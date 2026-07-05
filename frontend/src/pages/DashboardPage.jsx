import React, { useState } from 'react';
import { LogOut, LayoutDashboard, FileText, Target, Users, Code, Database, MessageCircle, BarChart3, BrainCircuit, TrendingUp, Sparkles, ChevronRight, Bell, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ScoreEntryModal from '../components/ScoreEntryModal';
import ProgressGraph from '../components/ProgressGraph';

const CATEGORIES = [
  { id: 'aptitude', name: 'Aptitude', icon: BrainCircuit, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  { id: 'coding', name: 'Coding', icon: Code, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { id: 'sql', name: 'SQL', icon: Database, color: 'from-secondary to-teal-500', bg: 'bg-teal-50', text: 'text-teal-600' },
  { id: 'communication', name: 'Soft Skills', icon: MessageCircle, color: 'from-accent to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', subsectors: ['Group Discussion', 'Technical Communication', 'Presentation Skills'] }
];

const SidebarItem = ({ icon: Icon, label, to, active }) => (
  <Link to={to} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${active ? 'bg-gradient-to-r from-primary-50 to-transparent text-primary-600 border-l-4 border-primary-500' : 'text-textSecondary hover:bg-gray-50 hover:text-textPrimary border-l-4 border-transparent'}`}>
    <Icon className={`w-5 h-5 ${active ? 'text-primary-500' : 'text-gray-400'}`} />
    {label}
  </Link>
);

const DashboardPage = ({ setAuth }) => {
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Shanmuga Priya', email: 'shangmuga@college.edu' };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshGraph, setRefreshGraph] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth(false);
  };

  const activeModalCategory = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="flex bg-background h-screen font-sans overflow-hidden">
      {/* SIDEBAR */}
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

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#FAFBFF]">
        {/* TOP NAV */}
        <header className="h-[88px] px-6 md:px-8 lg:px-10 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-border/60 sticky top-0 z-10">
           <div className="w-full max-w-xl relative group">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" />
              <input type="text" placeholder="Search tasks, scores, or resources..." className="w-full bg-white/90 border border-border rounded-full py-3.5 pl-12 pr-6 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm" />
           </div>
           
           <div className="flex items-center gap-4 ml-4">
              <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-100 transition-colors">
                <Target className="w-4 h-4" /> New Entry
              </button>
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
        <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 custom-scrollbar">
          <div className="mx-auto w-full max-w-7xl">
          {/* WELCOME BANNER */}
          <div className="rounded-[30px] p-8 md:p-10 text-white relative overflow-hidden shadow-[0_24px_80px_rgba(79,125,243,0.25)] mb-8 bg-gradient-to-br from-primary-600 via-primary-500 to-accent">
             <div className="absolute top-0 right-0 w-full h-full pointer-events-none">
                <div className="absolute -top-20 -right-16 w-72 h-72 bg-white/15 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[18%] w-[480px] h-[480px] bg-white/10 rounded-full blur-3xl"></div>
             </div>
             
             <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                <div className="max-w-2xl">
                   <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/20">
                      <Sparkles className="w-3.5 h-3.5" /> Keep up the pace!
                   </span>
                   <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight font-heading leading-tight">
                     You’re closing in on your dream placement.
                   </h2>
                   <p className="text-white/80 font-medium text-lg">You completed 4 focused tasks today and your streak is still strong at 12 days 🔥</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 min-w-[280px]">
                   <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20">
                      <p className="text-sm text-white/70 font-semibold mb-1">Overall</p>
                      <p className="text-2xl font-extrabold font-heading">78%</p>
                   </div>
                   <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/20">
                      <p className="text-sm text-white/70 font-semibold mb-1">Today</p>
                      <p className="text-2xl font-extrabold font-heading flex items-center gap-1">
                        <TrendingUp className="w-5 h-5 text-success" /> +4
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="rounded-[24px] border border-border bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-textSecondary">Focus Hours</p>
              <p className="text-2xl font-bold text-textPrimary mt-2">5.2h</p>
              <p className="text-sm text-success mt-1">+1.1h this week</p>
            </div>
            <div className="rounded-[24px] border border-border bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-textSecondary">Resume Score</p>
              <p className="text-2xl font-bold text-textPrimary mt-2">84/100</p>
              <p className="text-sm text-primary-600 mt-1">Ready for review</p>
            </div>
            <div className="rounded-[24px] border border-border bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-textSecondary">Mock Interviews</p>
              <p className="text-2xl font-bold text-textPrimary mt-2">3</p>
              <p className="text-sm text-accent mt-1">Scheduled this month</p>
            </div>
          </div>

          {/* CATEGORIES GRID */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
               <div>
                 <h3 className="text-xl font-bold text-textPrimary font-heading">Log Today’s Preparation</h3>
                 <p className="text-sm text-textSecondary mt-1">Choose a skill area to record your latest progress.</p>
               </div>
               <button className="text-primary-600 text-sm font-semibold hover:text-primary-700 flex items-center gap-1 transition-colors">
                  View All Stats <ChevronRight className="w-4 h-4" />
               </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              {CATEGORIES.map(cat => (
                <div 
                  key={cat.id} 
                  onClick={() => setSelectedCategory(cat.id)}
                  className="bg-white rounded-[24px] p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] border border-border cursor-pointer hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)] transition-all duration-300 transform hover:-translate-y-1.5 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} opacity-6 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${cat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <cat.icon className="w-6 h-6" />
                     </div>
                     <div className={`px-2.5 py-1 ${cat.bg} ${cat.text} rounded-lg text-xs font-bold`}>
                        Pending
                     </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-textPrimary font-heading mb-1 relative z-10">{cat.name}</h4>
                  <p className="text-sm text-textSecondary font-medium relative z-10">Log scores & update your performance</p>
                  
                  <div className="mt-6 pt-5 border-t border-border/60 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                       <TrendingUp className="w-4 h-4 text-success" />
                       <span className="text-xs font-bold text-success">+2% this week</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                       <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
           <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
             <button onClick={() => navigate('/tests')} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary-600 to-violet-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(79,70,229,0.25)] transition hover:shadow-[0_20px_45px_rgba(79,70,229,0.28)]">
               <Target className="w-4 h-4 mr-2" /> Take Aptitude Test
             </button>
             <p className="text-sm text-textSecondary max-w-2xl">Instantly generate aptitude, SQL, or coding practice and save your score automatically.</p>
           </div>
          </div>
        </div>

        {/* MODAL */}
        {activeModalCategory && (
           <ScoreEntryModal 
             category={activeModalCategory} 
             onClose={() => setSelectedCategory(null)}
             onSave={() => {
                setSelectedCategory(null);
                setRefreshGraph(prev => prev + 1);
             }}
           />
        )}
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
      `}} />
    </div>
  );
};

export default DashboardPage;
