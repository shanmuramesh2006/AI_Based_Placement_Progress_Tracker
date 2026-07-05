import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Database } from './src/db/db';
import { AIService } from './src/services/ai';
import { Category } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing middleware
  app.use(express.json({ limit: '10mb' }));

  // --- API Endpoints ---

  // Generate Test Endpoint
  app.post('/api/tests/generate', async (req, res) => {
    try {
      const { studentId, category } = req.body;
      if (!studentId || !category) {
        res.status(400).json({ error: 'studentId and category are required' });
        return;
      }

      console.log(`Generating practice test for student ${studentId}, category ${category}...`);
      
      // Call Gemini AI service to get fresh questions
      const rawQuestions = await AIService.generateTestQuestions(category as Category);

      // Save complete test (with correct answers) in the Database
      const savedTest = await Database.saveTest({
        studentId: Number(studentId),
        category: category as Category,
        questionsJson: JSON.stringify(rawQuestions),
      });

      // Sanitize questions for the frontend: strip correct answers and expected test output
      const sanitizedQuestions = rawQuestions.map((q: any) => {
        if (category === 'APTITUDE') {
          const { correctAnswerIndex, ...sanitized } = q;
          return sanitized;
        } else if (category === 'SQL') {
          const { correctAnswer, ...sanitized } = q;
          return sanitized;
        } else if (category === 'CODING') {
          // For coding challenges, strip expected test outputs inside testCases array
          const { testCases, ...sanitized } = q;
          return sanitized;
        }
        return q;
      });

      res.json({
        testId: savedTest.id,
        category: savedTest.category,
        questions: sanitizedQuestions,
      });
    } catch (error) {
      console.error('Error in /api/tests/generate:', error);
      res.status(500).json({ error: 'Failed to generate test questions. Please try again.' });
    }
  });

  // Submit Test and Auto-Score Endpoint
  app.post('/api/tests/submit', async (req, res) => {
    try {
      const { testId, studentId, answers } = req.body;
      if (!testId || !studentId || !answers) {
        res.status(400).json({ error: 'testId, studentId, and answers are required' });
        return;
      }

      // Fetch the original generated test to get correct answers
      const generatedTest = await Database.getTestById(testId);
      if (!generatedTest) {
        res.status(404).json({ error: 'Generated test not found' });
        return;
      }

      const originalQuestions = JSON.parse(generatedTest.questionsJson);
      const category = generatedTest.category;
      const totalQuestions = originalQuestions.length;
      let correctCount = 0;
      const feedbackList: any[] = [];

      console.log(`Grading test ${testId} for student ${studentId} (${category})...`);

      // Evaluate each question based on category
      for (let i = 0; i < totalQuestions; i++) {
        const original = originalQuestions[i];
        const studentAnswer = answers[i] || '';

        if (category === 'APTITUDE') {
          const correctIdx = original.correctAnswerIndex;
          const isCorrect = Number(studentAnswer) === correctIdx;
          if (isCorrect) correctCount++;

          const correctText = original.options[correctIdx];
          const studentText = original.options[Number(studentAnswer)] || 'No answer submitted';

          feedbackList.push({
            question: original.question,
            studentAnswer: studentText,
            correctAnswer: correctText,
            isCorrect,
            explanation: isCorrect 
              ? `Correct! "${correctText}" is the right choice.`
              : `Incorrect. The correct answer was: "${correctText}".`,
          });

        } else if (category === 'SQL') {
          if (original.type === 'mcq') {
            const correctIdx = Number(original.correctAnswer);
            const isCorrect = Number(studentAnswer) === correctIdx;
            if (isCorrect) correctCount++;

            const correctText = original.options[correctIdx];
            const studentText = original.options[Number(studentAnswer)] || 'No answer submitted';

            feedbackList.push({
              question: original.question,
              type: 'mcq',
              studentAnswer: studentText,
              correctAnswer: correctText,
              isCorrect,
              explanation: isCorrect
                ? `Correct! "${correctText}" is the right choice.`
                : `Incorrect. The correct answer was: "${correctText}".`,
            });
          } else {
            // SQL Query Type: Call Gemini to grade query correctness
            let result;
            if (!studentAnswer.trim()) {
              result = { isCorrect: false, explanation: 'No query was submitted for evaluation.' };
            } else {
              result = await AIService.gradeSQLQuery(original.question, studentAnswer, original.correctAnswer);
            }

            if (result.isCorrect) correctCount++;

            feedbackList.push({
              question: original.question,
              type: 'query',
              studentAnswer: studentAnswer || 'No query submitted',
              correctAnswer: original.correctAnswer,
              isCorrect: result.isCorrect,
              explanation: result.explanation,
            });
          }

        } else if (category === 'CODING') {
          // Coding Challenge: Call Gemini to evaluate code logic against test cases
          let result;
          if (!studentAnswer.trim()) {
            result = { isCorrect: false, explanation: 'No solution was submitted for evaluation.' };
          } else {
            result = await AIService.gradeCodingSolution(
              original.title,
              original.description,
              studentAnswer,
              original.testCases
            );
          }

          if (result.isCorrect) correctCount++;

          feedbackList.push({
            question: original.title,
            type: 'coding',
            studentAnswer: studentAnswer || 'No code submitted',
            isCorrect: result.isCorrect,
            explanation: result.explanation,
          });
        }
      }

      // Calculate score out of 100
      const score = Math.round((correctCount / totalQuestions) * 100);

      // Save the test attempt details
      const attempt = await Database.saveAttempt({
        testId,
        studentId: Number(studentId),
        answersJson: JSON.stringify(answers),
        score,
        totalQuestions,
        correctCount,
        feedbackJson: JSON.stringify(feedbackList),
      });

      // IMPORTANT: Automatically log to the existing daily_progress table for progress tracking
      const todayStr = new Date().toISOString().split('T')[0];
      await Database.saveProgress({
        studentId: Number(studentId),
        category,
        score,
        logDate: todayStr,
      });

      console.log(`Grading complete! Score: ${score}%. Auto-saved to daily progress.`);

      res.json({
        score,
        correctCount,
        totalQuestions,
        feedback: feedbackList,
      });
    } catch (error) {
      console.error('Error in /api/tests/submit:', error);
      res.status(500).json({ error: 'Failed to submit and grade test. Please try again.' });
    }
  });

  // Progress Logging endpoints (GET all logs, POST a manual log, DELETE a log)
  app.get('/api/progress', async (req, res) => {
    try {
      const studentId = req.query.studentId ? Number(req.query.studentId) : undefined;
      let progress = await Database.getAllProgress();
      if (studentId !== undefined) {
        progress = progress.filter((p) => p.studentId === studentId);
      }
      res.json(progress);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      res.status(500).json({ error: 'Failed to fetch progress logs' });
    }
  });

  app.post('/api/progress', async (req, res) => {
    try {
      const { studentId, category, score, logDate } = req.body;
      if (!studentId || !category || score === undefined || !logDate) {
        res.status(400).json({ error: 'Missing required progress parameters' });
        return;
      }

      const progress = await Database.saveProgress({
        studentId: Number(studentId),
        category: category as Category,
        score: Number(score),
        logDate,
      });

      res.json(progress);
    } catch (error) {
      console.error('Failed to save manual progress:', error);
      res.status(500).json({ error: 'Failed to save manual progress' });
    }
  });

  app.delete('/api/progress/:id', async (req, res) => {
    try {
      const success = await Database.deleteProgress(req.params.id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Progress log not found' });
      }
    } catch (error) {
      console.error('Failed to delete progress:', error);
      res.status(500).json({ error: 'Failed to delete progress log' });
    }
  });

  // Monthly AI Mentor analysis report endpoint
  app.get('/api/monthly-analysis', async (req, res) => {
    try {
      const studentId = req.query.studentId ? Number(req.query.studentId) : 1;
      const progress = await Database.getAllProgress();
      
      // Filter student progress and pass to Gemini AI mentor
      const studentLogs = progress.filter((p) => p.studentId === studentId);
      
      console.log(`Generating AI Mentor report based on ${studentLogs.length} historical logs for student ${studentId}...`);
      const mentorReport = await AIService.generateMonthlyReport(studentLogs);
      
      res.json(mentorReport);
    } catch (error) {
      console.error('Failed to generate monthly report:', error);
      res.status(500).json({ error: 'Failed to generate performance analysis' });
    }
  });


  // --- Vite & Production static routing ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
