
import React, { createContext, useState, useEffect, useContext } from 'react';
import { message } from 'antd';

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
      // Check if user already exists (in a real app, this would be done by the backend)
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (existingUsers.find(u => u.email === userData.email)) {
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

      // Add user to "database"
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Log in the user
      const { password, ...userWithoutPassword } = newUser;
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
      // Find user by email
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = existingUsers.find(u => u.email === email);

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
