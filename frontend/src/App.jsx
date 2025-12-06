import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import AdminPanel from './pages/AdminPanel';
import Statistics from './pages/Statistics';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/customers" 
          element={isAuthenticated ? <Layout><Customers /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/admin" 
          element={isAuthenticated ? <Layout><AdminPanel /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/statistics" 
          element={isAuthenticated ? <Layout><Statistics /></Layout> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
      </Routes>
    </Router>
  );
}

export default App;