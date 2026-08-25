import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

type Mode = 'work' | 'break';

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pomodoro_timeLeft');
    return saved !== null ? parseInt(saved, 10) : WORK_TIME;
  });
  const [isRunning, setIsRunning] = useState(() => {
    const saved = localStorage.getItem('pomodoro_isRunning');
    return saved === 'true';
  });
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem('pomodoro_mode') as Mode;
    return saved || 'work';
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pomodoro_timeLeft', timeLeft.toString());
    localStorage.setItem('pomodoro_isRunning', isRunning.toString());
    localStorage.setItem('pomodoro_mode', mode);
  }, [timeLeft, isRunning, mode]);

 useEffect(() => {
 let interval: number | undefined;

 if (isRunning && timeLeft > 0) {
 interval = window.setInterval(() => {
 setTimeLeft((prev) => prev - 1);
 }, 1000);
 } else if (isRunning && timeLeft === 0) {
 // Auto-switch mode
 if (mode === 'work') {
 setMode('break');
 setTimeLeft(BREAK_TIME);
 } else {
 setMode('work');
 setTimeLeft(WORK_TIME);
 }
 setIsRunning(false); // Pause on switch
 }

 return () => clearInterval(interval);
 }, [isRunning, timeLeft, mode]);

 const toggleTimer = () => setIsRunning(!isRunning);

 const resetTimer = () => {
 setIsRunning(false);
 setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
 };

 const switchMode = (newMode: Mode) => {
 setMode(newMode);
 setIsRunning(false);
 setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
 };

 const formatTime = (seconds: number) => {
 const m = Math.floor(seconds / 60);
 const s = seconds % 60;
 return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
 };

 const progress =
 mode === 'work'
 ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100
 : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

 return (
 <div className="bg-dark rounded-2xl p-6 text-white flex flex-col h-full relative overflow-hidden">
 {/* Background decoration */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 -mr-10 -mt-10"/>
 <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full blur-3xl opacity-20 -ml-10 -mb-10"/>

 <div className="flex justify-between items-center mb-8 relative z-10">
 <h2 className="text-xl font-bold">Fokus</h2>
 <div className="flex bg-white/10 rounded-full p-1 gap-1">
 <button
 onClick={() => switchMode('work')}
 className={cn(
 'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all',
 mode === 'work' ? 'bg-primary text-white' : 'text-white/60 hover:text-white'
 )}
 >
 <Briefcase size={12} />
 Kerja
 </button>
 <button
 onClick={() => switchMode('break')}
 className={cn(
 'px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all',
 mode === 'break' ? 'bg-accent text-dark' : 'text-white/60 hover:text-white'
 )}
 >
 <Coffee size={12} />
 Istirahat
 </button>
 </div>
 </div>

 <div className="flex-1 flex flex-col items-center justify-center relative z-10">
 <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Circular Progress */}
        <svg className="absolute w-full h-full transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            className="stroke-white/10"
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            className={cn(
              mode === 'work' ? 'stroke-primary' : 'stroke-accent'
            )}
            style={{ 
              transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
              strokeDasharray: 2 * Math.PI * 88,
              strokeDashoffset: 2 * Math.PI * 88 * (1 - progress / 100)
            }}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
 <div className="text-5xl font-bold tracking-tight">
 {formatTime(timeLeft)}
 </div>
 </div>

 <div className="flex items-center gap-4 mt-8">
 <button
 onClick={resetTimer}
 className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
 >
 <RotateCcw size={20} />
 </button>
 <button
 onClick={toggleTimer}
 className={cn(
 'px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95',
 mode === 'work' ? 'bg-primary text-white' : 'bg-accent text-dark'
 )}
 >
 {isRunning ? <Pause size={20} /> : <Play size={20} />}
 {isRunning ? 'Jeda' : 'Mulai'}
 </button>
 </div>
 </div>
 </div>
 );
}
