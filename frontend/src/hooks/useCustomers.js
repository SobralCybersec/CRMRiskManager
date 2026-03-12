import { useState, useEffect } from 'react';
import api from '../services/api';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomerStatus = async (customerId) => {
    try {
      await api.get(`/customers/${customerId}`);
      await fetchCustomers();
    } catch (error) {
      throw new Error('Erro ao atualizar status');
    }
  };

  return {
    customers,
    loading,
    fetchCustomers,
    updateCustomerStatus
  };
};
