import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { AlertTriangle, Users, DollarSign, TrendingUp, Download, BarChart3, FileText } from 'lucide-react';
import { translateStatus, getStatusColor } from '../utils/statusTranslator';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    const mockData = {
      totalCustomers: 5,
      overduePayments: 1,
      highRiskCustomers: 3,
      topRiskCustomers: [
        { id: 5, name: 'Carlos Souza', email: 'carlos@email.com', riskScore: 0.90, status: 'OVERDUE' },
        { id: 1, name: 'João Silva', email: 'joao@email.com', riskScore: 0.85, status: 'HIGH_RISK' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@email.com', riskScore: 0.75, status: 'HIGH_RISK' },
        { id: 2, name: 'Maria Santos', email: 'maria@email.com', riskScore: 0.45, status: 'ACTIVE' },
        { id: 4, name: 'Ana Lima', email: 'ana@email.com', riskScore: 0.25, status: 'ACTIVE' },
      ]
    };

    const fetchData = async () => {
      try {
        const dashboardData = await dashboardService.getDashboard();
        console.log('Dashboard data:', dashboardData);
        setData(dashboardData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
        setData({
          totalCustomers: 0,
          overduePayments: 0,
          highRiskCustomers: 0,
          topRiskCustomers: []
        });
        setLoading(false);
      }
    };

    fetchData();
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoadingAnalytics(true);
      const response = await fetch('http://localhost:8001/analytics/dashboard-data');
      const analyticsData = await response.json();
      console.log('Analytics data:', analyticsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Erro ao buscar analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };



  const viewRiskSummary = async () => {
    try {
      const response = await fetch('http://localhost:8001/reports/risk-summary');
      const summary = await response.json();
      
      const reportWindow = window.open('', '_blank', 'width=800,height=600');
      reportWindow.document.write(`
        <html>
          <head><title>Relatório de Risco</title></head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>📊 Relatório de Análise de Risco</h1>
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
      `);
    } catch (error) {
      alert('Erro ao gerar relatório: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botões de Analytics */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">📊 Analytics & Relatórios</h2>
          <div className="flex gap-2">
            <button 
              onClick={() => window.open('http://localhost:8001/export/customers-excel')}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2"
              title="Baixar relatório formatado em Excel"
            >
              <Download className="w-4 h-4" />
              📈 Excel
            </button>
            <button 
              onClick={viewRiskSummary}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Relatório de Risco
            </button>
            <button 
              onClick={fetchAnalytics}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2"
              disabled={loadingAnalytics}
            >
              <BarChart3 className="w-4 h-4" />
              {loadingAnalytics ? 'Carregando...' : 'Atualizar Analytics'}
            </button>
            <button 
              onClick={() => {
                window.open('/statistics', '_blank');
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              title="Abrir página de estatísticas para captura"
            >
              📊 Estatísticas
            </button>
          </div>
        </div>
        
        {/* Mostrar dados de analytics se disponível */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-3 rounded">
              <h3 className="font-medium text-blue-900">Score Médio de Risco</h3>
              <p className="text-2xl font-bold text-blue-600">{(analytics.average_risk_score * 100).toFixed(1)}%</p>
            </div>
            <div className="bg-red-50 p-3 rounded">
              <h3 className="font-medium text-red-900">Clientes Alto Risco</h3>
              <p className="text-2xl font-bold text-red-600">{analytics.high_risk_customers}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <h3 className="font-medium text-green-900">Última Análise</h3>
              <p className="text-sm text-green-600">{new Date(analytics.generated_at).toLocaleString('pt-BR')}</p>
            </div>
          </div>
        )}
      </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total de Clientes
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data?.totalCustomers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pagamentos em Atraso
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data?.overduePayments || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Clientes Alto Risco
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data?.highRiskCustomers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Taxa de Risco
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {data?.totalCustomers > 0 
                          ? ((data.highRiskCustomers / data.totalCustomers) * 100).toFixed(1)
                          : 0}%
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Clientes com Maior Risco
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Lista dos clientes com maior probabilidade de inadimplência
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {data?.topRiskCustomers?.slice(0, 5).map((customer) => (
                  <li key={customer.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {customer.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-sm text-gray-900 mr-4">
                          Score: {(customer.riskScore * 100).toFixed(1)}%
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {translateStatus(customer.status)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Ações Recomendadas
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Sugestões baseadas na análise de risco
                </p>
              </div>
              <div className="px-4 py-4 space-y-3">
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Contatar {data?.overduePayments || 0} clientes em atraso</p>
                    <p className="text-xs text-red-600">Prioridade alta</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-yellow-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Monitorar {data?.highRiskCustomers || 0} clientes de alto risco</p>
                    <p className="text-xs text-yellow-600">Enviar alertas preventivos</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Campanhas de retenção</p>
                    <p className="text-xs text-blue-600">Oferecer renegociação</p>
                  </div>
                </div>
                
                {/* Mostrar recomendações do analytics se disponível */}
                {analytics?.risk_distribution && (
                  <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">Distribuição de Risco</p>
                      <p className="text-xs text-purple-600">
                        Alto: {analytics.risk_distribution.Alto || 0} | 
                        Crítico: {analytics.risk_distribution.Crítico || 0}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  );
};

export default Dashboard;