import React, { useState, useEffect } from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Clock, 
  Radio, 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  InfoIcon, 
  Sparkles,
  Ambulance
} from 'lucide-react';

export function Header() {
  const { currentRole, activeNotification, createDispatch, hospitals } = useMediMatch();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const roleTitles = {
    paramedic: { title: 'Paramedic Dispatch & Triage', tag: 'Field Unit' },
    hospital_staff: { title: 'Emergency Department Command', tag: 'Hospital Ops' },
    network_map: { title: 'Regional Network Emergency Grid', tag: 'Command View' },
  };

  const handleSimulateEmergency = () => {
    // Randomly dispatch to Hospital A, B, or C
    const target = hospitals[Math.floor(Math.random() * hospitals.length)];
    const complaints = [
      'Severe Anaphylactic Shock',
      'Acute STEMI Cardiac Event',
      'Severe Respiratory Distress (SpO2 84%)',
      'Multiple Trauma / MVA Incident',
    ];
    const complaint = complaints[Math.floor(Math.random() * complaints.length)];

    createDispatch({
      ambulanceCode: `Medic-${Math.floor(Math.random() * 80 + 10)}`,
      paramedicName: 'Field Paramedic Unit',
      patientAge: Math.floor(Math.random() * 50 + 20),
      patientGender: Math.random() > 0.5 ? 'Female' : 'Male',
      triageLevel: 'Code Red',
      chiefComplaint: complaint,
      vitals: `BP ${Math.floor(Math.random() * 40 + 130)}/${Math.floor(Math.random() * 20 + 85)} | HR ${Math.floor(Math.random() * 40 + 100)}`,
      requiredServices: ['ICU', 'CT Scanner'],
      targetHospitalId: target.id,
      targetHospitalName: target.shortName,
      etaMinutes: Math.floor(Math.random() * 8 + 3),
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Current Active Role Title */}
        <div className="flex items-center gap-3">
          <Badge variant="green" size="md" dot>
            {roleTitles[currentRole]?.tag || 'Active Session'}
          </Badge>
          <div>
            <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">
              {roleTitles[currentRole]?.title}
            </h2>
            <p className="text-xs text-gray-500 font-medium hidden sm:block">
              Real-time synchronization across EMS units and local EDs
            </p>
          </div>
        </div>

        {/* System Time & Quick Action Trigger */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Live Simulated Clock */}
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-mono font-semibold text-gray-700">
            <Clock className="w-4 h-4 text-[#16A34A]" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            <span className="text-[10px] text-gray-400 font-sans uppercase">UTC+5:30</span>
          </div>

          {/* Quick Simulation Trigger */}
          <Button
            variant="tint"
            size="sm"
            icon={Sparkles}
            onClick={handleSimulateEmergency}
            title="Trigger simulated emergency dispatch for testing"
          >
            + Simulate Emergency Alert
          </Button>
        </div>
      </div>

      {/* Dynamic Toast Notification Banner */}
      {activeNotification && (
        <div className={`
          mt-3 p-3 rounded-xl border flex items-center justify-between text-sm animate-ping-once transition-all duration-300
          ${activeNotification.type === 'alert' 
            ? 'bg-[#FEF2F2] border-[#DC2626]/30 text-[#DC2626]' 
            : activeNotification.type === 'success' 
            ? 'bg-[#ECFDF5] border-[#16A34A]/30 text-[#16A34A]' 
            : 'bg-[#FFFBEB] border-[#D97706]/30 text-[#D97706]'}
        `}>
          <div className="flex items-center gap-2.5 font-medium">
            {activeNotification.type === 'alert' && <ShieldAlert className="w-5 h-5 shrink-0" />}
            {activeNotification.type === 'success' && <CheckCircle2 className="w-5 h-5 shrink-0" />}
            {activeNotification.type === 'info' && <InfoIcon className="w-5 h-5 shrink-0" />}
            <span>{activeNotification.message}</span>
          </div>
          <span className="text-xs font-semibold uppercase opacity-75">Live Event</span>
        </div>
      )}
    </header>
  );
}
