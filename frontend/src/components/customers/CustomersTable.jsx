import { AlertTriangle } from 'lucide-react';
import { translateStatus, getStatusColor } from '../../utils/statusTranslator';

const CustomersTable = ({ customers, onCustomerClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <TableHeader />
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {customers.map((customer) => (
            <CustomerRow 
              key={customer.id} 
              customer={customer} 
              onCustomerClick={onCustomerClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHeader = () => (
  <thead className="bg-gray-50 dark:bg-gray-900">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Cliente
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Contato
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Score de Risco
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Status
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Ações
      </th>
    </tr>
  </thead>
);

const CustomerRow = ({ customer, onCustomerClick }) => {
  const handleClick = () => {
    onCustomerClick(customer.id);
  };

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <CustomerInfo customer={customer} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ContactInfo email={customer.email} phone={customer.phone} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RiskScore score={customer.riskScore} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={customer.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <CustomerActions onClick={handleClick} />
      </td>
    </tr>
  );
};

const CustomerInfo = ({ customer }) => {
  const getAvatarUrl = () => {
    if (customer.avatarUrl) {
      return `http://localhost:8080${customer.avatarUrl}`;
    }
    return null;
  };

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
          {getAvatarUrl() ? (
            <img src={getAvatarUrl()} alt={customer.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {customer.name.charAt(0)}
            </span>
          )}
        </div>
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {customer.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          ID: {customer.id}
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ email, phone }) => (
  <div>
    <div className="text-sm text-gray-900 dark:text-gray-100">{email}</div>
    <div className="text-sm text-gray-500 dark:text-gray-400">{phone}</div>
  </div>
);

const RiskScore = ({ score }) => {
  const getRiskColor = () => {
    if (score > 0.8) {
      return 'text-red-600';
    }
    
    if (score > 0.6) {
      return 'text-yellow-600';
    }
    
    return 'text-green-600';
  };

  const getProgressBarColor = () => {
    if (score > 0.8) {
      return 'bg-red-500';
    }
    
    if (score > 0.6) {
      return 'bg-yellow-500';
    }
    
    return 'bg-green-500';
  };

  return (
    <div>
      <div className={`text-sm font-medium ${getRiskColor()}`}>
        {(score * 100).toFixed(1)}%
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
        <div
          className={`h-2 rounded-full ${getProgressBarColor()}`}
          style={{ width: `${score * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
    {status === 'HIGH_RISK' && <AlertTriangle className="w-3 h-3 mr-1" />}
    {translateStatus(status)}
  </span>
);

const CustomerActions = ({ onClick }) => (
  <div>
    <button 
      onClick={onClick}
      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
    >
      Ver Detalhes
    </button>
    <button 
      onClick={onClick}
      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
    >
      Contatar
    </button>
  </div>
);

export default CustomersTable;
