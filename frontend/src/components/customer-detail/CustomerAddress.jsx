const CustomerAddress = ({ customer }) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2">Endereço</h3>
    <div className="space-y-2 text-sm">
      <p><strong>Cidade:</strong> {customer.city || 'N/A'}</p>
      <p><strong>Estado:</strong> {customer.state || 'N/A'}</p>
      <p><strong>Endereço:</strong> {customer.address || 'N/A'}</p>
    </div>
  </div>
);

export default CustomerAddress;
