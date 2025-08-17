import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ManagerDashboard from './components/dashboard/ManagerDashboard';
import EmployeeDashboard from './components/dashboard/EmployeeDashboard';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { loading, isAuthenticated, isManager } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route 
          path="/" 
          element={
            isManager ? <ManagerDashboard /> : <EmployeeDashboard />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isManager ? <ManagerDashboard /> : <EmployeeDashboard />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
