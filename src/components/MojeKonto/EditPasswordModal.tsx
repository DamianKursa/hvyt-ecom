import React, { useState } from 'react';

interface EditPasswordModalProps {
  onClose: () => void;
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      alert('All fields are required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/moje-konto/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }

      const result = await response.json();
      console.log('Password changed successfully:', result);
      alert('Password updated successfully');
      onClose();
    } catch (error: any) {
      console.error('Error changing password:', error.message);
      alert('Error changing password');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-[25px] p-8 w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Zmień Hasło</h2>
        <div className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Obecne hasło"
            className="w-full border rounded-md p-2"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Nowe hasło"
            className="w-full border rounded-md p-2"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Powtórz nowe hasło"
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
          >
            Zmień hasło
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPasswordModal;
