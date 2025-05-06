
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const ApiErrorAlert = ({ error, title = "Error" }) => {
  if (!error) return null;
  
  // Handle different error types
  let errorMessage = error;
  
  if (typeof error === 'object') {
    if (error.message) {
      errorMessage = error.message;
    } else if (error.error) {
      errorMessage = error.error;
    } else {
      errorMessage = JSON.stringify(error);
    }
  }
  
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};

export default ApiErrorAlert;
