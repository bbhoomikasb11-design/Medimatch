import React, { createContext, useContext, useState, useEffect } from 'react';

const MediMatchContext = createContext();

export const INITIAL_HOSPITALS = [
  {
    id: 'hosp-a',
    name: 'Hospital A - Saint Jude Trauma Center',
    shortName: 'Hospital A',
    distanceKm: 2.0,
    etaMinutes: 6,
    address: '104 Metro Ave, City Center',
    phone: '+1 (555) 019-2831',
    traumaLevel: 'Level 1 Trauma',
    icuBeds: {
      available: 0,
      total: 5,
      lastUpdated: 'Just now',
    },
    ctScanner: {
      status: 'available', // 'available' | 'unavailable'
      queueTimeMins: 0,
      lastUpdated: '3 mins ago',
    },
    ventilators: {
      available: 4,
      total: 4,
      statusText: '4 Available',
      lastUpdated: '1 min ago',
    },
    specialists: {
      count: 5,
      types: ['Trauma Surgeon', 'Anesthesiologist', 'Cardiologist'],
      lastUpdated: '4 mins ago',
    },
    bloodUnits: {
      total: 24,
      oNegative: 6,
      aPositive: 10,
      bPositive: 8,
      lastUpdated: '2 mins ago',
    },
    coordinates: { x: 35, y: 30 },
    specialties: ['Trauma', 'Neurosurgery', 'Cardiology'],
    contactPerson: 'Dr. Sarah Lin (ER Chief)',
    status: 'High Load',
  },
  {
    id: 'hosp-b',
    name: 'Hospital B - General Care & Cardiac',
    shortName: 'Hospital B',
    distanceKm: 5.0,
    etaMinutes: 12,
    address: '450 Westside Pkwy, District 4',
    phone: '+1 (555) 018-9412',
    traumaLevel: 'Level 2 Trauma',
    icuBeds: {
      available: 3,
      total: 6,
      lastUpdated: '2 mins ago',
    },
    ctScanner: {
      status: 'available',
      queueTimeMins: 5,
      lastUpdated: '5 mins ago',
    },
    ventilators: {
      available: 1,
      total: 3,
      statusText: '1 Available',
      lastUpdated: 'Just now',
    },
    specialists: {
      count: 3,
      types: ['General Surgeon', 'Cardiologist'],
      lastUpdated: '6 mins ago',
    },
    bloodUnits: {
      total: 16,
      oNegative: 3,
      aPositive: 7,
      bPositive: 6,
      lastUpdated: '8 mins ago',
    },
    coordinates: { x: 70, y: 55 },
    specialties: ['General Surgery', 'Cardiology', 'Orthopedics'],
    contactPerson: 'Dr. Marcus Vance',
    status: 'Optimal Capacity',
  },
  {
    id: 'hosp-c',
    name: 'Hospital C - Metro Pulmonary & Specialty',
    shortName: 'Hospital C',
    distanceKm: 7.0,
    etaMinutes: 18,
    address: '890 Harbor View Blvd, Eastside',
    phone: '+1 (555) 014-5520',
    traumaLevel: 'Specialty Center',
    icuBeds: {
      available: 0,
      total: 4,
      lastUpdated: '4 mins ago',
    },
    ctScanner: {
      status: 'unavailable', // CT unavailable
      queueTimeMins: 45,
      lastUpdated: '10 mins ago',
    },
    ventilators: {
      available: 2,
      total: 5,
      statusText: '2 Available',
      lastUpdated: '3 mins ago',
    },
    specialists: {
      count: 4,
      types: ['Pulmonologist', 'Intensivist'],
      lastUpdated: '12 mins ago',
    },
    bloodUnits: {
      total: 12,
      oNegative: 2,
      aPositive: 5,
      bPositive: 5,
      lastUpdated: '15 mins ago',
    },
    coordinates: { x: 82, y: 22 },
    specialties: ['Pulmonology', 'Intensive Care', 'Burns'],
    contactPerson: 'Dr. Elena Rostova',
    status: 'ICU At Capacity',
  },
];

export const INITIAL_DISPATCHES = [
  {
    id: 'disp-101',
    ambulanceCode: 'Medic-4',
    paramedicName: 'Alex Mercer',
    patientAge: 54,
    patientGender: 'Male',
    triageLevel: 'Code Red',
    chiefComplaint: 'Acute Myocardial Infarction / Severe Chest Pain',
    vitals: 'BP 160/95 | HR 112 | SpO2 91%',
    requiredServices: ['ICU Bed', 'CT Scanner'],
    targetHospitalId: 'hosp-b',
    targetHospitalName: 'Hospital B',
    etaMinutes: 8,
    status: 'Accepted', // 'Pending' | 'Accepted' | 'En Route' | 'Arrived' | 'Redirected'
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    assignedBay: 'Bay 2 (Trauma & Cardiac)',
  },
  {
    id: 'disp-102',
    ambulanceCode: 'Medic-12',
    paramedicName: 'Ravi Kumar',
    patientAge: 29,
    patientGender: 'Female',
    triageLevel: 'Code Yellow',
    chiefComplaint: 'Blunt Force Abdominal Trauma (MVA)',
    vitals: 'BP 118/74 | HR 88 | SpO2 98%',
    requiredServices: ['CT Scanner'],
    targetHospitalId: 'hosp-a',
    targetHospitalName: 'Hospital A',
    etaMinutes: 4,
    status: 'Pending',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(),
    assignedBay: 'Unassigned',
  }
];

