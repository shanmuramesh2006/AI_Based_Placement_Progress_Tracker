import React, { useState } from 'react';
import { LogOut, LayoutDashboard, FileText, UploadCloud, BrainCircuit, CheckCircle, AlertCircle, RefreshCw, Target, Sparkles, ChevronRight, Bell, Search, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${active ? 'bg-gradient-to-r from-primary-50 to-transparent text-primary-600 border-l-4 border-primary-500' : 'text-textSecondary hover:bg-gray-50 hover:text-textPrimary border-l-4 border-transparent'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-primary-500' : 'text-gray-400'}`} />
    {label}
  </Link>
);

const ResumeCheckingPage = ({ setAuth }) => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Shanmuga Priya', email: 'shangmuga@college.edu' };
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const analyzeResume = () => {
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        score: 85,
        strengths: ['Strong action verbs', 'Quantified achievements', 'Clear education section'],
        weaknesses: ['Formatting is inconsistent', 'Missing keyword: "React"'],
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col md:flex-row bg-background h-screen font-sans overflow-hidden">
      
      {/* SIDEBAR (Matches Dashboard) */}
      <aside className="w-[280px] bg-card border-r border-border shrink-0 flex flex-col pt-8 pb-6 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="flex items-center gap-3 px-8 mb-12">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-glow">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-textPrimary text-xl tracking-tight font-heading">Placement Hub</h1>
            <p className="text-[11px] font-bold text-textSecondary uppercase tracking-widest mt-0.5">Tracker</p>
          </div>
        </div>
        
        <div className="px-5 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Menu</div>
        <nav className="flex-1 space-y-1 px-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={FileText} label="Resume Check" to="/resume-check" active={location.pathname === '/resume-check'} />
        </nav>

        <div className="px-6 mt-auto">
          <div className="p-4 bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 mb-6 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-primary-200 rounded-full blur-2xl opacity-50"></div>
            <Sparkles className="w-5 h-5 text-primary-500 mb-2 relative z-10" />
            <p className="text-sm font-bold text-textPrimary relative z-10 font-heading">Go Premium</p>
            <p className="text-xs text-textSecondary mt-1 relative z-10">Get 1-on-1 AI mock interviews.</p>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-primary-100 border-2 border-white shadow-sm flex items-center justify-center text-primary-600 font-bold overflow-hidden">
               {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-textPrimary truncate">{user.name}</p>
              <p className="text-xs text-textSecondary truncate">{user.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
               <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFBFF]">
        {/* TOP NAV */}
        <header className="h-[88px] px-10 flex items-center justify-between bg-white/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-10">
           <div className="w-96 relative group">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" />
              <input type="text" placeholder="Search tasks, scores, or resources..." className="w-full bg-white border border-border rounded-full py-3.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm" />
           </div>
           
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors">
                 <Bell className="w-6 h-6" />
                 <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white"></span>
              </button>
              <div className="hidden md:block text-right">
                 <p className="text-sm font-bold text-textPrimary">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'},</p>
                 <p className="text-xs text-textSecondary font-medium">{user.name}</p>
              </div>
           </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <header className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-textPrimary font-heading flex items-center gap-2">
              <BrainCircuit className="w-8 h-8 text-primary-500" /> AI Resume Reviewer
            </h2>
            <p className="text-textSecondary mt-2 font-medium">Upload your resume to get instant actionable feedback tailored to tech roles.</p>
          </header>

          {!result && (
              <div className="bg-card rounded-3xl p-10 shadow-premium border-2 border-dashed border-gray-200 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[450px] relative transition-all hover:border-primary-400 hover:bg-primary-50/50 group mt-10">
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl z-0">
                     <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-primary-100/50 rounded-full blur-3xl group-hover:bg-primary-200/50 transition-colors"></div>
                  </div>
                  
                  {!file ? (
                      <div className="relative z-10 flex flex-col items-center">
                          <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                              <UploadCloud className="w-10 h-10 text-primary-500" />
                          </div>
                          <h3 className="text-2xl font-bold text-textPrimary mb-2 font-heading">Drag & Drop your resume</h3>
                          <p className="text-sm text-textSecondary mb-8 font-medium">Supports PDF, DOCX (Max 5MB)</p>
                          <div className="relative group/btn">
                              <input 
                                  type="file" 
                                  accept=".pdf,.doc,.docx"
                                  onChange={handleFileUpload}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                              />
                              <button className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl transition-all shadow-glow hover:shadow-[0_12px_25px_rgba(79,125,243,0.4)] hover:-translate-y-0.5 relative overflow-hidden z-10 w-48">
                                  <span className="relative z-10">Browse Files</span>
                                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite] z-0"></div>
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="text-center w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-300">
                          <div className="w-24 h-24 bg-gradient-to-br from-success/10 to-success/20 rounded-[28px] flex items-center justify-center mb-6 mx-auto shadow-inner">
                              <FileText className="w-12 h-12 text-success" />
                          </div>
                          <h3 className="text-xl font-bold text-textPrimary mb-2 truncate font-heading" title={file.name}>{file.name}</h3>
                          <p className="text-sm text-textSecondary mb-8 border-b border-border pb-8 font-medium">File successfully selected. Ready for AI processing.</p>

                          <button 
                              onClick={analyzeResume}
                              disabled={analyzing}
                              className={`w-full py-4 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 relative overflow-hidden ${analyzing ? 'bg-primary-300 cursor-not-allowed' : 'bg-gradient-to-r from-primary-500 to-primary-600 shadow-glow hover:shadow-[0_12px_25px_rgba(79,125,243,0.4)] hover:-translate-y-0.5'}`}
                          >
                              {analyzing ? (
                                  <>
                                      <RefreshCw className="w-6 h-6 animate-spin" />
                                      Our AI is gathering insights...
                                  </>
                              ) : (
                                  <>
                                      <Sparkles className="w-5 h-5" /> Analyze My Resume
                                  </>
                              )}
                          </button>
                      </div>
                  )}
              </div>
          )}

          {result && (
              <div className="max-w-5xl mx-auto animate-in slide-in-from-bottom-5 fade-in duration-500 mt-4">
                   <div className="bg-card rounded-3xl p-10 shadow-premium border border-border/50 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-50 to-transparent rounded-full blur-3xl opacity-50"></div>
                      
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 border-b border-border pb-10 mb-10 relative z-10 mt-2">
                          <div className="relative">
                              <svg className="w-40 h-40 transform -rotate-90">
                                  <circle cx="80" cy="80" r="72" stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                                  <circle 
                                      cx="80" cy="80" r="72" 
                                      stroke={result.score >= 80 ? '#22c55e' : result.score >= 60 ? '#eab308' : '#ef4444'} 
                                      strokeWidth="12" 
                                      fill="transparent" 
                                      strokeDasharray="452.4"
                                      strokeDashoffset={452.4 - (452.4 * result.score) / 100}
                                      className="transition-all duration-[2000ms] ease-out"
                                  />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center flex-col shadow-inner rounded-full m-3 bg-white">
                                  <span className="text-4xl font-extrabold text-textPrimary font-heading">{result.score}</span>
                                  <span className="text-xs text-textSecondary font-bold tracking-widest uppercase">/ 100</span>
                              </div>
                          </div>
                          
                          <div className="flex-1 text-center md:text-left pt-2">
                              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold uppercase tracking-wider mb-4 border border-success/20">
                                  <Star className="w-3.5 h-3.5" /> High Shortlist Probability
                              </div>
                              <h3 className="text-3xl font-extrabold text-textPrimary mb-3 font-heading">
                                  {result.score >= 80 ? 'Excellent Resume!' : result.score >= 60 ? 'Good, but needs polish' : 'Needs Significant Revision'}
                              </h3>
                              <p className="text-textSecondary text-lg font-medium max-w-2xl leading-relaxed">
                                  Based on industry standards, your resume scores highly on structure, but can be further optimized with better keywords for ATS filtering.
                              </p>
                              <button 
                                  onClick={() => {setResult(null); setFile(null);}}
                                  className="mt-6 px-6 py-3 bg-background hover:bg-gray-100 text-textPrimary border border-border font-semibold rounded-xl text-sm transition-colors shadow-sm focus:outline-none"
                              >
                                  Upload a new file
                              </button>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                          <div className="bg-gradient-to-br from-success/5 to-transparent p-8 rounded-[24px] border border-success/10 shadow-sm">
                              <h4 className="text-xl font-bold text-textPrimary mb-6 font-heading flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                                     <CheckCircle className="w-5 h-5 text-success" />
                                  </div>
                                  What you did well
                              </h4>
                              <ul className="space-y-4">
                                  {result.strengths.map((str, i) => (
                                      <li key={i} className="flex items-start gap-4">
                                          <div className="w-2 h-2 rounded-full bg-success mt-2 shrink-0"></div>
                                          <span className="text-textPrimary font-medium text-[15px]">{str}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                          <div className="bg-gradient-to-br from-danger/5 to-transparent p-8 rounded-[24px] border border-danger/10 shadow-sm">
                              <h4 className="text-xl font-bold text-textPrimary mb-6 font-heading flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                                     <AlertCircle className="w-5 h-5 text-danger" />
                                  </div>
                                  Areas for Improvement
                              </h4>
                              <ul className="space-y-4">
                                  {result.weaknesses.map((weak, i) => (
                                      <li key={i} className="flex items-start gap-4">
                                          <div className="w-2 h-2 rounded-full bg-danger mt-2 shrink-0"></div>
                                          <span className="text-textPrimary font-medium text-[15px]">{weak}</span>
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>
                   </div>
              </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeCheckingPage;
