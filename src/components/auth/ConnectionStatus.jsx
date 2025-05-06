
import React from 'react';
import { Loader2, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';

const ConnectionStatus = ({ 
  checking, 
  connected, 
  apiError, 
  onRetryConnection, 
  isLoading 
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
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Retry Connection
          </Button>
        </div>
      </Alert>
    );
  }
  
  return null;
};

export default ConnectionStatus;
