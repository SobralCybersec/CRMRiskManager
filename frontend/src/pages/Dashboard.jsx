import { useState, useEffect } from 'react';
import { dashboardService } from '../services/api';
import { AlertTriangle, Users, DollarSign, TrendingUp } from 'lucide-react';
import { translateStatus, getStatusColor } from '../utils/statusTranslator';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import TopRiskCustomers from '../components/dashboard/TopRiskCustomers';
import RecommendedActions from '../components/dashboard/RecommendedActions';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchAnalytics();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const dashboardData = await dashboardService.getDashboard();
      setData(dashboardData);
    } catch (error) {
      setData(createEmptyDashboard());
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    
    try {
      const response = await fetch('http://localhost:8001/analytics/dashboard-data');
      const analyticsData = await response.json();
      setAnalytics(analyticsData);
    } catch (error) {
      setAnalytics(null);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const createEmptyDashboard = () => ({
    totalCustomers: 0,
    overduePayments: 0,
    highRiskCustomers: 0,
    topRiskCustomers: []
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader 
        analytics={analytics}
        loadingAnalytics={loadingAnalytics}
        onRefreshAnalytics={fetchAnalytics}
      />

      <DashboardMetrics data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopRiskCustomers customers={data?.topRiskCustomers || []} />
        <RecommendedActions data={data} analytics={analytics} />
      </div>
    </div>
  );
};

export default Dashboard;