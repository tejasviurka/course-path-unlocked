
import { useState, useEffect } from 'react';
import { checkBackendConnection } from '../services/api';
import { toast } from 'sonner';

export const useBackendCheck = () => {
  const [backendStatus, setBackendStatus] = useState({ checking: true, connected: true });
  const [apiError, setApiError] = useState('');

  const checkConnection = async () => {
    setBackendStatus({ checking: true, connected: true });
    const status = await checkBackendConnection();
    setBackendStatus({ checking: false, connected: status.connected });
    
    if (!status.connected) {
      setApiError('Cannot connect to server. Please make sure your backend is running.');
      console.error('Backend connection failed:', status);
    } else {
      setApiError('');
    }
  };

  const handleRetryConnection = async () => {
    setBackendStatus({ checking: true, connected: false });
    const status = await checkBackendConnection();
    setBackendStatus({ checking: false, connected: status.connected });
    
    if (status.connected) {
      setApiError('');
      toast.success('Connected to server successfully!');
    } else {
      setApiError('Cannot connect to server. Please make sure your backend is running on http://localhost:8080.');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return { 
    backendStatus, 
    apiError, 
    setApiError, 
    handleRetryConnection 
  };
};
