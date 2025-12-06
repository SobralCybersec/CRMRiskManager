import { useState, useEffect } from 'react';
import { Database, Users, Trash2, Edit, Plus } from 'lucide-react';
import api from '../services/api';
import { translateStatus, getStatusColor } from '../utils/statusTranslator';

const AdminPanel = () => {
  const [data, setData] = useState({ customers: [], users: [] });
  const [activeTab, setActiveTab] = useState('customers');
  const [loading, setLoading] = useState(true);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/data');
      setData(response.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await api.delete(`/admin/${type}/${id}`);
      fetchData();
    } catch (error) {
      alert('Erro ao excluir');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = null;
      
      if (avatarFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', avatarFile);
        const uploadResponse = await api.post('/upload/avatar', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        avatarUrl = uploadResponse.data.url;
      }

      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        cpf: formData.cpf || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        status: formData.status || 'ACTIVE',
        riskScore: formData.riskScore || 0.0,
        enrollmentDate: formData.enrollmentDate || new Date().toISOString().split('T')[0],
        avatarUrl: avatarUrl
      };
      await api.post('/admin/customers', customerData);
      setShowCustomerForm(false);
      setFormData({});
      setAvatarFile(null);
      setAvatarPreview(null);
      fetchData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar cliente: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        passwordHash: formData.password,
        role: formData.role || 'USER'
      };
      await api.post('/admin/users', userData);
      setShowUserForm(false);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar usuário: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      let avatarUrl = editingCustomer.avatarUrl;
      
      if (avatarFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', avatarFile);
        const uploadResponse = await api.post('/upload/avatar', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        avatarUrl = uploadResponse.data.url;
      }

      const customerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        cpf: formData.cpf || '',
        address: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        status: formData.status,
        riskScore: formData.riskScore / 100,
        enrollmentDate: formData.enrollmentDate,
        avatarUrl: avatarUrl
      };
      
      await api.put(`/admin/customers/${editingCustomer.id}`, customerData);
      setEditingCustomer(null);
      setFormData({});
      setAvatarFile(null);
      setAvatarPreview(null);
      fetchData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar cliente: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="flex justify-center p-8">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6" />
          Painel Administrativo
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 flex justify-between items-center px-6 py-3">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('customers')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'customers'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Clientes ({data.customers.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Usuários ({data.users.length})
            </button>
          </nav>
          <button
            onClick={() => activeTab === 'customers' ? setShowCustomerForm(true) : setShowUserForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar {activeTab === 'customers' ? 'Cliente' : 'Usuário'}
          </button>
        </div>

        <div className="p-6">
          {(showCustomerForm || editingCustomer) && (
            <div className="mb-6 bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-4">{editingCustomer ? 'Editar Cliente' : 'Novo Cliente'}</h3>
              <form onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer} className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                      Escolher Foto
                      <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Opcional - Máx 5MB</p>
                  </div>
                </div>
                <input required placeholder="Nome" value={formData.name || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input required type="email" placeholder="Email" value={formData.email || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input placeholder="Telefone" value={formData.phone || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                <input placeholder="CPF" value={formData.cpf || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, cpf: e.target.value})} />
                <input placeholder="Endereço" value={formData.address || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, address: e.target.value})} />
                <input placeholder="Cidade" value={formData.city || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <input placeholder="Estado" value={formData.state || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, state: e.target.value})} />
                <input type="date" placeholder="Data de Cadastro" value={formData.enrollmentDate || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, enrollmentDate: e.target.value})} />
                <input type="number" min="0" max="100" step="0.1" placeholder="Score de Risco (%)" value={formData.riskScore || ''} className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, riskScore: parseFloat(e.target.value)})} />
                <select className="border rounded px-3 py-2" value={formData.status || 'ACTIVE'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="ACTIVE">Seguro</option>
                  <option value="HIGH_RISK">Alto Risco</option>
                  <option value="OVERDUE">Atrasado</option>
                </select>
                <div className="col-span-2 flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    {editingCustomer ? 'Atualizar' : 'Salvar'}
                  </button>
                  <button type="button" onClick={() => {
                    setShowCustomerForm(false);
                    setEditingCustomer(null);
                    setFormData({});
                    setAvatarFile(null);
                    setAvatarPreview(null);
                  }} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {showUserForm && (
            <div className="mb-6 bg-gray-50 p-4 rounded border">
              <h3 className="font-semibold mb-4">Novo Usuário</h3>
              <form onSubmit={handleCreateUser} className="grid grid-cols-2 gap-4">
                <input required placeholder="Nome" className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input required type="email" placeholder="Email" className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <input required type="password" placeholder="Senha" className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                <select className="border rounded px-3 py-2" onChange={(e) => setFormData({...formData, role: e.target.value})}>
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="col-span-2 flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Salvar</button>
                  <button type="button" onClick={() => setShowUserForm(false)} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avatar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telefone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CPF</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risco</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {customer.avatarUrl ? (
                            <img src={`http://localhost:8080${customer.avatarUrl}`} alt={customer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-sm font-medium text-gray-700">{customer.name.charAt(0)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.cpf}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.enrollmentDate ? new Date(customer.enrollmentDate).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(customer.riskScore * 100).toFixed(1)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(customer.status)}`}>
                          {translateStatus(customer.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-900 p-1 border border-blue-300 rounded" 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Editando cliente:', customer);
                              setEditingCustomer(customer);
                              setFormData({
                                ...customer,
                                riskScore: customer.riskScore * 100,
                                enrollmentDate: customer.enrollmentDate
                              });
                              setShowCustomerForm(false);
                              console.log('Estado editingCustomer definido:', customer);
                            }}
                            title="Editar cliente"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 p-1" 
                            onClick={() => handleDelete('customers', customer.id)}
                            title="Excluir cliente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDelete('users', user.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
