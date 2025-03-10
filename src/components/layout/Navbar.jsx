
import React from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header 
      className="px-6 flex items-center justify-between bg-white shadow-sm z-10"
      style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: '0 24px' }}
    >
      <div className="flex items-center">
        <Link to="/">
          <Title level={3} className="m-0 text-primary">
            SavingsSync
          </Title>
        </Link>
      </div>

      <div className="flex items-center">
        {!isAuthenticated ? (
          <>
            {location.pathname !== '/login' && (
              <Link to="/login">
                <Button type="text" className="mr-2">
                  Log in
                </Button>
              </Link>
            )}
            
            {location.pathname !== '/register' && (
              <Link to="/register">
                <Button type="primary" className="rounded-md">
                  Register
                </Button>
              </Link>
            )}
          </>
        ) : (
          <Dropdown menu={userMenu} trigger={['click']}>
            <div className="flex items-center cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-md transition-colors">
              <Avatar icon={<UserOutlined />} className="mr-2 animate-pulse" style={{ backgroundColor: '#1890ff' }} />
              <span className="mr-2">{user.name}</span>
            </div>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
