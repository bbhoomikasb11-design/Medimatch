import React, { useState } from 'react';
import { Activity, Ambulance, Building2, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function LandingPage({ onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-[#1A1A1A] antialiased">
      {/* ========================================================================= */}
      {/* LEFT PANEL (Off-White Background) */}
      {/* ========================================================================= */}
      <div className="w-full md:w-1/2 bg-[#F8FAFC] p-8 sm:p-12 lg:p-16 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between relative overflow-hidden">
        {/* Top-left Brand Logo & Title */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#16A34A]/20 flex items-center justify-center text-[#16A34A] shadow-sm">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              MediMatch
            </h1>
          </div>

          <p className="text-base text-gray-600 font-medium max-w-md leading-relaxed">
            Connecting emergency teams with the right hospital resources.
          </p>
        </div>

        {/* Abstract Line-and-Node Illustration Placeholder */}
        <div className="my-12 py-8 flex items-center justify-center">
          <div className="relative w-full max-w-sm h-52 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full">
              {/* Dotted Connection Lines */}
              <line x1="25%" y1="50%" x2="75%" y2="25%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="25%" y1="50%" x2="75%" y2="75%" stroke="#16A34A" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Ambulance Node */}
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shadow-md border-2 border-white">
                <Ambulance className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-500 mt-2 uppercase">EMS Unit</span>
            </div>

            {/* Hospital Node 1 */}
            <div className="absolute right-[20%] top-[20%] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30 flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase">Hosp A</span>
            </div>

            {/* Hospital Node 2 */}
            <div className="absolute right-[20%] bottom-[20%] flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30 flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-400 mt-1 uppercase">Hosp B</span>
            </div>
          </div>
        </div>

        {/* Bottom-left Small Caps Label */}
        <div>
          <span className="text-[10px] tracking-wider uppercase text-gray-400 font-bold font-mono">
            CLINICAL PRECISION SYSTEM
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT PANEL (White Background, Centered Content) */}
      {/* ========================================================================= */}
      <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between items-center">
        <div className="w-full max-w-md my-auto space-y-8">
          {/* Welcome Heading */}
          <div>
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight">
              Welcome
            </h2>
            <p className="text-sm text-gray-500 mt-1.5 font-normal">
              Choose how you're accessing the emergency network.
            </p>
          </div>

          {/* Two Stacked Selectable Cards */}
          <div className="space-y-4">
            {/* Card 1: Paramedic / Ambulance */}
            <div
              id="role-card-paramedic"
              onClick={() => setSelectedRole('paramedic')}
              className={`
                p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4
                ${selectedRole === 'paramedic'
                  ? 'border-[#16A34A] bg-[#ECFDF5] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'}
              `}
            >
              <div className={`
                w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors
                ${selectedRole === 'paramedic'
                  ? 'bg-[#16A34A] text-white shadow'
                  : 'bg-gray-100 text-gray-600'}
              `}>
                <Ambulance className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Paramedic / Ambulance
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Find suitable participating hospitals and coordinate emergency arrivals.
                </p>
              </div>
            </div>

            {/* Card 2: Hospital Staff */}
            <div
              id="role-card-hospital"
              onClick={() => setSelectedRole('hospital_staff')}
              className={`
                p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex items-center gap-4
                ${selectedRole === 'hospital_staff'
                  ? 'border-[#16A34A] bg-[#ECFDF5] shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'}
              `}
            >
              <div className={`
                w-12 h-12 rounded-full shrink-0 flex items-center justify-center transition-colors
                ${selectedRole === 'hospital_staff'
                  ? 'bg-[#16A34A] text-white shadow'
                  : 'bg-gray-100 text-gray-600'}
              `}>
                <Building2 className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1A1A1A]">
                  Hospital Staff
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Manage emergency capacity, incoming cases and resource requests.
                </p>
              </div>
            </div>
          </div>

          {/* Full-width Green "Continue" Button */}
          <div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={!selectedRole}
              onClick={handleContinue}
              icon={ChevronRight}
              iconPosition="right"
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Small Caps Footer Text */}
        <div className="pt-8 text-center">
          <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">
            AUTHORIZED HEALTHCARE PERSONNEL ONLY · SECURE EMERGENCY COORDINATION NETWORK
          </p>
        </div>
      </div>
    </div>
  );
}
