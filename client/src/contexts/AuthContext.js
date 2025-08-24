import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set up axios defaults
  useEffect(() => {
    // For now, use localStorage-based authentication since we don't have a backend
    // This creates a working demo without needing a separate API server
      
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Decode mock token to get user data
          const userData = JSON.parse(atob(token));
          const users = JSON.parse(localStorage.getItem('companytasks_users') || '[]');
          const user = users.find(u => u.id === userData.userId);
          
          if (user) {
            setUser(user);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      // Mock authentication using localStorage
      const users = JSON.parse(localStorage.getItem('companytasks_users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (!user) {
        toast.error('User not found');
        return { success: false, message: 'User not found' };
      }
      
      // Simple password check (in real app, this would be hashed)
      if (user.password !== password) {
        toast.error('Invalid password');
        return { success: false, message: 'Invalid password' };
      }
      
      // Generate mock token
      const mockToken = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role }));
      
      setToken(mockToken);
      setUser(user);
      localStorage.setItem('token', mockToken);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error('Login failed');
      return { success: false, message: 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration using localStorage
      const users = JSON.parse(localStorage.getItem('companytasks_users') || '[]');
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        toast.error('User already exists');
        return { success: false, message: 'User already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed
        role: userData.role || 'employee',
        department: userData.department || '',
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('companytasks_users', JSON.stringify(users));
      
      // Generate mock token
      const mockToken = btoa(JSON.stringify({ userId: newUser.id, email: newUser.email, role: newUser.role }));
      
      setToken(mockToken);
      setUser(newUser);
      localStorage.setItem('token', mockToken);
      
      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      toast.error('Registration failed');
      return { success: false, message: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updates) => {
    try {
      // Mock profile update using localStorage
      const users = JSON.parse(localStorage.getItem('companytasks_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('companytasks_users', JSON.stringify(users));
        setUser(users[userIndex]);
        toast.success('Profile updated successfully!');
        return { success: true };
      }
      
      toast.error('User not found');
      return { success: false, message: 'User not found' };
    } catch (error) {
      toast.error('Profile update failed');
      return { success: false, message: 'Profile update failed' };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isManager: user?.role === 'manager',
    isEmployee: user?.role === 'employee'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
