

"use client"

import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export const useAuth = () => {

  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { setUser } = context;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', userData);
      setUser(response.data.user);
      setLoading(false);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      setLoading(false);
      return { success: false, error: error.response?.data?.message || 'An error occurred during registration' };
    }
  }; 
  
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, refreshToken } = response.data;
  
      // Store the tokens in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refreshToken);
  
      // Fetch user data using the token
      const userResponse = await axios.get('/api/auth/login/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Set the user data in context
      setUser(userResponse.data.user);
  
      setLoading(false);
      return { success: true, data: { token, refreshToken } };
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during login');
      setLoading(false);
      return { success: false, error: error.response?.data?.message || 'An error occurred during login' };
    }
  };
  
  

  return { register, login, loading, error };
};
