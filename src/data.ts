import type { DemoCase, Doctor, Equipment, EquipmentCategory, Hospital, ResourceTransfer } from './types';

/* ─── Equipment Catalog ─── */

export const equipmentCategories: EquipmentCategory[] = [
  'Critical Resources',
  'Surgical Damage Control',
  'Vascular Access & Monitoring',
  'Massive Transfusion Protocol',
  'Neurological & Spinal',
  'Advanced Life Support',
];

export const surgeonTypes: string[] = [
  'Trauma Surgeon',
  'Neurosurgeon',
  'Cardiothoracic Surgeon',
  'Vascular Surgeon',
  'Orthopedic Surgeon',
  'General Surgeon',
  'Plastic / Reconstructive Surgeon',
  'Pediatric Surgeon',
];

export const equipmentCatalog: Equipment[] = [
  // ── Critical Resources (listed first) ──
  { id: 'cr-01', name: 'Blood Units (Packed RBCs)', shortName: 'Blood Units', category: 'Critical Resources', description: 'Packed red blood cell units for immediate massive transfusion' },
  { id: 'cr-02', name: 'ICU Bed with Ventilator', shortName: 'ICU Bed', category: 'Critical Resources', description: 'Intensive care unit bed with mechanical ventilator support' },
  { id: 'cr-03', name: 'Trauma Team Activation', shortName: 'Trauma Team', category: 'Critical Resources', description: 'Full trauma team standby including surgeon, anesthesiologist, and nurses' },
  { id: 'cr-04', name: 'CT Scanner Access', shortName: 'CT Scan', category: 'Critical Resources', description: 'Immediate computed tomography scan for trauma imaging' },
  { id: 'cr-05', name: 'Operating Theater', shortName: 'Operating Theater', category: 'Critical Resources', description: 'Emergency operating room with full anesthesia and surgical setup' },

  // ── Surgical Damage Control ──
  { id: 'eq-01', name: 'Emergency Thoracotomy Tray', shortName: 'Thoracotomy Tray', category: 'Surgical Damage Control', description: 'Ready-to-use tray for emergency chest opening to clamp bleeding vessels' },
  { id: 'eq-02', name: 'Chest Tube Insertion Kit', shortName: 'Chest Tube Kit', category: 'Surgical Damage Control', description: 'Kit for inserting tubes to drain trapped air and blood from the chest cavity' },
  { id: 'eq-03', name: 'Laparotomy Set', shortName: 'Laparotomy Set', category: 'Surgical Damage Control', description: 'Surgical set for emergency abdominal opening to control internal hemorrhage' },
  { id: 'eq-04', name: 'Damage Control Surgery Pack', shortName: 'DCS Pack', category: 'Surgical Damage Control', description: 'Abdominal packing materials and temporary closure devices for staged surgery' },
  { id: 'eq-05', name: 'Resuscitative Balloon Catheter (REBOA)', shortName: 'REBOA Catheter', category: 'Surgical Damage Control', description: 'Endovascular balloon to occlude the aorta and control massive hemorrhage' },

  // ── Vascular Access & Monitoring ──
  { id: 'eq-06', name: 'Intraosseous (IO) Drill', shortName: 'IO Drill', category: 'Vascular Access & Monitoring', description: 'Drill for bone marrow vascular access when veins collapse from shock' },
  { id: 'eq-07', name: 'Central Venous Catheter (CVC)', shortName: 'CVC Line', category: 'Vascular Access & Monitoring', description: 'Large-bore catheter for high-volume fluid and medication delivery' },
  { id: 'eq-08', name: 'Arterial Line Monitor', shortName: 'Arterial Line', category: 'Vascular Access & Monitoring', description: 'Continuous second-by-second blood pressure tracking via arterial cannulation' },
  { id: 'eq-09', name: 'Ultrasound-Guided IV Access', shortName: 'US-Guided IV', category: 'Vascular Access & Monitoring', description: 'Portable ultrasound for visualizing veins during difficult IV placement' },
  { id: 'eq-10', name: 'Pulmonary Artery Catheter (Swan-Ganz)', shortName: 'PA Catheter', category: 'Vascular Access & Monitoring', description: 'Catheter to measure cardiac output and pulmonary pressures in shock' },

  // ── Massive Transfusion Protocol ──
  { id: 'eq-11', name: 'Rapid Infuser (Belmont/Level 1)', shortName: 'Rapid Infuser', category: 'Massive Transfusion Protocol', description: 'High-flow device that warms and pumps blood at up to 1 litre per minute' },
  { id: 'eq-12', name: 'Thromboelastography (TEG) Machine', shortName: 'TEG Machine', category: 'Massive Transfusion Protocol', description: 'Real-time blood clotting analysis to guide transfusion decisions' },
  { id: 'eq-13', name: 'Fresh Frozen Plasma (FFP) Supply', shortName: 'FFP Supply', category: 'Massive Transfusion Protocol', description: 'Frozen plasma units for replacing clotting factors during massive hemorrhage' },
  { id: 'eq-14', name: 'Platelet Concentrate Supply', shortName: 'Platelet Supply', category: 'Massive Transfusion Protocol', description: 'Platelet units to restore clotting ability in coagulopathic trauma patients' },
  { id: 'eq-15', name: 'Cell Salvage (Autotransfusion) Device', shortName: 'Cell Salvage', category: 'Massive Transfusion Protocol', description: 'Machine to collect, wash, and re-infuse the patient\'s own lost blood' },

  // ── Neurological & Spinal ──
  { id: 'eq-16', name: 'Intracranial Pressure (ICP) Monitor', shortName: 'ICP Monitor', category: 'Neurological & Spinal', description: 'Sensor drilled into skull to continuously track brain swelling pressure' },
  { id: 'eq-17', name: 'Rigid Spinal Immobilization Board', shortName: 'Spinal Board', category: 'Neurological & Spinal', description: 'Full-body immobilization board for suspected spinal cord injuries' },
  { id: 'eq-18', name: 'Pelvic Binder', shortName: 'Pelvic Binder', category: 'Neurological & Spinal', description: 'Circumferential compression device to control bleeding from pelvic fractures' },
  { id: 'eq-19', name: 'External Ventricular Drain (EVD)', shortName: 'EVD Kit', category: 'Neurological & Spinal', description: 'Catheter system to drain cerebrospinal fluid and relieve brain pressure' },
  { id: 'eq-20', name: 'Cervical Collar (Philadelphia)', shortName: 'Cervical Collar', category: 'Neurological & Spinal', description: 'Rigid neck brace for immobilizing suspected cervical spine injuries' },

  // ── Advanced Life Support ──
  { id: 'eq-21', name: 'ECMO Machine', shortName: 'ECMO', category: 'Advanced Life Support', description: 'Extracorporeal membrane oxygenation — temporary artificial heart and lung' },
  { id: 'eq-22', name: 'CRRT System', shortName: 'CRRT', category: 'Advanced Life Support', description: 'Continuous renal replacement therapy to filter toxins during kidney failure' },
  { id: 'eq-23', name: 'Intra-Aortic Balloon Pump (IABP)', shortName: 'IABP', category: 'Advanced Life Support', description: 'Counterpulsation device to assist a failing heart and improve coronary perfusion' },
  { id: 'eq-24', name: 'Therapeutic Hypothermia System', shortName: 'Hypothermia System', category: 'Advanced Life Support', description: 'Controlled cooling device for neuroprotection after cardiac arrest' },
  { id: 'eq-25', name: 'Mechanical CPR Device (LUCAS)', shortName: 'Mech. CPR', category: 'Advanced Life Support', description: 'Automated chest compression device for consistent CPR during transport' },
];

