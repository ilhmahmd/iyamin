import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence of text fades
    const timer1 = setTimeout(() => setStep(1), 1500); // Move to 'Satu langkah.'
    const timer2 = setTimeout(() => setStep(2), 3000); // Fade out overlay
    const timer3 = setTimeout(() => onFinish(), 3600); // Unmount completely

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
      initial={{ opacity: 1 }}
      animate={{ opacity: step === 2 ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.h1
            key="hari"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            satu hari.
          </motion.h1>
        )}
        {step === 1 && (
          <motion.h1
            key="langkah"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            satu langkah.
          </motion.h1>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
