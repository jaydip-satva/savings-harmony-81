
import React, { useState } from 'react';
import { Table, Tag, Button, Space, Modal, message, Input, Select } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { format } from 'date-fns';
import TransactionForm from './TransactionForm';
import { useAuth } from '../../contexts/AuthContext';
import { deleteTransaction } from '../../services/transactionService';

const { Option } = Select;

const TransactionList = ({ transactions, onUpdate }) => {
  const { user } = useAuth();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    type: null,
    category: null,
  });

  // Delete transaction
  const handleDelete = (transaction) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this transaction?',
      content: 'This action cannot be undone.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, keep it',
      onOk: async () => {
        try {
          await deleteTransaction(user.id, transaction.id);
          message.success('Transaction deleted successfully');
          onUpdate();
        } catch (error) {
          message.error('Failed to delete transaction');
          console.error(error);
        }
      },
    });
  };

  // Edit transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingTransaction(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    onUpdate();
  };

  // Filter transactions
  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      // Text search
      const matchesSearch = searchText === '' || 
        transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchText.toLowerCase());
      
      // Type filter
      const matchesType = !filters.type || transaction.type === filters.type;
      
      // Category filter
      const matchesCategory = !filters.category || transaction.category === filters.category;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  };

  // Get unique categories for filter
  const categories = [...new Set(transactions.map(t => t.category))];

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Tag color="blue">{category}</Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <span style={{ 
          color: record.type === 'expense' ? '#f5222d' : '#52c41a',
          fontWeight: 'medium'
        }}>
          {record.type === 'expense' ? '-' : '+'}
          ${parseFloat(amount).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)} 
            className="text-blue-500"
          />
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record)} 
            className="text-red-500"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <Input
            placeholder="Search transactions"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
            className="w-60"
          />
          <Select
            placeholder="Filter by type"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, type: value })}
          >
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>
          </Select>
          <Select
            placeholder="Filter by category"
            allowClear
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, category: value })}
          >
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
        </div>
        <Button 
          type="primary" 
          onClick={() => setIsModalVisible(true)}
          className="rounded-md"
        >
          Add Transaction
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={getFilteredTransactions()} 
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showTotal: (total) => `Total ${total} transactions`,
        }}
        className="shadow-sm rounded-lg overflow-hidden"
      />

      <Modal
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        <TransactionForm 
          transaction={editingTransaction} 
          onSuccess={handleFormSuccess} 
        />
      </Modal>
    </div>
  );
};

export default TransactionList;
