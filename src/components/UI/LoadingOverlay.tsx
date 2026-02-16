// components/LoadingOverlay.tsx
import { useI18n } from '@/utils/hooks/useI18n';
import React from 'react';

const LoadingOverlay: React.FC = () => {
  const {t} = useI18n();
  return (
    <div id="loading-overlay" style={overlayStyle}>
      <div style={spinnerStyle} />
      <div style={textStyle}>{t.modal.messageRedirectingPleaseWait}</div>
      <style jsx global>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: '#ffffff',
  zIndex: 100000,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

const spinnerStyle: React.CSSProperties = {
  border: '8px solid #f3f3f3',
  borderTop: '8px solid #333',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  animation: 'spin 1s linear infinite',
};

const textStyle: React.CSSProperties = {
  marginTop: '20px',
  fontSize: '18px',
  color: '#333',
  textAlign: 'center',
};

export default LoadingOverlay;
