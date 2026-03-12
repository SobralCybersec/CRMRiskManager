import { Search, Filter } from 'lucide-react';

const CustomersFilters = ({ searchTerm, filterStatus, onSearchChange, onFilterChange }) => {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row gap-4">
        <SearchInput value={searchTerm} onChange={onSearchChange} />
        <StatusFilter value={filterStatus} onChange={onFilterChange} />
      </div>
    </div>
  );
};

const SearchInput = ({ value, onChange }) => (
  <div className="flex-1 relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
    <input
      type="text"
      placeholder="Buscar por nome ou email..."
      className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const StatusFilter = ({ value, onChange }) => (
  <div className="relative">
    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
    <select
      className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ALL">Todos os Status</option>
      <option value="ACTIVE">Seguro</option>
      <option value="HIGH_RISK">Alto Risco</option>
      <option value="OVERDUE">Atrasado</option>
    </select>
  </div>
);

export default CustomersFilters;