/* ─── Location Suggestions ─── */

export const locationSuggestions: string[] = [
  'Near Domlur Flyover, Bengaluru',
  'Silk Board Junction, Bengaluru',
  'Hebbal Flyover, Bengaluru',
  'KR Puram Bridge, Bengaluru',
  'Marathahalli Bridge, Bengaluru',
  'Tin Factory Junction, Bengaluru',
  'Electronic City Flyover, Bengaluru',
  'Koramangala 5th Block, Bengaluru',
  'Indiranagar 100 Feet Road, Bengaluru',
  'Whitefield Main Road, Bengaluru',
  'Yelahanka Air Force Road, Bengaluru',
  'Bannerghatta Road, Bengaluru',
  'MG Road Metro Station, Bengaluru',
  'Jayanagar 4th Block, Bengaluru',
  'Rajajinagar Industrial Area, Bengaluru',
];

/* ─── Doctor / Surgeon Data ─── */

const centralDoctors: Doctor[] = [
  { id: 'dr-01', name: 'Dr. Aravind Menon', specialty: 'Trauma Surgeon', available: true, hospitalId: 'central' },
  { id: 'dr-02', name: 'Dr. Priya Sharma', specialty: 'Emergency Medicine', available: true, hospitalId: 'central' },
  { id: 'dr-03', name: 'Dr. Rajesh Iyer', specialty: 'Orthopedic Surgeon', available: false, hospitalId: 'central' },
];

