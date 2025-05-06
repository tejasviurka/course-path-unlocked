
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { validateRegisterForm } from '../../utils/formValidation';
import { useBackendCheck } from '../../hooks/useBackendCheck';
import ConnectionStatus from '../auth/ConnectionStatus';
import ApiErrorAlert from '../auth/ApiErrorAlert';
import RegisterFormFields from '../auth/RegisterFormFields';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { backendStatus, apiError, setApiError, handleRetryConnection } = useBackendCheck();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    role: 'STUDENT'
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    // Clear API error when user makes changes
    if (apiError) {
      setApiError('');
    }
  };

  const handleRoleChange = (value) => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    
    if (!backendStatus.connected) {
      const status = await handleRetryConnection();
      if (!status?.connected) {
        return;
      }
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      // Log the request for debugging
      console.log('Attempting to register with:', {
        ...formData, 
        password: '[REDACTED]'
      });
      
      const result = await register(formData);
      
      if (result.success) {
        toast.success('Registration successful! Please log in.');
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        setApiError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // More specific error handling
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        // Server responded with an error status
        errorMessage = error.response.data?.message || 
                      `Server error: ${error.response.status}`;
                     
        // Handle specific status codes
        if (error.response.status === 404) {
          errorMessage = 'Cannot connect to registration service. Please try again later.';
        } else if (error.response.status === 409) {
          errorMessage = 'Username or email already exists.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Make sure your backend is running on http://localhost:8080.';
      } else {
        // Error in setting up the request
        errorMessage = error.message || 'An unknown error occurred';
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>
            Join our learning platform to access courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ConnectionStatus 
            checking={backendStatus.checking}
            connected={backendStatus.connected}
            apiError={apiError}
            onRetryConnection={handleRetryConnection}
            isLoading={isLoading}
          />
          
          <ApiErrorAlert error={apiError} />
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <RegisterFormFields 
              formData={formData}
              handleChange={handleChange}
              errors={errors}
              onRoleChange={handleRoleChange}
            />
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !backendStatus.connected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Register'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate('/login')}
            >
              Log in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
