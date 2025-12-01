import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const steps = [
    "INITIALIZING KERNEL...",
    "MOUNTING FILE SYSTEMS...",
    "LOADING DRIVERS...",
    "STARTING INTERFACE...",
    "WELCOME, HIMELPVZ"
  ];

  useEffect(() => {
    const totalTime = 2200; // 2.2 seconds total
    const stepTime = totalTime / steps.length;

    const interval = setInterval(() => {
      setStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, stepTime);

    const timer = setTimeout(() => {
      onComplete();
    }, totalTime);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#030014] flex flex-col items-center justify-center font-mono">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 animate-pulse absolute top-0 left-0"></div>
        <div className="w-24 h-24 rounded-full border-t-4 border-cyan-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-2xl text-white">
          HP
        </div>
      </div>

      <div className="h-8 text-cyan-400 text-sm tracking-widest mb-4">
        {steps[step]}
      </div>

      <div className="splash-loader rounded-full"></div>
    </div>
  );
};

export default SplashScreen;