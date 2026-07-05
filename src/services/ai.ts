import { GoogleGenAI, Type } from '@google/genai';
import { Category, AptitudeQuestion, SQLQuestion, CodingQuestion } from '../types';

// Initialize Gemini Client
// Using process.env.GEMINI_API_KEY which is automatically injected
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.5-flash';

export class AIService {
  /**
   * Generates a fresh set of questions based on the category
   */
  public static async generateTestQuestions(category: Category): Promise<any[]> {
    let systemInstruction = '';
    let prompt = '';
    let responseSchema: any;

    if (category === 'APTITUDE') {
      systemInstruction = 'You are an expert aptitude test designer for engineering campus placements.';
      prompt = `Generate exactly 10 high-quality multiple-choice aptitude questions covering quantitative reasoning (e.g., probability, time-speed-distance, percentages), logical reasoning (e.g., blood relations, syllogisms), and verbal ability. Ensure varying difficulty (easy, medium, hard). Provide exactly 4 clear, plausible options per question, and the correct 0-indexed answer index. Do not include markdown formatting inside JSON strings.`;
      
      responseSchema = {
        type: Type.ARRAY,
        description: 'A list of 10 aptitude multiple choice questions',
        items: {
          type: Type.OBJECT,
          required: ['question', 'options', 'correctAnswerIndex'],
          properties: {
            question: { type: Type.STRING, description: 'The text of the question' },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Four multiple choice options',
            },
            correctAnswerIndex: {
              type: Type.INTEGER,
              description: 'The 0-indexed index of the correct option (0, 1, 2, or 3)',
            },
          },
        },
      };
    } else if (category === 'SQL') {
      systemInstruction = 'You are an expert Database Administrator and SQL interviewer for technical placements.';
      prompt = `Generate exactly 5 SQL questions for placement practice. Provide a mix of MCQ output-prediction questions (type "mcq", exactly 4 options, and correctAnswer being the index "0"-"3") and query-writing questions (type "query", no options, and correctAnswer being a model SQL query). Avoid using markdown formatting inside JSON properties.`;

      responseSchema = {
        type: Type.ARRAY,
        description: 'A list of 5 SQL practice questions',
        items: {
          type: Type.OBJECT,
          required: ['question', 'type', 'correctAnswer'],
          properties: {
            question: { type: Type.STRING, description: 'The text of the question or the database schema description and query task' },
            type: { type: Type.STRING, description: 'Either "mcq" or "query"' },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Four options (only required if type is "mcq")',
            },
            correctAnswer: {
              type: Type.STRING,
              description: 'For MCQ, the 0-indexed index ("0"-"3") as a string. For query, the correct SQL query statement.',
            },
          },
        },
      };
    } else if (category === 'CODING') {
      systemInstruction = 'You are a veteran software engineer and data structures & algorithms (DSA) interviewer.';
      prompt = `Generate exactly 2 coding challenges (easy-medium difficulty) suitable for technical placement preparation. Focus on core DSA topics like arrays, strings, hash maps, simple trees, or linked lists. Provide clear descriptions, sample input and output, and exactly 3 functional test cases with inputs and expected outputs. Ensure the formatting is clean.`;

      responseSchema = {
        type: Type.ARRAY,
        description: 'A list of exactly 2 coding challenges',
        items: {
          type: Type.OBJECT,
          required: ['title', 'description', 'sampleInput', 'sampleOutput', 'testCases'],
          properties: {
            title: { type: Type.STRING, description: 'The title of the coding challenge' },
            description: { type: Type.STRING, description: 'The complete problem statement, constraints, and instructions' },
            sampleInput: { type: Type.STRING, description: 'A sample input example' },
            sampleOutput: { type: Type.STRING, description: 'The expected output for the sample input' },
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['input', 'expectedOutput'],
                properties: {
                  input: { type: Type.STRING, description: 'Test case input parameters' },
                  expectedOutput: { type: Type.STRING, description: 'Expected return value or output as a string' },
                },
              },
            },
          },
        },
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.7,
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('AI returned an empty response');
      }

      const questions = JSON.parse(responseText.trim());
      return questions;
    } catch (error) {
      console.error(`Error generating ${category} test:`, error);
      throw error;
    }
  }

  /**
   * Uses Gemini to grade a submitted SQL Query against the model correct answer
   */
  public static async gradeSQLQuery(
    question: string,
    studentQuery: string,
    modelAnswer: string
  ): Promise<{ isCorrect: boolean; explanation: string }> {
    const prompt = `
    You are an automated technical SQL grading assistant.
    Review the student's submitted SQL query and determine if it is logically equivalent to the expected model query for the given database task.
    
    Database Task / Question:
    "${question}"
    
    Expected Correct Model Query:
    "${modelAnswer}"
    
    Student's Submitted Query:
    "${studentQuery}"
    
    Evaluate carefully:
    - The student query is correct if it achieves the exact same results as the model query for any valid dataset.
    - Be lenient with minor formatting differences, extra spaces, casing of SQL keywords (SELECT vs select), optional semicolons, or alias names, as long as the logical execution is correct.
    - If correct, set isCorrect to true. If incorrect or syntactically invalid, set isCorrect to false.
    - Provide a short, constructive explanation of why it is correct or what was wrong/how to improve.
    
    Respond strictly in JSON format matching the schema below.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['isCorrect', 'explanation'],
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING, description: 'Constructive feedback explaining correctness or logical flaws' },
            },
          },
          temperature: 0.2, // Low temperature for precise grading
        },
      });

      const text = response.text;
      if (!text) {
        return { isCorrect: false, explanation: 'Could not grade query: empty AI response.' };
      }

      return JSON.parse(text.trim());
    } catch (error) {
      console.error('Error grading SQL query:', error);
      return {
        isCorrect: false,
        explanation: 'Error grading query via AI: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Uses Gemini to grade a submitted coding solution against test cases (since secure sandboxed runtime execution is out-of-scope for MVP)
   */
  public static async gradeCodingSolution(
    title: string,
    description: string,
    studentCode: string,
    testCases: Array<{ input: string; expectedOutput: string }>
  ): Promise<{ isCorrect: boolean; explanation: string }> {
    const testCasesStr = JSON.stringify(testCases, null, 2);
    const prompt = `
    You are an automated grading engine for an online coding test. Since we do not run a sandboxed code executor in this MVP, you must perform static code analysis and semantic evaluation to determine if the student's code correctly solves the DSA challenge.
    
    Coding Challenge Title: "${title}"
    Problem Description:
    "${description}"
    
    Expected Test Cases:
    ${testCasesStr}
    
    Student's Submitted Code:
    \`\`\`
    ${studentCode}
    \`\`\`
    
    Evaluate:
    - Does the code have the correct logic to solve the problem?
    - Is it syntactically valid (in common languages like JavaScript/TypeScript, Python, or Java)?
    - Would it successfully pass the expected inputs and produce the correct output?
    - Check edge cases like empty inputs, boundary values, etc.
    - Decide if it passes overall (isCorrect: true) or fails (isCorrect: false).
    - Provide a concise, highly constructive evaluation detailing strengths, any bugs, or optimization hints.
    
    Respond strictly in JSON format matching the schema below.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['isCorrect', 'explanation'],
            properties: {
              isCorrect: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING, description: 'Code review, test case analysis, and suggestion for improvement' },
            },
          },
          temperature: 0.2,
        },
      });

      const text = response.text;
      if (!text) {
        return { isCorrect: false, explanation: 'Could not grade code: empty AI response.' };
      }

      return JSON.parse(text.trim());
    } catch (error) {
      console.error('Error grading coding solution:', error);
      return {
        isCorrect: false,
        explanation: 'Error grading code via AI: ' + (error instanceof Error ? error.message : String(error)),
      };
    }
  }

  /**
   * Generates a monthly AI mentor report based on history logs
   */
  public static async generateMonthlyReport(progressLogs: any[]): Promise<any> {
    const logsStr = JSON.stringify(progressLogs, null, 2);
    const prompt = `
    You are an AI Mentor for placement preparation. Review the following student progress log, which details scores in Aptitude, SQL, and Coding tests over recent days.
    
    Progress Logs:
    ${logsStr}
    
    Provide:
    1. A detailed list of strengths (e.g., categories where score is consistently high or rising).
    2. Primary areas of weakness/focus (where scores are fluctuating or low).
    3. A clear, encouraging, structured 15-day action plan to prepare for upcoming campus placement drives.
    4. An overall rating out of 10 based on progress and performance.
    
    Respond strictly in JSON format matching the schema below. Keep it professional, highly scannable, and extremely constructive. Do not use markdown inside the JSON string values.
    `;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            required: ['strengths', 'weaknesses', 'plan', 'overallRating'],
            properties: {
              strengths: { type: Type.STRING, description: 'Summary of student strengths' },
              weaknesses: { type: Type.STRING, description: 'Key focus areas needing improvement' },
              plan: { type: Type.STRING, description: '15-day study plan' },
              overallRating: { type: Type.NUMBER, description: 'A score from 1.0 to 10.0' },
            },
          },
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('AI returned an empty performance report');
      }

      return JSON.parse(text.trim());
    } catch (error) {
      console.error('Error generating monthly mentor report:', error);
      // Fallback response so app never crashes
      return {
        strengths: 'Consistent performance across quantitative reasoning and database concepts.',
        weaknesses: 'Needs more practice with complex DSA optimization and advanced nested queries.',
        plan: 'Days 1-5: Practice medium arrays and strings.\nDays 6-10: Review SQL join statements.\nDays 11-15: Take daily full-length practice tests.',
        overallRating: 7.5,
      };
    }
  }
}
