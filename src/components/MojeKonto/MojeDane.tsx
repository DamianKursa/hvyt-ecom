import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!confirm('Czy na pewno chcesz usunąć konto?')) return;
    try {
      await fetch('/api/auth/delete-account', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/logowanie');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleContactUpdate = async (updatedUser: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    try {
      await onUpdate(updatedUser);
      setSuccessMessage('Twoje dane kontaktowe zostały zmienione.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Failed to update contact details:', error);
    }
  };

  const handlePasswordUpdate = () => {
    setSuccessMessage('Twoje hasło zostało zmienione.');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  return (
    <div className="rounded-[25px] bg-white  md:p-8 shadow-sm">
      <h2 className="text-2xl font-semibold p-4 md:p-0 md:mb-8 text-[#661F30]">Moje dane</h2>
      <div className="md:border rounded-[25px]">
        {/* Contact Details */}
        <div className="py-4 border-b border-t md:border-t-0 border-gray-300 flex items-start justify-between px-4">
          <div>
            <p className="text-[18px] font-semibold mb-[32px]">Dane kontaktowe</p>
            <p className="text-[18px]" >
              {user.firstName} {user.lastName}
            </p>
            <p className="text-[18px]">{user.email}</p>
          </div>
          <button
            onClick={() => setIsEditContactModalOpen(true)}
            className="text-black border border-black px-4 py-2 rounded-full flex items-center"
          >
            {/* On mobile show only "Edytuj", on larger screens show full text */}
            <span className="md:hidden">Edytuj</span>
            <span className="hidden md:inline">Edytuj Dane kontaktowe</span>
            <img src="/icons/edit.svg" alt="Edytuj" className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Password */}
        <div className="py-4 flex items-start border-b md:border-b-0 justify-between px-4">
          <div>
            <p className="text-[18px] font-semibold mb-[32px]">Hasło</p>
            <p className="text-[18px]">********</p>
          </div>
          <button
            onClick={() => setIsEditPasswordModalOpen(true)}
            className="text-black border border-black px-4 py-2 rounded-full flex items-center"
          >
            <span className="md:hidden">Edytuj</span>
            <span className="hidden md:inline">Edytuj Hasło</span>
            <img src="/icons/edit.svg" alt="Edytuj" className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="pb-12 md:pb-0 py-4 md:mt-8 px-4">
        <p className=" text-[18px] font-semibold mb-[32px]">Usuń konto</p>
        <button
          onClick={handleDeleteAccount}
          className="text-[18px] text-black underline font-medium"
        >
          Usuń konto
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-[#2A5E45] text-white px-4 py-2 rounded-lg mt-4 flex items-center">
          <img
            src="/icons/circle-check.svg"
            alt="Success"
            className="w-5 h-5 mr-2"
          />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Modals */}
      {isEditContactModalOpen && (
        <EditContactModal
          user={user}
          onUpdate={handleContactUpdate}
          onClose={() => setIsEditContactModalOpen(false)}
        />
      )}
      {isEditPasswordModalOpen && (
        <EditPasswordModal
          onClose={() => setIsEditPasswordModalOpen(false)}
          onUpdateSuccess={(message) => setSuccessMessage(message)}
        />
      )}
    </div>
  );
};

export default MojeDane;
