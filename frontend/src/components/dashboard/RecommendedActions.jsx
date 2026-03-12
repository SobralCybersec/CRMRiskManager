import { AlertTriangle, TrendingUp, Users, BarChart3 } from 'lucide-react';
import Card from '../ui/Card';

const RecommendedActions = ({ data, analytics }) => {
  const actions = [
    {
      icon: AlertTriangle,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      descColor: 'text-red-600',
      title: `Contatar ${data?.overduePayments || 0} clientes em atraso`,
      description: 'Prioridade alta'
    },
    {
      icon: TrendingUp,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      descColor: 'text-yellow-600',
      title: `Monitorar ${data?.highRiskCustomers || 0} clientes de alto risco`,
      description: 'Enviar alertas preventivos'
    },
    {
      icon: Users,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-600',
      title: 'Campanhas de retenção',
      description: 'Oferecer renegociação'
    }
  ];

  return (
    <Card className="slide-up" style={{ animationDelay: '100ms' }}>
      <Card.Header>
        <Card.Title>Ações Recomendadas</Card.Title>
        <Card.Description>
          Sugestões baseadas na análise de risco
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          {actions.map((action, index) => (
            <ActionCard key={index} {...action} index={index} />
          ))}
          
          {analytics?.risk_distribution && (
            <RiskDistributionCard analytics={analytics} />
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

const ActionCard = ({ icon: Icon, bgColor, iconColor, titleColor, descColor, title, description, index }) => (
  <div 
    className={`flex items-start gap-3 p-4 ${bgColor} dark:bg-opacity-20 rounded-lg border border-gray-200 dark:border-gray-700 fade-in`}
    style={{ animationDelay: `${index * 100}ms` }}
  >
    <div className="flex-shrink-0">
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${titleColor} dark:text-gray-100`}>{title}</p>
      <p className={`text-xs ${descColor} dark:text-gray-400 mt-1`}>{description}</p>
    </div>
  </div>
);

const RiskDistributionCard = ({ analytics }) => (
  <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-opacity-20 rounded-lg border border-gray-200 dark:border-gray-700 fade-in">
    <div className="flex-shrink-0">
      <BarChart3 className="h-5 w-5 text-purple-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-purple-900 dark:text-gray-100">Distribuição de Risco</p>
      <p className="text-xs text-purple-600 dark:text-gray-400 mt-1">
        Alto: {analytics.risk_distribution.Alto || 0} | 
        Crítico: {analytics.risk_distribution.Crítico || 0}
      </p>
    </div>
  </div>
);

export default RecommendedActions;
