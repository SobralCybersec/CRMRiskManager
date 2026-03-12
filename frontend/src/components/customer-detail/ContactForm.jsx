import { useState } from 'react';

const ContactForm = ({ onSubmit }) => {
  const [contactType, setContactType] = useState('PHONE');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      alert('Por favor, adicione observações sobre o contato');
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit({ contactType, notes });
      setNotes('');
    } catch (error) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">Registrar Contato</h3>
      <div className="space-y-3">
        <select
          value={contactType}
          onChange={(e) => setContactType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="PHONE">Telefone</option>
          <option value="EMAIL">Email</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="VISIT">Visita</option>
        </select>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Observações do contato..."
          className="w-full border rounded px-3 py-2"
          rows="3"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {submitting ? 'Registrando...' : 'Registrar Contato'}
        </button>
      </div>
    </div>
  );
};

export default ContactForm;
