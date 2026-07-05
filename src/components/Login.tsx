import React, { useState } from 'react';
import { 
  BookOpen, 
  User, 
  ArrowRight, 
  Sparkles, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  Lock, 
  Eye, 
  EyeOff, 
  HelpCircle,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (user: { name: string; studentId: number; targetRole: string; targetCompany: string }) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState('');
  const [studentIdInput, setStudentIdInput] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('Google');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom states for premium UX
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    const parsedId = parseInt(studentIdInput.trim(), 10);
    if (!studentIdInput.trim() || isNaN(parsedId) || parsedId <= 0) {
      setError('Please enter a valid numeric Student ID.');
      return;
    }

    setIsSubmitting(true);

    // Simulate clean loading for aesthetic realism
    setTimeout(() => {
      onLogin({
        name: name.trim(),
        studentId: parsedId,
        targetRole,
        targetCompany: targetCompany.trim() || 'Tech Industry',
      });
      setIsSubmitting(false);
    }, 800);
  };

  const handleDemoLogin = (demoName: string, id: number, role: string, company: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onLogin({
        name: demoName,
        studentId: id,
        targetRole: role,
        targetCompany: company,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans text-[#1E293B] antialiased" id="login-split-container">
      
      {/* LEFT SECTION: Beautiful Full-height Hero Panel */}
      <div className="lg:w-1/2 relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-[#0F172A] text-white">
        {/* Background Image with slight blue gradient overlay & soft glassmorphic visual filters */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/campus_hero_bg_1783250089219.jpg"
            alt="Futuristic Tech University Campus Background"
            className="w-full h-full object-cover opacity-35 scale-105 transition-transform duration-[10000ms] hover:scale-100"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0F172A] via-[#0F172A]/90 to-[#2563EB]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#0F172A]/70 to-[#0F172A]" />
        </div>

        {/* Content Top: Placement Tracker AI Logo */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white shadow-lg shadow-blue-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-extrabold tracking-tight uppercase bg-gradient-to-r from-white via-slate-200 to-blue-200 bg-clip-text text-transparent">
              Placement Tracker AI
            </span>
            <span className="block text-[9px] text-[#3B82F6] font-bold tracking-widest uppercase">Assessment Suite</span>
          </div>
        </div>

        {/* Content Middle: Title & Sub-headlines */}
        <div className="relative z-10 my-auto max-w-lg space-y-8">
          <div className="space-y-4">
            {/* Modern Accent line */}
            <div className="h-1.5 w-16 rounded bg-[#2563EB] shadow-lg shadow-blue-500/50" />
            
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1]">
              AI-Powered <br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-blue-100 to-white bg-clip-text text-transparent">
                Student Placement
              </span> <br />
              Progress Tracker
            </h1>
          </div>

          {/* Core pillar words */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-1 text-xs font-semibold text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]" />
              <span>Track.</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-1 text-xs font-semibold text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span>Analyze.</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full px-3.5 py-1 text-xs font-semibold text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Improve.</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed max-w-md font-medium">
            Empowering engineering students with AI-powered placement preparation, auto-generated mock assessments, and personalized performance evaluation.
          </p>

          {/* Floating Live Statistics Widget for ultra premium look */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg shadow-2xl flex items-center justify-between max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Placement Success</div>
                <div className="text-sm font-bold text-white">94.2% Rate Verified</div>
              </div>
            </div>
            <div className="text-right border-l border-white/10 pl-4">
              <div className="text-[9px] text-[#3B82F6] font-extrabold uppercase">Live Node</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1 justify-end">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Bottom: Secure Access Footer */}
        <div className="relative z-10 flex items-center justify-between text-slate-400 text-xs pt-6 border-t border-white/10">
          <p className="font-semibold text-[10px] uppercase tracking-wider">&copy; 2026 AI Placement Engine</p>
          <div className="flex items-center space-x-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Secure Enterprise SSL</span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION: Modern Premium Login Card & Panel */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 md:p-16 lg:max-w-2xl xl:max-w-3xl bg-[#F8FAFC]">
        {/* Mobile Header Logo */}
        <div className="flex items-center justify-between lg:hidden mb-8">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-[#2563EB] text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold tracking-tight text-[#0F172A] uppercase">Placement Tracker AI</span>
          </div>
          <span className="text-[9px] text-[#2563EB] font-bold uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded">v1.1 Active</span>
        </div>

        {/* Empty spacing on desktop to center the content vertically */}
        <div className="hidden lg:block h-6" />

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto space-y-7">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight text-[#0F172A]">
              Welcome Back
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Login to continue your placement journey.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-xl shadow-slate-100 relative"
          >
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-xs font-semibold text-rose-600 animate-shake flex items-center space-x-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] font-semibold text-[#1E293B] transition-all bg-[#F8FAFC] focus:bg-white"
                    placeholder="e.g. Siddharth Sharma"
                  />
                </div>
              </div>

              {/* Student ID field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Student Registration ID (Numeric)
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={studentIdInput}
                    onChange={(e) => setStudentIdInput(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-10 pr-4 py-3 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] font-semibold text-[#1E293B] transition-all bg-[#F8FAFC] focus:bg-white"
                    placeholder="e.g. 20268842"
                  />
                </div>
              </div>

              {/* Password field (Requested by design specs, bound to existing unused state with real eye toggle) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 group-focus-within:text-[#2563EB] transition-colors">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] font-semibold text-[#1E293B] transition-all bg-[#F8FAFC] focus:bg-white"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-[#2563EB] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Placement Preferences Label Area */}
              <div className="pt-2">
                <div className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest text-center border-b border-slate-100 pb-1 mb-3">
                  Placement Focus Preferences
                </div>
                
                {/* Target Role & Target Company in responsive grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Role
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Briefcase className="h-3.5 w-3.5" />
                      </span>
                      <select
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        className="w-full pl-8 pr-2 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold text-[#1E293B] bg-[#F8FAFC] transition-all cursor-pointer"
                      >
                        <option value="Software Engineer">Software Engineer</option>
                        <option value="SQL Analyst">SQL Analyst</option>
                        <option value="Full-stack Developer">Full-stack Dev</option>
                        <option value="QA Engineer">QA Engineer</option>
                        <option value="Business Analyst">Business Analyst</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Company
                    </label>
                    <div className="relative group">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        <Building2 className="h-3.5 w-3.5" />
                      </span>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={(e) => setTargetCompany(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 text-xs border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#2563EB] font-semibold text-[#1E293B] bg-[#F8FAFC] transition-all"
                        placeholder="e.g. Google, Stripe"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Remember Me and Forgot Password / registration details */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/20 cursor-pointer"
                  />
                  <span className="text-[11px] font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
                    Remember Me
                  </span>
                </label>
                <a 
                  href="#forgot-id" 
                  onClick={(e) => { e.preventDefault(); alert("Please contact your placement cell coordinator or college administration to retrieve your Registration ID."); }}
                  className="text-[11px] font-bold text-[#2563EB] hover:text-[#3B82F6] transition-colors"
                >
                  Forgot ID / Password?
                </a>
              </div>

              {/* Submit Button (Primary) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0F172A] to-[#1E293B] hover:from-[#1E293B] hover:to-[#2D3748] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin mr-2" />
                    Accessing Placement Engine...
                  </>
                ) : (
                  <>
                    Login to Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

              {/* Continue with Google button (Requested by design specs, cosmetic helper) */}
              <button
                type="button"
                onClick={() => handleDemoLogin('Siddharth Sharma', 20268842, 'Software Engineer', 'Google')}
                className="w-full inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F8FAFC] px-4 py-3 text-xs font-bold text-slate-700 transition-all active:scale-[0.98] cursor-pointer mt-1"
              >
                {/* Colorful Google custom SVG icon */}
                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.59 5.59 0 0 1 8.4 12.928a5.59 5.59 0 0 1 5.59-5.59c2.184 0 4.148 1.25 5.09 3.086l3.65-2.83C20.65 4.316 16.712 2 12.24 2a10.9 10.9 0 0 0-11 10.928A10.9 10.9 0 0 0 12.24 23.85c5.986 0 10.74-4.8 10.74-10.928 0-.643-.054-1.286-.16-1.928H12.24z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>

            {/* Quick Demo Student Logs with Premium Styling */}
            <div className="mt-6 border-t border-slate-100 pt-5">
              <div className="text-[9px] font-extrabold text-[#2563EB] uppercase tracking-widest text-center mb-3 flex items-center justify-center space-x-1">
                <Award className="h-3 w-3 animate-bounce" />
                <span>Instant Credentials (Demo Students)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('Siddharth Sharma', 20268842, 'Software Engineer', 'Google')}
                  className="flex flex-col items-start p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-blue-50/10 text-left transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors">Siddharth S.</span>
                  <span className="text-[8.5px] font-medium text-slate-400 mt-0.5">ID: 20268842 (Google SE)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('R. Shanmugapriya', 20261045, 'SQL Analyst', 'Stripe')}
                  className="flex flex-col items-start p-3 rounded-xl border border-[#E5E7EB] hover:border-[#2563EB] hover:bg-blue-50/10 text-left transition-all cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors">Shanmugapriya</span>
                  <span className="text-[8.5px] font-medium text-slate-400 mt-0.5">ID: 20261045 (Stripe SQL)</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Bottom links */}
          <div className="text-center text-xs text-slate-400 font-semibold">
            <span>Don't have an account? </span>
            <a 
              href="#signup" 
              onClick={(e) => { e.preventDefault(); alert("Placement cell enrollment is done automatically by university administration. Please report to the Placement Cell for new registrations."); }}
              className="text-[#2563EB] hover:text-[#3B82F6] hover:underline font-bold"
            >
              Contact Registrar
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center mt-6 border-t border-slate-100 lg:block hidden">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            &copy; 2026 AI-Based Placement Progress Tracker • Secure Student Access
          </p>
        </footer>
      </div>
    </div>
  );
}
