import React from 'react';
import { BookOpen, User, Flame, TrendingUp, LogOut } from 'lucide-react';

interface NavbarProps {
  user: { name: string; studentId: number; targetRole: string; targetCompany: string } | null;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  return (
    <nav className="border-b border-slate-200 bg-white shadow-sm" id="app-navbar">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-blue-600 text-white shadow-md shadow-blue-100">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-800">AI-Based Placement Progress Tracker</span>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Assessment Module • AI Powered</p>
            </div>
          </div>

          {/* User Metrics & Profile */}
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-4 text-xs font-medium text-slate-500">
              <div className="flex items-center space-x-1">
                <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-slate-700 font-bold">7 Day Streak</span>
              </div>
              <div className="h-4 w-[1px] bg-slate-200" />
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-slate-700 font-bold">92% Target</span>
              </div>
            </div>

            <div className="flex items-center space-x-4 border-l border-slate-200 pl-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800">{user?.name || 'Siddharth Sharma'}</div>
                  <div className="text-[9px] font-semibold text-slate-400 flex flex-col">
                    <span>ID: {user?.studentId || '2026-8842'}</span>
                    <span className="text-[8px] text-blue-500 font-bold uppercase tracking-wider">{user?.targetRole || 'Software Engineer'} • {user?.targetCompany || 'Google'}</span>
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 transition-all cursor-pointer border border-transparent flex items-center justify-center"
                  title="Sign Out"
                  id="navbar-logout-btn"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
