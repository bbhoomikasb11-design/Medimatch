import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell, Placeholder } from './components';
import { Acceptance, Active, CaseRecord, Details, Handover, Intake, Overview, Recommendations, Search, Welcome } from './paramedic';
import { CapacityUpdate, HospitalDashboard, IncomingCase, PreArrival } from './hospital';
import { ResourceDashboard, ResourceDetails, TransferTracking } from './resources';
import { AdminDashboard, AuditSafety, HelpSafety, NetworkOverview } from './network';

const pages = [
  ['/paramedic/activity', 'Activity', 'Paramedic'],
  ['/hospital/audit-log', 'Audit Log', 'Hospital'],
  ['/admin/settings', 'Settings', 'Administrator'],
] as const;

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route element={<AppShell />}>
        {/* Paramedic routes */}
        <Route path="/paramedic/overview" element={<Overview />} />
        <Route path="/paramedic/new-emergency" element={<Intake />} />
        <Route path="/paramedic/network-search" element={<Search />} />
        <Route path="/paramedic/hospital-network" element={<NetworkOverview />} />
        <Route path="/paramedic/hospital-recommendations" element={<Recommendations />} />
        <Route path="/paramedic/hospital-details" element={<Details />} />
        <Route path="/paramedic/request-acceptance" element={<Acceptance />} />
        <Route path="/paramedic/active-case" element={<Active />} />
        <Route path="/paramedic/handover" element={<Handover />} />
        <Route path="/paramedic/case-record" element={<CaseRecord />} />
        <Route path="/paramedic/resource-requests" element={<ResourceDashboard />} />
        <Route path="/paramedic/resource-request-details" element={<ResourceDetails />} />
        <Route path="/paramedic/transfer-tracking" element={<TransferTracking />} />

        {/* Hospital routes */}
        <Route path="/hospital/overview" element={<HospitalDashboard />} />
        <Route path="/hospital/capacity" element={<CapacityUpdate />} />
        <Route path="/hospital/incoming-cases" element={<IncomingCase />} />
        <Route path="/hospital/pre-arrival-alert" element={<PreArrival />} />
        <Route path="/hospital/resource-exchange" element={<ResourceDashboard />} />
        <Route path="/hospital/resource-request-details" element={<ResourceDetails />} />
        <Route path="/hospital/transfer-tracking" element={<TransferTracking />} />
        <Route path="/hospital/transfer-requests" element={<TransferTracking />} />
        <Route path="/hospital/audit-log" element={<AuditSafety />} />

        {/* Admin routes */}
        <Route path="/admin/overview" element={<AdminDashboard />} />
        <Route path="/admin/participating-hospitals" element={<NetworkOverview />} />
        <Route path="/admin/capacity-freshness" element={<AdminDashboard />} />
        <Route path="/admin/resource-requests" element={<ResourceDashboard />} />
        <Route path="/admin/resource-request-details" element={<ResourceDetails />} />
        <Route path="/admin/audit-safety" element={<AuditSafety />} />

        {/* Help & Safety */}
        <Route path="/help-safety" element={<HelpSafety />} />

        {pages.map(([path, title, group]) => (
          <Route key={path} path={path} element={<Placeholder title={title} group={group} />} />
        ))}
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
