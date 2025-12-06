import { X, Phone, Mail, MapPin, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const CustomerDetailModal = ({ customerId, onClose }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactType, setContactType] = useState('PHONE');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      console.log('Buscando detalhes do cliente:', customerId);
      const response = await api.get(`/customers/${customerId}`);
      console.log('Detalhes recebidos:', response.data);
      setCustomer(response.data);
    } catch (error) {
      console.error('Erro ao carregar detalhes:', error);
      console.error('Erro completo:', error.response?.data);
      alert('Erro ao carregar detalhes do cliente: ' + (error.response?.data?.message || error.message));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    try {
      console.log('Registrando contato para:', customerId);
      await api.post('/customers/contact', {
        customerId,
        contactType,
        notes
      });
      setNotes('');
      fetchCustomerDetails();
    } catch (error) {
      console.error('Erro ao registrar contato:', error);
      alert('Erro ao registrar contato: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">Carregando...</div>;
  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalhes do Cliente</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Informações Pessoais</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Nome:</strong> {customer.name}</p>
                <p><strong>CPF:</strong> {customer.cpf || 'N/A'}</p>
                <p><strong>Email:</strong> {customer.email}</p>
                <p><strong>Telefone:</strong> {customer.phone || 'N/A'}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Endereço</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Cidade:</strong> {customer.city || 'N/A'}</p>
                <p><strong>Estado:</strong> {customer.state || 'N/A'}</p>
                <p><strong>Endereço:</strong> {customer.address || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Motivos de Risco
            </h3>
            <div className="space-y-2">
              {customer.riskReasons?.length > 0 ? (
                customer.riskReasons.map((reason, idx) => (
                  <div key={idx} className="bg-red-50 p-3 rounded border border-red-200">
                    <p className="font-medium text-red-800">{reason.reason}</p>
                    <p className="text-sm text-red-600">{reason.description}</p>
                    <p className="text-xs text-red-500 mt-1">Impacto: {(reason.impactScore * 100).toFixed(0)}%</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhum motivo de risco registrado</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Registrar Contato</h3>
            <div className="space-y-3">
              <select
                value={contactType}
                onChange={(e) => setContactType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="PHONE">Telefone</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="VISIT">Visita</option>
              </select>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações do contato..."
                className="w-full border rounded px-3 py-2"
                rows="3"
              />
              <button
                onClick={handleContact}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Registrar Contato
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Histórico de Contatos</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {customer.contactHistory?.length > 0 ? (
                customer.contactHistory.map((contact, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border">
                    <div className="flex justify-between">
                      <span className="font-medium">{contact.contactType}</span>
                      <span className="text-xs text-gray-500">{new Date(contact.contactedAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{contact.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">Por: {contact.contactedBy}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhum contato registrado</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailModal;
