import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Flame, Loader2, Trophy, Target, LayoutGrid, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function HistoryPage() {
  const [activeTab, setActiveTab] = useState<'journals' | 'stats'>('journals');
  const [journals, setJournals] = useState<any[]>([]);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [habitBreakdown, setHabitBreakdown] = useState<any[]>([]);
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [topHabit, setTopHabit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === 'journals') {
      const { data } = await supabase
        .from('journals')
        .select('*')
        .order('created_at', { ascending: false });
      setJournals(data || []);
    } else {
      // Fetch stats with joined habit data
      const { data } = await supabase
        .from('habit_logs')
        .select(`
          completed_date, 
          habits(id, title)
        `)
        .eq('completed', true)
        .order('completed_date', { ascending: true });
      
      const logs = data || [];
      
      // Calculate Total Completed
      setTotalCompleted(logs.length);

      // Group by Date for Chart
      const groupedByDate = logs.reduce((acc: any, log: any) => {
        acc[log.completed_date] = (acc[log.completed_date] || 0) + 1;
        return acc;
      }, {});
      
      const statsArr = Object.keys(groupedByDate).map(date => {
        const dateObj = new Date(date);
        return {
          fullDate: date,
          dateLabel: dateObj.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
          count: groupedByDate[date]
        };
      });
      setDailyStats(statsArr);

      // Group by Habit for Breakdown & Top Habit
      const groupedByHabit = logs.reduce((acc: any, log: any) => {
        if (!log.habits) return acc;
        // In Supabase js, a many-to-one join returns an object or array. 
        // We'll handle both just in case.
        const habitId = Array.isArray(log.habits) ? log.habits[0]?.id : log.habits.id;
        const habitTitle = Array.isArray(log.habits) ? log.habits[0]?.title : log.habits.title;
        
        if (!habitId) return acc;

        if (!acc[habitId]) {
          acc[habitId] = { id: habitId, title: habitTitle, count: 0 };
        }
        acc[habitId].count += 1;
        return acc;
      }, {});

      const breakdownArr = Object.values(groupedByHabit).sort((a: any, b: any) => b.count - a.count);
      setHabitBreakdown(breakdownArr);
      setTopHabit(breakdownArr.length > 0 ? breakdownArr[0] : null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-dark">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex items-center gap-4">
          <Link
            to="/"
            className="p-3 bg-white rounded-xl border border-slate-200 hover:border-primary-light hover:text-primary transition-colors hover:bg-slate-50"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-dark">Riwayat & Statistik</h1>
            <p className="text-sm text-slate-500 font-medium">Lacak perjalanan dan konsistensi Anda</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden min-h-[60vh] flex flex-col">
          
          {/* Tabs */}
          <div className="flex p-3 gap-2 bg-slate-50/50 border-b border-slate-100">
            <button
              onClick={() => setActiveTab('journals')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
                activeTab === 'journals' ? 'bg-white text-primary border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-dark border border-transparent hover:bg-slate-100/50'
              )}
            >
              <BookOpen size={18} />
              Riwayat Jurnal
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all',
                activeTab === 'stats' ? 'bg-white text-accent-dark border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-dark border border-transparent hover:bg-slate-100/50'
              )}
            >
              <Flame size={18} />
              Statistik Habit
            </button>
          </div>

          {/* Main View */}
          <div className="flex-1 p-6 md:p-8 bg-slate-50/30">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[40vh] text-slate-400">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
              </div>
            ) : activeTab === 'journals' ? (
              <div className="space-y-4">
                {journals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <BookOpen size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-slate-500">Belum ada jurnal yang dicatat.</p>
                    <p className="text-sm">Mari mulai tuliskan wawasan Anda hari ini!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {journals.map((j) => (
                      <div key={j.id} className="bg-gradient-to-br from-white to-slate-50/30 p-6 rounded-2xl border border-slate-200 flex flex-col group hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between mb-4 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 bg-primary-light/20 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <h3 className="font-bold text-dark text-base leading-tight mt-0.5">{j.title}</h3>
                              <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                                {new Date(j.created_at).toLocaleDateString('id-ID', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap md:pl-12 flex-1">{j.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                
                {/* Highlight Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary-light/20 to-white p-6 rounded-2xl border border-primary/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-primary mb-1">Total Diselesaikan</p>
                      <h3 className="text-3xl font-black text-dark">{totalCompleted} <span className="text-sm font-semibold text-slate-400">kali</span></h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary border border-primary/10">
                      <Target size={24} />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-accent-light/30 to-white p-6 rounded-2xl border border-accent/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-accent-dark mb-1">Habit Paling Sering</p>
                      <h3 className="text-xl font-bold text-dark leading-tight line-clamp-1">{topHabit ? topHabit.title : '-'}</h3>
                      <p className="text-xs font-semibold text-slate-500 mt-1">{topHabit ? `${topHabit.count} kali diselesaikan` : 'Belum ada data'}</p>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-dark border border-accent/10">
                      <Trophy size={24} />
                    </div>
                  </div>
                </div>

                {/* Visual Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart2 size={18} className="text-slate-400" />
                    <h3 className="font-bold text-dark">Aktivitas Harian</h3>
                  </div>
                  
                  {dailyStats.length === 0 ? (
                    <div className="flex items-center justify-center h-64 text-slate-400 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                      Belum ada data aktivitas habit.
                    </div>
                  ) : (
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="dateLabel" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} 
                            dy={10} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            allowDecimals={false}
                          />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'none' }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#FAB96E" 
                            radius={[6, 6, 6, 6]}
                            name="Habit Selesai" 
                            barSize={32}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                {/* Habit Breakdown List */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2 mb-4">
                    <LayoutGrid size={18} className="text-slate-400" />
                    <h3 className="font-bold text-dark">Rincian per Habit</h3>
                  </div>
                  
                  {habitBreakdown.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">Belum ada rincian data.</p>
                  ) : (
                    <div className="space-y-3">
                      {habitBreakdown.map((item: any, idx: number) => {
                        // Calculate percentage relative to the top habit for a visual progress bar
                        const maxCount = topHabit?.count || 1;
                        const widthPct = Math.round((item.count / maxCount) * 100);
                        
                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200 transition-colors">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between items-end mb-1.5">
                                <span className="font-semibold text-sm text-dark">{item.title}</span>
                                <span className="text-xs font-bold text-slate-500">{item.count} kali</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-primary h-1.5 rounded-full" 
                                  style={{ width: `${widthPct}%` }}
                                ></div>
                              </div>
                            </div>
                            {idx === 0 && (
                              <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center text-accent-dark border border-accent/20">
                                <Trophy size={14} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
