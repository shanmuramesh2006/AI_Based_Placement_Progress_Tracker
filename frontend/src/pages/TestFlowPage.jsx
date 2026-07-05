import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Code, Database, BrainCircuit, Loader2, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { id: 'Aptitude', label: 'Aptitude', icon: BrainCircuit, description: 'MCQ-driven logic and reasoning questions.' },
  { id: 'SQL', label: 'SQL', icon: Database, description: 'Query-writing practice with exact answer grading.' },
  { id: 'Coding', label: 'Coding', icon: Code, description: 'Solve a coding problem and submit your implementation.' }
];

const TestFlowPage = ({ setAuth }) => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('select');
  const [category, setCategory] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const selectedQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);
  const currentAnswer = answers[selectedQuestion?.id] || '';

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      setAuth(false);
      navigate('/login');
    }
  }, [navigate, setAuth]);

  const startTest = async (selectedCategory) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/tests/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ category: selectedCategory, count: 5 })
      });
      if (!response.ok) {
        throw new Error('Unable to generate questions');
      }
      const data = await response.json();
      setCategory(selectedCategory);
      setSessionId(data.sessionId);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setPhase('answer');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [selectedQuestion.id]: value }));
  };

  const goNext = () => {
    setCurrentIndex(index => Math.min(index + 1, questions.length - 1));
  };

  const goBack = () => {
    setCurrentIndex(index => Math.max(index - 1, 0));
  };

  const submitAll = async () => {
    if (!sessionId) return;
    setLoading(true);
    setError('');

    const payload = {
      sessionId,
      answers: questions.map((question) => ({ questionId: question.id, answer: answers[question.id] || '' }))
    };

    try {
      const response = await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }
      const data = await response.json();
      setResult(data);
      setPhase('result');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5ff] text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </button>

        <div className="rounded-[32px] bg-white shadow-[0_40px_120px_rgba(79,70,229,0.08)] p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.24em] text-primary-600 font-semibold">Practice Suite</p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-950">Take a test, get instant feedback, and save your score automatically.</h1>
              <p className="mt-4 text-base text-slate-600">Choose Aptitude, SQL, or Coding. Questions appear one by one, then your score is auto-logged into daily progress.</p>
            </div>
            <div className="rounded-3xl bg-primary-50 border border-primary-100 p-6 shadow-sm">
              <p className="text-sm font-semibold text-primary-700">Current mode</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{category || 'Select a category'}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-3xl border border-rose-200 bg-rose-50 text-rose-700 px-5 py-4 mb-8 font-medium">{error}</div>
          )}

          {phase === 'select' && (
            <div className="grid gap-6 sm:grid-cols-3">
              {CATEGORIES.map((item) => (
                <button key={item.id} onClick={() => startTest(item.id)} disabled={loading} className="group rounded-[28px] border border-border p-6 text-left transition hover:border-primary-300 hover:shadow-[0_20px_60px_rgba(79,70,229,0.08)] bg-white">
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-700 mb-6">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-950 mb-2">{item.label}</h2>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </button>
              ))}
            </div>
          )}

          {phase === 'answer' && selectedQuestion && (
            <div className="space-y-8">
              <div className="rounded-[28px] border border-border bg-slate-50 p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary-600 text-white">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-primary-600 font-semibold">Question {currentIndex + 1} of {questions.length}</p>
                    <h2 className="mt-3 text-2xl font-extrabold text-slate-950">{selectedQuestion.prompt}</h2>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-6">{selectedQuestion.type === 'MCQ' ? 'Select the correct answer below.' : 'Type your answer in the box and continue.'}</p>

                {selectedQuestion.type === 'MCQ' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAnswerChange(option)}
                        className={`w-full text-left rounded-3xl border px-5 py-4 transition ${currentAnswer === option ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-border bg-white hover:border-primary-300'}`}>
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => handleAnswerChange(e.target.value)}
                    rows={selectedQuestion.type === 'Coding' ? 10 : 6}
                    placeholder={selectedQuestion.type === 'SQL' ? 'Write your SQL query here...' : 'Write your code or answer here...'}
                    className="w-full rounded-3xl border border-border bg-white px-5 py-4 text-sm text-slate-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition"
                  />
                )}
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <button disabled={currentIndex === 0} onClick={goBack} className="inline-flex items-center justify-center rounded-3xl border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button>
                  {currentIndex < questions.length - 1 ? (
                    <button onClick={goNext} className="inline-flex items-center justify-center rounded-3xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-700 transition">
                      Next Question
                    </button>
                  ) : (
                    <button onClick={submitAll} disabled={loading} className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-primary-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? 'Submitting...' : 'Submit Answers'}
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-500">Answer saved locally until submission.</p>
              </div>
            </div>
          )}

          {phase === 'result' && result && (
            <div className="rounded-[32px] border border-primary-100 bg-primary-50/80 p-10 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-primary-600 font-semibold">Test Complete</p>
                  <h2 className="mt-4 text-4xl font-extrabold text-slate-950">Your score: {result.score}/100</h2>
                  <p className="mt-3 text-sm text-slate-600">Correct {result.correctCount} of {result.totalQuestions} questions.</p>
                </div>
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Auto saved</p>
                  <p className="mt-3 text-3xl font-bold text-primary-700">Logged to Daily Progress</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <button onClick={() => navigate('/dashboard')} className="rounded-3xl bg-white px-6 py-4 text-sm font-semibold text-primary-700 border border-primary-200 hover:bg-primary-50 transition">
                  Return to Dashboard
                </button>
                <button onClick={() => { setPhase('select'); setCategory(null); setQuestions([]); setAnswers({}); setSessionId(''); setResult(null); }} className="rounded-3xl bg-primary-600 px-6 py-4 text-sm font-semibold text-white hover:bg-primary-700 transition">
                  Take another test
                </button>
              </div>
            </div>
          )}

          {loading && !phase.includes('result') && (
            <div className="mt-8 rounded-3xl border border-primary-100 bg-white p-6 text-center text-sm text-slate-600">
              <Loader2 className="w-5 h-5 mx-auto mb-3 animate-spin text-primary-600" /> Preparing your questions...
            </div>
          )}

          {phase !== 'select' && !loading && !result && (
            <div className="mt-10 rounded-3xl border border-border bg-slate-50 p-6 text-sm text-slate-500">
              {selectedQuestion && <span>Question {currentIndex + 1} / {questions.length}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestFlowPage;
