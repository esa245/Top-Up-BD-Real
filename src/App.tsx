import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './store';
import Layout from './components/Layout';
import Login from './pages/Login';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import AddFunds from './pages/AddFunds';
import Support from './pages/Support';
import Profile from './pages/Profile';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAppContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/new-order" replace />} />
            <Route path="new-order" element={<NewOrder />} />
            <Route path="orders" element={<Orders />} />
            <Route path="add-funds" element={<AddFunds />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
