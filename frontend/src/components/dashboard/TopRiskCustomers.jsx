import { translateStatus, getStatusColor } from '../../utils/statusTranslator';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const TopRiskCustomers = ({ customers }) => {
  const topFiveCustomers = customers.slice(0, 5);

  return (
    <Card className="slide-up">
      <Card.Header>
        <Card.Title>Clientes com Maior Risco</Card.Title>
        <Card.Description>
          Lista dos clientes com maior probabilidade de inadimplência
        </Card.Description>
      </Card.Header>
      <Card.Content className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {topFiveCustomers.map((customer, index) => (
            <CustomerRiskItem key={customer.id} customer={customer} index={index} />
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

const CustomerRiskItem = ({ customer, index }) => {
  const formatRiskScore = (score) => (score * 100).toFixed(1);
  
  const getVariant = (status) => {
    const variantMap = {
      'ACTIVE': 'success',
      'HIGH_RISK': 'warning',
      'OVERDUE': 'danger'
    };
    return variantMap[status] || 'default';
  };

  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {customer.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {customer.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {formatRiskScore(customer.riskScore)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
          </div>
          <Badge variant={getVariant(customer.status)}>
            {translateStatus(customer.status)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TopRiskCustomers;
