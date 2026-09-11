import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('role-selection');

  return (
    <AppContext.Provider value={{ role, setRole }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
