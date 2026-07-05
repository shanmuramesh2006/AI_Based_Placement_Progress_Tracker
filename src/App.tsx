import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Dashboard from './components/Dashboard.tsx';
import Analytics from './components/Analytics.tsx';
import TestRunner from './components/TestRunner.tsx';
import Login from './components/Login.tsx';
import { Category, DailyProgress } from './types';
import { LayoutDashboard, TrendingUp, Sparkles, Loader2 } from 'lucide-react';

interface UserProfile {
  name: string;
  studentId: number;
  targetRole: string;
  targetCompany: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ANALYTICS'>('DASHBOARD');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  // Student authentication state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('placement_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Progress history logs state
  const [progressLogs, setProgressLogs] = useState<DailyProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch all progress logs from full-stack backend
  const fetchProgressLogs = async () => {
    if (!user) return;
    setLoadingProgress(true);
    try {
      const res = await fetch(`/api/progress?studentId=${user.studentId}`);
      if (res.ok) {
        const data = await res.json();
        setProgressLogs(data);
      }
    } catch (err) {
      console.error('Failed to load progress logs:', err);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProgressLogs();
    } else {
      setLoadingProgress(false);
    }
  }, [user]);

  const handleStartTest = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleFinishTest = async () => {
    // Return to dashboard and reload latest scores
    setSelectedCategory(null);
    setActiveTab('DASHBOARD');
    await fetchProgressLogs();
  };

  const handleLogin = (profile: UserProfile) => {
    localStorage.setItem('placement_user', JSON.stringify(profile));
    setUser(profile);
  };

  const handleLogout = () => {
    localStorage.removeItem('placement_user');
    setUser(null);
    setProgressLogs([]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 animate-fade-in" id="app-root">
      {/* Dynamic Header Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {selectedCategory ? (
          /* Active practice test running environment */
          <div className="animate-fade-in">
            <button
              onClick={() => setSelectedCategory(null)}
              className="mb-6 inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            >
              &larr; Exit practice and return to Dashboard
            </button>
            <TestRunner category={selectedCategory} onFinish={handleFinishTest} studentId={user.studentId} />
          </div>
        ) : (
          /* Main preparation dashboard and charts layout */
          <div className="space-y-6">
            
            {/* Primary Navigation Tabs */}
            <div className="border-b border-slate-200 flex items-center justify-between pb-1">
              <div className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('DASHBOARD')}
                  className={`pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'DASHBOARD'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Preparation Core</span>
                </button>

                <button
                  onClick={() => setActiveTab('ANALYTICS')}
                  className={`pb-4 text-xs uppercase tracking-wider font-bold border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
                    activeTab === 'ANALYTICS'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Analytics & AI Mentor</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-3.5 py-1.5 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
                <span>AI placement preparation engine v1.1</span>
              </div>
            </div>

            {/* Active Workspace */}
            {loadingProgress ? (
              <div className="flex h-96 flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-3 text-xs font-semibold">Loading student progress timeline...</p>
              </div>
            ) : activeTab === 'DASHBOARD' ? (
              <div className="animate-fade-in">
                <Dashboard
                  onTakeTest={handleStartTest}
                  progressLogs={progressLogs}
                  refreshProgress={fetchProgressLogs}
                  studentId={user.studentId}
                />
              </div>
            ) : (
              <div className="animate-fade-in">
                <Analytics progressLogs={progressLogs} refreshProgress={fetchProgressLogs} studentId={user.studentId} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer copyright notice (without telemetry clutter) */}
      <footer className="border-t border-slate-200 bg-white py-6" id="app-footer">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-slate-400 font-medium">
            &copy; 2026 Placement Prep Hub. Empowering students with responsive AI education.
          </p>
        </div>
      </footer>
    </div>
  );
}
