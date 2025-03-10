
import React, { useState } from 'react';
import { Form, Input, DatePicker, Select, Button, InputNumber } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { addTransaction, updateTransaction } from '../../services/transactionService';
import dayjs from 'dayjs';

const { Option } = Select;

const CATEGORIES = [
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Rent', label: 'Rent & Housing' },
  { value: 'Utilities', label: 'Utilities' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Travel', label: 'Travel' },
  { value: 'Education', label: 'Education' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Investment', label: 'Investment' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Other', label: 'Other' }
];

const TransactionForm = ({ transaction, onSuccess }) => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState(transaction?.type || 'expense');

  // Set initial form values if editing
  React.useEffect(() => {
    if (transaction) {
      form.setFieldsValue({
        ...transaction,
        date: dayjs(transaction.date),
      });
      setTransactionType(transaction.type);
    }
  }, [transaction, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formattedTransaction = {
        ...values,
        date: values.date.toISOString(),
        amount: parseFloat(values.amount),
      };

      if (transaction) {
        // Update existing transaction
        await updateTransaction(user.id, {
          ...formattedTransaction,
          id: transaction.id,
        });
      } else {
        // Create new transaction
        await addTransaction(user.id, formattedTransaction);
      }
      
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter categories based on transaction type
  const filteredCategories = CATEGORIES.filter(category => {
    if (transactionType === 'income') {
      return ['Salary', 'Investment', 'Gift', 'Other'].includes(category.value);
    }
    return !['Salary', 'Investment'].includes(category.value);
  });

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        type: 'expense',
        date: dayjs(),
      }}
    >
      <Form.Item
        name="type"
        label="Transaction Type"
        rules={[{ required: true, message: 'Please select a type' }]}
      >
        <Select onChange={setTransactionType}>
          <Option value="expense">Expense</Option>
          <Option value="income">Income</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="amount"
        label="Amount"
        rules={[
          { required: true, message: 'Please enter an amount' },
          { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          precision={2}
        />
      </Form.Item>

      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select>
          {filteredCategories.map(category => (
            <Option key={category.value} value={category.value}>
              {category.label}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end gap-2">
          <Button onClick={() => form.resetFields()}>Reset</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {transaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
