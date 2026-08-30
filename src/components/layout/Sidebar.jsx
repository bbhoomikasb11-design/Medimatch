import React from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { Badge } from '../ui/Badge';
import { 
  Ambulance, 
  Building2, 
  Map, 
  Activity, 
  RefreshCw, 
  Volume2, 
  VolumeX,
  ShieldAlert,
  ChevronRight,
  Home
} from 'lucide-react';

export function Sidebar({ onReturnHome }) {
  const { 
    currentRole, 
    setCurrentRole, 
    hospitals, 
    dispatches, 
    resetSeedData,
    soundEnabled,
    setSoundEnabled 
  } = useMediMatch();

  const activeDispatchesCount = dispatches.filter(d => d.status === 'Pending' || d.status === 'Accepted').length;
  
  const totalAvailableIcu = hospitals.reduce((acc, h) => acc + h.icuBeds.available, 0);
  const totalIcuCapacity = hospitals.reduce((acc, h) => acc + h.icuBeds.total, 0);

  const roles = [
    {
      id: 'paramedic',
      name: 'Paramedic Crew',
      subtitle: 'Field Triage & Dispatch',
      icon: Ambulance,
      badgeText: 'Field Ops',
      badgeVariant: 'green',
    },
    {
      id: 'hospital_staff',
      name: 'Hospital Staff',
      subtitle: 'Capacity & ER Bay Triage',
      icon: Building2,
      badgeText: `${activeDispatchesCount} Incoming`,
      badgeVariant: activeDispatchesCount > 0 ? 'amber' : 'green',
    },
    {
      id: 'network_map',
      name: 'Network Map',
      subtitle: 'Regional System Overview',
      icon: Map,
      badgeText: 'Live Grid',
      badgeVariant: 'gray',
    },
  ];

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0 shadow-sm z-20">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div 
            onClick={onReturnHome}
            className="flex items-center gap-3 cursor-pointer group"
            title="Return to Welcome Screen"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#16A34A]/20 flex items-center justify-center text-[#16A34A] shadow-sm group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-[#1A1A1A] tracking-tight flex items-center gap-1.5">
                MediMatch
                <span className="text-[10px] px-1.5 py-0.5 rounded font-extrabold bg-[#ECFDF5] text-[#16A34A] uppercase border border-[#16A34A]/20">
                  PROTOTYPE
                </span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">Emergency Health Sync</p>
            </div>
          </div>
        </div>

        {/* Return to Landing Page Action */}
        {onReturnHome && (
          <div className="px-3 pt-3">
            <button
              onClick={onReturnHome}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
            >
              <Home className="w-4 h-4 text-[#16A34A]" />
              <span>Change Welcome Persona</span>
            </button>
          </div>
        )}

        {/* Role Selection Label */}
        <div className="px-6 pt-5 pb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Switch Persona / View
          </p>
        </div>

        {/* Role Navigation List */}
        <nav className="px-3 space-y-1">
          {roles.map((role) => {
            const Icon = role.icon;
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                onClick={() => setCurrentRole(role.id)}
                className={`
                  w-full flex items-center justify-between p-3.5 rounded-xl transition-all duration-200 text-left group
                  ${isActive 
                    ? 'bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30 shadow-sm font-semibold' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive ? 'bg-[#16A34A] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-snug">{role.name}</div>
                    <div className={`text-xs ${isActive ? 'text-[#16A34A]/80' : 'text-gray-500'}`}>
                      {role.subtitle}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Badge variant={role.badgeVariant} size="sm">
                    {role.badgeText}
                  </Badge>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'text-[#16A34A] translate-x-0.5' : 'text-gray-300 group-hover:text-gray-400'}`} />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Live Network Health Summary */}
        <div className="mx-4 mt-6 p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              Regional ICU Status
            </span>
            <Badge 
              variant={totalAvailableIcu > 3 ? 'green' : totalAvailableIcu > 0 ? 'amber' : 'red'} 
              size="sm"
            >
              {totalAvailableIcu} / {totalIcuCapacity} Available
            </Badge>
          </div>

          {/* Capacity Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                totalAvailableIcu > 3 ? 'bg-[#16A34A]' : totalAvailableIcu > 0 ? 'bg-[#D97706]' : 'bg-[#DC2626]'
              }`}
              style={{ width: `${Math.round(((totalIcuCapacity - totalAvailableIcu) / totalIcuCapacity) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-500 flex justify-between">
            <span>Occupancy Rate</span>
            <span className="font-semibold text-gray-700">
              {Math.round(((totalIcuCapacity - totalAvailableIcu) / totalIcuCapacity) * 100)}%
            </span>
          </p>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="p-4 border-t border-gray-100 bg-white space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500 px-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100"
            title="Toggle Audio Notifications"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#16A34A]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            <span>Audio {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={resetSeedData}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100"
            title="Reset Mock Hospitals to Default Seed Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
            <span>Reset Demo</span>
          </button>
        </div>
        <div className="text-[10px] text-gray-400 text-center pt-1">
          MediMatch Real-Time Coordination v1.0
        </div>
      </div>
    </aside>
  );
}
