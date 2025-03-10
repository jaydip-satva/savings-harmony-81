
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import Navbar from '../components/layout/Navbar';
import SideMenu from '../components/layout/SideMenu';
import Dashboard from '../components/dashboard/Dashboard';
import { useAuth } from '../contexts/AuthContext';
import { getUserTransactions } from '../services/transactionService';

const { Content } = Layout;

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
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
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar />
        <Content className="p-6 md:p-8">
          <div className="pb-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.name}!</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
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
