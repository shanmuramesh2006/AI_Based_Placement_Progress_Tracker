import React, { useState, useEffect } from 'react';
import { Brain, Database as DbIcon, CodeXml, Plus, Calendar, Award, CheckCircle, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { Category, DailyProgress } from '../types';

interface DashboardProps {
  onTakeTest: (category: Category) => void;
  progressLogs: DailyProgress[];
  refreshProgress: () => Promise<void>;
  studentId: number;
}

export default function Dashboard({ onTakeTest, progressLogs, refreshProgress, studentId }: DashboardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Manual Score Form State
  const [manualCategory, setManualCategory] = useState<Category>('APTITUDE');
  const [manualScore, setManualScore] = useState<number>(80);
  const [manualDate, setManualDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  // Find latest score for a category
  const getLatestScore = (category: Category): { score: number | null; date: string | null } => {
    const categoryLogs = progressLogs
      .filter((p) => p.category === category)
      .sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
    
    if (categoryLogs.length > 0) {
      return { score: categoryLogs[0].score, date: categoryLogs[0].logDate };
    }
    return { score: null, date: null };
  };

  // Calculate high-level stats
  const totalTestsCompleted = progressLogs.length;
  
  const getAverageScore = () => {
    if (progressLogs.length === 0) return 0;
    const sum = progressLogs.reduce((acc, log) => acc + log.score, 0);
    return Math.round(sum / progressLogs.length);
  };

  const getAptitudeLatest = getLatestScore('APTITUDE');
  const getSqlLatest = getLatestScore('SQL');
  const getCodingLatest = getLatestScore('CODING');

  const handleOpenManualModal = () => {
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmitManualScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualScore < 0 || manualScore > 100) {
      setFormError('Score must be between 0 and 100.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId, // dynamic student for tracker
          category: manualCategory,
          score: manualScore,
          logDate: manualDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save manual progress log');
      }

      await refreshProgress();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError('Failed to save score. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" id="dashboard-container">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-slate-900 px-6 py-8 text-white shadow-xl sm:px-12 sm:py-10 border border-slate-850">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center space-x-1.5 rounded bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300 border border-blue-500/20">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>AI Placement Engine Engaged</span>
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Level up your placement readiness.
          </h1>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Take auto-generated, AI-powered practice tests in Aptitude, SQL, and Coding.
            Our intelligent grading engine provides instant code evaluation, semantic query grading, and personalized mentor advice.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => onTakeTest('APTITUDE')}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-all active:scale-95 cursor-pointer"
            >
              Start Practice Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={handleOpenManualModal}
              className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/15 transition-all cursor-pointer border border-white/5"
            >
              <Plus className="mr-2 h-4 w-4" />
              Manual Log Score
            </button>
          </div>
        </div>
        
        {/* Abstract shapes for background */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full bg-blue-500/5 blur-2xl" />
      </div>

      {/* Summary Stats Bento Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Preparation Index</div>
            <div className="text-2xl font-extrabold text-slate-800">{getAverageScore()}%</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-amber-50 text-amber-600 border border-amber-100">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Assessments Taken</div>
            <div className="text-2xl font-extrabold text-slate-800">{totalTestsCompleted}</div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center space-x-4">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Latest Log Date</div>
            <div className="text-2xl font-extrabold text-slate-800">
              {progressLogs.length > 0 
                ? new Date(progressLogs.sort((a,b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime())[0].logDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                : 'No logs'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Preparation Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Placement Preparation Tracks</h2>
          <p className="text-xs text-slate-400 mt-0.5">Generate structured assessments designed specifically for engineering recruitment standards.</p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Aptitude Track */}
          <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">Quantitative & Aptitude</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Quantitative reasoning, logical analysis, verbal ability, syllogisms, and numeric patterns common in Deloitte, TCS, and Accenture tests.
              </p>
              
              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">10 Questions (MCQ)</span>
                <span className="font-bold text-slate-700">
                  {getAptitudeLatest.score !== null ? `Last Score: ${getAptitudeLatest.score}%` : 'Not Attempted'}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => onTakeTest('APTITUDE')}
                className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
              >
                Take AI Practice Test
              </button>
            </div>
          </div>

          {/* SQL Track */}
          <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100">
                <DbIcon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">SQL & Databases</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Output-prediction query MCQs and writing active SQL scripts covering JOINs, aggregations, window functions, and nested queries.
              </p>
              
              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">5 Questions (MCQ + Code)</span>
                <span className="font-bold text-slate-700">
                  {getSqlLatest.score !== null ? `Last Score: ${getSqlLatest.score}%` : 'Not Attempted'}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => onTakeTest('SQL')}
                className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
              >
                Take AI Practice Test
              </button>
            </div>
          </div>

          {/* Coding Track */}
          <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CodeXml className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-950 group-hover:text-blue-600 transition-colors">Coding & Algorithms</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">
                Easy-to-medium Data Structures and Algorithms problems. Full problem statements, constraints, sample cases, and custom compiler panel.
              </p>
              
              <div className="mt-5 border-t border-slate-100 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">2 Challenges (DSA)</span>
                <span className="font-bold text-slate-700">
                  {getCodingLatest.score !== null ? `Last Score: ${getCodingLatest.score}%` : 'Not Attempted'}
                </span>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => onTakeTest('CODING')}
                className="w-full inline-flex items-center justify-center rounded-lg bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
              >
                Take AI Practice Test
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Manual Score Log Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-fade-in" id="manual-score-modal">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl animate-scale-up border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Manual Progress Entry</h3>
            <p className="mt-1 text-xs text-slate-400">
              Log manual practice scores to track history. Monthly analysis is updated automatically.
            </p>

            <form onSubmit={handleSubmitManualScore} className="mt-5 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500">Category</label>
                <select
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value as Category)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 outline-none focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600 transition-colors"
                >
                  <option value="APTITUDE">Aptitude & Reasoning</option>
                  <option value="SQL">SQL & Databases</option>
                  <option value="CODING">Coding & Algorithms</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500">Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={manualScore}
                  onChange={(e) => setManualScore(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  placeholder="e.g. 85"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-500">Date Logged</label>
                <input
                  type="date"
                  required
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                />
              </div>

              {formError && (
                <p className="text-xs font-bold text-red-500">{formError}</p>
              )}

              <div className="mt-6 flex justify-end space-x-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Log Progress'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
