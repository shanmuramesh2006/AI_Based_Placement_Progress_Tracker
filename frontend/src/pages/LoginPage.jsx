import React, { useState, useEffect } from 'react';
import { Mail, KeyRound, CheckCircle2, TrendingUp, Briefcase, FileCheck2, Lightbulb, Target, GraduationCap, Eye, EyeOff, User, Lock } from 'lucide-react';

const LoginPage = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  // Toggle to simulate CORS failure in the UI without changing backend connectivity
  const [simulateCorsError, setSimulateCorsError] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, passwordHash: formData.password };
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const contentType = response.headers.get("content-type");
      let data = null;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      if (!response.ok) {
        if (!data || data.includes("Proxy error") || data.includes("504")) {
           throw new Error("Cannot connect to server. Is your Spring Boot backend running on port 8080?");
        }
        throw new Error(data.message || data || 'Authentication failed');
      }

      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        setAuth(true);
      } else {
        setIsLogin(true);
        setError('Registration successful! Please sign in.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full font-sans">
      <div className="flex h-screen">
        {/* Left Half */}
        <div className="w-1/2 bg-[#F3F4F6] p-10 flex flex-col">
          <div className="max-w-lg mx-auto h-full flex flex-col">
            <header className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-[#0f172a] flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg font-bold text-slate-900">Placement Tracker</h3>
                  <span className="ml-2 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs font-semibold">AI</span>
                </div>
              </div>
            </header>

            <main className="mt-8 flex-1 flex flex-col">
              <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">
                AI-Powered
                <br />
                Student Placement
                <br />
                Progress Tracker
              </h1>

              <div className="mt-6">
                <div className="w-14 h-1 bg-blue-600 rounded" />
              </div>

              <p className="mt-6 text-slate-600 max-w-xl">
                Track. Analyze. Improve.
                <br />
                Empowering students with AI insights to achieve their placement goals.
              </p>

              <div className="mt-6 flex-1 flex items-end">
                <div className="w-full rounded-2xl bg-white/60 p-6 flex items-center justify-center shadow-md">
                  <div className="text-center text-slate-500">
                    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4">
                      <rect x="2" y="2" width="116" height="76" rx="12" stroke="#E6E9EE" strokeWidth="4" fill="#FFF"/>
                      <path d="M20 56h80v2a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4v-2z" fill="#F3F4F6"/>
                      <rect x="26" y="20" width="68" height="22" rx="3" fill="#F8FAFC"/>
                      <path d="M36 26h48" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M36 32h30" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <div className="text-sm">Illustration hidden for privacy</div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        {/* Right Half */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className="w-full max-w-md px-8 py-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
              <p className="mt-2 text-sm text-slate-500">Login to continue your placement journey</p>
            </div>

            {(simulateCorsError || error) && (
              <div className={`rounded-lg border p-3 text-sm font-medium mb-4 ${error.includes('successful') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>
                {simulateCorsError ? 'Invalid CORS request' : error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Email or Roll Number</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email or roll number"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-slate-900 outline-none focus:border-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 pr-11 text-slate-900 outline-none focus:border-slate-400"
                  />
                  <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <a href="#" className="text-sm font-medium text-blue-600">Forgot Password?</a>
                </div>
              </div>

              <button type="submit" disabled={simulateCorsError} className={`w-full rounded-full py-3 text-base font-semibold shadow-sm ${simulateCorsError ? 'bg-slate-300 text-slate-600 cursor-not-allowed' : 'bg-slate-900 text-white'}`}>Login</button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <div className="text-sm text-slate-400">or</div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button type="button" disabled={simulateCorsError} className={`w-full rounded-full border border-slate-200 bg-white py-3 flex items-center justify-center gap-3 text-sm ${simulateCorsError ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <span className="h-5 w-5 flex items-center justify-center">
                  {/* Google G svg */}
                  <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h147.4c-6.3 34-25 62.8-53.4 82v68.2h86.1c50.3-46.4 81.4-114.6 81.4-195.2z" fill="#4285F4"/>
                    <path d="M272 544.3c72.6 0 133.7-24.1 178.2-65.3l-86.1-68.2c-24 16.1-54.7 25.6-92.1 25.6-70.8 0-130.8-47.8-152.3-112.1H35.6v70.6C79.5 488.5 170.2 544.3 272 544.3z" fill="#34A853"/>
                    <path d="M119.7 327.3c-10.8-32.2-10.8-66.9 0-99.1V157.6H35.6c-39.6 78.9-39.6 172.7 0 251.6l84.1-82." fill="#FBBC05"/>
                    <path d="M272 109.7c39.6 0 75.3 13.6 103.4 40.3l77.8-77.8C405.8 24.7 349.4 0 272 0 170.2 0 79.5 55.8 35.6 137.8l84.1 70.6C141.2 157.5 201.2 109.7 272 109.7z" fill="#EA4335"/>
                  </svg>
                </span>
                <span>Login with Google</span>
              </button>

              <p className="text-center text-sm text-slate-600">Don't have an account? <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className="text-blue-600 font-semibold">Sign up</button></p>

              {/* Developer helper: quick toggle to enable/disable simulated CORS error */}
              <div className="mt-3 text-center">
                <button type="button" onClick={() => setSimulateCorsError(!simulateCorsError)} className="text-xs text-slate-400 underline">Toggle simulated CORS error</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
