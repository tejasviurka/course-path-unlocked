
import React from 'react';
import { Loader2, WifiOff, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

const ConnectionStatus = ({ 
  checking, 
  connected, 
  apiError, 
  onRetryConnection, 
  isLoading,
  showConnected = false
}) => {
  if (checking) {
    return (
      <Alert className="mb-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        <AlertDescription>Checking server connection...</AlertDescription>
      </Alert>
    );
  }
  
  if (!connected) {
    return (
      <Alert variant="destructive" className="mb-4">
        <WifiOff className="h-4 w-4" />
        <div className="flex flex-col space-y-2">
          <AlertDescription>{apiError || 'Server connection failed. Please make sure your backend is running.'}</AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetryConnection}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Retry Connection
          </Button>
        </div>
      </Alert>
    );
  }
  
  if (connected && showConnected) {
    return (
      <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertDescription>Connected to server</AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default ConnectionStatus;
