import { Download, BarChart3, FileText, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const DashboardHeader = ({ analytics, loadingAnalytics, onRefreshAnalytics }) => {
  const handleExportExcel = () => {
    window.open('http://localhost:8001/export/customers-excel');
  };

  const handleViewRiskSummary = async () => {
    try {
      const response = await fetch('http://localhost:8001/reports/risk-summary');
      const summary = await response.json();
      openRiskReportWindow(summary);
    } catch (error) {
      alert('Erro ao gerar relatório: ' + error.message);
    }
  };

  const openRiskReportWindow = (summary) => {
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    reportWindow.document.write(generateReportHTML(summary));
  };

  const generateReportHTML = (summary) => `
    <html>
      <head><title>Relatório de Risco</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Relatório de Análise de Risco</h1>
        <h2>Resumo Executivo</h2>
        <ul>
          <li>Total de Clientes: ${summary.summary.total_customers}</li>
          <li>Score Médio: ${(summary.summary.average_score * 100).toFixed(1)}%</li>
          <li>Risco Crítico: ${summary.summary.critical_risk} clientes</li>
          <li>Alto Risco: ${summary.summary.high_risk} clientes</li>
        </ul>
        <h2>Top 5 Clientes de Maior Risco</h2>
        <table border="1" style="border-collapse: collapse; width: 100%;">
          <tr><th>Nome</th><th>Email</th><th>Score</th><th>Status</th></tr>
          ${summary.top_risk_customers.map(c => 
            `<tr><td>${c.name}</td><td>${c.email}</td><td>${(c.riskScore * 100).toFixed(1)}%</td><td>${c.status}</td></tr>`
          ).join('')}
        </table>
        <h2>Recomendações</h2>
        <ul>
          ${summary.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
        <p><small>Gerado em: ${summary.generated_at}</small></p>
      </body>
    </html>
  `;

  const handleOpenStatistics = () => {
    window.open('/statistics', '_blank');
  };

  return (
    <Card className="animate-in">
      <Card.Content className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics e Relatórios</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize e exporte dados do sistema</p>
          </div>
          <ActionButtons
            onExportExcel={handleExportExcel}
            onViewRiskSummary={handleViewRiskSummary}
            onRefreshAnalytics={onRefreshAnalytics}
            onOpenStatistics={handleOpenStatistics}
            loadingAnalytics={loadingAnalytics}
          />
        </div>
        
        {analytics && <AnalyticsMetrics analytics={analytics} />}
      </Card.Content>
    </Card>
  );
};

const ActionButtons = ({ 
  onExportExcel, 
  onViewRiskSummary, 
  onRefreshAnalytics, 
  onOpenStatistics,
  loadingAnalytics 
}) => (
  <div className="flex gap-2">
    <Button 
      onClick={onExportExcel}
      variant="secondary"
      size="sm"
      icon={Download}
    >
      Excel
    </Button>
    <Button 
      onClick={onViewRiskSummary}
      variant="secondary"
      size="sm"
      icon={FileText}
    >
      Relatório
    </Button>
    <Button 
      onClick={onRefreshAnalytics}
      variant="secondary"
      size="sm"
      icon={BarChart3}
      disabled={loadingAnalytics}
    >
      {loadingAnalytics ? 'Carregando...' : 'Atualizar'}
    </Button>
    <Button 
      onClick={onOpenStatistics}
      variant="secondary"
      size="sm"
      icon={TrendingUp}
    >
      Estatísticas
    </Button>
  </div>
);

const AnalyticsMetrics = ({ analytics }) => {
  const formatRiskScore = (score) => {
    if (!score && score !== 0) return '0.0';
    return (score * 100).toFixed(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        title="Score Médio de Risco"
        value={`${formatRiskScore(analytics.average_risk_score)}%`}
        bgColor="bg-blue-50"
        textColor="text-blue-900"
        valueColor="text-blue-600"
      />
      <MetricCard
        title="Clientes Alto Risco"
        value={analytics.high_risk_customers || 0}
        bgColor="bg-red-50"
        textColor="text-red-900"
        valueColor="text-red-600"
      />
      <MetricCard
        title="Última Análise"
        value={formatDate(analytics.generated_at)}
        bgColor="bg-green-50"
        textColor="text-green-900"
        valueColor="text-green-600"
        small
      />
    </div>
  );
};

const MetricCard = ({ title, value, bgColor, textColor, valueColor, small = false }) => (
  <div className={`${bgColor} dark:bg-opacity-20 p-4 rounded-lg border border-gray-200 dark:border-gray-700`}>
    <h3 className={`font-medium ${textColor} dark:text-gray-100 text-sm`}>{title}</h3>
    <p className={`${valueColor} dark:text-gray-300 font-bold mt-1 ${small ? 'text-sm' : 'text-2xl'}`}>
      {value}
    </p>
  </div>
);

export default DashboardHeader;
