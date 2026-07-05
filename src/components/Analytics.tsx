import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, ArrowRight, RefreshCw, Trophy, Flame, Target, BookOpen, Trash2 } from 'lucide-react';
import { DailyProgress, Category } from '../types';

interface AnalyticsProps {
  progressLogs: DailyProgress[];
  refreshProgress: () => Promise<void>;
  studentId: number;
}

interface MentorReport {
  strengths: string;
  weaknesses: string;
  plan: string;
  overallRating: number;
}

export default function Analytics({ progressLogs, refreshProgress, studentId }: AnalyticsProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [mentorReport, setMentorReport] = useState<MentorReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Fetch AI Mentor Report
  const fetchMentorReport = async () => {
    setIsLoadingReport(true);
    try {
      const res = await fetch(`/api/monthly-analysis?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setMentorReport(data);
      }
    } catch (err) {
      console.error('Failed to load mentor report:', err);
    } finally {
      setIsLoadingReport(false);
    }
  };

  // Fetch report automatically on first load if not present
  useEffect(() => {
    fetchMentorReport();
  }, [progressLogs.length]); // regenerate report if logs count changes

  // Delete manual/test progress log
  const handleDeleteLog = async (id: string) => {
    setIsDeletingId(id);
    try {
      const res = await fetch(`/api/progress/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await refreshProgress();
      }
    } catch (err) {
      console.error('Failed to delete progress log:', err);
    } finally {
      setIsDeletingId(null);
    }
  };

  // Sort and process logs for charting
  const sortedLogs = [...progressLogs].sort(
    (a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime()
  );

  // Filter logs based on category selection
  const filteredLogs = sortedLogs.filter(
    (p) => selectedCategory === 'ALL' || p.category === selectedCategory
  );

  // Process unique dates
  const uniqueDates = Array.from(new Set(sortedLogs.map((log) => log.logDate))).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // SVG Chart Config
  const chartWidth = 700;
  const chartHeight = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;

  // Render Category lines on SVG
  const renderChartLine = (category: Category, color: string, gradientId: string) => {
    const catLogs = sortedLogs.filter((p) => p.category === category);
    if (catLogs.length < 2) return null;

    const points = catLogs.map((log) => {
      // Find date position on X
      const dateIdx = uniqueDates.indexOf(log.logDate);
      const x = paddingLeft + (dateIdx / (uniqueDates.length - 1)) * plotWidth;
      const y = chartHeight - paddingBottom - (log.score / 100) * plotHeight;
      return { x, y, score: log.score, logDate: log.logDate };
    });

    // Generate Path
    let pathD = '';
    points.forEach((pt, idx) => {
      if (idx === 0) {
        pathD += `M ${pt.x} ${pt.y}`;
      } else {
        // Curve tension
        const prev = points[idx - 1];
        const cpX1 = prev.x + (pt.x - prev.x) / 2;
        const cpY1 = prev.y;
        const cpX2 = prev.x + (pt.x - prev.x) / 2;
        const cpY2 = pt.y;
        pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
      }
    });

    // Area Path under line for color fill
    let areaD = pathD;
    if (points.length > 0) {
      areaD += ` L ${points[points.length - 1].x} ${chartHeight - paddingBottom}`;
      areaD += ` L ${points[0].x} ${chartHeight - paddingBottom} Z`;
    }

    return (
      <g key={category}>
        {/* Shadow fill */}
        <path d={areaD} fill={`url(#${gradientId})`} opacity="0.15" />
        {/* Stroke line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500"
        />
        {/* Circle data points */}
        {points.map((pt, i) => (
          <g key={i} className="group/point cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="white"
              stroke={color}
              strokeWidth="2.5"
              className="transition-all duration-200 hover:r-7"
            />
            {/* Tooltip on hover */}
            <title>{`${category}: ${pt.score}% on ${pt.logDate}`}</title>
          </g>
        ))}
      </g>
    );
  };

  return (
    <div className="space-y-8" id="analytics-section">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Performance Analytics</h2>
          <p className="text-xs text-slate-400">Review your daily preparation score trends and custom AI feedback.</p>
        </div>
        
        {/* Category Selector */}
        <div className="flex bg-slate-100 rounded-lg p-1 max-w-fit self-start border border-slate-200">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Tracks
          </button>
          <button
            onClick={() => setSelectedCategory('APTITUDE')}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'APTITUDE' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Aptitude
          </button>
          <button
            onClick={() => setSelectedCategory('SQL')}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'SQL' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            SQL
          </button>
          <button
            onClick={() => setSelectedCategory('CODING')}
            className={`rounded px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === 'CODING' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Coding
          </button>
        </div>
      </div>

      {/* Progress Line Graph */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preparation Score Timeline (%)</h3>
        
        <div className="mt-6 flex justify-center overflow-x-auto">
          {uniqueDates.length < 2 ? (
            <div className="flex h-52 items-center justify-center flex-col text-slate-400">
              <BookOpen className="h-10 w-10 text-slate-300 stroke-1" />
              <p className="mt-2 text-xs font-medium">Take more than one practice test to map your visual trend lines!</p>
            </div>
          ) : (
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full max-w-4xl h-auto" style={{ minWidth: '600px' }}>
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="1" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="1" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 20, 40, 60, 80, 100].map((tick) => {
                const y = chartHeight - paddingBottom - (tick / 100) * plotHeight;
                return (
                  <g key={tick}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="1.2"
                    />
                    <text
                      x={paddingLeft - 12}
                      y={y + 4}
                      className="font-mono text-[9px] font-bold fill-slate-400 text-right"
                      textAnchor="end"
                    >
                      {tick}%
                    </text>
                  </g>
                );
              })}

              {/* X Axis Dates */}
              {uniqueDates.map((dateStr, idx) => {
                if (uniqueDates.length > 8 && idx % 2 !== 0) return null;
                const x = paddingLeft + (idx / (uniqueDates.length - 1)) * plotWidth;
                const formattedDate = new Date(dateStr).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <text
                    key={dateStr}
                    x={x}
                    y={chartHeight - 12}
                    className="font-mono text-[9px] font-bold fill-slate-400 text-center"
                    textAnchor="middle"
                  >
                    {formattedDate}
                  </text>
                );
              })}

              {/* Render Lines depending on Visibility */}
              {(selectedCategory === 'ALL' || selectedCategory === 'APTITUDE') &&
                renderChartLine('APTITUDE', '#4f46e5', 'purpleGrad')}
              {(selectedCategory === 'ALL' || selectedCategory === 'SQL') &&
                renderChartLine('SQL', '#2563eb', 'cyanGrad')}
              {(selectedCategory === 'ALL' || selectedCategory === 'CODING') &&
                renderChartLine('CODING', '#059669', 'emeraldGrad')}
            </svg>
          )}
        </div>

        {/* Legend */}
        <div className="mt-4 border-t border-slate-100 pt-4 flex flex-wrap gap-4 items-center justify-center text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="text-slate-600">Aptitude & Reasoning</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-slate-600">SQL & Databases</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-slate-600">Coding & Algorithms</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
        
        {/* AI Performance Analysis & Mentor Report */}
        <div className="md:col-span-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-50 text-blue-600 border border-blue-100">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">AI Mentor Performance Analysis</h3>
              </div>

              <button
                onClick={fetchMentorReport}
                disabled={isLoadingReport}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 transition-all cursor-pointer border border-slate-200"
                title="Regenerate Report"
              >
                {isLoadingReport ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </button>
            </div>

            <p className="mt-2 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Generative evaluation based on your cumulative assessment timeline
            </p>

            {isLoadingReport ? (
              <div className="flex h-56 flex-col items-center justify-center text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-3 text-xs font-medium">Generating performance evaluation...</p>
              </div>
            ) : mentorReport ? (
              <div className="mt-6 space-y-5 text-xs animate-fade-in">
                {/* Rating Meter */}
                <div className="flex items-center space-x-4 bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-lg shadow-sm border border-blue-500">
                    {mentorReport.overallRating}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Overall Placement Readiness</h4>
                    <p className="text-slate-400 text-[10px] font-medium">Based on performance history logs.</p>
                  </div>
                </div>

                {/* Strengths */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Key Strengths:</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 font-normal">
                    {mentorReport.strengths}
                  </p>
                </div>

                {/* Focus Areas */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Areas of Focus:</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 font-normal">
                    {mentorReport.weaknesses}
                  </p>
                </div>

                {/* Plan */}
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-[10px] uppercase tracking-wider flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Recommended 15-Day Preparation Plan:</span>
                  </h4>
                  <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50/50 p-3.5 rounded-lg border border-slate-100 font-normal">
                    {mentorReport.plan}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-52 flex-col items-center justify-center text-slate-400">
                <p className="text-xs font-semibold">No reports generated. Perform more tests to analyze your readiness.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Performance Logs */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Preparation Logs</h3>
            <p className="text-xs text-slate-400 mt-1 leading-normal font-normal">Audit trail of completed assessments & manual progress entries.</p>
            
            <div className="mt-5 max-h-[380px] overflow-y-auto space-y-3 pr-1">
              {filteredLogs.length === 0 ? (
                <div className="flex h-32 items-center justify-center text-xs text-slate-400 font-semibold">
                  No logs found for this track.
                </div>
              ) : (
                [...filteredLogs].reverse().map((log) => {
                  let badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                  if (log.category === 'SQL') badgeColor = 'bg-blue-50 text-blue-700 border-blue-100';
                  if (log.category === 'CODING') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-100';

                  return (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-all text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                          {log.category === 'APTITUDE' ? 'Aptitude' : log.category === 'SQL' ? 'SQL' : 'Coding'}
                        </span>
                        <div>
                          <div className="font-bold text-slate-800">{log.score}% Score</div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {new Date(log.logDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Delete Log Option */}
                      <button
                        onClick={() => handleDeleteLog(log.id)}
                        disabled={isDeletingId === log.id}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded hover:bg-red-50/50 transition-all cursor-pointer border border-transparent"
                        title="Delete log"
                      >
                        {isDeletingId === log.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
