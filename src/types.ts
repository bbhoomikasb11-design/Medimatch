export type Role='paramedic'|'hospital'|'admin';
export type Tone='green'|'amber'|'red'|'blue'|'slate';

export type EquipmentCategory =
  | 'Critical Resources'
  | 'Surgical Damage Control'
  | 'Vascular Access & Monitoring'
  | 'Massive Transfusion Protocol'
  | 'Neurological & Spinal'
  | 'Advanced Life Support';

export interface Equipment {
  id: string;
  name: string;
  shortName: string;
  category: EquipmentCategory;
  description: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available: boolean;
  hospitalId: string;
}

export interface Hospital {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  etaMinutes: number;
  icuBeds: number;
  ctStatus: 'Available' | 'Unavailable';
  traumaTeam: 'Available' | 'Limited';
  updatedAt: string;
  participation: 'Participating';
  doctors: Doctor[];
}

export interface DemoCase {
  id: string;
  patient: string;
  incident: string;
  location: string;
  requirements: string[];
  urgency: 'Critical';
  status: 'draft' | 'awaiting_confirmation' | 'confirmed' | 'declined' | 'handed_over';
  declineReason?: string;
}

export interface ToastMessage { id: number; message: string; tone: Tone }

export type TransferStage =
  | 'request_created'
  | 'destination_approved'
  | 'source_approved'
  | 'logistics_pending'
  | 'pickup_scheduled'
  | 'in_transit'
  | 'delivered'
  | 'handover_confirmed';

export interface AuditEntry { id: number; time: string; message: string; actor: string }

export interface ResourceTransfer {
  id: string;
  resource: string;
  source: string;
  destination: string;
  distanceKm: number;
  stage: TransferStage;
  audit: AuditEntry[];
}
