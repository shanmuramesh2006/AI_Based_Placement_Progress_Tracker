import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Activity } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/90 backdrop-blur-md p-4 border border-border shadow-float rounded-xl">
        <p className="text-xs font-bold text-textSecondary uppercase tracking-wider mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1 last:mb-0">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
             <span className="text-sm font-medium text-textPrimary">{entry.name}: <span className="font-bold">{entry.value}%</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ProgressGraph = ({ triggerRefresh }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      try {
        const response = await fetch(`/api/progress/daily?category=${selectedCategory === 'All' ? '' : selectedCategory}&startDate=${startStr}&endDate=${endStr}`, {
           headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if(response.ok) {
           const jsonData = await response.json();
           
           const groupedByDate = {};
           jsonData.forEach(item => {
             if(!groupedByDate[item.logDate]) {
                groupedByDate[item.logDate] = { date: item.logDate };
             }
             groupedByDate[item.logDate][item.category] = item.score;
           });

           const chartData = Object.values(groupedByDate).sort((a,b) => new Date(a.date) - new Date(b.date));
           setData(chartData);
        }
      } catch (e) {
        console.error("Failed to load graph data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [triggerRefresh, selectedCategory]);

  return (
    <div className="bg-card rounded-[24px] p-8 shadow-float border border-border w-full flex flex-col mb-10 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-gradient-to-bl from-primary-50/50 to-transparent rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10">
        <div>
           <h3 className="text-2xl font-bold text-textPrimary font-heading flex items-center gap-2">
             <Activity className="w-6 h-6 text-primary-500" /> Performance Analytics
           </h3>
           <p className="text-sm text-textSecondary mt-1 font-medium">Tracking your progress over the last 30 days.</p>
        </div>
        
        <div className="mt-4 sm:mt-0 relative group">
           <select 
             value={selectedCategory} 
             onChange={(e) => setSelectedCategory(e.target.value)}
             className="appearance-none px-5 py-3 pr-10 bg-background border border-border rounded-xl text-sm font-bold text-textPrimary outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 cursor-pointer transition-all shadow-sm"
           >
             <option value="All">All Categories Overview</option>
             <option value="Aptitude">Aptitude</option>
             <option value="Coding">Coding</option>
             <option value="SQL">SQL</option>
             <option value="Communication">Communication</option>
           </select>
           <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </div>
        </div>
      </div>

      <div className="w-full h-[380px] relative z-10">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-textSecondary bg-background/50 rounded-2xl animate-pulse">
             <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
             <p className="font-medium text-sm">Aggregating learning trends...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-textSecondary bg-background/50 rounded-2xl border border-dashed border-border/80">
             <Activity className="w-12 h-12 text-gray-300 mb-3" />
             <p className="font-bold text-gray-400">No data logged for this period.</p>
             <p className="text-xs text-gray-400 mt-1">Add scores in the grid above to start visualizing your journey.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                 <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#4F7DF3" stopOpacity={0.3}/>
                   <stop offset="95%" stopColor="#4F7DF3" stopOpacity={0}/>
                 </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
              <XAxis 
                 dataKey="date" 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{fontSize: 12, fill: '#6B7280', fontWeight: 600}} 
                 dy={15} 
              />
              <YAxis 
                 axisLine={false} 
                 tickLine={false} 
                 tick={{fontSize: 12, fill: '#6B7280', fontWeight: 600}} 
                 domain={[0, 100]} 
                 dx={-10}
              />
              <Tooltip cursor={{ stroke: '#4F7DF3', strokeWidth: 1, strokeDasharray: '4 4' }} content={<CustomTooltip />} />
              {selectedCategory === 'All' ? (
                <>
                  <Line type="monotone" dataKey="Aptitude" stroke="#4F7DF3" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill: '#4F7DF3'}} />
                  <Line type="monotone" dataKey="Coding" stroke="#3CCFCF" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill: '#3CCFCF'}} />
                  <Line type="monotone" dataKey="SQL" stroke="#F59E0B" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill: '#F59E0B'}} />
                  <Line type="monotone" dataKey="Communication" stroke="#8B5CF6" strokeWidth={3} dot={{r:0}} activeDot={{r:6, strokeWidth: 0, fill: '#8B5CF6'}} />
                </>
              ) : (
                <Line type="monotone" dataKey={selectedCategory} stroke="#4F7DF3" strokeWidth={4} dot={{r:0}} activeDot={{r:8, strokeWidth: 2, fill: '#4F7DF3', stroke: '#fff'}} />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ProgressGraph;
