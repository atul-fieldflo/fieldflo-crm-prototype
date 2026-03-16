import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy } from 'react';

const BidLineItemTypes = lazy(() => import('../components/admin/BidLineItemTypes'));
const ProductionTasks = lazy(() => import('../components/admin/ProductionTasks'));
const TaskGroups = lazy(() => import('../components/admin/TaskGroups'));
const ProposalTemplates = lazy(() => import('../components/admin/ProposalTemplates'));
const LeadTemplates = lazy(() => import('../components/admin/LeadTemplates'));
const ClientRateSheets = lazy(() => import('../components/admin/ClientRateSheets'));

export default function AdminPage() {
  return (
    <Routes>
      <Route index element={<Navigate to="bid-types" />} />
      <Route path="bid-types" element={<BidLineItemTypes />} />
      <Route path="tasks" element={<ProductionTasks />} />
      <Route path="task-groups" element={<TaskGroups />} />
      <Route path="proposal-templates" element={<ProposalTemplates />} />
      <Route path="lead-templates" element={<LeadTemplates />} />
      <Route path="rate-sheets" element={<ClientRateSheets />} />
    </Routes>
  );
}
