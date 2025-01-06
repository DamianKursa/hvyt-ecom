import React, { useState } from 'react';
import EditContactModal from './EditContactModal';
import EditPasswordModal from './EditPasswordModal';

interface MojeDaneProps {
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
}

const MojeDane: React.FC<MojeDaneProps> = ({ user, onUpdate }) => {
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);

  return (
    <div className="rounded-[25px] bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-[#661F30]">Moje dane</h2>
      <div className="space-y-6">
        {/* Contact Details */}
        <div>
          <h3 className="text-lg font-medium">Dane kontaktowe</h3>
          <p>
            {user.firstName} {user.lastName}
          </p>
          <p>{user.email}</p>
          <button
            onClick={() => setIsEditContactModalOpen(true)}
            className="mt-2 text-[#661F30] flex items-center"
          >
            Edytuj Dane kontaktowe
            <img src="/icons/edit.svg" alt="Edytuj" className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Password */}
        <div>
          <h3 className="text-lg font-medium">Hasło</h3>
          <p>********</p>
          <button
            onClick={() => setIsEditPasswordModalOpen(true)}
            className="mt-2 text-[#661F30] flex items-center"
          >
            Edytuj Hasło
            <img src="/icons/edit.svg" alt="Edytuj" className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Delete Account */}
        <div>
          <button className="text-red-500">Usuń konto</button>
        </div>
      </div>

      {/* Modals */}
      {isEditContactModalOpen && (
        <EditContactModal
          user={user}
          onUpdate={onUpdate}
          onClose={() => setIsEditContactModalOpen(false)}
        />
      )}
      {isEditPasswordModalOpen && (
        <EditPasswordModal onClose={() => setIsEditPasswordModalOpen(false)} />
      )}
    </div>
  );
};

export default MojeDane;
