import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  ArrowLeft, 
  Ambulance, 
  Building2, 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Radio, 
  MapPin, 
  Sparkles 
} from 'lucide-react';

export function FindingHospitalScreen({ onBack, onComplete }) {
  // 6 Checklist Steps
  const checklistSteps = [
    'Location confirmed',
    'Searching participating hospitals',
    'Checking ICU capacity',
    'Checking CT availability',
    'Checking emergency capacity',
    'Calculating ETA',
  ];

  const [currentStep, setCurrentStep] = useState(0);

  // Progressive timeout animation for checklist & node updates over ~2.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= checklistSteps.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [checklistSteps.length]);

  // Auto-advance to results when all steps complete
  useEffect(() => {
    if (currentStep >= checklistSteps.length) {
      const autoAdvanceTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(autoAdvanceTimer);
    }
  }, [currentStep, checklistSteps.length, onComplete]);

  // Dynamic hospital node status helper based on step progress
  const getHospitalNodeStatus = (hospKey) => {
    if (currentStep < 2) return { text: 'Checking...', color: 'gray' };

    switch (hospKey) {
      case 'b':
        return currentStep >= 2 ? { text: 'Suitable', color: 'green' } : { text: 'Checking...', color: 'gray' };
      case 'a':
        return currentStep >= 2 ? { text: 'ICU Full', color: 'red' } : { text: 'Checking...', color: 'gray' };
      case 'c':
        return currentStep >= 3 ? { text: 'CT Unavail', color: 'red' } : { text: 'Checking...', color: 'gray' };
      case 'd':
        return currentStep >= 4 ? { text: 'Limited', color: 'gray' } : { text: 'Checking...', color: 'gray' };
      case 'e':
        return currentStep >= 5 ? { text: 'Far (18km)', color: 'gray' } : { text: 'Checking...', color: 'gray' };
      case 'f':
        return currentStep >= 5 ? { text: 'No ER Bay', color: 'red' } : { text: 'Checking...', color: 'gray' };
      default:
        return { text: 'Checking...', color: 'gray' };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1A1A] flex flex-col justify-between antialiased">
      <div>
        {/* ========================================================================= */}
        {/* TOP BAR */}
        {/* ========================================================================= */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
          {/* Back Arrow */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors p-1.5 rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Centered MediMatch Wordmark */}
          <div className="text-center">
            <h1 className="font-extrabold text-lg text-[#1A1A1A] tracking-tight">
              MediMatch
            </h1>
          </div>

          {/* # Emergency #1043 Chip Top-Right */}
          <div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-gray-100 text-gray-800 border border-gray-200 shadow-sm">
              # Emergency #1043
            </span>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MAIN TRANSITION AREA */}
        {/* ========================================================================= */}
        <main className="max-w-6xl mx-auto p-6 sm:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                ACTIVE EMERGENCY
              </span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Finding the right hospital...
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Scanning real-time regional hospital capacity and traffic vectors.
            </p>
          </div>

          {/* Main Area: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ========================================================================= */}
            {/* LEFT / CENTER: RADIATING NETWORK DIAGRAM */}
            {/* ========================================================================= */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4 flex flex-col justify-between min-h-[420px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#16A34A] animate-pulse" /> Scanning Regional Network
                </span>
                <span className="text-xs font-mono font-semibold text-gray-500">MG Road Radius: 10 km</span>
              </div>

              {/* SVG Network Diagram Container */}
              <div className="relative w-full h-80 sm:h-96 bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center">
                {/* Background Grid */}
                <svg className="absolute inset-0 w-full h-full opacity-20">
                  <pattern id="transitionGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22c55e" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#transitionGrid)" />
                </svg>

                {/* Radiating Dashed SVG Lines from Central Ambulance (50%, 50%) to 6 Hospitals */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="50%" y1="50%" x2="82%" y2="55%" stroke="#16a34a" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <line x1="50%" y1="50%" x2="70%" y2="82%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="30%" y2="82%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="50%" y1="50%" x2="18%" y2="55%" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Central Ambulance Icon (50%, 50%) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="relative">
                    <span className="absolute -inset-3 rounded-full bg-emerald-500 animate-ping opacity-30" />
                    <div className="w-14 h-14 rounded-2xl bg-[#16A34A] text-white border-2 border-white flex items-center justify-center shadow-xl">
                      <Ambulance className="w-7 h-7" />
                    </div>
                  </div>
                  <span className="mt-2 text-[11px] font-mono font-bold text-white bg-black/80 px-2.5 py-0.5 rounded border border-emerald-500/40">
                    Medic-08
                  </span>
                </div>

                {/* Hospital Node 1: Hospital B (75%, 25%) */}
                <div className="absolute left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-800 border-2 border-[#16A34A] flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-[#16A34A]" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 mt-1">Hosp B</span>
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded mt-0.5 uppercase ${
                    getHospitalNodeStatus('b').color === 'green'
                      ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {getHospitalNodeStatus('b').text}
                  </span>
                </div>

                {/* Hospital Node 2: Hospital A (25%, 25%) */}
                <div className="absolute left-[25%] top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-800 border-2 border-red-500 flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 mt-1">Hosp A</span>
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded mt-0.5 uppercase ${
                    getHospitalNodeStatus('a').color === 'red'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {getHospitalNodeStatus('a').text}
                  </span>
                </div>

                {/* Hospital Node 3: Hospital C (82%, 55%) */}
                <div className="absolute left-[82%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-white text-gray-800 border-2 border-red-500 flex items-center justify-center shadow-md">
                    <Building2 className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 mt-1">Hosp C</span>
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded mt-0.5 uppercase ${
                    getHospitalNodeStatus('c').color === 'red'
                      ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {getHospitalNodeStatus('c').text}
                  </span>
                </div>

                {/* Hospital Node 4: Hospital D (70%, 82%) */}
                <div className="absolute left-[70%] top-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">Hosp D</span>
                  <span className="text-[9px] font-mono text-gray-400 bg-gray-900 px-1 py-0.2 rounded mt-0.5">
                    {getHospitalNodeStatus('d').text}
                  </span>
                </div>

                {/* Hospital Node 5: Hospital E (30%, 82%) */}
                <div className="absolute left-[30%] top-[82%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">Hosp E</span>
                  <span className="text-[9px] font-mono text-gray-400 bg-gray-900 px-1 py-0.2 rounded mt-0.5">
                    {getHospitalNodeStatus('e').text}
                  </span>
                </div>

                {/* Hospital Node 6: Hospital F (18%, 55%) */}
                <div className="absolute left-[18%] top-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-bold text-gray-400 mt-0.5">Hosp F</span>
                  <span className="text-[9px] font-mono text-gray-400 bg-gray-900 px-1 py-0.2 rounded mt-0.5">
                    {getHospitalNodeStatus('f').text}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-400">
                Live Capacity Verification Engine • MG Road Sub-Sector
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT SIDE: VERTICAL CHECKLIST + NETWORK SUMMARY */}
            {/* ========================================================================= */}
            <div className="space-y-4">
              {/* Vertical Checklist Card "Checking availability" */}
              <Card className="p-5 border-gray-200 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-[#1A1A1A]">Checking Availability</h3>
                  <Badge variant="green" size="sm" dot>Live Scan</Badge>
                </div>

                <div className="space-y-3">
                  {checklistSteps.map((stepName, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    const isPending = idx > currentStep;

                    return (
                      <div key={stepName} className="flex items-center gap-3 text-xs font-semibold">
                        {isDone && (
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                        )}
                        {isCurrent && (
                          <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                        )}
                        {isPending && (
                          <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                        )}

                        <span className={isDone ? 'text-[#1A1A1A]' : isCurrent ? 'text-blue-600 font-bold' : 'text-gray-400 font-normal'}>
                          {stepName}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Network Summary Card */}
              <Card className="p-5 border-gray-200 space-y-3 bg-gray-50/60">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Network Summary
                  </h4>
                  <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                  <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                    <div className="text-[10px] text-gray-400 uppercase">Found</div>
                    <div className="text-base font-extrabold text-[#1A1A1A] font-mono">6</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#16A34A]/30">
                    <div className="text-[10px] text-[#16A34A] uppercase font-bold">Suitable</div>
                    <div className="text-base font-extrabold text-[#16A34A] font-mono">1</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FEF2F2] border border-[#DC2626]/30">
                    <div className="text-[10px] text-[#DC2626] uppercase font-bold">Unavail</div>
                    <div className="text-base font-extrabold text-[#DC2626] font-mono">5</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
