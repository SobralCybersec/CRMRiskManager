import { useState } from 'react';
import { Users } from 'lucide-react';
import CustomerDetailModal from '../components/CustomerDetailModal';
import { useCustomers } from '../hooks/useCustomers';
import CustomersTable from '../components/customers/CustomersTable';
import CustomersFilters from '../components/customers/CustomersFilters';

const Customers = () => {
  const { customers, loading, fetchCustomers, updateCustomerStatus } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filterCustomers = () => {
    return customers.filter(customer => {
      const matchesSearch = matchesSearchTerm(customer, searchTerm);
      const matchesFilter = filterStatus === 'ALL' || customer.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const matchesSearchTerm = (customer, term) => {
    const lowerTerm = term.toLowerCase();
    return customer.name.toLowerCase().includes(lowerTerm) ||
           customer.email.toLowerCase().includes(lowerTerm);
  };

  const handleCustomerClick = async (customerId) => {
    await updateCustomerStatus(customerId);
    setSelectedCustomer(customerId);
  };

  const handleCloseModal = () => {
    setSelectedCustomer(null);
    fetchCustomers();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const filteredCustomers = filterCustomers();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Users className="w-6 h-6" />
          Clientes
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <CustomersFilters
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          onSearchChange={setSearchTerm}
          onFilterChange={setFilterStatus}
        />

        <CustomersTable
          customers={filteredCustomers}
          onCustomerClick={handleCustomerClick}
        />
      </div>

      {selectedCustomer && (
        <CustomerDetailModal 
          customerId={selectedCustomer} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default Customers;