import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, Building2, Check, ChevronDown, ChevronUp,
  Clock3, Database, MapPin, ShieldCheck, Stethoscope, User, Users,
} from 'lucide-react';
import { StatusBadge } from './components';
import { useDemoStore } from './store';
import type { Hospital } from './types';

const filters = ['ICU', 'CT', 'Trauma', 'Surgeons Available'] as const;
type Filter = typeof filters[number];

const Safety = () => (
  <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-xs text-blue-800">
    <ShieldCheck className="h-4 w-4 shrink-0" />
    <span><b>Prototype data — not for clinical use.</b> Every facility shown is fictional and reports only the information it elects to share.</span>
  </div>
);

/* Map positions for all 8 hospitals spread across Bengaluru */
const points: { [key: string]: { x: string; y: string } } = {
  central: { x: '28%', y: '55%' },
  east: { x: '54%', y: '38%' },
  north: { x: '58%', y: '12%' },
  whitefield: { x: '85%', y: '42%' },
  jayanagar: { x: '22%', y: '72%' },
  yelahanka: { x: '42%', y: '8%' },
  ecity: { x: '48%', y: '88%' },
  bannerghatta: { x: '32%', y: '85%' },
};

function freshness(updated: string) {
  if (updated === 'Just now' || updated === '1 min ago' || updated === '2 min ago') return 'Fresh';
  if (updated === '3 min ago' || updated === '4 min ago' || updated === '5 min ago') return 'Fresh';
  return 'Aging';
}

function meets(h: Hospital, f: Filter) {
  if (f === 'ICU') return h.icuBeds > 0;
  if (f === 'CT') return h.ctStatus === 'Available';
  if (f === 'Trauma') return h.traumaTeam === 'Available';
  if (f === 'Surgeons Available') return (h.doctors || []).some(d => d.available);
  return false;
}

/* ─── Map Component ─── */
function Map({ ids }: { ids: string[] }) {
  const { hospitals } = useDemoStore();
  return (
    <div className="network-map relative min-h-[390px] overflow-hidden rounded-xl border border-slate-200">
      <i className="network-road road-one" />
      <i className="network-road road-two" />
      <i className="network-road road-three" />
      {/* Incident pin */}
      <span className="absolute left-[36%] top-[50%] z-10 flex h-9 w-9 items-center justify-center rounded-full border-3 border-white bg-blue-600 text-white shadow">
        <MapPin size={17} />
      </span>
      <b className="absolute left-[32%] top-[60%] text-[11px] text-slate-700">Domlur Flyover</b>
      {/* Hospital markers */}
      {hospitals.map(h => {
        const pos = points[h.id];
        if (!pos || !ids.includes(h.id)) return null;
        const allGood = h.icuBeds > 0 && h.ctStatus === 'Available' && h.traumaTeam === 'Available';
        const availableDocs = (h.doctors || []).filter(d => d.available).length;
        return (
          <div key={h.id} className="absolute z-10" style={{ left: pos.x, top: pos.y }}>
            <span className={'network-marker ' + (allGood ? 'marker-green' : 'marker-amber')}>
              <Building2 size={14} />
            </span>
            <b className="network-label">
              {h.name.replace('Bengaluru ', '').replace('MediMatch ', '').replace('North Bengaluru ', '')}
              <small>{h.distanceKm} km · {availableDocs} dr available · {h.updatedAt}</small>
            </b>
          </div>
        );
      })}
      <span className="absolute bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-[10px] text-slate-500">
        Simulated Bengaluru map · fictional participating facilities
      </span>
    </div>
  );
}

