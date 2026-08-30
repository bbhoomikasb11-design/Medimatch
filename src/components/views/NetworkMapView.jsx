import React, { useState } from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Map, 
  Building2, 
  Ambulance, 
  Activity, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldAlert, 
  CheckCircle,
  Stethoscope,
  ChevronRight,
  ArrowUpRight,
  Zap,
  Radio,
  Layers,
  Sparkles
} from 'lucide-react';

export function NetworkMapView() {
  const { hospitals, dispatches, setCurrentRole, setSelectedHospitalId } = useMediMatch();
  const [selectedHospitalNode, setSelectedHospitalNode] = useState(hospitals[1] || hospitals[0]); // Default Hospital B

  // Active ambulance dispatches in transit
  const activeDispatches = dispatches.filter(d => d.status === 'Accepted' || d.status === 'Pending' || d.status === 'En Route');
  const latestDispatch = activeDispatches[0] || dispatches[0];

  // Target hospital for ambulance vector line
  const targetHospital = hospitals.find(h => h.id === (latestDispatch?.targetHospitalId || 'hosp-b')) || hospitals[1];

  // Regional metrics
  const totalAvailableIcu = hospitals.reduce((acc, h) => acc + h.icuBeds.available, 0);
  const totalIcuBeds = hospitals.reduce((acc, h) => acc + h.icuBeds.total, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Network Header Banner */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-[#16A34A]" />
            <h2 className="text-xl font-extrabold text-[#1A1A1A]">Regional Emergency Command & Map</h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Visual integration tying Paramedic field dispatches and Hospital ED capacities into a live regional spatial map.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="green" size="md" dot>
            {activeDispatches.length} Active Route Vector{activeDispatches.length === 1 ? '' : 's'}
          </Badge>
          <Badge variant={totalAvailableIcu > 2 ? 'green' : 'amber'} size="md">
            Network ICU: {totalAvailableIcu}/{totalIcuBeds} Free
          </Badge>
        </div>
      </div>

      {/* Main Grid Layout: Map Canvas (Left 2 cols) + Live Side Panel (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ========================================================================= */}
        {/* STYLIZED ABSTRACT MAP CANVAS WITH MOVING AMBULANCE DOT */}
        {/* ========================================================================= */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1A1A]">
              <Radio className="w-4 h-4 text-[#16A34A] animate-pulse" />
              <span>Bengaluru Metro Emergency Network Grid</span>
            </div>

            <span className="text-xs text-gray-400 font-mono">Origin: MG Road EMS Dispatch</span>
          </div>

          {/* SVG Map Canvas Container */}
          <div className="relative w-full h-[400px] sm:h-[460px] bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center">
            {/* Grid Pattern Layer */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              <defs>
                <pattern id="networkGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#16a34a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#networkGrid)" />
            </svg>

            {/* SVG Arterial Routes & Moving Ambulance Vectors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Background Arterial Lines */}
              {/* Line: MG Road (25%, 72%) to Hospital A (30%, 25%) */}
              <line x1="25%" y1="72%" x2="30%" y2="25%" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
              {/* Line: MG Road (25%, 72%) to Hospital B (65%, 45%) */}
              <line x1="25%" y1="72%" x2="65%" y2="45%" stroke="#16a34a" strokeWidth="4" strokeDasharray="8 4" />
              {/* Line: MG Road (25%, 72%) to Hospital C (82%, 22%) */}
              <line x1="25%" y1="72%" x2="82%" y2="22%" stroke="#334155" strokeWidth="3" strokeDasharray="6 4" />
              {/* Line: Hosp A to Hosp B */}
              <line x1="30%" y1="25%" x2="65%" y2="45%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
              {/* Line: Hosp B to Hosp C */}
              <line x1="65%" y1="45%" x2="82%" y2="22%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

              {/* Highlighted Active Ambulance Dispatch Route to Target Hospital */}
              <path
                d={`M 25% 72% L ${targetHospital.coordinates.x}% ${targetHospital.coordinates.y}%`}
                fill="none"
                stroke="#16a34a"
                strokeWidth="4"
                strokeDasharray="10 6"
                className="animate-pulse"
              />

              {/* MOVING AMBULANCE DOT VECTOR ANIMATION */}
              {latestDispatch && (
                <g>
                  {/* Position interpolated at ~55% along MG Road -> Target Hospital line */}
                  {(() => {
                    const startX = 25;
                    const startY = 72;
                    const endX = targetHospital.coordinates.x;
                    const endY = targetHospital.coordinates.y;
                    const posX = startX + (endX - startX) * 0.55;
                    const posY = startY + (endY - startY) * 0.55;

                    return (
                      <g>
                        {/* Outer Pulsating Ring */}
                        <circle cx={`${posX}%`} cy={`${posY}%`} r="18" fill="#16a34a" fillOpacity="0.25" className="animate-ping" />
                        {/* Moving Dot Center */}
                        <circle cx={`${posX}%`} cy={`${posY}%`} r="8" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                        
                        {/* Floating Ambulance Telemetry Tag */}
                        <g transform={`translate(0, -18)`}>
                          <rect 
                            x={`${posX - 8}%`} 
                            y={`${posY - 5}%`} 
                            width="110" 
                            height="24" 
                            rx="6" 
                            fill="#090d16" 
                            stroke="#16a34a" 
                            strokeWidth="1.5" 
                          />
                          <text 
                            x={`${posX - 7}%`} 
                            y={`${posY - 1}%`} 
                            fill="#ffffff" 
                            fontSize="11" 
                            fontWeight="bold" 
                            fontFamily="monospace"
                          >
                            🚑 {latestDispatch.ambulanceCode} • {latestDispatch.etaMinutes}m ETA
                          </text>
                        </g>
                      </g>
                    );
                  })()}
                </g>
              )}
            </svg>

            {/* Emergency Location Origin Pin (MG Road, Bengaluru) */}
            <div 
              className="absolute left-[25%] top-[72%] -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                <span className="absolute -inset-2 rounded-full bg-emerald-500 animate-ping opacity-40" />
                <div className="w-9 h-9 rounded-full bg-[#16A34A] text-white border-2 border-white flex items-center justify-center shadow-lg font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-1 bg-black/80 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 shadow backdrop-blur-sm">
                MG Road (Origin)
              </div>
            </div>

            {/* 3 Hospital Pins (Color-coded Green / Red / Amber) */}
            {hospitals.map((h) => {
              const isSelected = selectedHospitalNode?.id === h.id;
              // Color code rules: Green if ICU available > 0, Red if 0 ICU beds or CT down
              const isGreen = h.icuBeds.available > 0 && h.ctScanner.status === 'available';
              const isAmber = h.icuBeds.available > 0 || h.ventilators.available > 0;
              const pinColor = isGreen ? '#16A34A' : isAmber ? '#D97706' : '#DC2626';

              return (
                <button
                  key={h.id}
                  id={`map-pin-${h.id}`}
                  onClick={() => setSelectedHospitalNode(h)}
                  style={{ left: `${h.coordinates.x}%`, top: `${h.coordinates.y}%` }}
                  className={`
                    absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 focus:outline-none
                    ${isSelected ? 'scale-125 z-30' : 'hover:scale-110'}
                  `}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Pulsating capacity ring */}
                    <span 
                      className="absolute -inset-3 rounded-full animate-ping opacity-35"
                      style={{ backgroundColor: pinColor }}
                    />

                    {/* Pin Marker Card */}
                    <div 
                      className={`
                        px-3 py-1.5 rounded-xl shadow-xl border-2 border-white text-white font-extrabold text-xs flex items-center gap-1.5 transition-all
                        ${isSelected ? 'ring-4 ring-white/30' : ''}
                      `}
                      style={{ backgroundColor: pinColor }}
                    >
                      <Building2 className="w-4 h-4 shrink-0" />
                      <span>{h.shortName}</span>
                      <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded font-mono">
                        {h.icuBeds.available > 0 ? `${h.icuBeds.available} ICU` : 'FULL'}
                      </span>
                    </div>

                    {/* Quick status label */}
                    <div className="mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-black/90 text-white font-mono border border-white/20">
                      {h.distanceKm} km • {h.icuBeds.available > 0 ? 'ICU Available' : 'ICU FULL'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Legend & Demo Controls */}
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-semibold text-[#16A34A]">
                <span className="w-3 h-3 rounded-full bg-[#16A34A]" /> Green: ICU & CT Ready
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#DC2626]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]" /> Red: ICU Full / CT Down
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#D97706]">
                <span className="w-3 h-3 rounded-full bg-[#D97706]" /> Amber: Moderate
              </span>
            </div>

            <span className="text-gray-400 font-mono text-[11px]">Click pins to inspect hospital telemetry</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE-UPDATING SIDE PANEL (KEY STATS FOR EACH HOSPITAL) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#1A1A1A]">Hospital Status Live Panel</h3>
            <Badge variant="green" size="sm" dot>Live Sync</Badge>
          </div>

          <div className="space-y-3">
            {hospitals.map((hospital) => {
              const isSelected = selectedHospitalNode?.id === hospital.id;
              const isGreen = hospital.icuBeds.available > 0 && hospital.ctScanner.status === 'available';

              return (
                <Card
                  key={hospital.id}
                  onClick={() => setSelectedHospitalNode(hospital)}
                  className={`cursor-pointer transition-all duration-200 p-4 ${
                    isSelected 
                      ? 'border-2 border-[#16A34A] shadow-md bg-gradient-to-br from-[#ECFDF5]/50 to-white' 
                      : 'hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#1A1A1A]">{hospital.shortName}</span>
                      <span className="text-xs text-gray-500 font-mono">({hospital.distanceKm} km)</span>
                    </div>

                    <Badge 
                      variant={hospital.icuBeds.available > 0 ? 'green' : 'red'} 
                      size="sm"
                    >
                      {hospital.icuBeds.available > 0 ? `${hospital.icuBeds.available}/${hospital.icuBeds.total} ICU` : 'ICU FULL'}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-500 mb-3">{hospital.name}</p>

                  {/* Resource Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase">ICU Beds</div>
                      <div className={`font-mono font-bold ${hospital.icuBeds.available > 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {hospital.icuBeds.available}/{hospital.icuBeds.total}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase">CT Scanner</div>
                      <div className={`font-bold uppercase text-[11px] ${hospital.ctScanner.status === 'available' ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>
                        {hospital.ctScanner.status}
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="text-[10px] text-gray-400 uppercase">Ventilator</div>
                      <div className={`font-bold ${hospital.ventilators.available > 0 ? 'text-[#D97706]' : 'text-[#DC2626]'}`}>
                        {hospital.ventilators.available} Ready
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Jump Controls to tie demo together */}
                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <Button
                        variant="tint"
                        size="sm"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentRole('paramedic');
                        }}
                      >
                        Dispatch (Paramedic)
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedHospitalId(hospital.id);
                          setCurrentRole('hospital_staff');
                        }}
                      >
                        Manage ER (Hospital)
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
