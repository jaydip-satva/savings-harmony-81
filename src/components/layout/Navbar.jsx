
import React from 'react';
import { Layout, Menu, Button, Typography, Avatar, Dropdown } from 'antd';
import { 
  UserOutlined, 
  LogoutOutlined,
  SunOutlined,
  MoonOutlined
} from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
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
      className={`px-6 flex items-center justify-between z-10 ${isDarkMode ? 'bg-[#141414] text-white' : 'bg-white'}`}
      style={{ position: 'sticky', top: 0, zIndex: 1, width: '100%', padding: '0 24px' }}
    >
      <div className="flex items-center">
        <Link to="/">
          <Title level={3} className={`m-0 ${isDarkMode ? 'text-white' : 'text-primary'}`}>
            SavingsSync
          </Title>
        </Link>
      </div>

      <div className="flex items-center">
        <Button 
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className={`mr-4 ${isDarkMode ? 'text-white hover:text-yellow-300' : 'text-gray-600 hover:text-gray-900'}`}
        />
        
        {!isAuthenticated ? (
          <>
            {location.pathname !== '/login' && (
              <Link to="/login">
                <Button type="text" className={`mr-2 ${isDarkMode ? 'text-white' : ''}`}>
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
          <div className="flex items-center">
            <Avatar icon={<UserOutlined />} className="mr-2 animate-pulse" style={{ backgroundColor: '#1890ff' }} />
            <span className={`mr-2 ${isDarkMode ? 'text-white' : ''}`}>{user.name}</span>
            <Button 
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className={`ml-2 ${isDarkMode ? 'text-white hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
            />
          </div>
        )}
      </div>
    </Header>
  );
};

export default Navbar;
