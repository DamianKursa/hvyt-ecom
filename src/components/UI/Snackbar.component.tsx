import React from 'react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, visible }) => {
  if (!visible) return null;

  return (
    <div className={`fixed left-4 bottom-4 p-4 rounded-md text-white ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} max-w-[30%]`}>
      {message}
    </div>
  );
};

export default Snackbar;
