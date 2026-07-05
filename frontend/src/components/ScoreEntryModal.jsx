import React, { useState } from 'react';
import { X, Target, Calendar, Edit3 } from 'lucide-react';

const ScoreEntryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    score: '',
    logDate: new Date().toISOString().split('T')[0],
    subSector: category.subsectors ? category.subsectors[0] : '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const scoreVal = parseInt(formData.score);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 100) {
      setError('Score must be between 0 and 100');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/progress/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          category: category.name,
          subSector: formData.subSector,
          score: scoreVal,
          logDate: formData.logDate,
          notes: formData.notes
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save score. Please try again.');
      }
      
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-[28px] w-full max-w-[500px] shadow-premium overflow-hidden animate-in zoom-in-95 fade-in duration-300 relative">
        
        {/* Soft Background Gradient */}
        <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${category.color} rounded-full blur-[80px] opacity-20 pointer-events-none`}></div>

        <div className="flex justify-between items-center p-8 pb-6 border-b border-border relative z-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.color} text-white shadow-glow`}>
               <category.icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-textPrimary font-heading tracking-tight">Log Score</h3>
              <p className="text-textSecondary text-sm font-medium">{category.name} Module</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-danger hover:bg-danger/10 transition-colors p-2.5 rounded-xl cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
          {error && <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm font-bold flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </div>}

          {category.subsectors && (
             <div className="group">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-textSecondary mb-2 group-focus-within:text-primary-500 transition-colors">Topic Detail</label>
                <select name="subSector" value={formData.subSector} onChange={handleChange} className="w-full px-5 py-4 rounded-xl bg-background border border-border text-textPrimary text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer">
                  {category.subsectors.map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
             </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1 group/score">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-textSecondary mb-2 group-focus-within/score:text-primary-500 transition-colors flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> Assessment Score</label>
              <input type="number" name="score" value={formData.score} onChange={handleChange} required min="0" max="100" placeholder="e.g. 85" className="w-full px-5 py-4 rounded-xl bg-background border border-border text-textPrimary text-xl font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 placeholder:font-medium" />
            </div>
            <div className="flex-1 group/date">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-textSecondary mb-2 group-focus-within/date:text-primary-500 transition-colors flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Date Logged</label>
              <input type="date" name="logDate" value={formData.logDate} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl bg-background border border-border text-textPrimary text-sm font-bold focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all" />
            </div>
          </div>

          <div className="group">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-textSecondary mb-2 group-focus-within:text-primary-500 transition-colors flex items-center gap-1.5"><Edit3 className="w-3.5 h-3.5" /> Personal Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="What key concepts did you master today?" className="w-full px-5 py-4 rounded-xl bg-background border border-border text-textPrimary text-sm font-medium focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none resize-none transition-all placeholder:text-gray-400"></textarea>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={loading} className={`w-full bg-gradient-to-r ${category.color} text-white font-bold py-4 rounded-xl transition-all relative overflow-hidden group/btn flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-glow hover:-translate-y-1`}>
              <span className="relative z-10 flex items-center gap-2">{loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Log Activity'}</span>
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-[shine_1.5s_ease-in-out_infinite] z-0"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScoreEntryModal;
