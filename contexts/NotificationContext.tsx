import React, { createContext, useContext, useState } from 'react';
import TopNotification from '../components/TopNotification';

interface NotificationContextType {
  showNotification: (message: string, type: 'error' | 'success' | 'info') => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<{
    message: string;
    type: 'error' | 'success' | 'info';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const showNotification = (message: string, type: 'error' | 'success' | 'info') => {
    setNotification({
      message,
      type,
      visible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const value: NotificationContextType = {
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <TopNotification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onDismiss={hideNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