const eastDoctors: Doctor[] = [
  { id: 'dr-04', name: 'Dr. Kavitha Reddy', specialty: 'Neurosurgeon', available: true, hospitalId: 'east' },
  { id: 'dr-05', name: 'Dr. Sunil Patel', specialty: 'Cardiothoracic Surgeon', available: true, hospitalId: 'east' },
  { id: 'dr-06', name: 'Dr. Meera Nair', specialty: 'Trauma Surgeon', available: true, hospitalId: 'east' },
];

const northDoctors: Doctor[] = [
  { id: 'dr-07', name: 'Dr. Vikram Rao', specialty: 'Neurosurgeon', available: true, hospitalId: 'north' },
  { id: 'dr-08', name: 'Dr. Anjali Desai', specialty: 'Vascular Surgeon', available: false, hospitalId: 'north' },
  { id: 'dr-09', name: 'Dr. Karthik Hegde', specialty: 'Trauma Surgeon', available: true, hospitalId: 'north' },
];

const whitefieldDoctors: Doctor[] = [
  { id: 'dr-10', name: 'Dr. Deepa Kulkarni', specialty: 'General Surgeon', available: true, hospitalId: 'whitefield' },
  { id: 'dr-11', name: 'Dr. Arjun Bhat', specialty: 'Orthopedic Surgeon', available: true, hospitalId: 'whitefield' },
  { id: 'dr-12', name: 'Dr. Sneha Joshi', specialty: 'Emergency Medicine', available: false, hospitalId: 'whitefield' },
];

const jayanagDoctors: Doctor[] = [
  { id: 'dr-13', name: 'Dr. Ramesh Gowda', specialty: 'Trauma Surgeon', available: true, hospitalId: 'jayanagar' },
  { id: 'dr-14', name: 'Dr. Lakshmi Venkat', specialty: 'Neurosurgeon', available: true, hospitalId: 'jayanagar' },
  { id: 'dr-15', name: 'Dr. Siddharth Rao', specialty: 'Cardiothoracic Surgeon', available: false, hospitalId: 'jayanagar' },
];

const yelaDoctors: Doctor[] = [
  { id: 'dr-16', name: 'Dr. Nandini Prasad', specialty: 'General Surgeon', available: true, hospitalId: 'yelahanka' },
  { id: 'dr-17', name: 'Dr. Harish Kumar', specialty: 'Orthopedic Surgeon', available: true, hospitalId: 'yelahanka' },
  { id: 'dr-18', name: 'Dr. Rekha Bai', specialty: 'Vascular Surgeon', available: true, hospitalId: 'yelahanka' },
];

const ecityDoctors: Doctor[] = [
  { id: 'dr-19', name: 'Dr. Mohan Das', specialty: 'Trauma Surgeon', available: true, hospitalId: 'ecity' },
  { id: 'dr-20', name: 'Dr. Fatima Sheikh', specialty: 'Pediatric Surgeon', available: true, hospitalId: 'ecity' },
  { id: 'dr-21', name: 'Dr. Prashanth Nair', specialty: 'Neurosurgeon', available: false, hospitalId: 'ecity' },
];

const bannerDoctors: Doctor[] = [
  { id: 'dr-22', name: 'Dr. Ashwin Rao', specialty: 'Cardiothoracic Surgeon', available: true, hospitalId: 'bannerghatta' },
  { id: 'dr-23', name: 'Dr. Divya Murthy', specialty: 'Trauma Surgeon', available: true, hospitalId: 'bannerghatta' },
  { id: 'dr-24', name: 'Dr. Ganesh Kamath', specialty: 'Plastic / Reconstructive Surgeon', available: true, hospitalId: 'bannerghatta' },
];

