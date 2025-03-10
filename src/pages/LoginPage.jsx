
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Login from '../components/auth/Login';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;

const LoginPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="p-6 md:p-12 flex items-center justify-center">
        <Login />
      </Content>
    </Layout>
  );
};

export default LoginPage;