export function MediMatchProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('paramedic');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-[#16A34A]' ? 'hosp-b' : 'hosp-a');
  const [hospitals, setHospitals] = useState(INITIAL_HOSPITALS);
  const [dispatches, setDispatches] = useState(INITIAL_DISPATCHES);
  const [resourceTransfers, setResourceTransfers] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playAlertSound = (type = 'dispatch') => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = type === 'dispatch' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(type === 'dispatch' ? 587.33 : 880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(type === 'dispatch' ? 880 : 440, ctx.currentTime + 0.3);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Audio playback restricted', e);
    }
  };

  const showNotification = (message, type = 'info') => {
    setActiveNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  // Hospital Staff actions to update 5 resources in real-time
  const updateIcuBeds = (hospitalId, delta) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newAvail = Math.max(0, Math.min(h.icuBeds.total, h.icuBeds.available + delta));
          return {
            ...h,
            icuBeds: { ...h.icuBeds, available: newAvail, lastUpdated: 'Just now' },
          };
        }
        return h;
      })
    );
    showNotification(`ICU bed availability updated for ${hospitalId.toUpperCase()}`, 'success');
  };

  const toggleCtScanner = (hospitalId) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newStatus = h.ctScanner.status === 'available' ? 'unavailable' : 'available';
          return {
            ...h,
            ctScanner: { ...h.ctScanner, status: newStatus, lastUpdated: 'Just now' },
          };
        }
        return h;
      })
    );
    showNotification(`CT Scanner operational status changed`, 'info');
  };

  const updateVentilators = (hospitalId, delta) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newAvail = Math.max(0, Math.min(h.ventilators.total, h.ventilators.available + delta));
          return {
            ...h,
            ventilators: {
              ...h.ventilators,
              available: newAvail,
              statusText: newAvail > 0 ? `${newAvail} Available` : 'Unavailable',
              lastUpdated: 'Just now',
            },
          };
        }
        return h;
      })
    );
    showNotification(`Ventilator count updated`, 'success');
  };

  const updateSpecialists = (hospitalId, delta) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newCount = Math.max(0, h.specialists.count + delta);
          return {
            ...h,
            specialists: { ...h.specialists, count: newCount, lastUpdated: 'Just now' },
          };
        }
        return h;
      })
    );
    showNotification(`Specialists on-call count updated`, 'info');
  };

  const updateBloodUnits = (hospitalId, delta) => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id === hospitalId) {
          const newTotal = Math.max(0, h.bloodUnits.total + delta);
          const newONeg = Math.max(0, h.bloodUnits.oNegative + (delta > 0 ? 1 : -1));
          return {
            ...h,
            bloodUnits: { 
              ...h.bloodUnits, 
              total: newTotal, 
              oNegative: newONeg,
              lastUpdated: 'Just now' 
            },
          };
        }
        return h;
      })
    );
    showNotification(`Blood reserve inventory updated`, 'success');
  };

  // Create Inter-Hospital Resource Transfer Request
  const requestResourceTransfer = (reqHospId, targetHospId, targetHospName, resourceName) => {
    const transferId = `tr-${Date.now().toString().slice(-4)}`;
    const newTransfer = {
      id: transferId,
      requestingHospitalId: reqHospId,
      targetHospitalId: targetHospId,
      targetHospitalName: targetHospName,
      resourceName,
      status: 'Requested', // 'Requested' -> 'Approved'
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setResourceTransfers((prev) => [newTransfer, ...prev]);
    showNotification(`Inter-hospital transfer request for ${resourceName} sent to ${targetHospName}`, 'amber');
    playAlertSound('dispatch');

    // After 2.5 seconds, auto-update status to "Approved by Target Hospital"
    setTimeout(() => {
      setResourceTransfers((prev) =>
        prev.map((t) => {
          if (t.id === transferId) {
            return {
              ...t,
              status: `Approved by ${targetHospName}`,
            };
          }
          return t;
        })
      );
      showNotification(`Transfer of ${resourceName} Approved by ${targetHospName}!`, 'success');
      playAlertSound('status');
    }, 2500);
  };

  const createDispatch = (newDispatchData) => {
    const newDispatch = {
      id: `disp-${Date.now().toString().slice(-4)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      assignedBay: 'Unassigned',
      ...newDispatchData,
    };

    setDispatches((prev) => [newDispatch, ...prev]);
    playAlertSound('dispatch');
    showNotification(`Emergency alert transmitted to ${newDispatchData.targetHospitalName}!`, 'alert');
  };

  const updateDispatchStatus = (dispatchId, newStatus, bay = null) => {
    setDispatches((prev) =>
      prev.map((d) => {
        if (d.id === dispatchId) {
          return {
            ...d,
            status: newStatus,
            assignedBay: bay || d.assignedBay,
          };
        }
        return d;
      })
    );

    playAlertSound('status');
    showNotification(`Dispatch alert status updated to ${newStatus}`, 'success');
  };

  const resetSeedData = () => {
    setHospitals(INITIAL_HOSPITALS);
    setDispatches(INITIAL_DISPATCHES);
    setResourceTransfers([]);
    showNotification('Seed data reset to default benchmark states.', 'info');
  };

  return (
    <MediMatchContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedHospitalId: selectedHospitalId || 'hosp-a',
        setSelectedHospitalId,
        hospitals,
        dispatches,
        resourceTransfers,
        activeNotification,
        soundEnabled,
        setSoundEnabled,
        updateIcuBeds,
        toggleCtScanner,
        updateVentilators,
        updateSpecialists,
        updateBloodUnits,
        requestResourceTransfer,
        createDispatch,
        updateDispatchStatus,
        resetSeedData,
        playAlertSound,
        showNotification,
      }}
    >
      {children}
    </MediMatchContext.Provider>
  );
}

export function useMediMatch() {
  const context = useContext(MediMatchContext);
  if (!context) {
    throw new Error('useMediMatch must be used within a MediMatchProvider');
  }
  return context;
}
