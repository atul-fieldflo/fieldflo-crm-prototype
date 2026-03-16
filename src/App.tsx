import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppShell from './components/shell/AppShell';
import { lazy, Suspense, Component } from 'react';
import type { ReactNode } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 32, color: '#b91c1c', background: '#fef2f2', margin: 16, borderRadius: 8 }}>
          <h2 style={{ fontWeight: 'bold', fontSize: 18 }}>Runtime Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 8, fontSize: 12 }}>{this.state.error.stack}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 12, padding: '6px 16px', background: '#b91c1c', color: 'white', borderRadius: 6, border: 'none', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Lazy load pages
const CRMDashboard = lazy(() => import('./pages/DashboardPage'));
const LeadsListPage = lazy(() => import('./pages/LeadsListPage'));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-ff-text-muted text-sm">Loading...</div>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h2 className="text-lg font-semibold text-ff-text">Coming Soon</h2>
        <p className="text-ff-text-secondary text-sm mt-1">This module is not part of the CRM prototype.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/crm/dashboard" />} />
              <Route path="crm/dashboard" element={<CRMDashboard />} />
              <Route path="crm/leads" element={<LeadsListPage />} />
              <Route path="crm/leads/:leadId/*" element={<LeadDetailPage />} />
              <Route path="crm/clients/:clientId" element={<ComingSoon />} />
              {/* Admin Routes */}
              <Route path="admin/*" element={<AdminPage />} />
              {/* Placeholder modules */}
              <Route path="projects/*" element={<ComingSoon />} />
              <Route path="scheduling/*" element={<ComingSoon />} />
              <Route path="payroll/*" element={<ComingSoon />} />
              <Route path="safety/*" element={<ComingSoon />} />
              <Route path="warehouse/*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
