import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Members from './pages/members/Members';
import Tontines from './pages/tontines/Tontines';
import Seances from './pages/seances/Seances';
import Settings from './pages/settings/Settings';
import MonEspace from './pages/membre/MonEspace';
import useAuthStore, { isMembre } from './store/authStore';

const queryClient = new QueryClient();

function AppRoutes() {
  const { membre } = useAuthStore();
  const role = membre?.role || 'membre';

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login"   element={<Login />} />
      <Route element={<Layout />}>
        {/* Routes selon le rôle */}
        {isMembre(role) ? (
          <>
            <Route path="/"              element={<MonEspace />} />
            <Route path="/mes-finances"  element={<MonEspace />} />
            <Route path="/seances"       element={<Seances />} />
          </>
        ) : (
          <>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/members"   element={<Members />} />
            <Route path="/tontines"  element={<Tontines />} />
            <Route path="/seances"   element={<Seances />} />
            <Route path="/settings"  element={<Settings />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right"
          toastOptions={{
            style: {
              background: '#161b27',
              color:      '#e8edf5',
              border:     '1px solid #2e3a50'
            }
          }} />
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}