/* ─── Expandable Hospital Row ─── */
function HospitalRow({ h }: { h: Hospital }) {
  const [expanded, setExpanded] = useState(false);
  const docs = h.doctors || [];
  const availableDocs = docs.filter(d => d.available);

  return (
    <>
      <tr
        className="border-t border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="p-3">
          <b className="block text-xs">{h.name}</b>
          <span className="text-[11px] text-slate-400">{h.area}</span>
          <div className="mt-1">
            <StatusBadge tone="green">{h.participation}</StatusBadge>
          </div>
        </td>
        <td className="p-3 text-xs">
          {h.distanceKm} km<br />ETA {h.etaMinutes} min
        </td>
        <td className="p-3 text-xs">
          <span className={h.icuBeds > 0 ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
            ICU {h.icuBeds > 0 ? `${h.icuBeds} avail` : 'FULL'}
          </span>
          <br />
          <span className={h.ctStatus === 'Available' ? 'text-emerald-700' : 'text-rose-600'}>
            CT {h.ctStatus}
          </span>
          <br />
          <span className={h.traumaTeam === 'Available' ? 'text-emerald-700' : 'text-amber-600'}>
            Trauma {h.traumaTeam}
          </span>
        </td>
        <td className="p-3 text-xs">
          <div className="flex items-center gap-1">
            <User size={12} className="text-slate-400" />
            <span className="font-semibold text-[#1677c8]">{availableDocs.length}</span>
            <span className="text-slate-400">/ {docs.length}</span>
          </div>
          <span className="text-[10px] text-slate-400">doctors available</span>
        </td>
        <td className="p-3">
          <StatusBadge tone={freshness(h.updatedAt) === 'Fresh' ? 'green' : 'amber'}>
            {freshness(h.updatedAt)} · {h.updatedAt}
          </StatusBadge>
        </td>
        <td className="p-3 text-slate-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-blue-50 bg-blue-50/30">
          <td colSpan={6} className="p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Stethoscope size={12} className="inline mr-1" />
              Doctors & Surgeons at {h.name}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
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
          </td>
        </tr>
      )}
    </>
  );
}

/* ─── Network Overview ─── */
export function NetworkOverview() {
  const { hospitals } = useDemoStore();
  const [active, setActive] = useState<Filter[]>([]);

  const shown = useMemo(
    () => hospitals.filter(h => active.every(f => meets(h, f))),
    [hospitals, active]
  );

  const toggle = (f: Filter) =>
    setActive(x => (x.includes(f) ? x.filter(a => a !== f) : [...x, f]));

  const totalDoctors = hospitals.reduce((sum, h) => sum + (h.doctors || []).length, 0);
  const availableDoctors = hospitals.reduce((sum, h) => sum + (h.doctors || []).filter(d => d.available).length, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="label text-[#1677c8]">Hospital network overview</p>
        <h1 className="mt-1 text-2xl font-bold">Participating Bengaluru facilities</h1>
        <p className="mt-1 text-sm text-slate-500">
          {hospitals.length} hospitals · {totalDoctors} doctors ({availableDoctors} available) · Availability is simulated, timestamped, and controlled by each fictional participating facility.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-[#1677c8]">{hospitals.length}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Hospitals</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-emerald-700">{hospitals.reduce((s, h) => s + h.icuBeds, 0)}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ICU Beds</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-[#1677c8]">{availableDoctors}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Doctors Available</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{totalDoctors - availableDoctors}</p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Unavailable</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            onClick={() => toggle(f)}
            key={f}
            className={'rounded-lg border px-3 py-2 text-sm font-semibold ' + (active.includes(f) ? 'border-blue-200 bg-blue-50 text-[#1677c8]' : 'border-slate-200 bg-white text-slate-600')}
          >
            {active.includes(f) && <Check className="mr-1 inline h-3.5 w-3.5" />}
            {f}
          </button>
        ))}
        {active.length > 0 && (
          <button
            onClick={() => setActive([])}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Map + Table */}
      <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
        <Map ids={shown.map(h => h.id)} />
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
            Showing <b className="text-slate-700">{shown.length}</b> of {hospitals.length} hospitals
            {active.length > 0 && <> · Filtered by: {active.join(', ')}</>}
            <span className="ml-2 text-[10px] text-slate-400">Click a row to see doctors</span>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 sticky top-0">
                <tr>
                  <th className="p-3">Hospital</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Doctors</th>
                  <th className="p-3">Freshness</th>
                  <th className="p-3 w-8"></th>
                </tr>
              </thead>
              <tbody>
                {shown.map(h => (
                  <HospitalRow key={h.id} h={h} />
                ))}
              </tbody>
            </table>
          </div>
          {shown.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-500">
              No participating facilities match the selected simulated filters.
            </p>
          )}
        </div>
      </div>
      <Safety />
    </div>
  );
}

