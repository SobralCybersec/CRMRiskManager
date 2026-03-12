import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';
import CustomerPersonalInfo from './customer-detail/CustomerPersonalInfo';
import CustomerAddress from './customer-detail/CustomerAddress';
import RiskReasons from './customer-detail/RiskReasons';
import ContactForm from './customer-detail/ContactForm';
import ContactHistory from './customer-detail/ContactHistory';

const CustomerDetailModal = ({ customerId, onClose }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await api.get(`/customers/${customerId}`);
      setCustomer(response.data);
    } catch (error) {
      alert('Erro ao carregar detalhes do cliente');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (contactData) => {
    try {
      await api.post('/customers/contact', {
        customerId,
        ...contactData
      });
      await fetchCustomerDetails();
    } catch (error) {
      throw new Error('Erro ao registrar contato');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <ModalHeader onClose={onClose} />

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <CustomerPersonalInfo customer={customer} />
            <CustomerAddress customer={customer} />
          </div>

          <RiskReasons reasons={customer.riskReasons} />
          <ContactForm onSubmit={handleContactSubmit} />
          <ContactHistory history={customer.contactHistory} />
        </div>
      </div>
    </div>
  );
};

const ModalHeader = ({ onClose }) => (
  <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
    <h2 className="text-xl font-bold">Detalhes do Cliente</h2>
    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
      <X className="w-6 h-6" />
    </button>
  </div>
);

export default CustomerDetailModal;
