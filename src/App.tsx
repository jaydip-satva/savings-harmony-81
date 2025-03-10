
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import ReportsPage from './pages/ReportsPage';
import NotFound from './pages/NotFound';
import './App.css';

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8,
    fontSize: 16,
  },
};

// Protected route component
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }
  
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <ThemeProvider>
      <ConfigProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
