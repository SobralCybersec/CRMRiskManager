import { useState, useEffect } from 'react';
import { Search, Filter, AlertTriangle } from 'lucide-react';
import CustomerDetailModal from '../components/CustomerDetailModal';
import api from '../services/api';
import { translateStatus, getStatusColor } from '../utils/statusTranslator';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get('/customers');
      console.log('Clientes carregados:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const atualizarStatusDoCliente = async (customerId) => {
    try {
      await api.get(`/customers/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'ALL' || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });



  const getRiskColor = (score) => {
    if (score > 0.8) return 'text-red-600';
    if (score > 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="ALL">Todos os Status</option>
                <option value="ACTIVE">Seguro</option>
                <option value="HIGH_RISK">Alto Risco</option>
                <option value="OVERDUE">Atrasado</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score de Risco
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                          {customer.avatarUrl ? (
                            <img src={`http://localhost:8080${customer.avatarUrl}`} alt={customer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-gray-700">
                              {customer.name.charAt(0)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {customer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getRiskColor(customer.riskScore)}`}>
                      {(customer.riskScore * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className={`h-2 rounded-full ${
                          customer.riskScore > 0.8 ? 'bg-red-500' :
                          customer.riskScore > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${customer.riskScore * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                      {customer.status === 'HIGH_RISK' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {translateStatus(customer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => {
                        console.log('Abrindo modal para cliente:', customer.id);
                        atualizarStatusDoCliente(customer.id);
                        setSelectedCustomer(customer.id);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      onClick={() => {
                        console.log('Abrindo contato para cliente:', customer.id);
                        setSelectedCustomer(customer.id);
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Contatar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailModal 
          customerId={selectedCustomer} 
          onClose={() => {
            setSelectedCustomer(null);
            fetchCustomers();
          }} 
        />
      )}
    </div>
  );
};

export default Customers;