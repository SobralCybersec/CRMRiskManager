const CustomerPersonalInfo = ({ customer }) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2">Informações Pessoais</h3>
    <div className="space-y-2 text-sm">
      <p><strong>Nome:</strong> {customer.name}</p>
      <p><strong>CPF:</strong> {customer.cpf || 'N/A'}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Telefone:</strong> {customer.phone || 'N/A'}</p>
    </div>
  </div>
);

export default CustomerPersonalInfo;
