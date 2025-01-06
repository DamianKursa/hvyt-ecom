import React, { useState, useEffect } from 'react';

interface EditContactModalProps {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  onUpdate: (updatedUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }) => Promise<void>;
  onClose: () => void;
}

const EditContactModal: React.FC<EditContactModalProps> = ({
  user,
  onUpdate,
  onClose,
}) => {
  const [formData, setFormData] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ensure `user` has a valid ID when the modal opens
    if (!user.id) {
      setError('User ID is missing');
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!formData.id) {
        throw new Error('User ID is missing');
      }
      await onUpdate(formData);
      onClose();
    } catch (error) {
      setError('Failed to update user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-[25px] p-8 w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Edytuj Dane Kontaktowe</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Imię"
            className="w-full border rounded-md p-2"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Nazwisko"
            className="w-full border rounded-md p-2"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border rounded-md p-2"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button onClick={onClose} className="text-gray-500">
            Anuluj
          </button>
          <button
            onClick={handleSave}
            className="bg-[#661F30] text-white px-4 py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Zapisywanie...' : 'Zapisz'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContactModal;
