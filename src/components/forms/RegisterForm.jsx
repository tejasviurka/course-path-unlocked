import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { toast } from '../ui/toaster';
import { checkBackendConnection } from '../../services/api';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [backendStatus, setBackendStatus] = useState({ checking: true, connected: true });
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    role: 'STUDENT'
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
        console.error('Backend connection failed:', status);
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
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
                placeholder="Create a password"
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="STUDENT" id="student" />
                  <Label htmlFor="student">Student</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ADMIN" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
              </RadioGroup>
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
