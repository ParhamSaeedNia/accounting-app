import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Packages from './pages/Packages';
import Teachers from './pages/Teachers';
import Sessions from './pages/Sessions';
import Transactions from './pages/Transactions';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="packages" element={<Packages />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="transactions" element={<Transactions />} />
        </Route>
      </Routes>
    </ToastProvider>
  );
}

export default App;

