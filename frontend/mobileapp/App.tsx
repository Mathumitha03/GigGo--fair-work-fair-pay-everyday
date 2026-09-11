import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';

// Distinct Screen Modules organized into separate folders
import { RoleSelectionScreen } from './src/screens/role-selection';
import { CustomerLoginScreen } from './src/screens/customer-login';
import { WorkerLoginScreen } from './src/screens/worker-login';
import { CoopManagerLoginScreen } from './src/screens/coop-manager-login';
import { LanguagesScreen } from './src/screens/languages';
import { HelpCenterScreen } from './src/screens/help-center';

const MainAppContent: React.FC = () => {
  const { role } = useApp();

  switch (role) {
    case 'customer':
      return <CustomerLoginScreen />;
    case 'worker':
      return <WorkerLoginScreen />;
    case 'coop-manager':
      return <CoopManagerLoginScreen />;
    case 'languages':
      return <LanguagesScreen />;
    case 'help-center':
      return <HelpCenterScreen />;
    case 'role-selection':
    default:
      return <RoleSelectionScreen />;
  }
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <StatusBar style="dark" />
        <MainAppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}
