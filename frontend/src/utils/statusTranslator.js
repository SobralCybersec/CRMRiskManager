export const translateStatus = (status) => {
  const statusMap = {
    'ACTIVE': 'Seguro',
    'HIGH_RISK': 'Alto Risco',
    'OVERDUE': 'Atrasado'
  };
  
  return statusMap[status] || status;
};

export const getStatusColor = (status) => {
  const colorMap = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'HIGH_RISK': 'bg-yellow-100 text-yellow-800',
    'OVERDUE': 'bg-red-100 text-red-800'
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
};