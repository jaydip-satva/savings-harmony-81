
import React from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Empty } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import TrendChart from '../charts/TrendChart';
import SpendingChart from '../charts/SpendingChart';

const { Title, Text } = Typography;

const Dashboard = ({ transactions }) => {
  // Calculate total income, expenses, and balance
  const totals = transactions.reduce(
    (acc, transaction) => {
      const amount = parseFloat(transaction.amount);
      if (transaction.type === 'income') {
        acc.income += amount;
      } else {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
  
  const balance = totals.income - totals.expense;
  
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Get top categories for expenses
  const categoryExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      const category = transaction.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += parseFloat(transaction.amount);
      return acc;
    }, {});
    
  const topCategories = Object.keys(categoryExpenses)
    .map(category => ({
      category,
      amount: categoryExpenses[category]
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Summary cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card className="h-full shadow-sm">
            <Statistic
              title="Total Balance"
              value={balance}
              precision={2}
              valueStyle={{ color: balance >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <Text type="secondary">Your current financial balance</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="h-full shadow-sm">
            <Statistic
              title="Total Income"
              value={totals.income}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="USD"
            />
            <Text type="secondary">Money you've earned</Text>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="h-full shadow-sm">
            <Statistic
              title="Total Expenses"
              value={totals.expense}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ArrowDownOutlined />}
              suffix="USD"
            />
            <Text type="secondary">Money you've spent</Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <TrendChart transactions={transactions} />
        </Col>
        <Col xs={24} lg={12}>
          <SpendingChart transactions={transactions} />
        </Col>
      </Row>

      {/* Recent transactions and top categories */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={4}>Recent Transactions</Title>}
            className="h-full shadow-sm"
          >
            {recentTransactions.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={recentTransactions}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.description}
                      description={format(new Date(item.date), 'MMM dd, yyyy')}
                    />
                    <div className="flex items-center">
                      <Tag color={item.type === 'income' ? 'green' : 'red'}>
                        {item.type === 'income' ? '+' : '-'} ${parseFloat(item.amount).toFixed(2)}
                      </Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No transactions yet" />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card 
            title={<Title level={4}>Top Expense Categories</Title>}
            className="h-full shadow-sm"
          >
            {topCategories.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={topCategories}
                renderItem={item => (
                  <List.Item>
                    <List.Item.Meta
                      title={item.category}
                    />
                    <div>
                      <Tag color="red">${item.amount.toFixed(2)}</Tag>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No expense data yet" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
