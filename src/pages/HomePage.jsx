
import React from 'react';
import { Button, Typography, Space, Row, Col, Card } from 'antd';
import { 
  DollarOutlined, 
  PieChartOutlined, 
  FileTextOutlined, 
  LockOutlined 
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

const { Title, Paragraph } = Typography;

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full animate-fade-in">
        <Row gutter={[32, 32]} align="middle">
          <Col xs={24} lg={12}>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-2">
                <span className="bg-blue-50 text-blue-500 rounded-full px-3 py-1 text-sm font-medium">
                  Personal Finance Tracking
                </span>
              </div>
              <Title className="text-4xl md:text-5xl lg:text-6xl mb-6">
                Take control of your finances with SavingsSync
              </Title>
              <Paragraph className="text-lg mb-8 text-gray-600">
                Track your income and expenses, visualize spending patterns, and export detailed financial reports. 
                All your financial data in one secure place.
              </Paragraph>
              <Space size="middle">
                <Link to="/register">
                  <Button type="primary" size="large" className="h-12 px-8 rounded-md">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="large" className="h-12 px-8 rounded-md">
                    Log In
                  </Button>
                </Link>
              </Space>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <img 
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" 
                alt="Finance" 
                className="rounded-xl shadow-lg w-full"
              />
            </div>
          </Col>
        </Row>
      </section>
      
      <section className="py-16 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <Title level={2}>Key Features</Title>
            <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your personal finances effectively
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12} lg={6}>
              <Card 
                className="h-full shadow-sm text-center animate-slide-up card-hover-effect"
                style={{ animationDelay: '0.2s' }}
              >
                <DollarOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Track Transactions</Title>
                <Paragraph className="text-gray-600">
                  Easily record and manage your income and expenses with detailed categorization
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card 
                className="h-full shadow-sm text-center animate-slide-up card-hover-effect"
                style={{ animationDelay: '0.3s' }}
              >
                <PieChartOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Visual Insights</Title>
                <Paragraph className="text-gray-600">
                  Understand your spending patterns with interactive charts and graphs
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card 
                className="h-full shadow-sm text-center animate-slide-up card-hover-effect"
                style={{ animationDelay: '0.4s' }}
              >
                <FileTextOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Export Reports</Title>
                <Paragraph className="text-gray-600">
                  Generate and download comprehensive financial reports in PDF and CSV formats
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card 
                className="h-full shadow-sm text-center animate-slide-up card-hover-effect"
                style={{ animationDelay: '0.5s' }}
              >
                <LockOutlined className="text-4xl text-blue-500 mb-4" />
                <Title level={4}>Secure & Private</Title>
                <Paragraph className="text-gray-600">
                  Your financial data is completely private and only accessible to you
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </section>
      
      <footer className="py-8 px-4 md:px-8 bg-gray-100 text-center">
        <div className="max-w-7xl mx-auto">
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} SavingsSync. All rights reserved.
          </Typography.Text>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
