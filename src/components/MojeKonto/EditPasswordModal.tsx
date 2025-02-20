import React, { useState } from 'react';

interface EditPasswordModalProps {
  onClose: () => void;
  onUpdateSuccess: (message: string) => void; // Callback to display success message
}

const EditPasswordModal: React.FC<EditPasswordModalProps> = ({
  onClose,
  onUpdateSuccess,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isPasswordValid = formData.newPassword.length >= 8;

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
      alert('Wszystkie pola są wymagane.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      alert('Hasła się nie zgadzają.');
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
        throw new Error(errorData.message || 'Nie udało się zmienić hasła.');
      }

      onUpdateSuccess('Twoje hasło zostało zmienione.'); // Pass success message
      onClose(); // Close modal
    } catch (error: any) {
      console.error('Błąd przy zmianie hasła:', error.message);
      alert('Wystąpił błąd przy zmianie hasła.');
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(54, 49, 50, 0.4)' }}
    >
      <div
        className="bg-beige-light mx-4 md:mx-0 rounded-[25px] w-full max-w-[800px] relative"
        style={{ padding: '40px 32px', maxWidth: '650px' }}
      >
        {/* Title and Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Zmień Hasło</h2>
          <button onClick={onClose}>
            <img
              src="/icons/close-button.svg"
              alt="Close"
              className="w-3 h-3"
              style={{ filter: 'invert(0)' }}
            />
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-6">
          {/* Current Password */}
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onFocus={() => setFocusedField('currentPassword')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              placeholder="Obecne hasło"
            />
            <img
              src="/icons/show-pass.svg"
              alt="Show Password"
              className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            />
          </div>

          {/* New Password with Validation */}
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onFocus={() => setFocusedField('newPassword')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              placeholder="Nowe hasło"
            />
            <img
              src="/icons/show-pass.svg"
              alt="Show Password"
              className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            />
            <div className="flex items-center mt-2">
              <img
                src={
                  isPasswordValid ? '/icons/okey-icon.svg' : '/icons/wrong.svg'
                }
                alt={isPasswordValid ? 'Valid' : 'Invalid'}
                className="w-4 h-4 mr-2"
              />
              <p
                className={`text-sm font-light ${
                  isPasswordValid ? 'text-black' : 'text-black'
                }`}
              >
                {isPasswordValid
                  ? 'Twoje hasło ma 8 znaków, jest dobre.'
                  : 'Twoje hasło musi mieć co najmniej 8 znaków.'}
              </p>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
              onChange={handleChange}
              className="w-full border-b border-black p-2 bg-beige-light focus:outline-none placeholder:font-light placeholder:text-black"
              placeholder="Powtórz nowe hasło"
            />
            <img
              src="/icons/show-pass.svg"
              alt="Show Password"
              className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="w-[100%] md:w-[25%] py-3 font-medium bg-black text-white rounded-full hover:bg-gray-800 transition-all"
          >
            Zmień hasło
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPasswordModal;
