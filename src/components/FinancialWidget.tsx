import { TrendingUp, Lock } from 'lucide-react';

export function FinancialWidget() {
 return (
 <div className="bg-gradient-to-br from-accent-light to-white rounded-2xl p-6 border border-accent/20 flex flex-col relative overflow-hidden h-full">
 {/* Overlay for Coming Soon */}
 <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-6">
 <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-accent-dark mb-3">
 <Lock size={20} />
 </div>
 <h3 className="font-bold text-dark mb-1">Visualisasi Finansial</h3>
 <p className="text-xs text-slate-600 font-medium bg-white/80 px-3 py-1 rounded-full">
 Segera Hadir
 </p>
 </div>

 <div className="flex justify-between items-center mb-6 opacity-40">
 <div>
 <h2 className="text-xl font-bold text-dark">Beban Finansial</h2>
 <p className="text-sm font-medium text-primary mt-0.5">Alokasi freelance</p>
 </div>
 <div className="p-2 bg-accent text-white rounded-lg">
 <TrendingUp size={20} />
 </div>
 </div>

 <div className="flex-1 flex flex-col justify-end opacity-40">
 <div className="mb-2 flex justify-between text-sm font-semibold">
 <span className="text-slate-500">Progress Pelunasan</span>
 <span className="text-accent-dark">45%</span>
 </div>
 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
 <div 
 className="h-full bg-gradient-to-r from-accent to-accent-dark rounded-full"
 style={{ width: '45%' }}
 />
 </div>
 <p className="text-xs text-slate-400 mt-4 text-center">
 Fitur gamifikasi utang sedang dalam tahap pengembangan.
 </p>
 </div>
 </div>
 );
}
