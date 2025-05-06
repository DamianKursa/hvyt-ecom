// src/context/ExternalIdContext.tsx
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const ExternalIdContext = createContext<string | null>(null);

export const ExternalIdProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [externalId, setExternalId] = useState<string | null>(null);

  useEffect(() => {
    let stored = localStorage.getItem('anon_external_id');
    if (!stored) {
      stored = uuidv4();
      localStorage.setItem('anon_external_id', stored);
    }
    setExternalId(stored);
  }, []);

  if (!externalId) return null;

  return (
    <ExternalIdContext.Provider value={externalId}>
      {children}
    </ExternalIdContext.Provider>
  );
};
