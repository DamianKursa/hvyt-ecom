import React, { useState } from 'react';

interface CreateAccountProps {
  onSave: (data: { password: string }) => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({ onSave }) => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    onSave({ password: value });

    if (value.length < 8) {
      setPasswordError('Hasło musi mieć co najmniej 8 znaków.');
    } else {
      setPasswordError('');
    }
  };

  return (
    <div className="rounded-[16px] bg-[#E1DFE080] my-6 p-[12px]">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div>
          <h3 className="text-[20px] font-semibold mb-2">Stwórz konto</h3>
          <p className="text-[18px]">I zaoszczędź przy kolejnym zamówieniu</p>
        </div>
        <div className="text-center">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className={`w-full border-b ${passwordError ? 'border-red-500' : 'border-black'} p-2 focus:outline-none placeholder:font-light placeholder:text-black bg-transparent`}
              placeholder="Hasło"
              required
            />
            <img
              src="/icons/show-pass.svg"
              alt="Show Password"
              className="absolute right-2 top-3 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-1">{passwordError}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
