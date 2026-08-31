import { useState } from 'react';
import { ArrowRight, Box, Check, ChevronRight, ClipboardList, Clock3, MapPin, Plus, ShieldCheck, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatusBadge } from './components';
import { useDemoStore } from './store';
import type { Role, Tone, TransferStage } from './types';

const stages: { id: TransferStage; label: string; actor: string; message: string }[] = [
  { id: 'request_created', label: 'Request created', actor: 'Destination coordinator', message: 'Resource request created.' },
  { id: 'destination_approved', label: 'Destination approval', actor: 'Destination coordinator', message: 'Destination approved receiving coordination.' },
  { id: 'source_approved', label: 'Source approval', actor: 'Source coordinator', message: 'Source approved release of the resource.' },
  { id: 'logistics_pending', label: 'Logistics pending', actor: 'Logistics coordinator', message: 'Approved transfer awaits logistics assignment.' },
  { id: 'pickup_scheduled', label: 'Pickup scheduled', actor: 'Logistics coordinator', message: 'Pickup scheduled with authorized logistics team.' },
  { id: 'in_transit', label: 'In transit', actor: 'Logistics coordinator', message: 'Transfer marked in transit by authorized logistics team.' },
  { id: 'delivered', label: 'Delivered', actor: 'Destination coordinator', message: 'Resource delivery recorded at destination.' },
  { id: 'handover_confirmed', label: 'Handover confirmed', actor: 'Destination coordinator', message: 'Authorized handover confirmation recorded.' }
];

const toneFor = (stage: TransferStage): Tone =>
  stage === 'handover_confirmed' || stage === 'delivered' ? 'green' : stage === 'in_transit' || stage === 'pickup_scheduled' ? 'blue' : 'amber';

const index = (stage: TransferStage) => stages.findIndex(x => x.id === stage);

const Btn = ({ children, onClick, kind = 'primary', disabled = false }: { children: React.ReactNode; onClick: () => void; kind?: 'primary' | 'outline' | 'danger'; disabled?: boolean }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3.5 text-sm font-semibold disabled:opacity-50 ' + (kind === 'primary' ? 'bg-[#1677c8] text-white hover:bg-[#0e64ad]' : kind === 'danger' ? 'bg-rose-600 text-white hover:bg-rose-700' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50')}
  >
    {children}
  </button>
);

const Safety = () => (
  <div className="flex gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-3 text-xs text-blue-800">
    <ShieldCheck className="h-4 w-4 shrink-0" />
    <span><b>Prototype data — not for clinical use.</b> Resource visibility and every transfer stage remain controlled by participating hospitals and authorized logistics teams.</span>
  </div>
);

function getRoute(target: 'exchange' | 'details' | 'tracking', role: Role) {
  if (target === 'exchange') {
    return role === 'paramedic' ? '/paramedic/resource-requests' : role === 'admin' ? '/admin/resource-requests' : '/hospital/resource-exchange';
  }
  if (target === 'details') {
    return role === 'paramedic' ? '/paramedic/resource-request-details' : role === 'admin' ? '/admin/resource-request-details' : '/hospital/resource-request-details';
  }
  return role === 'paramedic' ? '/paramedic/transfer-tracking' : role === 'admin' ? '/admin/audit-safety' : '/hospital/transfer-tracking';
}

function TransferHeader() {
  const { transfer } = useDemoStore();
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#1677c8]">
            <Box size={21} />
          </span>
          <div>
            <p className="label">{transfer.id}</p>
            <h2 className="mt-1 text-lg font-bold">{transfer.resource}</h2>
            <p className="text-sm text-slate-500">
              {transfer.source} <ArrowRight className="mx-1 inline h-3.5 w-3.5" /> {transfer.destination} · {transfer.distanceKm} km
            </p>
          </div>
        </div>
        <StatusBadge tone={toneFor(transfer.stage)}>{stages[index(transfer.stage)].label}</StatusBadge>
      </div>
    </div>
  );
}

