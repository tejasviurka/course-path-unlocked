
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { checkBackendConnection } from '../../services/api';
import { toast } from '../ui/toaster';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendStatus, setBackendStatus] = useState({ checking: true, connected: true });
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Check if backend is reachable on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setBackendStatus({ checking: true, connected: true });
      const status = await checkBackendConnection();
      setBackendStatus({ checking: false, connected: status.connected });
      
      if (!status.connected) {
        setApiError('Cannot connect to server. Please make sure your backend is running.');
      }
    };
    
    checkConnection();
  }, []);

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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (!backendStatus.connected) {
      // Try to check the connection again
      const status = await checkBackendConnection();
      setBackendStatus({ checking: false, connected: status.connected });
      
      if (!status.connected) {
        setApiError('Cannot connect to server. Please make sure your backend is running on http://localhost:8080.');
        return;
      }
    }
    
    setIsLoading(true);
    setApiError('');
    
    try {
      console.log('Attempting to login with:', {
        username: formData.username,
        password: '[REDACTED]'
      });
      
      const result = await login(formData);
      
      if (result.success) {
        // Redirect based on user role is handled in the Auth context
      } else {
        setApiError(result.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with an error status
        errorMessage = error.response.data?.message || 
                     `Server error: ${error.response.status}`;
                     
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password';
        } else if (error.response.status === 404) {
          errorMessage = 'Login service unavailable';
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
          <CardTitle>Login to Your Account</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {backendStatus.checking ? (
            <Alert className="mb-4">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Checking server connection...</AlertDescription>
            </Alert>
          ) : !backendStatus.connected ? (
            <Alert variant="destructive" className="mb-4">
              <WifiOff className="h-4 w-4" />
              <div className="flex flex-col space-y-2">
                <AlertDescription>{apiError || 'Server connection failed. Please make sure your backend is running.'}</AlertDescription>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRetryConnection}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Retry Connection
                </Button>
              </div>
            </Alert>
          ) : apiError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          ) : null}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !backendStatus.connected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Button 
              variant="link" 
              className="p-0" 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
