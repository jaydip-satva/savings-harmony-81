
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Layout, Spin, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Navbar from '../components/layout/Navbar';
import SideMenu from '../components/layout/SideMenu';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import { useAuth } from '../contexts/AuthContext';
import { getUserTransactions } from '../services/transactionService';

const { Content } = Layout;

const TransactionsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Load user's transactions
  useEffect(() => {
    loadTransactions();
  }, [user]);
  
  const loadTransactions = async () => {
    if (user) {
      try {
        setLoading(true);
        const userTransactions = await getUserTransactions(user.id);
        setTransactions(userTransactions);
      } catch (error) {
        console.error('Error loading transactions:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    loadTransactions();
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SideMenu collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <Navbar />
        <Content className="p-6 md:p-8">
          <div className="pb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Transactions</h1>
              <p className="text-gray-500">Manage your income and expenses</p>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showModal}
              className="rounded-md"
            >
              Add Transaction
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <TransactionList 
              transactions={transactions} 
              onUpdate={loadTransactions} 
            />
          )}
          
          <Modal
            title="Add New Transaction"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            destroyOnClose
          >
            <TransactionForm onSuccess={handleFormSuccess} />
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default TransactionsPage;
