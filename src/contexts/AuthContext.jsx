
import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';
import api from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      // In a real app, this would be a POST request to an endpoint
      // Here we're using json-server, so we'll first check if user exists
      const users = await api.get('/users');
      
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email already in use');
      }

      // Create a new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, never store plain text passwords
        createdAt: new Date().toISOString()
      };

      // Add user to database
      const createdUser = await api.post('/users', newUser);

      // Initialize empty transactions for the new user
      await api.post(`/transactions`, { [createdUser.id]: [] });

      // Log in the user
      const { password, ...userWithoutPassword } = createdUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      message.success('Registration successful!');
      return userWithoutPassword;
    } catch (error) {
      message.error(error.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // In a real app, this would be a POST request with credentials
      // For json-server, we'll simulate this by fetching users and filtering
      const users = await api.get('/users');
      const user = users.find(u => u.email === email);

      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Login successful
      const { password: _, ...userWithoutPassword } = user;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      message.success('Login successful!');
      return userWithoutPassword;
    } catch (error) {
      message.error(error.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    message.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
