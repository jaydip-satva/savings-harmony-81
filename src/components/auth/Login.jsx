
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Card 
        className="w-full max-w-md mx-auto shadow-lg rounded-lg p-8 transition-all duration-300"
        bordered={false}
      >
        <div className="text-center mb-8">
          <Title level={2} className="mb-2">Welcome Back</Title>
          <Text type="secondary">Enter your credentials to access your account</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              className="h-10 rounded-md"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">New to SavingsSync?</Text>
        </Divider>

        <div className="text-center">
          <Link to="/register">
            <Button type="link">Create an account</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
