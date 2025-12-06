import { useState, useEffect } from 'react';
import { authService } from '../services/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      window.location.href = '/dashboard';
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Email ou senha inválidos' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return { isAuthenticated, login, logout, loading };
};