function Stepper() {
  const { transfer } = useDemoStore();
  const current = index(transfer.stage);
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-[700px] items-start gap-0">
        {stages.map((s, i) => (
          <div className="flex flex-1 items-start" key={s.id}>
            <div className="flex flex-col items-center text-center">
              <span className={'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ' + (i < current ? 'bg-emerald-100 text-emerald-700' : i === current ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400')}>
                {i < current ? <Check size={14} /> : i + 1}
              </span>
              <span className={'mt-2 w-20 text-[10px] font-semibold leading-3 ' + (i <= current ? 'text-slate-700' : 'text-slate-400')}>
                {s.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              <i className={'mt-3 h-0.5 flex-1 ' + (i < current ? 'bg-emerald-300' : 'bg-slate-200')} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Action() {
  const { transfer, advanceTransfer, notify, role } = useDemoStore();
  const current = index(transfer.stage);
  const next = stages[current + 1];

  if (!next) {
    return (
      <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
        <Check className="mr-2 inline h-4 w-4" />All transfer stages were manually confirmed by authorized participants.
      </div>
    );
  }

  const advance = () => {
    const actorName = role === 'paramedic' ? 'Paramedic coordinator' : next.actor;
    advanceTransfer(next.id, actorName, `${next.label} recorded by ${actorName}.`);
    notify(next.label + ' recorded.', 'green');
  };

  let verb = 'Record next stage';
  if (next.id === 'destination_approved') verb = 'Approve destination receipt';
  if (next.id === 'source_approved') verb = 'Approve source release';
  if (next.id === 'logistics_pending') verb = 'Assign logistics review';
  if (next.id === 'pickup_scheduled') verb = 'Schedule pickup';
  if (next.id === 'in_transit') verb = 'Mark in transit';
  if (next.id === 'delivered') verb = 'Record delivery';
  if (next.id === 'handover_confirmed') verb = 'Confirm handover';

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="label">Authorized action required</p>
      <h3 className="mt-1 font-semibold">Next: {next.label}</h3>
      <p className="mt-1 text-sm text-slate-500">
        No transfer moves forward automatically. The named authorized participant must record this stage.
      </p>
      <div className="mt-4">
        <Btn onClick={advance}>{verb} <ChevronRight size={16} /></Btn>
      </div>
    </div>
  );
}

/* ─── Modal for New Resource Request ─── */
function CreateRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { hospitals, createTransfer } = useDemoStore();
  const [resource, setResource] = useState('Pediatric ventilator');
  const [customResource, setCustomResource] = useState('');
  const [source, setSource] = useState(hospitals[2]?.name || hospitals[0]?.name || '');
  const [destination, setDestination] = useState(hospitals[1]?.name || hospitals[0]?.name || '');

  if (!open) return null;

  const sampleResources = [
    'Pediatric ventilator',
    'O Negative Blood Units (5 Units)',
    'ECMO Machine & Circuit',
    'Intraosseous (IO) Drill Kit',
    'Emergency Thoracotomy Tray',
    'CRRT Continuous Dialysis System',
    'Thromboelastography (TEG) Machine',
    'Custom equipment...',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalResource = resource === 'Custom equipment...' ? customResource : resource;
    if (!finalResource || !source || !destination) return;

    createTransfer(finalResource, source, destination);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section
        className="modal max-w-lg"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onMouseDown={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <h2 id="modal-title" className="font-bold text-slate-900">
            Request Inter-Hospital Resource
          </h2>
          <button onClick={onClose} aria-label="Close dialog" className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-sm text-slate-600">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Required Resource / Equipment
            </label>
            <select
              value={resource}
              onChange={e => setResource(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#1677c8]"
            >
              {sampleResources.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {resource === 'Custom equipment...' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Equipment Name
              </label>
              <input
                type="text"
                value={customResource}
                onChange={e => setCustomResource(e.target.value)}
                placeholder="e.g. Adult ECMO Oxygenator Set"
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm outline-none focus:border-[#1677c8]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Source Facility (Releasing Hospital)
            </label>
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#1677c8]"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.name}>
                  {h.name} ({h.area})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Destination Facility (Requesting Hospital / Paramedic Unit)
            </label>
            <select
              value={destination}
              onChange={e => setDestination(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-2.5 text-sm font-medium text-slate-800 outline-none focus:border-[#1677c8]"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.name}>
                  {h.name} ({h.area})
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-800">
            <b>Note:</b> Creating a request initiates the inter-hospital transfer protocol. Approvals are required from both source and destination coordinators.
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Btn kind="outline" onClick={onClose}>Cancel</Btn>
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#1677c8] px-4 text-sm font-semibold text-white hover:bg-[#0e64ad]"
            >
              <Plus size={16} /> Create Request
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

/* ─── Main Pages ─── */

export function ResourceDashboard() {
  const n = useNavigate();
  const { transfer, role } = useDemoStore();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="label text-[#1677c8]">
            {role === 'paramedic' ? 'Paramedic resource sharing' : role === 'admin' ? 'Network resource exchange' : 'Hospital resource exchange'}
          </p>
          <h1 className="mt-1 text-2xl font-bold">Inter-hospital resource coordination</h1>
          <p className="mt-1 text-sm text-slate-500">
            Participating hospitals decide what to share and approve every transfer stage.
          </p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => setModalOpen(true)}>
            <Plus size={16} /> New Resource Request
          </Btn>
          <Btn kind="outline" onClick={() => n(getRoute('details', role))}>
            Open request details
          </Btn>
        </div>
      </div>

      <TransferHeader />

      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Transfer progression</h2>
          <div className="mt-6">
            <Stepper />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="label">Current state</p>
          <p className="mt-2 text-lg font-bold">{stages[index(transfer.stage)].label}</p>
          <p className="mt-2 text-sm text-slate-500">
            Active request for <b>{transfer.resource}</b> between {transfer.source} and {transfer.destination}.
          </p>
          <div className="mt-4">
            <Btn kind="outline" onClick={() => n(getRoute('tracking', role))}>
              View transfer tracking <Truck size={16} />
            </Btn>
          </div>
        </div>
      </div>

      <Action />
      <Safety />
      <CreateRequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

export function ResourceDetails() {
  const n = useNavigate();
  const { transfer, role } = useDemoStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Resource request details</p>
        <h1 className="mt-1 text-2xl font-bold">{transfer.resource} request</h1>
        <p className="mt-1 text-sm text-slate-500">Review participating facilities, permissions, and the controlled approval state.</p>
      </div>
      <TransferHeader />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="label">Source facility</p>
          <h2 className="mt-2 font-semibold">{transfer.source}</h2>
          <p className="mt-1 text-sm text-slate-500">Potential source · approval required before resource release.</p>
          <div className="mt-3">
            <StatusBadge tone={index(transfer.stage) >= 2 ? 'green' : 'amber'}>
              {index(transfer.stage) >= 2 ? 'Source approval recorded' : 'Awaiting source hospital approval'}
            </StatusBadge>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="label">Destination facility</p>
          <h2 className="mt-2 font-semibold">{transfer.destination}</h2>
          <p className="mt-1 text-sm text-slate-500">Destination request owner · {transfer.distanceKm} km from source.</p>
          <div className="mt-3">
            <StatusBadge tone={index(transfer.stage) >= 1 ? 'green' : 'amber'}>
              {index(transfer.stage) >= 1 ? 'Destination approval recorded' : 'Destination approval pending'}
            </StatusBadge>
          </div>
        </div>
      </div>
      <Action />
      <div className="flex justify-between">
        <Btn kind="outline" onClick={() => n(getRoute('exchange', role))}>
          Back to dashboard
        </Btn>
        <Btn kind="outline" onClick={() => n(getRoute('tracking', role))}>
          View audit trail <ClipboardList size={16} />
        </Btn>
      </div>
      <Safety />
    </div>
  );
}

export function TransferTracking() {
  const n = useNavigate();
  const { transfer, role } = useDemoStore();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="label text-[#1677c8]">Transfer tracking</p>
        <h1 className="mt-1 text-2xl font-bold">Controlled transfer record</h1>
        <p className="mt-1 text-sm text-slate-500">This audit trail records manually confirmed coordination events.</p>
      </div>
      <TransferHeader />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <Stepper />
      </div>
      <Action />
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Audit trail</h2>
        <div className="mt-4">
          {[...transfer.audit].reverse().map(entry => (
            <div className="flex gap-4 border-b border-slate-100 py-4 last:border-0" key={entry.id}>
              <span className="w-16 shrink-0 text-xs font-semibold text-slate-400">{entry.time}</span>
              <i className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">{entry.message}</p>
                <p className="mt-1 text-xs text-slate-500">Recorded by {entry.actor}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Btn kind="outline" onClick={() => n(getRoute('exchange', role))}>
        Back to resource exchange
      </Btn>
      <Safety />
    </div>
  );
}