/* ─── Demo Seed Data ─── */

export const demoCase: DemoCase = {
  id: 'MM-260830-014',
  patient: 'Anonymous trauma patient',
  incident: 'Severe road-traffic trauma',
  location: 'Near Domlur Flyover, Bengaluru',
  requirements: ['ICU bed', 'CT scan', 'Trauma team'],
  urgency: 'Critical',
  status: 'draft',
};

export const hospitals: Hospital[] = [
  {
    id: 'central',
    name: 'MediMatch Central Emergency Hospital',
    area: 'Koramangala',
    distanceKm: 2.8,
    etaMinutes: 9,
    icuBeds: 0,
    ctStatus: 'Available',
    traumaTeam: 'Available',
    updatedAt: '2 min ago',
    participation: 'Participating',
    doctors: centralDoctors,
  },
  {
    id: 'east',
    name: 'Bengaluru East Multispeciality Centre',
    area: 'Indiranagar',
    distanceKm: 5.1,
    etaMinutes: 14,
    icuBeds: 3,
    ctStatus: 'Available',
    traumaTeam: 'Available',
    updatedAt: '1 min ago',
    participation: 'Participating',
    doctors: eastDoctors,
  },
  {
    id: 'north',
    name: 'North Bengaluru Trauma Institute',
    area: 'Hebbal',
    distanceKm: 7.4,
    etaMinutes: 19,
    icuBeds: 2,
    ctStatus: 'Unavailable',
    traumaTeam: 'Available',
    updatedAt: '4 min ago',
    participation: 'Participating',
    doctors: northDoctors,
  },
  {
    id: 'whitefield',
    name: 'Whitefield Integrated Hospital',
    area: 'Whitefield',
    distanceKm: 16.2,
    etaMinutes: 31,
    icuBeds: 5,
    ctStatus: 'Available',
    traumaTeam: 'Limited',
    updatedAt: '6 min ago',
    participation: 'Participating',
    doctors: whitefieldDoctors,
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar Advanced Trauma Centre',
    area: 'Jayanagar',
    distanceKm: 6.3,
    etaMinutes: 16,
    icuBeds: 4,
    ctStatus: 'Available',
    traumaTeam: 'Available',
    updatedAt: '3 min ago',
    participation: 'Participating',
    doctors: jayanagDoctors,
  },
  {
    id: 'yelahanka',
    name: 'Yelahanka District General Hospital',
    area: 'Yelahanka',
    distanceKm: 12.5,
    etaMinutes: 24,
    icuBeds: 1,
    ctStatus: 'Available',
    traumaTeam: 'Limited',
    updatedAt: '5 min ago',
    participation: 'Participating',
    doctors: yelaDoctors,
  },
  {
    id: 'ecity',
    name: 'Electronic City Super Speciality Hospital',
    area: 'Electronic City',
    distanceKm: 18.7,
    etaMinutes: 35,
    icuBeds: 6,
    ctStatus: 'Available',
    traumaTeam: 'Available',
    updatedAt: '2 min ago',
    participation: 'Participating',
    doctors: ecityDoctors,
  },
  {
    id: 'bannerghatta',
    name: 'Bannerghatta Road Medical College',
    area: 'Bannerghatta',
    distanceKm: 10.1,
    etaMinutes: 22,
    icuBeds: 3,
    ctStatus: 'Unavailable',
    traumaTeam: 'Available',
    updatedAt: '7 min ago',
    participation: 'Participating',
    doctors: bannerDoctors,
  },
];

export const resourceTransfer: ResourceTransfer = {
  id: 'RTX-260830-001',
  resource: 'Pediatric ventilator',
  source: 'North Bengaluru Trauma Institute',
  destination: 'Bengaluru East Multispeciality Centre',
  distanceKm: 6.8,
  stage: 'request_created',
  audit: [
    { id: 1, time: '14:36 IST', actor: 'Destination coordinator', message: 'Resource request created for pediatric ventilator.' },
    { id: 2, time: '14:36 IST', actor: 'MediMatch network', message: 'Source facility notified; no resource sharing is assumed.' },
  ],
};
