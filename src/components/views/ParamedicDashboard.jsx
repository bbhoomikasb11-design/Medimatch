import React from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Activity, 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Cpu, 
  ShieldCheck, 
  Plus, 
  Ambulance, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight,
  Settings,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export function ParamedicDashboard({ onStartEmergency, onViewActiveCase }) {
  const { dispatches, hospitals } = useMediMatch();

  // Active case check
  const activeCase = dispatches.find((d) => d.status === 'Accepted' || d.status === 'Pending' || d.status === 'En Route');

  // Mock recent cases seed data
  const recentCases = [
    {
      id: '#EMP-8842',
      status: 'Arrived',
      variant: 'green',
      condition: 'STEMI Cardiac Event',
      hospitalName: 'Hospital B - General Care',
      timestamp: 'Today, 14:20',
    },
    {
      id: '#EMP-8819',
      status: 'Arrived',
      variant: 'green',
      condition: 'Blunt Trauma (MVA)',
      hospitalName: 'Hospital A - Saint Jude',
      timestamp: 'Yesterday, 19:45',
    },
    {
      id: '#EMP-8790',
      status: 'Redirected',
      variant: 'amber',
      condition: 'Severe Acute Dyspnea',
      hospitalName: 'Hospital C - Specialty',
      timestamp: '2 days ago',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC] text-[#1A1A1A] antialiased">
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between shrink-0 p-6 shadow-sm z-10">
        <div>
          {/* Logo & Wordmark */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] border border-[#16A34A]/20 flex items-center justify-center text-[#16A34A] shadow-sm">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg text-[#1A1A1A] tracking-tight">
                MediMatch
              </h1>
              <p className="text-[10px] font-mono text-gray-400 font-bold uppercase">EMS Dashboard</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/20 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4 text-[#16A34A]" />
              <span>Dashboard</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Emergency Cases</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>Capacity</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Cpu className="w-4 h-4 text-gray-400" />
              <span>Resources</span>
            </button>

            <button
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Security Logs</span>
            </button>
          </nav>
        </div>

        {/* Pinned Bottom Section */}
        <div className="pt-8 border-t border-gray-100 space-y-4">
          {/* Pinned Solid Green "New Emergency" Button */}
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon={Plus}
            onClick={onStartEmergency}
          >
            New Emergency
          </Button>

          {/* Plain Settings and Support Links */}
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
            <a href="#settings" onClick={(e) => e.preventDefault()} className="hover:text-gray-900 transition-colors flex items-center gap-1">
              <Settings className="w-3.5 h-3.5 text-gray-400" /> Settings
            </a>
            <a href="#support" onClick={(e) => e.preventDefault()} className="hover:text-gray-900 transition-colors flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-gray-400" /> Support
            </a>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          {/* Status & Ambulance ID */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span className="text-[#16A34A] font-bold">Online</span>
            </div>

            <div className="text-xs font-mono font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded-xl border border-gray-200">
              Ambulance ID: KA 01 AB 1234
            </div>
          </div>

          {/* Right-aligned User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30 flex items-center justify-center font-bold text-xs shadow-sm">
              AM
            </div>
            <div className="hidden sm:block text-right">
              <div className="text-sm font-bold text-[#1A1A1A]">Alex Mercer</div>
              <div className="text-[10px] text-gray-500 font-mono">Lead Paramedic</div>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="p-8 max-w-6xl w-full mx-auto space-y-8 flex-1">
          {/* Welcome Heading */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
              Good evening, Alex
            </h2>
            <p className="text-xs text-gray-500 mt-1 font-medium">
              Ready for field triage and emergency hospital routing.
            </p>
          </div>

          {/* Two-Column Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Large Card titled "Start a New Emergency" with RED Button */}
            <Card className="flex flex-col justify-between border-2 border-gray-100 p-6 shadow-sm">
              <CardHeader className="p-0">
                <CardTitle className="text-xl font-extrabold text-[#1A1A1A]">
                  Start a New Emergency
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  Initiate field triage and locate optimal hospital capacity for critical patients.
                </CardDescription>
              </CardHeader>

              <CardFooter className="p-0 mt-8 border-t-0">
                {/* PROMINENT RED BUTTON strictly only here */}
                <button
                  id="start-emergency-red-btn"
                  onClick={onStartEmergency}
                  className="w-full bg-[#DC2626] text-white hover:bg-[#B91C1C] font-extrabold text-sm py-3.5 px-6 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                  <span>+ START EMERGENCY</span>
                </button>
              </CardFooter>
            </Card>

            {/* Right Column: Compact "Active Emergency" Card (ONLY if active case present!) */}
            {activeCase ? (
              <Card className="flex flex-col justify-between border-2 border-[#16A34A]/30 bg-gradient-to-br from-[#ECFDF5]/50 via-white to-emerald-50/20 p-6 shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-extrabold text-[#16A34A]">{activeCase.id}</span>
                    <Badge variant={activeCase.status === 'Accepted' ? 'green' : 'amber'} size="sm" dot>
                      {activeCase.status}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1A1A]">
                    {activeCase.chiefComplaint}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Target: <strong>{activeCase.targetHospitalName}</strong> • ETA: ~{activeCase.etaMinutes} mins</span>
                  </p>

                  {/* Checklist of confirmed items */}
                  <div className="mt-4 p-3 bg-white rounded-xl border border-[#16A34A]/20 space-y-1.5 text-xs text-gray-700">
                    <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>ICU Bed Reserved</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>CT Scanner Operational & Queued</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#16A34A] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Emergency Bay Prepared</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="tint"
                    size="md"
                    fullWidth
                    onClick={onViewActiveCase}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    View Active Case
                  </Button>
                </div>
              </Card>
            ) : null /* Simply absent if no active case! */}
          </div>

          {/* "Recent Cases" Section Below */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#1A1A1A]">Recent Cases</h3>
              <span className="text-xs text-gray-400 font-mono">Last 3 Completed Field Transports</span>
            </div>

            {/* Horizontal Row of 3 Small Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentCases.map((rc) => (
                <Card key={rc.id} className="p-4 space-y-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gray-500">{rc.id}</span>
                    <Badge variant={rc.variant} size="sm">
                      {rc.status}
                    </Badge>
                  </div>

                  <h4 className="font-bold text-sm text-[#1A1A1A]">{rc.condition}</h4>
                  <p className="text-xs text-gray-500">{rc.hospitalName}</p>

                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400 font-mono flex items-center justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {rc.timestamp}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
