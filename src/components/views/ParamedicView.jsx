import React, { useState } from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { ParamedicDashboard } from './ParamedicDashboard';
import { StartEmergencyScreen } from './StartEmergencyScreen';
import { FindingHospitalScreen } from './FindingHospitalScreen';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  MapPin, 
  Clock, 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Ambulance,
  Send,
  Sparkles,
  Stethoscope,
  ChevronRight,
  Heart,
  Brain,
  Wind,
  Plus,
  X,
  Loader2,
  CheckCircle,
  Check,
  ArrowRight,
  RotateCcw,
  Building2,
  Navigation,
  LayoutDashboard
} from 'lucide-react';

export function ParamedicView() {
  const { hospitals, createDispatch, setCurrentRole, setSelectedHospitalId } = useMediMatch();

  // Mode: 'dashboard' | 'start_emergency' | 'finding_hospital' | 'recommendations' | 'confirmation'
  const [mode, setMode] = useState('dashboard');

  // Form State
  const [selectedCondition, setSelectedCondition] = useState('Cardiac');
  const [severity, setSeverity] = useState('Critical');
  const [requiredResources, setRequiredResources] = useState(['ICU', 'CT Scan']);
  const [chiefComplaint, setChiefComplaint] = useState('Acute Severe Chest Pain & Sweating');
  const [ambulanceCode, setAmbulanceCode] = useState('Medic-08');

  // Selection & Confirmation State
  const [rankedHospitals, setRankedHospitals] = useState([]);
  const [confirmedHospital, setConfirmedHospital] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Transmitting telemetry to emergency department...');
  const [statusUpdated, setStatusUpdated] = useState(false);

  // Compute Ranking Algorithm based on user requirements and distance
  const computeRanking = (reqs = requiredResources) => {
    const needsIcu = reqs.includes('ICU Bed') || reqs.includes('ICU');
    const needsCt = reqs.includes('CT Scanner') || reqs.includes('CT Scan');
    const needsVent = reqs.includes('Ventilator');

    const evaluated = hospitals.map((h) => {
      const disqualifyingReasons = [];
      const matchingReasons = [];

      if (needsIcu) {
        if (h.icuBeds.available > 0) {
          matchingReasons.push(`ICU Bed Available (${h.icuBeds.available}/${h.icuBeds.total} beds)`);
        } else {
          disqualifyingReasons.push(`ICU Bed (0/${h.icuBeds.total} beds - FULL)`);
        }
      }

      if (needsCt) {
        if (h.ctScanner.status === 'available') {
          matchingReasons.push('CT Scanner Operational & Ready');
        } else {
          disqualifyingReasons.push('CT Scanner Unavailable (Maintenance)');
        }
      }

      if (needsVent) {
        if (h.ventilators.available > 0) {
          matchingReasons.push(`Ventilator Ready (${h.ventilators.available} available)`);
        } else {
          disqualifyingReasons.push('Ventilator Inventory Exhausted (0 available)');
        }
      }

      matchingReasons.push(`${h.distanceKm} km away (~${h.etaMinutes} min ETA via MG Road)`);

      const isFullyFit = disqualifyingReasons.length === 0;
      const score = (isFullyFit ? 1000 : 0) - h.distanceKm;

      return {
        ...h,
        isFullyFit,
        disqualifyingReasons,
        matchingReasons,
        score,
      };
    });

    evaluated.sort((a, b) => b.score - a.score);
    return evaluated;
  };

  // Called from StartEmergencyScreen onSubmitEmergency
  const handleStartEmergencySubmit = (formData) => {
    setSelectedCondition(formData.type);
    setSeverity(formData.condition);
    setRequiredResources(formData.requirements);

    const rankings = computeRanking(formData.requirements);
    setRankedHospitals(rankings);

    // Switch to finding_hospital transition screen!
    setMode('finding_hospital');
  };

  // Called when FindingHospitalScreen finishes checklist animation
  const handleFindingComplete = () => {
    setMode('recommendations');
  };

  // Handle Hospital Selection -> Confirmation Screen
  const handleSelectHospital = (hospital) => {
    setConfirmedHospital(hospital);
    setMode('confirmation');

    createDispatch({
      ambulanceCode,
      paramedicName: 'EMS Field Unit 8',
      patientAge: 48,
      patientGender: 'Male',
      triageLevel: severity === 'Critical' ? 'Code Red' : severity === 'Serious' ? 'Code Yellow' : 'Code Green',
      chiefComplaint: `[${selectedCondition}] ${chiefComplaint}`,
      vitals: 'BP 145/88 | HR 102 | SpO2 93%',
      requiredServices: requiredResources,
      targetHospitalId: hospital.id,
      targetHospitalName: hospital.shortName,
      etaMinutes: hospital.etaMinutes,
    });

    setStatusUpdated(false);
    setStatusMessage(`Transmitting emergency telemetry to ${hospital.shortName}...`);

    setTimeout(() => {
      setStatusUpdated(true);
      setStatusMessage(`${hospital.shortName} is preparing ICU bay & emergency team`);
    }, 2000);
  };

  // Render 1: Paramedic Dashboard Screen
  if (mode === 'dashboard') {
    return (
      <ParamedicDashboard 
        onStartEmergency={() => setMode('start_emergency')}
        onViewActiveCase={() => setMode('confirmation')}
      />
    );
  }

  // Render 2: Start Emergency Form Screen
  if (mode === 'start_emergency') {
    return (
      <StartEmergencyScreen 
        onBack={() => setMode('dashboard')}
        onSubmitEmergency={handleStartEmergencySubmit}
      />
    );
  }

  // Render 3: Finding Hospital Transition Screen
  if (mode === 'finding_hospital') {
    return (
      <FindingHospitalScreen
        onBack={() => setMode('start_emergency')}
        onComplete={handleFindingComplete}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header Bar for Recommendations / Confirmation */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/20 flex items-center justify-center font-bold shrink-0">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#1A1A1A]">Paramedic Field Triage</h2>
              <Badge variant="green" size="sm">Call Sign: {ambulanceCode}</Badge>
            </div>
            <p className="text-xs text-gray-500">
              {mode === 'recommendations' ? 'Hospital Capacity Ranking' : 'Emergency Dispatch Confirmed'}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={LayoutDashboard}
          onClick={() => setMode('dashboard')}
        >
          Dashboard
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* RECOMMENDATIONS SCREEN */}
      {/* ========================================================================= */}
      {mode === 'recommendations' && (
        <div className="space-y-6 animate-fade-slide-in">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#1A1A1A]">Capacity Match Rankings</h3>
                <p className="text-xs text-gray-500">Sorted by resource readiness and proximity to MG Road.</p>
              </div>

              <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => setMode('start_emergency')}>
                Edit Emergency Setup
              </Button>
            </div>

            {rankedHospitals.map((hospital, index) => {
              const isTopMatch = index === 0;

              if (isTopMatch) {
                return (
                  <Card
                    key={hospital.id}
                    className="bg-gradient-to-br from-[#ECFDF5] via-white to-emerald-50/40 border-2 border-[#16A34A] shadow-md relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-[#16A34A] text-white text-[11px] uppercase tracking-wider font-extrabold px-4 py-1.5 rounded-bl-xl shadow">
                      #1 RECOMMENDED MATCH
                    </div>

                    <CardHeader className="pt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="green" size="sm" dot>Optimal Fit</Badge>
                        <span className="text-xs font-semibold text-gray-500">• {hospital.distanceKm} km from location</span>
                      </div>
                      <CardTitle className="text-xl font-extrabold text-[#1A1A1A]">{hospital.name}</CardTitle>
                      <CardDescription className="text-xs text-gray-600">{hospital.traumaLevel} • {hospital.address}</CardDescription>
                    </CardHeader>

                    <CardContent className="my-2 space-y-4">
                      <div className="bg-white p-4 rounded-xl border border-[#16A34A]/20 shadow-sm space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#16A34A] flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> Why Recommended:
                        </h4>
                        <ul className="space-y-1.5 text-xs text-gray-800">
                          {hospital.matchingReasons.map((reason, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2 font-medium">
                              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        icon={Send}
                        onClick={() => handleSelectHospital(hospital)}
                      >
                        Select & Notify {hospital.shortName}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              }

              return (
                <Card
                  key={hospital.id}
                  className="bg-gray-50/70 border-gray-200 opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[#1A1A1A]">{hospital.name}</span>
                        <span className="text-xs text-gray-500 font-mono">({hospital.distanceKm} km)</span>
                      </div>

                      <div className="mt-2 space-y-1">
                        {hospital.disqualifyingReasons.map((disq, dIdx) => (
                          <div key={dIdx} className="flex items-center gap-1.5 text-xs text-[#DC2626] font-semibold">
                            <XCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                            <span>Disqualified: <line-through className="line-through decoration-[#DC2626] decoration-2">{disq}</line-through></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectHospital(hospital)}
                    >
                      Override & Dispatch
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONFIRMATION SCREEN */}
      {/* ========================================================================= */}
      {mode === 'confirmation' && confirmedHospital && (
        <Card className="border-2 border-[#16A34A]/30 space-y-6 animate-fade-slide-in">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 rounded-full bg-[#ECFDF5] text-[#16A34A] border border-[#16A34A]/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle className="w-9 h-9" />
            </div>

            <Badge variant="green" size="lg" className="mx-auto font-mono text-sm px-4 py-1.5">
              {confirmedHospital.shortName} notified • ETA {confirmedHospital.etaMinutes} min
            </Badge>

            <CardTitle className="text-2xl font-extrabold mt-3">
              Emergency Dispatch Confirmed
            </CardTitle>
            <CardDescription className="text-xs text-gray-500">
              Telemetry broadcast sent from Ambulance {ambulanceCode} to {confirmedHospital.name}.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className={`
              p-4 rounded-xl border transition-all duration-500 flex items-center justify-between text-sm font-semibold
              ${statusUpdated 
                ? 'bg-[#ECFDF5] border-[#16A34A]/30 text-[#16A34A] shadow-sm' 
                : 'bg-[#FFFBEB] border-[#D97706]/30 text-[#D97706] animate-pulse'}
            `}>
              <div className="flex items-center gap-3">
                {statusUpdated ? (
                  <CheckCircle2 className="w-5 h-5 shrink-[#16A34A]" />
                ) : (
                  <Loader2 className="w-5 h-5 shrink-0 animate-spin text-[#D97706]" />
                )}
                <span>{statusMessage}</span>
              </div>
              <span className="text-xs uppercase font-mono tracking-wider font-bold">
                {statusUpdated ? 'LIVE ED UPDATE' : 'TRANSMITTING'}
              </span>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="font-bold text-gray-500 uppercase">Emergency Protocol</span>
                <span className="font-bold text-[#16A34A]">{severity} ({selectedCondition})</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Diagnosis</span>
                  <span className="font-bold text-sm text-[#1A1A1A]">{chiefComplaint}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase">Assigned ER Bay</span>
                  <span className="font-bold text-sm text-[#16A34A]">Bay 2 (Trauma Ready)</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              icon={RotateCcw}
              onClick={() => setMode('start_emergency')}
            >
              + Start Another Emergency Call
            </Button>

            <Button
              variant="primary"
              size="md"
              fullWidth
              icon={Building2}
              onClick={() => {
                setSelectedHospitalId(confirmedHospital.id);
                setCurrentRole('hospital_staff');
              }}
            >
              View in Hospital Staff View
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
