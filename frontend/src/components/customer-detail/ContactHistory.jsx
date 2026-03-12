const ContactHistory = ({ history }) => (
  <div>
    <h3 className="font-semibold text-gray-700 mb-2">Histórico de Contatos</h3>
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {history?.length > 0 ? (
        history.map((contact, idx) => (
          <ContactHistoryItem key={idx} contact={contact} />
        ))
      ) : (
        <p className="text-gray-500 text-sm">Nenhum contato registrado</p>
      )}
    </div>
  </div>
);

const ContactHistoryItem = ({ contact }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="bg-gray-50 p-3 rounded border">
      <div className="flex justify-between">
        <span className="font-medium">{contact.contactType}</span>
        <span className="text-xs text-gray-500">{formatDate(contact.contactedAt)}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1">{contact.notes}</p>
      <p className="text-xs text-gray-500 mt-1">Por: {contact.contactedBy}</p>
    </div>
  );
};

export default ContactHistory;
