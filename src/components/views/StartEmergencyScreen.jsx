import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  ArrowLeft, 
  ShieldAlert, 
  Heart, 
  Brain, 
  Wind, 
  Baby, 
  Activity, 
  Check, 
  MapPin, 
  Send, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export function StartEmergencyScreen({ onBack, onSubmitEmergency }) {
  // Section 1: Emergency Type
  const [selectedType, setSelectedType] = useState('Trauma');

  // Preset resource maps for auto-selecting chips based on emergency type
  const typePresets = {
    Trauma: ['ICU', 'Emergency Team', 'CT Scan'],
    Cardiac: ['ICU', 'Cardiology', 'Emergency Team'],
    Stroke: ['CT Scan', 'Neurology', 'ICU'],
    Respiratory: ['ICU', 'Emergency Team'],
    Pediatric: ['Pediatric Care', 'Emergency Team'],
    Other: ['Emergency Team'],
  };

  // Section 2: Patient Requirements (multi-select chips)
  const [selectedChips, setSelectedChips] = useState(typePresets['Trauma']);

  // Section 3: Patient Condition (single select)
  const [condition, setCondition] = useState('Critical');

  // All available requirement chips
  const allChips = [
    'ICU',
    'Emergency Team',
    'CT Scan',
    'MRI',
    'Surgery',
    'Cardiology',
    'Neurology',
    'Pediatric Care',
  ];

  // Emergency Type Card options
  const emergencyTypes = [
    { id: 'Trauma', label: 'Trauma', icon: ShieldAlert },
    { id: 'Cardiac', label: 'Cardiac', icon: Heart },
    { id: 'Stroke', label: 'Stroke', icon: Brain },
    { id: 'Respiratory', label: 'Respiratory', icon: Wind },
    { id: 'Pediatric', label: 'Pediatric', icon: Baby },
    { id: 'Other', label: 'Other', icon: Activity },
  ];

  // Handle emergency type click & auto-select chips
  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    if (typePresets[typeId]) {
      setSelectedChips(typePresets[typeId]);
    }
  };

  // Toggle multi-select chips
  const handleChipToggle = (chipName) => {
    if (selectedChips.includes(chipName)) {
      setSelectedChips(selectedChips.filter((c) => c !== chipName));
    } else {
      setSelectedChips([...selectedChips, chipName]);
    }
  };

  // Handle Form Submit
  const handleFindHospitals = () => {
    onSubmitEmergency({
      type: selectedType,
      requirements: selectedChips,
      condition,
      location: 'MG Road, Bengaluru',
    });
  };

  // One-line summary calculation
  const summaryText = `Summary: ${selectedType} • ${condition} • ${selectedChips.length > 0 ? selectedChips.join(' + ') : 'None'}`;

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
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>

          {/* Centered MediMatch Wordmark */}
          <div className="text-center">
            <h1 className="font-extrabold text-lg text-[#1A1A1A] tracking-tight">
              MediMatch
            </h1>
          </div>

          {/* Red EMERGENCY MODE Badge Top-Right */}
          <div>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-full bg-[#FEF2F2] text-[#DC2626] border border-[#DC2626]/30 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              EMERGENCY MODE
            </span>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* MAIN FORM BODY WITH CLEAR SPACING & HIERARCHY */}
        {/* ========================================================================= */}
        <main className="max-w-3xl mx-auto p-6 sm:p-8 space-y-10">
          {/* Heading */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Start Emergency
            </h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              Tell us what the patient needs.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1 — EMERGENCY TYPE (3x2 GRID) */}
          {/* ========================================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Section 1 — Emergency Type
              </h3>
              <span className="text-xs text-gray-400 font-medium">Select primary condition</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {emergencyTypes.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedType === item.id;
                return (
                  <div
                    key={item.id}
                    id={`type-card-${item.id}`}
                    onClick={() => handleTypeSelect(item.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-3 min-h-[64px]
                      ${isSelected 
                        ? 'border-[#16A34A] bg-[#ECFDF5] shadow-sm ring-1 ring-[#16A34A]/20' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    <div className={`
                      w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors
                      ${isSelected ? 'bg-[#16A34A] text-white shadow' : 'bg-gray-100 text-gray-500'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-[#1A1A1A]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2 — WHAT DOES THE PATIENT REQUIRE? (MULTI-SELECT CHIPS) */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2 border-t border-gray-200/60">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Section 2 — What does the patient require?
              </h3>
              <span className="text-xs text-gray-400 font-medium">Auto-pre-selected • Tap to edit</span>
            </div>

            <div className="flex flex-wrap gap-2.5 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
              {allChips.map((chip) => {
                const isSelected = selectedChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleChipToggle(chip)}
                    className={`
                      px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer
                      ${isSelected 
                        ? 'bg-[#16A34A] text-white shadow-sm hover:bg-[#15803D]' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}
                    `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{chip}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 3 — PATIENT CONDITION (3 CARDS SIDE BY SIDE) */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2 border-t border-gray-200/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Section 3 — Patient Condition
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {[
                { 
                  id: 'Critical', 
                  label: 'Critical', 
                  tag: 'Code Red',
                  desc: 'Life Threatening / Immediate',
                  color: 'red',
                  activeClass: 'border-[#DC2626] bg-[#FEF2F2] text-[#DC2626] ring-1 ring-[#DC2626]'
                },
                { 
                  id: 'Serious', 
                  label: 'Serious', 
                  tag: 'Code Yellow',
                  desc: 'Urgent / Stable Vitals',
                  color: 'amber',
                  activeClass: 'border-[#D97706] bg-[#FFFBEB] text-[#D97706] ring-1 ring-[#D97706]'
                },
                { 
                  id: 'Stable', 
                  label: 'Stable', 
                  tag: 'Code Green',
                  desc: 'Non-Urgent Care',
                  color: 'yellow',
                  activeClass: 'border-[#CA8A04] bg-amber-50/60 text-[#CA8A04] ring-1 ring-[#CA8A04]'
                },
              ].map((item) => {
                const isSelected = condition === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setCondition(item.id)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer text-left min-h-[84px] flex flex-col justify-between
                      ${isSelected ? item.activeClass : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base">{item.label}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-black/5 font-mono">
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs opacity-80 mt-1">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 4 — CURRENT LOCATION */}
          {/* ========================================================================= */}
          <div className="space-y-3 pt-2 border-t border-gray-200/60 pb-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Section 4 — Current Location
            </h3>

            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left Details */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">GPS Telemetry</div>
                  <div className="text-base font-extrabold text-[#1A1A1A] mt-0.5">
                    Current Ambulance Location: MG Road, Bengaluru
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Zone 4 Traffic Sector • Locked GPS Vector</p>
                </div>
              </div>

              {/* Right Mock Map Graphic */}
              <div className="relative w-full sm:w-48 h-16 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shrink-0">
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <pattern id="startMiniGrid" width="12" height="12" patternUnits="userSpaceOnUse">
                    <path d="M 12 0 L 0 0 0 12" fill="none" stroke="#22c55e" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#startMiniGrid)" />
                </svg>
                <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-mono font-bold text-white bg-black/70 px-2.5 py-1 rounded backdrop-blur-sm border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                  <span>GPS: MG ROAD</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM BAR */}
      {/* ========================================================================= */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-4 sm:p-5 shadow-2xl z-30">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* One-Line Summary on the Left */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Live Selection Summary</span>
            <div className="text-xs font-bold text-[#1A1A1A] truncate max-w-sm">
              {summaryText}
            </div>
          </div>

          {/* Action Button & Helper Link */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a 
              href="#help" 
              onClick={(e) => {
                e.preventDefault();
                alert('Triage Guidance: Trauma requires ICU + CT; Cardiac requires ICU + Cardiology; Stroke requires CT + ICU.');
              }} 
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 self-start sm:self-center"
            >
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
              <span>Not sure what is required?</span>
            </a>

            <div className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={Send}
                onClick={handleFindHospitals}
              >
                FIND SUITABLE HOSPITALS
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
