import { HabitTracker } from '../components/HabitTracker';
import { PomodoroTimer } from '../components/PomodoroTimer';
import { JournalWidget } from '../components/JournalWidget';
import { FinancialWidget } from '../components/FinancialWidget';
import { History } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
 return (
 <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-dark relative">
 <div className="max-w-6xl mx-auto space-y-8">
 
 {/* Header */}
 <header className="flex items-center justify-between">
          <div className="flex items-center">
            <img src="/iyamin-logo.svg" alt="Iyamin" className="h-10" />
          </div>
 <div className="flex items-center gap-4">
 <Link
 to="/history"
 className="flex items-center gap-2 bg-white px-4 py-2 rounded-full font-semibold text-sm border border-slate-100 hover:border-primary-light transition-colors text-primary"
 >
 <History size={16} />
 <span className="hidden sm:inline">Riwayat & Statistik</span>
 </Link>
 <div className="hidden sm:block text-right">
 <p className="text-sm font-semibold text-slate-400">
 {new Date().toLocaleDateString('id-ID', {
 weekday: 'long',
 year: 'numeric',
 month: 'long',
 day: 'numeric'
 })}
 </p>
 </div>
 </div>
 </header>

 {/* Dashboard Grid */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
 
 <div>
 <PomodoroTimer />
 </div>

 <div className="lg:col-span-2">
 <HabitTracker />
 </div>

 <div className="lg:col-span-2">
 <JournalWidget />
 </div>

 <div>
 <FinancialWidget />
 </div>

 </div>
 
 {/* Footer */}
 <footer className="text-center text-xs text-slate-400 font-medium py-4">
 Stay focused. Stay consistent. &copy; {new Date().getFullYear()}
 </footer>
 </div>
 </div>
 );
}
