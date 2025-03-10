
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Register from '../components/auth/Register';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';

const { Content } = Layout;

const RegisterPage = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="p-6 md:p-12 flex items-center justify-center">
        <Register />
      </Content>
    </Layout>
  );
};

export default RegisterPage;
