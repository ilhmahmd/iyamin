import { useState } from 'react';
import { Send, BookOpen } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

export function JournalWidget() {
 const [title, setTitle] = useState('');
 const [content, setContent] = useState('');
 const [isSaved, setIsSaved] = useState(false);

 const handleSave = async () => {
 if (!title.trim() || !content.trim()) return;
 
 // Save to DB
 const { error } = await supabase.from('journals').insert({
 title: title.trim(),
 content: content.trim()
 });

 if (error) {
 console.error("Error saving journal:", error);
 return;
 }

 setIsSaved(true);
 setTimeout(() => {
 setTitle('');
 setContent('');
 setIsSaved(false);
 }, 2000);
 };

 const handleSkip = async () => {
    const { error } = await supabase.from('journals').insert({
      title: 'Tidak Ada Kajian',
      content: 'Hari ini tidak mendengarkan podcast atau kajian apapun.'
    });

    if (error) {
      console.error("Error saving journal:", error);
      return;
    }

    setIsSaved(true);
    setTimeout(() => {
      setTitle('');
      setContent('');
      setIsSaved(false);
    }, 2000);
  };

 return (
 <div className="bg-gradient-to-br from-primary-light/40 to-white rounded-2xl p-6 flex flex-col h-full border border-primary/20 relative overflow-hidden group hover:border-primary/40 transition-all duration-300">
 {/* Decorative Blob */}
 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"/>

 <div className="flex items-center justify-between mb-6 relative z-10">
 <div>
 <h2 className="text-xl font-bold text-dark">Jurnal Tumbuh</h2>
 <p className="text-sm font-medium text-primary mt-0.5">Insight Hari Ini</p>
 </div>
 <div className="p-2.5 bg-primary rounded-xl text-white">
 <BookOpen size={20} />
 </div>
 </div>

 <div className="relative flex-1 flex flex-col gap-4 z-10">
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 placeholder="Judul Podcast atau Kajian hari ini..."
 className="w-full bg-white rounded-2xl px-5 py-4 text-sm text-dark font-bold placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-100 transition-all hover:border-primary/30"
 />
 <textarea
 value={content}
 onChange={(e) => setContent(e.target.value)}
 placeholder="Tuliskan poin-poin menarik atau insight yang kamu dapatkan..."
 className="flex-1 w-full bg-white rounded-2xl p-5 text-sm text-dark placeholder:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none border border-slate-100 transition-all hover:border-primary/30 leading-relaxed"
 />
 
 <AnimatePresence>
 {isSaved && (
 <motion.div
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-primary font-semibold flex-col gap-2"
 >
 <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
 <Send size={18} />
 </div>
 Tersimpan!
 </motion.div>
 )}
 </AnimatePresence>
 </div>

  <div className="mt-5 flex items-center justify-between relative z-10">
    <button
      onClick={handleSkip}
      disabled={isSaved}
      className={cn(
        'px-4 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-dark hover:bg-slate-100 transition-colors',
        isSaved && 'opacity-50 cursor-not-allowed'
      )}
    >
      Lewati Hari Ini
    </button>
    <button
      onClick={handleSave}
      disabled={!title.trim() || !content.trim() || isSaved}
      className={cn(
        'px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300',
        title.trim() && content.trim() && !isSaved
          ? 'bg-primary text-white hover:bg-dark hover:-translate-y-0.5'
          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
      )}
    >
      Simpan Catatan
    </button>
  </div>
 </div>
 );
}
