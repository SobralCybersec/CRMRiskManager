import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { BarChart3, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import html2canvas from 'html2canvas';
import { translateStatus, getStatusColor } from '../utils/statusTranslator';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

export default function Statistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/admin/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Erro ao carregar estatísticas</p>
      </div>
    );
  }

  const riskDistributionData = {
    labels: ['Baixo', 'Médio', 'Alto', 'Crítico'],
    datasets: [{
      data: [
        stats.riskDistribution.LOW || 0,
        stats.riskDistribution.MEDIUM || 0,
        stats.riskDistribution.HIGH || 0,
        stats.riskDistribution.CRITICAL || 0
      ],
      backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#7C2D12'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const statusDistributionData = {
    labels: Object.keys(stats.statusDistribution),
    datasets: [{
      label: 'Clientes por Status',
      data: Object.values(stats.statusDistribution),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      borderColor: ['#2563EB', '#059669', '#D97706', '#DC2626'],
      borderWidth: 1
    }]
  };

  const monthlyData = {
    labels: Object.keys(stats.customersByMonth).sort(),
    datasets: [{
      label: 'Novos Clientes',
      data: Object.keys(stats.customersByMonth).sort().map(month => stats.customersByMonth[month]),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Estatísticas do Sistema</h1>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totals.customers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Usuários</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totals.users}</p>
            </div>
            <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pagamentos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totals.payments}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Contatos</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totals.contacts}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição de Risco */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Distribuição por Nível de Risco</h3>
          <div className="h-64">
            <Doughnut data={riskDistributionData} options={chartOptions} />
          </div>
        </div>

        {/* Status dos Clientes */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Status dos Clientes</h3>
          <div className="h-64">
            <Bar data={statusDistributionData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Gráfico de Linha - Novos Clientes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Novos Clientes (Últimos 6 Meses)</h3>
        <div className="h-64">
          <Line data={monthlyData} options={chartOptions} />
        </div>
      </div>

      {/* Top Clientes de Risco */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Top 5 Clientes com Maior Risco</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Score de Risco</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nível</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {stats.topRiskCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {(customer.riskScore * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                      {translateStatus(customer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.riskScore >= 0.8 ? 'bg-red-100 text-red-800' :
                      customer.riskScore >= 0.6 ? 'bg-orange-100 text-orange-800' :
                      customer.riskScore >= 0.4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {customer.riskScore >= 0.8 ? 'CRÍTICO' :
                       customer.riskScore >= 0.6 ? 'ALTO' :
                       customer.riskScore >= 0.4 ? 'MÉDIO' : 'BAIXO'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Score Médio por Status */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Score Médio por Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(stats.avgScoreByStatus).map(([status, avgScore]) => (
            <div key={status} className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{status}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{(avgScore * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}