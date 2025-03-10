
import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
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
          <Title level={2} className="mb-2">Create Account</Title>
          <Text type="secondary">Track your finances with SavingsSync</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input 
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Full Name" 
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email" 
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Confirm Password"
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
              Register
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>
          <Text type="secondary">Already have an account?</Text>
        </Divider>

        <div className="text-center">
          <Link to="/login">
            <Button type="link">Log in</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Register;
