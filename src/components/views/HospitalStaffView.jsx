import React, { useState } from 'react';
import { useMediMatch } from '../../context/MediMatchContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Building2, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Stethoscope, 
  Plus, 
  Minus, 
  Power, 
  Ambulance, 
  Check, 
  AlertTriangle, 
  ArrowRightLeft,
  Clock,
  ShieldCheck,
  UserCheck,
  Droplet,
  UserPlus,
  Send,
  Loader2,
  CheckCircle2,
  FileText,
  Heart,
  ChevronRight,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export function HospitalStaffView() {
  const { 
    hospitals, 
    selectedHospitalId, 
    setSelectedHospitalId, 
    updateIcuBeds, 
    toggleCtScanner, 
    updateVentilators,
    updateSpecialists,
    updateBloodUnits,
    requestResourceTransfer,
    resourceTransfers,
    dispatches,
    updateDispatchStatus,
    showNotification
  } = useMediMatch();

  const [assignedBays, setAssignedBays] = useState({});
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'transfers'

  const currentHospital = hospitals.find((h) => h.id === selectedHospitalId) || hospitals[0];

  // Dispatches for this hospital
  const hospitalDispatches = dispatches.filter((d) => d.targetHospitalId === currentHospital.id);
  const pendingAlerts = hospitalDispatches.filter((d) => d.status === 'Pending');
  const acceptedDispatches = hospitalDispatches.filter((d) => d.status === 'Accepted' || d.status === 'En Route');

  const handleAcceptAmbulance = (dispatchId) => {
    const bayNumber = assignedBays[dispatchId] || `Bay 2 (Trauma & ICU)`;
    updateDispatchStatus(dispatchId, 'Accepted', bayNumber);
    showNotification(`Ambulance accepted! Bay assigned: ${bayNumber}`, 'success');
  };

  const handleRedirectAmbulance = (dispatchId) => {
    updateDispatchStatus(dispatchId, 'Redirected', 'Rerouted to Hospital B');
    showNotification(`Ambulance redirected to partner hospital`, 'amber');
  };

  // Find partner hospitals with available resources for Request Resource flow
  const partnerHospitals = hospitals.filter((h) => h.id !== currentHospital.id);

  // Resource badges
  const icuVariant = currentHospital.icuBeds.available > 0 ? 'green' : 'red';
  const ctVariant = currentHospital.ctScanner.status === 'available' ? 'green' : 'red';
  let ventVariant = 'red';
  if (currentHospital.ventilators.available > 1) ventVariant = 'green';
  else if (currentHospital.ventilators.available === 1) ventVariant = 'amber';

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. HOSPITAL SELECTOR (A/B/C) AT THE TOP */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#16A34A]" />
              <h2 className="text-xl font-extrabold text-[#1A1A1A]">Emergency Department Capacity Dashboard</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Live facility controller • Updates reflect instantly in Paramedic routing matching.
            </p>
          </div>

          {/* Hospital Tabs (A / B / C) */}
          <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
            {hospitals.map((h) => {
              const isSelected = h.id === currentHospital.id;
              return (
                <button
                  key={h.id}
                  id={`select-hosp-btn-${h.id}`}
                  onClick={() => setSelectedHospitalId(h.id)}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2
                    ${isSelected 
                      ? 'bg-white text-[#16A34A] shadow-md border border-gray-200 ring-1 ring-[#16A34A]/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'}
                  `}
                >
                  <span>{h.shortName}</span>
                  <Badge 
                    variant={h.icuBeds.available > 0 ? 'green' : 'red'} 
                    size="sm"
                  >
                    {h.icuBeds.available} ICU
                  </Badge>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Facility Status Bar */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-500 gap-2">
          <div className="flex items-center gap-4">
            <span className="font-bold text-[#1A1A1A]">{currentHospital.name}</span>
            <span>{currentHospital.traumaLevel}</span>
            <span>Phone: <strong className="text-gray-700">{currentHospital.phone}</strong></span>
          </div>

          <Badge variant="green" size="sm" dot>
            ED Chief: {currentHospital.contactPerson}
          </Badge>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE CAPACITY DASHBOARD (5 RESOURCE CARDS WITH TIMESTAMPS) */}
      {/* ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-[#1A1A1A]">1. Live Resource Capacity Cards</h3>
          <span className="text-xs text-gray-400 font-medium">Use + / - controls to update inventory live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: ICU Beds */}
          <Card className="flex flex-col justify-between border-t-4 border-t-[#16A34A] p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Resource 1</span>
                <Badge variant={icuVariant} size="sm">
                  {currentHospital.icuBeds.available > 0 ? 'Available' : 'FULL'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] mb-2">
                <Activity className="w-4 h-4 text-[#16A34A]" />
                <span>ICU Beds</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center my-2">
                <div className="text-3xl font-black font-mono">
                  <span className={currentHospital.icuBeds.available > 0 ? "text-[#16A34A]" : "text-[#DC2626]"}>
                    {currentHospital.icuBeds.available}
                  </span>
                  <span className="text-gray-300 font-normal"> / {currentHospital.icuBeds.total}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {currentHospital.icuBeds.lastUpdated}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                disabled={currentHospital.icuBeds.available <= 0}
                onClick={() => updateIcuBeds(currentHospital.id, -1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-semibold text-gray-600">Free Beds</span>
              <Button
                variant="tint"
                size="sm"
                disabled={currentHospital.icuBeds.available >= currentHospital.icuBeds.total}
                onClick={() => updateIcuBeds(currentHospital.id, 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>

          {/* Card 2: CT Scanner */}
          <Card className="flex flex-col justify-between border-t-4 border-t-blue-500 p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Resource 2</span>
                <Badge variant={ctVariant} size="sm">
                  {currentHospital.ctScanner.status === 'available' ? 'Operational' : 'Down'}
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] mb-2">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>CT Scanner</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center my-2">
                <div className={`text-xl font-bold uppercase tracking-wider ${
                  currentHospital.ctScanner.status === 'available' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                }`}>
                  {currentHospital.ctScanner.status}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {currentHospital.ctScanner.lastUpdated}
                </div>
              </div>
            </div>

            <Button
              variant={currentHospital.ctScanner.status === 'available' ? 'danger' : 'primary'}
              size="sm"
              fullWidth
              icon={Power}
              onClick={() => toggleCtScanner(currentHospital.id)}
            >
              {currentHospital.ctScanner.status === 'available' ? 'Mark Down' : 'Mark Ready'}
            </Button>
          </Card>

          {/* Card 3: Ventilators */}
          <Card className="flex flex-col justify-between border-t-4 border-t-amber-500 p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Resource 3</span>
                <Badge variant={ventVariant} size="sm">
                  {currentHospital.ventilators.available} Ready
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] mb-2">
                <Stethoscope className="w-4 h-4 text-[#D97706]" />
                <span>Ventilators</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center my-2">
                <div className="text-3xl font-black font-mono">
                  <span className={currentHospital.ventilators.available > 0 ? "text-[#D97706]" : "text-[#DC2626]"}>
                    {currentHospital.ventilators.available}
                  </span>
                  <span className="text-gray-300 font-normal"> / {currentHospital.ventilators.total}</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {currentHospital.ventilators.lastUpdated}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                disabled={currentHospital.ventilators.available <= 0}
                onClick={() => updateVentilators(currentHospital.id, -1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-semibold text-gray-600">Ready</span>
              <Button
                variant="tint"
                size="sm"
                disabled={currentHospital.ventilators.available >= currentHospital.ventilators.total}
                onClick={() => updateVentilators(currentHospital.id, 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>

          {/* Card 4: Specialists On-Call */}
          <Card className="flex flex-col justify-between border-t-4 border-t-purple-500 p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Resource 4</span>
                <Badge variant="green" size="sm">
                  {currentHospital.specialists.count} On-Call
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] mb-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                <span>Specialists</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center my-2">
                <div className="text-3xl font-black font-mono text-purple-700">
                  {currentHospital.specialists.count}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {currentHospital.specialists.lastUpdated}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                disabled={currentHospital.specialists.count <= 0}
                onClick={() => updateSpecialists(currentHospital.id, -1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-semibold text-gray-600">On-Call</span>
              <Button
                variant="tint"
                size="sm"
                onClick={() => updateSpecialists(currentHospital.id, 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>

          {/* Card 5: Blood Units Reserve */}
          <Card className="flex flex-col justify-between border-t-4 border-t-rose-500 p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-gray-400">Resource 5</span>
                <Badge variant="green" size="sm">
                  {currentHospital.bloodUnits.oNegative} O-Neg
                </Badge>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#1A1A1A] mb-2">
                <Droplet className="w-4 h-4 text-rose-600" />
                <span>Blood Bank</span>
              </div>

              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center my-2">
                <div className="text-3xl font-black font-mono text-rose-700">
                  {currentHospital.bloodUnits.total} <span className="text-xs font-normal text-gray-400">Units</span>
                </div>
                <div className="text-[10px] text-gray-400 mt-1 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Updated {currentHospital.bloodUnits.lastUpdated}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-1 pt-2 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                disabled={currentHospital.bloodUnits.total <= 0}
                onClick={() => updateBloodUnits(currentHospital.id, -1)}
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs font-semibold text-gray-600">Units</span>
              <Button
                variant="tint"
                size="sm"
                onClick={() => updateBloodUnits(currentHospital.id, 1)}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INCOMING ALERTS & PRE-ARRIVAL BRIEF PANELS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-[#16A34A]" />
            <h3 className="text-base font-bold text-[#1A1A1A]">
              2. Incoming Ambulance Triage Queue — {currentHospital.shortName}
            </h3>
          </div>
          <Badge variant={pendingAlerts.length > 0 ? "amber" : "gray"} size="sm" dot>
            {pendingAlerts.length} Pending Alert{pendingAlerts.length === 1 ? '' : 's'}
          </Badge>
        </div>

        {/* Incoming Dispatches */}
        {hospitalDispatches.length === 0 ? (
          <Card className="py-8 text-center border-dashed border-gray-200 bg-gray-50/50">
            <CheckCircle className="w-8 h-8 text-[#16A34A] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-gray-700">No Active Dispatches Routed to {currentHospital.shortName}</p>
            <p className="text-xs text-gray-400 mt-1">Switch to Paramedic persona to dispatch a test emergency patient to this facility.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {hospitalDispatches.map((disp) => {
              const isAccepted = disp.status === 'Accepted' || disp.status === 'En Route';

              return (
                <div key={disp.id} className="space-y-3">
                  {/* Incoming Alert Card */}
                  <Card className={`transition-all duration-200 ${
                    isAccepted ? 'bg-[#ECFDF5]/40 border-[#16A34A]/30' : 'border-amber-300 shadow-md ring-2 ring-amber-400/20'
                  }`}>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-base text-[#1A1A1A]">{disp.ambulanceCode}</span>
                          <Badge 
                            variant={disp.triageLevel === 'Code Red' ? 'red' : disp.triageLevel === 'Code Yellow' ? 'amber' : 'green'} 
                            size="sm"
                            dot
                          >
                            {disp.triageLevel}
                          </Badge>
                          <span className="text-xs text-gray-500 font-mono">Patient: {disp.patientAge}y {disp.patientGender}</span>
                          <span className="text-xs text-gray-500 font-semibold">• ETA: ~{disp.etaMinutes} mins</span>
                        </div>

                        <div className="text-sm font-bold text-[#1A1A1A]">
                          Complaint: {disp.chiefComplaint}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                          <span className="font-mono bg-white px-2 py-0.5 rounded font-semibold border border-gray-200">
                            {disp.vitals}
                          </span>
                          <span>Required: <strong>{disp.requiredServices.join(', ')}</strong></span>
                          <span>Paramedic: {disp.paramedicName}</span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-wrap items-center gap-3 self-start lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                        {isAccepted ? (
                          <Badge variant="green" size="md">
                            <ShieldCheck className="w-4 h-4" /> Bay Confirmed: {disp.assignedBay}
                          </Badge>
                        ) : (
                          <>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-500">Bay:</span>
                              <select
                                value={assignedBays[disp.id] || 'Bay 2 (Trauma & ICU)'}
                                onChange={(e) => setAssignedBays({ ...assignedBays, [disp.id]: e.target.value })}
                                className="text-xs font-semibold px-2 py-1.5 border border-gray-300 rounded-lg bg-white"
                              >
                                <option value="Bay 1 (Trauma & Resus)">Bay 1 (Trauma & Resus)</option>
                                <option value="Bay 2 (Trauma & ICU)">Bay 2 (Trauma & ICU)</option>
                                <option value="Bay 3 (Cardiac Care)">Bay 3 (Cardiac Care)</option>
                              </select>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              icon={Check}
                              onClick={() => handleAcceptAmbulance(disp.id)}
                            >
                              Accept & Reserve Bay
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              icon={ArrowRightLeft}
                              onClick={() => handleRedirectAmbulance(disp.id)}
                            >
                              Redirect
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* PRE-ARRIVAL BRIEF PANEL (Shown after accepting) */}
                  {isAccepted && (
                    <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-5 border border-[#16A34A]/30 shadow-sm space-y-4 ml-2 sm:ml-6">
                      <div className="flex items-center justify-between border-b border-[#16A34A]/20 pb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-[#16A34A]" />
                          <h4 className="font-extrabold text-sm text-[#1A1A1A] uppercase tracking-wider">
                            Pre-Arrival Clinical Brief — {disp.ambulanceCode}
                          </h4>
                        </div>
                        <Badge variant="green" size="sm">
                          Assigned: {disp.assignedBay}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-gray-400">Triage Diagnosis</span>
                          <p className="font-bold text-sm text-[#1A1A1A]">{disp.chiefComplaint}</p>
                          <p className="text-[11px] text-gray-500 font-mono">Vitals: {disp.vitals}</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-gray-400">Prepped ER Team</span>
                          <p className="font-bold text-sm text-[#16A34A]">Trauma Team Alpha</p>
                          <p className="text-[11px] text-gray-500">Lead Nurse: Nurse Miller (On Bay)</p>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-gray-100 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-gray-400">Arrival Checklist</span>
                          <ul className="space-y-1 text-[11px] text-gray-700">
                            <li className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> ICU bed held on 3rd Floor
                            </li>
                            <li className="flex items-center gap-1.5 text-[#16A34A] font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> CT Scanner queued for priority arrival
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. REQUEST RESOURCE INTER-HOSPITAL TRANSFER FLOW */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-[#16A34A]" />
              <h3 className="text-base font-bold text-[#1A1A1A]">
                3. Inter-Hospital Resource Transfer Request System
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Request missing resources (ICU beds, CT scan clear, Ventilators, Blood units) from partner hospitals in real time.
            </p>
          </div>

          <Badge variant="gray" size="sm">
            Partner Network: {partnerHospitals.length} Area Centers
          </Badge>
        </div>

        {/* Partner Hospitals Resource Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partnerHospitals.map((partner) => (
            <div key={partner.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-[#1A1A1A]">{partner.name}</span>
                  <span className="text-xs text-gray-500 block">Distance: {partner.distanceKm} km</span>
                </div>
                <Badge variant={partner.icuBeds.available > 0 ? 'green' : 'red'} size="sm">
                  {partner.icuBeds.available} ICU Free
                </Badge>
              </div>

              {/* Resource Transfer Action Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={partner.icuBeds.available <= 0}
                  icon={Activity}
                  onClick={() => requestResourceTransfer(currentHospital.id, partner.id, partner.shortName, '1 ICU Bed')}
                >
                  Request ICU Bed ({partner.icuBeds.available})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={partner.ctScanner.status !== 'available'}
                  icon={CheckCircle}
                  onClick={() => requestResourceTransfer(currentHospital.id, partner.id, partner.shortName, 'CT Scan Slot')}
                >
                  Request CT Slot ({partner.ctScanner.status})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={partner.ventilators.available <= 0}
                  icon={Stethoscope}
                  onClick={() => requestResourceTransfer(currentHospital.id, partner.id, partner.shortName, '1 Ventilator Unit')}
                >
                  Request Ventilator ({partner.ventilators.available})
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={partner.bloodUnits.oNegative <= 0}
                  icon={Droplet}
                  onClick={() => requestResourceTransfer(currentHospital.id, partner.id, partner.shortName, '2 Units O-Neg Blood')}
                >
                  Request O-Neg Blood ({partner.bloodUnits.oNegative})
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Active Inter-Hospital Resource Requests Log */}
        {resourceTransfers.length > 0 && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Resource Transfer Logs ({resourceTransfers.length})
            </h4>

            <div className="space-y-2">
              {resourceTransfers.map((transfer) => {
                const isApproved = transfer.status.includes('Approved');
                return (
                  <div
                    key={transfer.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all duration-300 ${
                      isApproved 
                        ? 'bg-[#ECFDF5] border-[#16A34A]/30 text-[#16A34A]' 
                        : 'bg-[#FFFBEB] border-[#D97706]/30 text-[#D97706] animate-pulse'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-semibold">
                      {isApproved ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                      ) : (
                        <Loader2 className="w-4 h-4 animate-spin text-[#D97706] shrink-0" />
                      )}
                      <span>
                        Request for <strong>{transfer.resourceName}</strong> from {transfer.targetHospitalName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] opacity-75 font-mono">{transfer.requestedAt}</span>
                      <Badge variant={isApproved ? 'green' : 'amber'} size="sm">
                        {transfer.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
