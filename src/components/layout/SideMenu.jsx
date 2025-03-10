
import React from 'react';
import { Layout, Menu } from 'antd';
import { 
  DashboardOutlined, 
  TransactionOutlined, 
  FileTextOutlined
} from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const { Sider } = Layout;

const SideMenu = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  
  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: <Link to="/transactions">Transactions</Link>,
    },
    {
      key: '/reports',
      icon: <FileTextOutlined />,
      label: <Link to="/reports">Reports</Link>,
    }
  ];

  return (
    <Sider
      width={250}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className={`animate-slide-in ${isDarkMode ? 'bg-[#141414] shadow-lg' : 'bg-white shadow-sm'}`}
      style={{ 
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="h-16 m-4 flex items-center justify-center">
        {!collapsed && (
          <Link to="/dashboard">
            <h2 className={`text-xl font-medium m-0 ${isDarkMode ? 'text-white' : 'text-primary'}`}>SavingsSync</h2>
          </Link>
        )}
      </div>
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ borderRight: 0 }}
        items={menuItems}
      />
      <div className="p-4 absolute bottom-0 left-0 right-0">
        {!collapsed && (
          <div className={`text-xs text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            © {new Date().getFullYear()} SavingsSync
          </div>
        )}
      </div>
    </Sider>
  );
};

export default SideMenu;