/* ─── Admin Dashboard Metric ─── */
function Metric({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <span className="text-[#1677c8]">{icon}</span>
      <p className="mt-4 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

/* ─── Admin Dashboard ─── */
export function AdminDashboard() {
  const { hospitals, transfer, activeCase } = useDemoStore();
  const fresh = hospitals.filter(h => freshness(h.updatedAt) === 'Fresh').length;
  const totalDoctors = hospitals.reduce((sum, h) => sum + (h.doctors || []).length, 0);
  const availableDoctors = hospitals.reduce((sum, h) => sum + (h.doctors || []).filter(d => d.available).length, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="label text-[#1677c8]">Network administrator</p>
        <h1 className="mt-1 text-2xl font-bold">Network operations dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Demo metrics from fictional facilities and simulated coordination activity.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Participating facilities" value={String(hospitals.length)} detail="All fictional demo entities" icon={<Building2 size={20} />} />
        <Metric label="Reported ICU beds" value={String(hospitals.reduce((n, h) => n + h.icuBeds, 0))} detail="Across participating facilities" icon={<Activity size={20} />} />
        <Metric label="Available doctors" value={`${availableDoctors} / ${totalDoctors}`} detail="Across all specialties" icon={<Users size={20} />} />
        <Metric label="Fresh capacity records" value={`${fresh} / ${hospitals.length}`} detail="Updated in the last 5 minutes" icon={<Clock3 size={20} />} />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Network coordination status</h2>
          <div className="mt-5 space-y-4">
            <div className="flex justify-between text-sm">
              <span>Emergency case MM-260830-014</span>
              <StatusBadge tone={activeCase.status === 'confirmed' ? 'green' : activeCase.status === 'declined' ? 'red' : 'amber'}>
                {activeCase.status.replace('_', ' ')}
              </StatusBadge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pediatric ventilator transfer</span>
              <StatusBadge tone="amber">{transfer.stage.split('_').join(' ')}</StatusBadge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Facility participation</span>
              <StatusBadge tone="green">{hospitals.length} connected</StatusBadge>
            </div>
            <div className="flex justify-between text-sm">
              <span>Doctors on network</span>
              <StatusBadge tone="blue">{availableDoctors} available</StatusBadge>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Capacity freshness</h2>
          <div className="mt-5 space-y-3">
            {hospitals.map(h => {
              const avDocs = (h.doctors || []).filter(d => d.available).length;
              const totalDocs = (h.doctors || []).length;
              return (
                <div className="flex items-center justify-between gap-2 text-sm" key={h.id}>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-medium truncate">{h.name}</span>
                    <span className="text-[10px] text-slate-400">{avDocs}/{totalDocs} doctors · ICU {h.icuBeds}</span>
                  </div>
                  <StatusBadge tone={freshness(h.updatedAt) === 'Fresh' ? 'green' : 'amber'}>
                    {h.updatedAt}
                  </StatusBadge>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Safety />
    </div>
  );
}

/* ─── Audit & Safety ─── */
export function AuditSafety() {
  const { audit } = useDemoStore();
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Audit & safety log</p>
        <h1 className="mt-1 text-2xl font-bold">Traceable coordination activity</h1>
        <p className="mt-1 text-sm text-slate-500">Who changed what, when, and why — using simulated prototype records.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        {audit.map(a => (
          <div className="flex gap-4 border-b border-slate-100 py-4 last:border-0" key={a.id}>
            <span className="w-16 shrink-0 text-xs font-semibold text-slate-400">{a.time}</span>
            <i className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <div>
              <p className="text-sm font-medium">{a.message}</p>
              <p className="mt-1 text-xs text-slate-500">Recorded by {a.actor} · Why: Authorized prototype coordination action</p>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <AlertTriangle className="mr-2 inline h-4 w-4" />
        <b>Safety boundary:</b> Audit history records coordination events; it is not a clinical record and does not establish treatment decisions.
      </div>
      <Safety />
    </div>
  );
}

/* ─── Help & Safety ─── */
export function HelpSafety() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Help & safety</p>
        <h1 className="mt-1 text-2xl font-bold">MediMatch prototype boundaries</h1>
        <p className="mt-1 text-sm text-slate-500">Clear expectations for this emergency coordination demonstration.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {([
          ['What MediMatch does', 'Coordinates paramedic-entered requirements with hospital-reported capacity, timestamps, travel context, and professional confirmation.'],
          ['What MediMatch does not do', 'It does not diagnose, treat, select a hospital autonomously, guarantee admission, guarantee an ICU bed, or guarantee an emergency outcome.'],
          ['Prototype data', 'All hospitals, capacity, locations, resource transfers, and events in this application are simulated. No real partnership is implied.'],
          ['Professional confirmation', 'Authorized hospital and logistics staff approve acceptance, capacity publication, resource sharing, and every transfer stage.'],
          ['Privacy principles', 'Use the minimum information needed for coordination. The prototype uses an anonymous simulated patient and does not connect to real patient records.'],
          ['Emergency disclaimer', 'This is not emergency dispatch software. In a real emergency, follow local emergency protocols and the direction of authorized medical professionals.'],
        ] as const).map(([title, body]) => (
          <div className="rounded-xl border border-slate-200 bg-white p-5" key={title}>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
          </div>
        ))}
      </div>
      <Safety />
    </div>
  );
}
