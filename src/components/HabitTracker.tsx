import { useState, useEffect } from 'react';
import { Check, Flame, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

interface Habit {
 id: number;
 title: string;
 time?: string;
 completed?: boolean;
}

export function HabitTracker() {
 const [habits, setHabits] = useState<Habit[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 fetchHabits();
 }, []);

 const fetchHabits = async () => {
 setLoading(true);
 
 // Get all habits
 const { data: allHabits } = await supabase.from('habits').select('*').order('id');
 
 // Get today's logs
 const today = new Date().toISOString().split('T')[0];
 const { data: todayLogs } = await supabase
 .from('habit_logs')
 .select('habit_id, completed')
 .eq('completed_date', today)
 .eq('completed', true);

 const completedIds = new Set(todayLogs?.map(log => log.habit_id) || []);

 if (allHabits) {
 setHabits(allHabits.map(h => ({ ...h, completed: completedIds.has(h.id) })));
 }
 
 setLoading(false);
 };

 const toggleHabit = async (id: number) => {
 // Optimistic UI update
 setHabits(prev =>
 prev.map(habit =>
 habit.id === id ? { ...habit, completed: !habit.completed } : habit
 )
 );

 const targetHabit = habits.find(h => h.id === id);
 if (!targetHabit) return;
 
 const today = new Date().toISOString().split('T')[0];
 const willComplete = !targetHabit.completed;

    // Insert / Upsert log
    await supabase.from('habit_logs').upsert({
      habit_id: id,
      completed_date: today,
      completed: willComplete
    }, { onConflict: 'habit_id, completed_date' });
 };

 const progress = habits.length > 0 
 ? Math.round((habits.filter((h) => h.completed).length / habits.length) * 100)
 : 0;

 return (
 <div className="bg-gradient-to-br from-primary-light/30 to-white rounded-2xl p-6 border border-primary/10 flex flex-col h-full relative overflow-hidden">
 {/* Subtle top-right blob to match Financial styling */}
 <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"/>
 
 <div className="flex items-center justify-between mb-6 relative z-10">
 <div>
 <h2 className="text-xl font-bold text-dark">Habit Harian</h2>
 <p className="text-sm font-medium text-primary mt-0.5">Tetap konsisten setiap hari</p>
 </div>
 <div className="flex items-center gap-1 bg-accent-light text-accent-dark px-3 py-1 rounded-full text-sm font-semibold">
 <Flame size={16} />
 <span>{progress}%</span>
 </div>
 </div>

 <div className="flex flex-col gap-3 flex-1">
 {loading ? (
 <div className="flex items-center justify-center flex-1">
 <Loader2 className="animate-spin text-primary"/>
 </div>
 ) : (
 habits.map((habit) => (
 <motion.div
 key={habit.id}
 layout
 initial={false}
 animate={{
 backgroundColor: habit.completed ? '#DDDAFE' : '#FFFFFF',
 }}
 className={cn(
 'flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border',
 habit.completed ? 'border-primary-light' : 'border-slate-200 hover:border-primary-light/50'
 )}
 onClick={() => toggleHabit(habit.id)}
 >
 <div className="flex items-center gap-3">
 <div
 className={cn(
 'w-5 h-5 rounded-full flex items-center justify-center transition-colors',
 habit.completed ? 'bg-primary text-white' : 'bg-slate-200 text-transparent'
 )}
 >
 <Check size={12} strokeWidth={3} />
 </div>
 <div className="flex items-center gap-2">
 <p
 className={cn(
 'font-semibold text-sm transition-all',
 habit.completed ? 'text-primary line-through opacity-70' : 'text-dark'
 )}
 >
 {habit.title}
 </p>
 {habit.time && (
 <span className="text-[10px] font-bold text-primary bg-primary-light/40 px-1.5 py-0.5 rounded-md mt-px">
 {habit.time}
 </span>
 )}
 </div>
 </div>
 </motion.div>
 ))
 )}
 </div>
 </div>
 );
}
