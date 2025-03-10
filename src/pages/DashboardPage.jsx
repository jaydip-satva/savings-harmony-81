
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Navbar from '../components/layout/Navbar';
import SideMenu from '../components/layout/SideMenu';
import Dashboard from '../components/dashboard/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getUserTransactions } from '../services/transactionService';

const { Content } = Layout;

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Load user's transactions
  useEffect(() => {
    if (user) {
      const userTransactions = getUserTransactions(user.id);
      setTransactions(userTransactions);
      setLoading(false);
    }
  }, [user]);

  return (
    <Layout style={{ minHeight: '100vh', height: '100%' }}>
      <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar />
        <Content className="p-6 md:p-8" style={{ 
          overflow: 'auto', 
          height: 'calc(100vh - 64px)',
          [isDarkMode ? 'backgroundColor' : 'backgroundImage']: isDarkMode 
            ? '#141414' 
            : 'linear-gradient(184.1deg, rgba(249,255,182,0.1) 44.7%, rgba(226,255,172,0.1) 67.2%)'
        }}>
          <div className="pb-6 animate-fade-in">
            <h1 className={`text-2xl font-semibold animate-slide-up ${isDarkMode ? 'text-white' : ''}`}>Dashboard</h1>
            <p className={`animate-slide-up ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} style={{ animationDelay: '0.1s' }}>
              Welcome back, <span className="text-primary font-medium">{user?.name}!</span>
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64 animate-fade-in">
              <Spin size="large" />
            </div>
          ) : (
            <Dashboard transactions={transactions} />
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
