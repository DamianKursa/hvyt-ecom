import React from 'react';
import LoaderSpinner from '@/components/UI/LoaderSpinner';

interface LoadingModalProps {
  title: string;
  description?: string;
  showOverlay?: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  title,
  description,
  showOverlay = true,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex p-4 items-center justify-center ${
        showOverlay ? '' : 'bg-transparent'
      }`}
      style={{
        backgroundColor: showOverlay ? 'rgba(54, 49, 50, 0.4)' : undefined,
      }}
    >
      <div
        className="w-full  h-[250px] max-w-[440px] bg-white rounded-[24px] p-8 flex flex-col items-center"
        style={{
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
        }}
      >
        <h2 className="text-center text-xl font-semibold mb-2">{title}</h2>
        <LoaderSpinner />
        {description && (
          <p className="text-center text-gray-600 font-light">{description}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingModal;
