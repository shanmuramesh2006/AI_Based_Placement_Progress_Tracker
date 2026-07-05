import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRight, ArrowLeft, Brain, Database, CodeXml, Sparkles, AlertCircle, CheckCircle2, XCircle, ChevronDown, ChevronUp, BookOpen, Terminal } from 'lucide-react';
import { Category, SanitizedQuestion, SanitizedSQLQuestion, SanitizedCodingQuestion, SubmitResponse, QuestionFeedback } from '../types';

interface TestRunnerProps {
  category: Category;
  onFinish: () => void;
  studentId: number;
}

const PROGRESSIVE_MESSAGES = [
  'Connecting to AI Assessment Core...',
  'Analyzing student preparation history...',
  'Generating industry-standard placement challenges...',
  'Validating numeric reasoning structures...',
  'Synthesizing database queries and query targets...',
  'Formulating easy-to-medium DSA coding challenges...',
  'Structuring custom test suites... get ready!',
];

export default function TestRunner({ category, onFinish, studentId }: TestRunnerProps) {
  const [loading, setLoading] = useState(true);
  const [generatingMessageIdx, setGeneratingMessageIdx] = useState(0);
  const [testId, setTestId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SanitizedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Student Answers state
  // Stores answer as a string (MCQ: index "0"-"3", SQL: Query string, Coding: code script)
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // Submission / Grading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<SubmitResponse | null>(null);
  const [expandedFeedback, setExpandedFeedback] = useState<Record<number, boolean>>({});

  // Cycle progressive loading messages every 2 seconds
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setGeneratingMessageIdx((prev) => (prev + 1) % PROGRESSIVE_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  // Fetch / Generate test questions
  useEffect(() => {
    const generateTest = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/tests/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId, // Student tracking ID
            category,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate practice test');
        }

        const data = await response.json();
        setTestId(data.testId);
        setQuestions(data.questions);
        
        // Pre-fill answer templates for coding with initial boilerplate
        if (category === 'CODING') {
          const codingBoilerplates: Record<number, string> = {};
          data.questions.forEach((q: any, idx: number) => {
            codingBoilerplates[idx] = `/*\n * Challenge: ${q.title}\n */\nfunction solve(input) {\n    // Write your code logic here\n    \n    return null;\n}`;
          });
          setAnswers(codingBoilerplates);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    generateTest();
  }, [category]);

  const handleSelectOption = (optionIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: String(optionIdx),
    }));
  };

  const handleWriteQuery = (query: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: query,
    }));
  };

  const handleWriteCode = (code: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: code,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Map answers record to ordered index list for submission
      const answerList: string[] = [];
      for (let i = 0; i < questions.length; i++) {
        answerList.push(answers[i] || '');
      }

      const res = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          studentId,
          answers: answerList,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit and grade test.');
      }

      const data = await res.json();
      setResults(data);
      
      // Auto-expand first few responses
      const initialExp: Record<number, boolean> = {};
      data.feedback.forEach((_: any, idx: number) => {
        initialExp[idx] = true;
      });
      setExpandedFeedback(initialExp);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFeedback = (idx: number) => {
    setExpandedFeedback((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  // Render Category Headers
  const renderCategoryDetails = () => {
    if (category === 'APTITUDE') {
      return (
        <div className="flex items-center space-x-2 text-indigo-600">
          <Brain className="h-5 w-5 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase">Quantitative & Aptitude Test</span>
        </div>
      );
    } else if (category === 'SQL') {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <Database className="h-5 w-5 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase">SQL & Database Query Test</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-2 text-emerald-600">
          <CodeXml className="h-5 w-5 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase">Coding & Algorithm Challenge</span>
        </div>
      );
    }
  };

  // 1. Loading Screen
  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 animate-fade-in" id="loading-test-screen">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
          <Sparkles className="h-6 w-6 text-blue-600 animate-pulse" />
        </div>
        <h3 className="mt-8 text-base font-bold text-slate-900 tracking-tight uppercase">Generating Practice Assessment</h3>
        <p className="mt-2 text-xs text-slate-500 max-w-sm h-6 font-medium leading-normal">
          {PROGRESSIVE_MESSAGES[generatingMessageIdx]}
        </p>
      </div>
    );
  }

  // 2. Submitting / Grading Screen
  if (isSubmitting) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 animate-fade-in" id="grading-test-screen">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute h-full w-full rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin" />
          <Terminal className="h-6 w-6 text-emerald-600 animate-pulse" />
        </div>
        <h3 className="mt-8 text-base font-bold text-slate-900 tracking-tight uppercase">Grading Submissions via AI</h3>
        <p className="mt-2 text-xs text-slate-500 max-w-md leading-relaxed font-medium">
          Evaluating code logic, parsing query syntax, comparing options, and assembling personalized feedback. This may take a few seconds...
        </p>
      </div>
    );
  }

  // 3. Results / Feedback Screen
  if (results) {
    let scoreColor = 'text-blue-600 border-blue-200 bg-blue-50';
    if (results.score >= 80) scoreColor = 'text-emerald-600 border-emerald-200 bg-emerald-50';
    else if (results.score < 50) scoreColor = 'text-rose-600 border-rose-200 bg-rose-50';

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in" id="results-screen">
        {/* Header Ribbon */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">Practice Test Completed</h2>
            <p className="text-xs text-slate-400 font-medium">Your performance statistics and AI tutor grading breakdown.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex h-16 w-16 items-center justify-center rounded-lg border-2 font-black text-2xl shadow-sm ${scoreColor}`}>
              {results.score}%
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scoring Breakdown</div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                {results.correctCount} / {results.totalQuestions} Questions Correct
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-5">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detailed Feedback Breakdown</h3>
          
          {results.feedback.map((item, idx) => {
            const isOpen = !!expandedFeedback[idx];
            return (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                {/* Header Toggle */}
                <button
                  onClick={() => toggleFeedback(idx)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50/50 transition-all text-left cursor-pointer border-none"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    {item.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.question}</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                        Type: {item.type ? item.type.toUpperCase() : 'APTITUDE'}
                      </p>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>

                {/* Question Feedback Body */}
                {isOpen && (
                  <div className="border-t border-slate-100 p-6 space-y-5 bg-slate-50/50 text-xs text-slate-700 animate-slide-down">
                    {/* User Submitted Answer */}
                    <div>
                      <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">Your Response:</div>
                      {item.type === 'coding' || item.type === 'query' ? (
                        <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg overflow-x-auto font-mono leading-relaxed text-[11px] border border-slate-800">
                          {item.studentAnswer}
                        </pre>
                      ) : (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-800 font-medium shadow-xs">
                          {item.studentAnswer}
                        </div>
                      )}
                    </div>

                    {/* Correct answer indicator (where available) */}
                    {item.correctAnswer && (
                      <div>
                        <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5">Expected Model Output:</div>
                        {item.type === 'query' ? (
                          <pre className="p-4 bg-slate-950 text-slate-100 rounded-lg overflow-x-auto font-mono leading-relaxed text-[11px] border border-slate-800">
                            {item.correctAnswer}
                          </pre>
                        ) : (
                          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-blue-900 font-medium">
                            {item.correctAnswer}
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI Grading Explanation */}
                    <div>
                      <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1.5 flex items-center space-x-1">
                        <Sparkles className="h-3.5 w-3.5 text-blue-500" />
                        <span>AI Grading Analysis:</span>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-slate-100 text-slate-600 leading-relaxed font-sans shadow-xs whitespace-pre-line">
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={onFinish}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-slate-850 transition-all active:scale-95 cursor-pointer"
          >
            Return to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  // 4. Test Taker Interface
  const activeQuestion = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in" id="test-taker-ui">
      {/* Test Meta Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        {renderCategoryDetails()}
        <div className="text-xs font-mono font-bold text-slate-400">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Split-Panel Test Panel */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        
        {/* Left Panel: Question Statement */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100">
              Problem Segment
            </span>
            <h3 className="mt-3 text-sm font-bold text-slate-900 leading-relaxed whitespace-pre-line">
              {category === 'CODING' 
                ? (activeQuestion as SanitizedCodingQuestion).title 
                : activeQuestion.question
              }
            </h3>

            {/* Problem Description (for Coding) */}
            {category === 'CODING' && (
              <div className="mt-4 text-xs text-slate-500 leading-relaxed space-y-3 font-sans">
                <p className="whitespace-pre-line">{(activeQuestion as SanitizedCodingQuestion).description}</p>
                
                <div className="border-t border-slate-100 pt-3">
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Sample Input:</div>
                  <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto font-mono text-[10px] text-slate-750 mt-1 border border-slate-100">
                    {(activeQuestion as SanitizedCodingQuestion).sampleInput}
                  </pre>
                </div>

                <div>
                  <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Sample Output:</div>
                  <pre className="p-3 bg-slate-50 rounded-lg overflow-x-auto font-mono text-[10px] text-slate-750 mt-1 border border-slate-100">
                    {(activeQuestion as SanitizedCodingQuestion).sampleOutput}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Safe compilation MVP limitation note */}
          {(category === 'CODING' || (category === 'SQL' && (activeQuestion as SanitizedSQLQuestion).type === 'query')) && (
            <div className="mt-6 border-t border-slate-100 pt-4 flex items-start space-x-2 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-750 leading-normal font-sans font-medium">
                <strong>MVP Grading Note:</strong> Since running arbitrary program scripts in container environments is sandboxed out-of-scope for compliance, code correct-checking is performed via advanced semantic AI analysis of your program logic.
              </p>
            </div>
          )}
        </div>

        {/* Right Panel: Interactive Answers Sandbox */}
        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div className="w-full">
            <span className="inline-flex items-center rounded bg-slate-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border border-slate-100">
              Answer Workspace
            </span>

            {/* MCQ Panel (Aptitude or SQL-MCQ) */}
            {(category === 'APTITUDE' || (category === 'SQL' && (activeQuestion as SanitizedSQLQuestion).type === 'mcq')) && (
              <div className="mt-6 space-y-3">
                {activeQuestion.options?.map((option, idx) => {
                  const isSelected = answers[currentIndex] === String(idx);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full flex items-center p-4 rounded-lg border text-left text-xs font-semibold transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-50/50 border-blue-500 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/50'
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-full border flex items-center justify-center font-bold mr-3.5 text-[10px] ${
                        isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-300 text-slate-500'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* SQL Query Editor Workspace */}
            {category === 'SQL' && (activeQuestion as SanitizedSQLQuestion).type === 'query' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <span>Interactive SQL Terminal</span>
                  <span className="font-mono">SQL Syntax Supported</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-250">
                  <textarea
                    value={answers[currentIndex] || ''}
                    onChange={(e) => handleWriteQuery(e.target.value)}
                    rows={12}
                    className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs focus:outline-none leading-relaxed resize-none"
                    placeholder="-- Write your PostgreSQL query here&#10;SELECT * FROM students WHERE ...;"
                  />
                </div>
              </div>
            )}

            {/* Coding Challenge Code Editor */}
            {category === 'CODING' && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <span>Interactive Code Editor (JavaScript)</span>
                  <span className="font-mono">ESNext Runtime Environment</span>
                </div>
                <div className="relative rounded-lg overflow-hidden border border-slate-250">
                  <textarea
                    value={answers[currentIndex] || ''}
                    onChange={(e) => handleWriteCode(e.target.value)}
                    rows={14}
                    className="w-full p-4 bg-slate-950 text-slate-100 font-mono text-xs focus:outline-none leading-relaxed resize-none"
                    placeholder="// Write your script logic here"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom navigation */}
          <div className="mt-8 border-t border-slate-100 pt-5 flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-blue-500 transition-all active:scale-95 cursor-pointer border-none"
              >
                Submit Practice Test
                <Sparkles className="ml-2 h-4 w-4 animate-pulse" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-850 transition-all active:scale-95 cursor-pointer"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
