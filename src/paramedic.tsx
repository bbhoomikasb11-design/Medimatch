import { useEffect, useRef, useState } from 'react';
import {
  Activity, Ambulance, ArrowLeft, BedDouble, Building2, Check, ChevronRight,
  Clock3, Cross, Filter, MapPin, Navigation, Package, Radio, ScanLine,
  ShieldCheck, Stethoscope, Truck, User, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './components';
import { useDemoStore } from './store';
import { equipmentCatalog, equipmentCategories, locationSuggestions, surgeonTypes } from './data';
import type { EquipmentCategory, Hospital } from './types';

const Btn = ({ children, onClick, kind = 'primary', disabled = false }: { children: React.ReactNode; onClick: () => void; kind?: 'primary' | 'outline'; disabled?: boolean }) => (
  <button disabled={disabled} onClick={onClick} className={'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold ' + (kind === 'primary' ? 'bg-[#1677c8] text-white hover:bg-[#0e64ad]' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}>
    {children}
  </button>
);

const Safety = () => (
  <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-xs text-blue-800">
    <ShieldCheck className="h-4 w-4 shrink-0" />
    <span><b>Prototype data — not for clinical use.</b> Recommendations require professional confirmation.</span>
  </div>
);

function CaseStrip() {
  const { incidentLocation, selectedEquipment } = useDemoStore();
  const selectedNames = equipmentCatalog.filter(e => selectedEquipment.includes(e.id)).map(e => e.shortName);
  const displayResources = selectedNames.length > 0 ? selectedNames : ['ICU bed', 'CT scan', 'Trauma team'];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#1677c8]">ACTIVE DEMO SCENARIO · MM-260830-014</p>
          <p className="mt-1 font-semibold">Anonymous trauma patient · {incidentLocation || 'Location not set'}</p>
        </div>
        <StatusBadge tone="red">Critical</StatusBadge>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {displayResources.map(x => (
          <StatusBadge tone="blue" key={x}>{x}</StatusBadge>
        ))}
      </div>
    </div>
  );
}

/* ─── Location Input with Autocomplete ─── */
function LocationInput() {
  const { incidentLocation, setIncidentLocation } = useDemoStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState(incidentLocation);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(incidentLocation);
  }, [incidentLocation]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = locationSuggestions.filter(s =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const select = (loc: string) => {
    setQuery(loc);
    setIncidentLocation(loc);
    setShowSuggestions(false);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setIncidentLocation(value);
    setShowSuggestions(true);
  };

  return (
    <div className="intake-section">
      <div className="intake-section-title">
        <span className="section-icon"><MapPin size={16} /></span>
        Incident location
      </div>
      <div className="location-input-wrap" ref={wrapRef}>
        <MapPin size={17} className="location-icon" />
        <input
          type="text"
          className="location-input"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Enter incident location..."
        />
        {showSuggestions && filtered.length > 0 && (
          <div className="location-suggestions">
            {filtered.map(s => (
              <div
                key={s}
                className={'location-suggestion' + (s === incidentLocation ? ' active' : '')}
                onClick={() => select(s)}
              >
                <MapPin size={13} className="mr-1.5 inline text-slate-400" />
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="location-actions">
        <button className="location-btn" onClick={() => select('Near Domlur Flyover, Bengaluru')}>
          <Navigation size={12} /> Use demo location
        </button>
        <button className="location-btn" onClick={() => { setQuery(''); setIncidentLocation(''); }}>
          <X size={12} /> Clear
        </button>
      </div>
    </div>
  );
}

/* ─── Equipment Category Filters ─── */
function EquipmentFilters() {
  const {
    selectedEquipment, toggleEquipment,
    equipmentCategoryFilter, setEquipmentCategoryFilter,
  } = useDemoStore();

  const countByCategory = (cat: EquipmentCategory) =>
    equipmentCatalog.filter(e => e.category === cat && selectedEquipment.includes(e.id)).length;

  const visibleEquipment = equipmentCategoryFilter
    ? equipmentCatalog.filter(e => e.category === equipmentCategoryFilter)
    : equipmentCatalog;

  const selectedItems = equipmentCatalog.filter(e => selectedEquipment.includes(e.id));

  return (
    <div className="intake-section">
      <div className="intake-section-title">
        <span className="section-icon"><Package size={16} /></span>
        Required equipment
        {selectedEquipment.length > 0 && (
          <span className="ml-auto text-xs font-bold text-[#1677c8]">
            {selectedEquipment.length} selected
          </span>
        )}
      </div>

      {/* Selected summary */}
      {selectedItems.length > 0 && (
        <div className="selected-summary">
          <span className="selected-count">{selectedItems.length} equipment selected:</span>
          {selectedItems.map(eq => (
            <span className="selected-tag" key={eq.id}>
              {eq.shortName}
              <button onClick={() => toggleEquipment(eq.id)} aria-label={`Remove ${eq.shortName}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Category filter bar */}
      <div className="category-bar">
        <button
          className={'category-pill' + (equipmentCategoryFilter === null ? ' active' : '')}
          onClick={() => setEquipmentCategoryFilter(null)}
        >
          <Filter size={13} />
          All
          <span className="pill-count">{equipmentCatalog.length}</span>
        </button>
        {equipmentCategories.map(cat => {
          const count = countByCategory(cat);
          const shortLabel = cat === 'Critical Resources' ? 'Critical'
            : cat === 'Surgical Damage Control' ? 'Surgical'
            : cat === 'Vascular Access & Monitoring' ? 'Vascular'
            : cat === 'Massive Transfusion Protocol' ? 'Transfusion'
            : cat === 'Neurological & Spinal' ? 'Neuro/Spinal'
            : 'Life Support';
          return (
            <button
              key={cat}
              className={'category-pill' + (equipmentCategoryFilter === cat ? ' active' : '')}
              onClick={() => setEquipmentCategoryFilter(equipmentCategoryFilter === cat ? null : cat)}
            >
              {shortLabel}
              {count > 0 && <span className="pill-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Equipment chips grid */}
      <div className="equipment-grid">
        {visibleEquipment.map(eq => {
          const isSelected = selectedEquipment.includes(eq.id);
          return (
            <button
              key={eq.id}
              className={'equipment-chip' + (isSelected ? ' selected' : '')}
              onClick={() => toggleEquipment(eq.id)}
            >
              <span className="eq-check">
                {isSelected && <Check size={13} />}
              </span>
              <span className="eq-info">
                <span className="eq-name">{eq.shortName}</span>
                <span className="eq-desc">{eq.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {visibleEquipment.length === 0 && (
        <div className="equipment-empty">No equipment in this category</div>
      )}
    </div>
  );
}

/* ─── Doctor Listing for Hospital Cards ─── */
function DoctorListing({ hospital }: { hospital: Hospital }) {
  const docs = hospital.doctors || [];
  if (docs.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
        <User size={12} className="inline mr-1" />
        Available doctors & surgeons
      </p>
      <div className="doctor-list">
        {docs.map(doc => {
          const initials = doc.name.split(' ').filter(w => w.length > 1).map(w => w[0]).join('').slice(0, 2);
          return (
            <div className="doctor-card" key={doc.id}>
              <div className={'doctor-avatar ' + (doc.available ? 'available' : 'unavailable')}>
                {initials}
              </div>
              <div className="doctor-info">
                <div className="doctor-name">{doc.name}</div>
                <div className="doctor-specialty">{doc.specialty}</div>
              </div>
              <span className={'doctor-status ' + (doc.available ? 'available' : 'unavailable')}>
                <i />
                {doc.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Pages ─── */

export function Welcome() {
  const n = useNavigate(), { setRole } = useDemoStore();
  const enter = () => { setRole('paramedic'); n('/paramedic/overview'); };
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="banner"><span>DEMO MODE</span><p>Prototype data — not for clinical use.</p></div>
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1677c8] text-white"><Activity /></span>
          <b className="text-xl">MEDIMATCH</b>
        </div>
        <div className="mt-16 max-w-2xl">
          <p className="label text-[#1677c8]">Emergency capacity coordination</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            The right hospital. The right resource. <span className="text-[#1677c8]">At the right time.</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Coordinate an emergency with participating hospitals using reported availability, travel time, and professional confirmation.
          </p>
          <Btn onClick={enter}><Ambulance size={17} />Enter paramedic demo</Btn>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[['Paramedic', 'Capture emergency requirements'], ['Hospital coordinator', 'Review and confirm requests'], ['Network administrator', 'Monitor network readiness']].map(([t, d]) => (
            <div className="rounded-xl border border-slate-200 bg-white p-5" key={t}>
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-slate-500">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl"><Safety /></div>
      </main>
    </div>
  );
}

export function Overview() {
  const n = useNavigate(), { activeCase } = useDemoStore();
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="label text-[#1677c8]">Paramedic overview</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Coordinate with confirmation in the loop.</h1>
          <p className="mt-1 text-sm text-slate-500">Start the trauma coordination scenario or continue an active case.</p>
        </div>
        <Btn onClick={() => n('/paramedic/new-emergency')}><Ambulance size={16} />Start emergency</Btn>
      </div>
      <Safety />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <CaseStrip />
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="label">Current status</p>
          <p className="mt-3 font-bold">
            {activeCase.status === 'confirmed' ? 'Hospital confirmed' : activeCase.status === 'awaiting_confirmation' ? 'Awaiting confirmation' : 'Ready to coordinate'}
          </p>
          <p className="mt-1 text-sm text-slate-500">No autonomous destination selection.</p>
          {activeCase.status !== 'draft' && <Btn kind="outline" onClick={() => n('/paramedic/active-case')}>Open active case</Btn>}
        </div>
      </div>
    </div>
  );
}

/* ─── Surgeon Selection ─── */
function SurgeonSelection() {
  const { selectedSurgeons, toggleSurgeon } = useDemoStore();

  return (
    <div className="intake-section">
      <div className="intake-section-title">
        <span className="section-icon"><Stethoscope size={16} /></span>
        Surgeons required
        {selectedSurgeons.length > 0 && (
          <span className="ml-auto text-xs font-bold text-[#1677c8]">
            {selectedSurgeons.length} selected
          </span>
        )}
      </div>

      {selectedSurgeons.length > 0 && (
        <div className="selected-summary">
          <span className="selected-count">{selectedSurgeons.length} surgeon{selectedSurgeons.length > 1 ? ' types' : ''} required:</span>
          {selectedSurgeons.map(s => (
            <span className="selected-tag" key={s}>
              {s}
              <button onClick={() => toggleSurgeon(s)} aria-label={`Remove ${s}`}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="equipment-grid">
        {surgeonTypes.map(s => {
          const isSelected = selectedSurgeons.includes(s);
          return (
            <button
              key={s}
              className={'equipment-chip' + (isSelected ? ' selected' : '')}
              onClick={() => toggleSurgeon(s)}
            >
              <span className="eq-check">
                {isSelected && <Check size={13} />}
              </span>
              <span className="eq-info">
                <span className="eq-name">{s}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Intake() {
  const n = useNavigate();
  const { incidentLocation, selectedEquipment, selectedSurgeons } = useDemoStore();
  const [checking, setChecking] = useState(false);

  const check = () => {
    setChecking(true);
    setTimeout(() => n('/paramedic/network-search'), 1100);
  };

  const hasLocation = incidentLocation.trim().length > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={() => n('/paramedic/overview')} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
        <ArrowLeft size={16} />Overview
      </button>
      <div>
        <p className="label text-[#1677c8]">New emergency</p>
        <h1 className="mt-1 text-2xl font-bold">Capture coordination requirements</h1>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {/* Location Section */}
        <LocationInput />

        {/* Equipment Section */}
        <EquipmentFilters />

        {/* Surgeon Selection */}
        <SurgeonSelection />

        {/* Severity */}
        <div className="intake-section">
          <div className="intake-section-title">
            <span className="section-icon"><Cross size={16} /></span>
            Severity
          </div>
          <StatusBadge tone="red">Critical</StatusBadge>
        </div>

        {/* Summary */}
        {(selectedEquipment.length > 0 || selectedSurgeons.length > 0 || hasLocation) && (
          <div className="intake-section">
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
              <b>Coordination summary:</b> {hasLocation ? incidentLocation : 'No location set'}
              {selectedEquipment.length > 0 && (
                <> · {selectedEquipment.length} equipment item{selectedEquipment.length > 1 ? 's' : ''} selected</>
              )}
              {selectedSurgeons.length > 0 && (
                <> · {selectedSurgeons.length} surgeon type{selectedSurgeons.length > 1 ? 's' : ''} required</>
              )}
              {' '}· Severity: Critical
            </div>
          </div>
        )}

        <div className="mt-6 text-right">
          <Btn onClick={check} disabled={checking || !hasLocation}>
            {checking ? (
              <><Radio className="animate-pulse" size={16} />Checking participating hospitals…</>
            ) : (
              <>Check participating hospitals <ChevronRight size={16} /></>
            )}
          </Btn>
        </div>
      </div>
      <Safety />
    </div>
  );
}

export function Search() {
  const n = useNavigate();
  const [done, setDone] = useState(false);
  useEffect(() => { const id = setTimeout(() => setDone(true), 1400); return () => clearTimeout(id); }, []);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Network search</p>
        <h1 className="mt-1 text-2xl font-bold">Checking participating hospitals</h1>
        <p className="mt-1 text-sm text-slate-500">Reported resources, data freshness, distance, and ETA are being reviewed.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-7">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-[#1677c8]">
            <Radio className={!done ? 'animate-pulse' : ''} />
          </span>
          <div>
            <b>{done ? 'Search complete' : 'Checking participating hospitals…'}</b>
            <p className="text-sm text-slate-500">{done ? 'Eight fictional participating facilities reviewed.' : 'Confirming ICU, CT, trauma team, and travel estimates.'}</p>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {['Location confirmed', 'ICU capacity checked', 'CT availability checked', 'Trauma team checked', 'Travel time calculated', 'Data freshness reviewed'].map((x, i) => (
            <div className="flex items-center gap-2 text-sm" key={x}>
              {done || i < 3 ? <Check className="text-emerald-600" size={17} /> : <span className="h-4 w-4 rounded-full border border-slate-300" />}
              {x}
            </div>
          ))}
        </div>
        {done && (
          <div className="mt-8">
            <Btn onClick={() => n('/paramedic/hospital-recommendations')}>View hospital recommendations <ChevronRight size={16} /></Btn>
          </div>
        )}
      </div>
      <Safety />
    </div>
  );
}

function MatchCard({ h, kind, onClick }: { h: Hospital; kind: 'nearest' | 'recommended' | 'other'; onClick: () => void }) {
  const recommended = kind === 'recommended';
  return (
    <article className={'rounded-xl border bg-white p-5 ' + (recommended ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200')}>
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <p className={'text-xs font-bold uppercase tracking-wider ' + (recommended ? 'text-emerald-700' : 'text-slate-400')}>
            {recommended ? 'Recommended option' : kind === 'nearest' ? 'Nearest participating hospital' : 'Alternative option'}
          </p>
          <h2 className="mt-1 text-lg font-bold">{h.name}</h2>
          <p className="text-sm text-slate-500">{h.area} · {h.distanceKm} km · ETA {h.etaMinutes} min</p>
        </div>
        <StatusBadge tone={recommended ? 'green' : kind === 'nearest' ? 'red' : 'amber'}>
          {recommended ? 'Resources reported available' : kind === 'nearest' ? 'ICU full' : 'Limited capability'}
        </StatusBadge>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        <Metric icon={<BedDouble size={17} />} label="ICU" value={h.icuBeds ? `${h.icuBeds} AVAILABLE` : 'FULL'} good={h.icuBeds > 0} />
        <Metric icon={<ScanLine size={17} />} label="CT" value={h.ctStatus.toUpperCase()} good={h.ctStatus === 'Available'} />
        <Metric icon={<Stethoscope size={17} />} label="TRAUMA" value={h.traumaTeam.toUpperCase()} good={h.traumaTeam === 'Available'} />
      </div>

      {/* Doctor Listing */}
      <DoctorListing hospital={h} />

      <p className="mt-4 text-xs text-slate-500">
        <Clock3 className="mr-1 inline h-3.5 w-3.5" />
        Reported {h.updatedAt} · {recommended ? 'Matches the requested ICU, CT, and trauma team.' : 'Does not meet all reported requirements.'}
      </p>
      <Btn kind={recommended ? 'primary' : 'outline'} onClick={onClick}>
        {recommended ? 'Review recommended option' : 'View details'} <ChevronRight size={15} />
      </Btn>
    </article>
  );
}

function Metric({ icon, label, value, good }: { icon: React.ReactNode; label: string; value: string; good: boolean }) {
  return (
    <div className={'rounded-lg border p-3 ' + (good ? 'border-emerald-100 bg-emerald-50' : 'border-rose-100 bg-rose-50')}>
      <span className={good ? 'text-emerald-700' : 'text-rose-700'}>{icon}</span>
      <p className="mt-2 text-[10px] font-bold tracking-wider text-slate-500">{label}</p>
      <p className={'mt-1 text-xs font-bold ' + (good ? 'text-emerald-700' : 'text-rose-700')}>{value}</p>
    </div>
  );
}

export function Recommendations() {
  const n = useNavigate(), { hospitals } = useDemoStore();

  // Determine best match: hospital with most resources and ICU > 0
  const scored = hospitals.map(h => ({
    h,
    score: (h.icuBeds > 0 ? 3 : 0) + (h.ctStatus === 'Available' ? 2 : 0) + (h.traumaTeam === 'Available' ? 1 : 0),
  })).sort((a, b) => b.score - a.score);

  const recommended = scored[0].h;
  const nearest = hospitals[0]; // Central is closest
  const others = hospitals.filter(h => h.id !== recommended.id && h.id !== nearest.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="label text-[#1677c8]">Hospital recommendations</p>
        <h1 className="mt-1 text-2xl font-bold">Showing {hospitals.length} participating hospitals sorted by match.</h1>
        <p className="mt-1 text-sm text-slate-500">Recommendations support professional judgment; acceptance is still required.</p>
      </div>
      <div className="recommendation-compare">
        <div>
          <p className="label">Nearest hospital</p>
          <b className="text-2xl text-slate-900">{nearest.distanceKm} km · {nearest.etaMinutes} min</b>
          <p className="mt-2 text-sm text-rose-700"><b>ICU {nearest.icuBeds > 0 ? 'AVAILABLE' : 'FULL'}</b> {nearest.icuBeds === 0 ? '— cannot support the reported ICU requirement.' : ''}</p>
        </div>
        <div className="compare-arrow">→</div>
        <div>
          <p className="label text-emerald-700">Recommended option</p>
          <b className="text-2xl text-emerald-800">{recommended.distanceKm} km · {recommended.etaMinutes} min</b>
          <p className="mt-2 text-sm text-emerald-700">
            <b>ICU {recommended.icuBeds} AVAILABLE · CT {recommended.ctStatus.toUpperCase()} · TRAUMA TEAM {recommended.traumaTeam.toUpperCase()}</b>
          </p>
        </div>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <MatchCard h={nearest} kind="nearest" onClick={() => n(`/paramedic/hospital-details?hospital=${nearest.id}`)} />
        <MatchCard h={recommended} kind="recommended" onClick={() => n(`/paramedic/hospital-details?hospital=${recommended.id}`)} />
        {others.map(h => (
          <MatchCard key={h.id} h={h} kind="other" onClick={() => n(`/paramedic/hospital-details?hospital=${h.id}`)} />
        ))}
      </div>
      <Safety />
    </div>
  );
}

export function Details() {
  const n = useNavigate(), { hospitals } = useDemoStore();
  const h = hospitals[1];
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button onClick={() => n('/paramedic/hospital-recommendations')} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
        <ArrowLeft size={16} />Recommendations
      </button>
      <div className="rounded-xl border border-emerald-200 bg-white p-6">
        <StatusBadge tone="green">Recommended option</StatusBadge>
        <h1 className="mt-4 text-2xl font-bold">{h.name}</h1>
        <p className="mt-1 text-slate-500">{h.area} · {h.distanceKm} km · ETA {h.etaMinutes} min</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Metric icon={<BedDouble size={18} />} label="ICU" value="3 AVAILABLE" good />
          <Metric icon={<ScanLine size={18} />} label="CT" value="AVAILABLE" good />
          <Metric icon={<Stethoscope size={18} />} label="TRAUMA TEAM" value="AVAILABLE" good />
        </div>

        {/* Doctor Listing in Details */}
        <DoctorListing hospital={h} />

        <div className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          This facility is recommended because its reported capacity matches all requested resources. It requires professional confirmation and does not guarantee admission.
        </div>
        <div className="mt-6">
          <Btn onClick={() => n('/paramedic/request-acceptance')}>Request acceptance <ChevronRight size={16} /></Btn>
        </div>
      </div>
      <Safety />
    </div>
  );
}

export function Acceptance() {
  const n = useNavigate(), { setCaseStatus, notify } = useDemoStore();
  const send = () => {
    setCaseStatus('awaiting_confirmation');
    notify('Acceptance request sent to Bengaluru East Multispeciality Centre.', 'blue');
    n('/paramedic/active-case');
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Request acceptance</p>
        <h1 className="mt-1 text-2xl font-bold">Send a coordination request</h1>
        <p className="mt-1 text-sm text-slate-500">The destination hospital must review and confirm.</p>
      </div>
      <CaseStrip />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="font-semibold">Bengaluru East Multispeciality Centre</p>
        <p className="mt-1 text-sm text-slate-500">Reported: ICU 3 available · CT available · Trauma team available</p>
        <div className="mt-6 flex gap-3">
          <Btn onClick={send}><Truck size={16} />Send acceptance request</Btn>
          <Btn kind="outline" onClick={() => n('/paramedic/hospital-details')}>Back</Btn>
        </div>
      </div>
      <Safety />
    </div>
  );
}

export function Active() {
  const n = useNavigate(), { activeCase } = useDemoStore();
  const confirmed = activeCase.status === 'confirmed';
  const declined = activeCase.status === 'declined';
  const handed = activeCase.status === 'handed_over';
  const title = handed ? 'Handover recorded' : confirmed ? 'Hospital confirmed' : declined ? 'Hospital declined this request' : 'Awaiting hospital confirmation';
  return (
    <div className="space-y-6">
      <div>
        <p className="label text-[#1677c8]">Active emergency</p>
        <h1 className="mt-1 text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {handed ? 'The controlled case record is ready for review.' : confirmed ? 'Continue coordination with authorized personnel.' : declined ? 'Review the decline reason and select another participating option.' : 'The request awaits an authorized hospital coordinator decision.'}
        </p>
      </div>
      <CaseStrip />
      {declined && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          <b>Decline reason:</b> {activeCase.declineReason}. No destination is selected automatically.
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Coordination timeline</h2>
          {([
            ['14:32', 'Emergency requirements entered', 'green'],
            ['14:33', 'Participating hospitals checked', 'green'],
            ['14:34', handed ? 'Authorized handover recorded' : confirmed ? 'Hospital accepted coordination' : declined ? 'Hospital declined request' : 'Acceptance request sent', handed || confirmed ? 'green' : declined ? 'red' : 'amber'],
            ['Next', handed ? 'Case record available' : declined ? 'Review alternative facilities' : 'Pre-arrival alert and handover', 'slate'],
          ] as const).map(([t, x, k]) => (
            <div className="mt-5 flex gap-3" key={x}>
              <i className={'mt-1.5 h-2.5 w-2.5 rounded-full ' + (k === 'green' ? 'bg-emerald-500' : k === 'amber' ? 'bg-amber-500' : k === 'red' ? 'bg-rose-500' : 'bg-slate-300')} />
              <div>
                <p className="text-xs text-slate-400">{t} IST</p>
                <p className="text-sm font-medium">{x}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="label">Destination status</p>
          <p className="mt-2 font-semibold">Bengaluru East Multispeciality Centre</p>
          <div className="mt-4">
            <StatusBadge tone={handed || confirmed ? 'green' : declined ? 'red' : 'amber'}>
              {handed ? 'Handover recorded' : confirmed ? 'Hospital confirmed' : declined ? 'Request declined' : 'Awaiting confirmation'}
            </StatusBadge>
          </div>
          <p className="mt-4 text-sm text-slate-500">Acceptance is required and does not guarantee admission or an emergency outcome.</p>
          {confirmed && <Btn onClick={() => n('/paramedic/handover')}>Record handover</Btn>}
          {handed && <Btn onClick={() => n('/paramedic/case-record')}>Open case record</Btn>}
          {!confirmed && !handed && (
            <Btn kind="outline" onClick={() => n('/paramedic/hospital-recommendations')}>
              {declined ? 'Review alternatives' : 'View hospital network'}
            </Btn>
          )}
        </div>
      </div>
      <Safety />
    </div>
  );
}

export function Handover() {
  const n = useNavigate(), { setCaseStatus, notify } = useDemoStore();
  const complete = () => {
    setCaseStatus('handed_over');
    notify('Authorized handover recorded. Case record created.', 'green');
    n('/paramedic/case-record');
  };
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Handover</p>
        <h1 className="mt-1 text-2xl font-bold">Record controlled handover</h1>
        <p className="mt-1 text-sm text-slate-500">Confirm only after authorized personnel complete the handover.</p>
      </div>
      <CaseStrip />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="font-semibold">Bengaluru East Multispeciality Centre</p>
        <p className="mt-1 text-sm text-slate-500">Hospital coordination was confirmed. This action records the demo handover; it does not make a clinical statement.</p>
        <Btn onClick={complete}><Check size={16} />Confirm authorized handover</Btn>
      </div>
      <Safety />
    </div>
  );
}

export function CaseRecord() {
  const n = useNavigate(), { activeCase } = useDemoStore();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Case record</p>
        <h1 className="mt-1 text-2xl font-bold">Coordination record · MM-260830-014</h1>
        <p className="mt-1 text-sm text-slate-500">A prototype coordination summary, not a clinical record.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <StatusBadge tone="green">Handover confirmed</StatusBadge>
        <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="label">Incident</dt><dd className="mt-1 font-semibold">Severe road-traffic trauma</dd></div>
          <div><dt className="label">Destination</dt><dd className="mt-1 font-semibold">Bengaluru East Multispeciality Centre</dd></div>
          <div><dt className="label">Reported requirements</dt><dd className="mt-1 font-semibold">ICU, CT, trauma team</dd></div>
          <div><dt className="label">Final coordination state</dt><dd className="mt-1 font-semibold">{activeCase.status === 'handed_over' ? 'Authorized handover recorded' : 'In progress'}</dd></div>
        </dl>
      </div>
      <Btn kind="outline" onClick={() => n('/paramedic/overview')}>Return to overview</Btn>
      <Safety />
    </div>
  );
}
