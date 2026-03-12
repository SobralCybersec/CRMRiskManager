import { Users, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';

const DashboardMetrics = ({ data }) => {
  const calculateRiskRate = () => {
    if (!data?.totalCustomers || data.totalCustomers === 0) {
      return 0;
    }
    return ((data.highRiskCustomers / data.totalCustomers) * 100).toFixed(1);
  };

  const metrics = [
    {
      title: 'Total de Clientes',
      value: data?.totalCustomers || 0,
      icon: Users,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Pagamentos em Atraso',
      value: data?.overduePayments || 0,
      icon: DollarSign,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Clientes Alto Risco',
      value: data?.highRiskCustomers || 0,
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Taxa de Risco',
      value: `${calculateRiskRate()}%`,
      icon: TrendingUp,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} index={index} />
      ))}
    </div>
  );
};

const MetricCard = ({ title, value, icon: Icon, iconColor, bgColor, index }) => (
  <Card hover className="animate-in" style={{ animationDelay: `${index * 100}ms` }}>
    <Card.Content className="py-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </div>
        <div className={`${bgColor} dark:bg-opacity-20 p-3 rounded-xl`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
      </div>
    </Card.Content>
  </Card>
);

export default DashboardMetrics;
