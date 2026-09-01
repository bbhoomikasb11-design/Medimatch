import{createContext,useContext,useEffect,useMemo,useState,type ReactNode}from'react';
import{demoCase,hospitals as seed,resourceTransfer as seedTransfer}from'./data';
import type{AuditEntry,DemoCase,EquipmentCategory,Hospital,ResourceTransfer,Role,Tone,ToastMessage,TransferStage}from'./types';

const key='medimatch-demo-v3';

type Saved = {
  role: Role;
  activeCase: DemoCase;
  hospitals: Hospital[];
  transfer: ResourceTransfer;
  audit: AuditEntry[];
  incidentLocation: string;
  selectedEquipment: string[];
  equipmentCategoryFilter: EquipmentCategory | null;
  selectedSurgeons: string[];
};

const initialAudit: AuditEntry[] = [
  { id: 101, time: '14:32 IST', actor: 'Paramedic demo unit', message: 'Case MM-260830-014 created from paramedic-entered demo information.' },
  { id: 102, time: '14:36 IST', actor: 'Destination coordinator', message: 'Pediatric ventilator request created; source notification sent.' },
];

const base = (): Saved => ({
  role: 'paramedic',
  activeCase: demoCase,
  hospitals: seed,
  transfer: seedTransfer,
  audit: initialAudit,
  incidentLocation: 'Near Domlur Flyover, Bengaluru',
  selectedEquipment: [],
  equipmentCategoryFilter: null,
  selectedSurgeons: [],
});

const load = (): Saved => {
  try {
    const x = localStorage.getItem(key);
    return x ? { ...base(), ...JSON.parse(x) } : base();
  } catch {
    return base();
  }
};

interface Store {
  role: Role;
  setRole: (r: Role) => void;
  activeCase: DemoCase;
  setCaseStatus: (s: DemoCase['status'], reason?: string) => void;
  hospitals: Hospital[];
  updateHospital: (id: string, changes: Partial<Hospital>) => void;
  transfer: ResourceTransfer;
  createTransfer: (resource: string, source: string, destination: string, distanceKm?: number) => void;
  selectedSurgeons: string[];
  toggleSurgeon: (s: string) => void;
}

const C = createContext<Store | undefined>(undefined);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const saved = load();
  const [role, setRole] = useState<Role>(saved.role);
  const [activeCase, setActiveCase] = useState<DemoCase>(saved.activeCase);
  const [hospitals, setHospitals] = useState<Hospital[]>(saved.hospitals);
  const [transfer, setTransfer] = useState<ResourceTransfer>(saved.transfer);
  const [audit, setAudit] = useState<AuditEntry[]>(saved.audit);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [incidentLocation, setIncidentLocation] = useState<string>(saved.incidentLocation);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(saved.selectedEquipment);
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState<EquipmentCategory | null>(saved.equipmentCategoryFilter);
  const [selectedSurgeons, setSelectedSurgeons] = useState<string[]>(saved.selectedSurgeons);

  const record = (actor: string, message: string) =>
    setAudit(a => [{ id: Date.now(), time: '14:38 IST', actor, message }, ...a]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify({ role, activeCase, hospitals, transfer, audit, incidentLocation, selectedEquipment, equipmentCategoryFilter, selectedSurgeons }));
  }, [role, activeCase, hospitals, transfer, audit, incidentLocation, selectedEquipment, equipmentCategoryFilter, selectedSurgeons]);

  const notify = (message: string, tone: Tone = 'blue') => setToast({ id: Date.now(), message, tone });

  const setCaseStatus = (status: DemoCase['status'], declineReason?: string) => {
    setActiveCase(c => ({ ...c, status, declineReason }));
    record(
      status === 'confirmed' ? 'Hospital coordinator' : status === 'declined' ? 'Hospital coordinator' : status === 'handed_over' ? 'Paramedic demo unit' : 'Paramedic demo unit',
      status === 'confirmed' ? 'Emergency coordination accepted; paramedic notified.' : status === 'declined' ? `Emergency request declined: ${declineReason || 'reason not recorded'}.` : status === 'handed_over' ? 'Authorized handover recorded; case record closed.' : 'Emergency acceptance request sent.'
    );
  };

  const updateHospital = (id: string, changes: Partial<Hospital>) => {
    const name = hospitals.find(h => h.id === id)?.name || 'Hospital';
    setHospitals(items => items.map(item => item.id === id ? { ...item, ...changes, updatedAt: 'Just now' } : item));
    record('Hospital coordinator', `${name} published capacity update: ICU ${changes.icuBeds ?? 'unchanged'}, CT ${changes.ctStatus ?? 'unchanged'}.`);
  };

  const advanceTransfer = (stage: TransferStage, actor: string, message: string) => {
    setTransfer(t => ({ ...t, stage, audit: [...t.audit, { id: Date.now(), time: '14:38 IST', actor, message }] }));
    record(actor, message);
  };

  const createTransfer = (resource: string, source: string, destination: string, distanceKm = 6.8) => {
    const newId = `RTX-${Date.now().toString().slice(-6)}`;
    const initialEntry: AuditEntry = {
      id: Date.now(),
      time: '14:38 IST',
      actor: role === 'paramedic' ? 'Paramedic unit' : role === 'admin' ? 'Network administrator' : 'Destination coordinator',
      message: `New inter-hospital resource request created for ${resource} from ${source} to ${destination}.`
    };
    const newTransfer: ResourceTransfer = {
      id: newId,
      resource,
      source,
      destination,
      distanceKm,
      stage: 'request_created',
      audit: [initialEntry]
    };
    setTransfer(newTransfer);
    record(initialEntry.actor, initialEntry.message);
    notify(`Resource request created for ${resource}.`, 'green');
  };

  const toggleEquipment = (eqId: string) => {
    setSelectedEquipment(prev =>
      prev.includes(eqId) ? prev.filter(id => id !== eqId) : [...prev, eqId]
    );
  };

  const toggleSurgeon = (s: string) => {
    setSelectedSurgeons(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const resetDemo = () => {
    const x = base();
    setRole(x.role);
    setActiveCase(x.activeCase);
    setHospitals(x.hospitals);
    setTransfer(x.transfer);
    setAudit(x.audit);
    setIncidentLocation(x.incidentLocation);
    setSelectedEquipment(x.selectedEquipment);
    setEquipmentCategoryFilter(x.equipmentCategoryFilter);
    setSelectedSurgeons(x.selectedSurgeons);
    localStorage.removeItem(key);
    notify('Demo reset to the initial scenario.');
  };

  const v = useMemo(
    () => ({
      role, setRole, activeCase, setCaseStatus, hospitals, updateHospital, transfer, advanceTransfer, createTransfer, audit, toast, notify, resetDemo,
      incidentLocation, setIncidentLocation, selectedEquipment, toggleEquipment, equipmentCategoryFilter, setEquipmentCategoryFilter,
      selectedSurgeons, toggleSurgeon,
    }),
    [role, activeCase, hospitals, transfer, audit, toast, incidentLocation, selectedEquipment, equipmentCategoryFilter, selectedSurgeons]
  );

  return <C.Provider value={v}>{children}</C.Provider>;
}

export function useDemoStore() {
  const v = useContext(C);
  if (!v) throw new Error('Store missing');
  return v;
}
