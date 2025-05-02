
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  React.useEffect(() => {
    // Redirect to home if user is already authenticated
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-lms-primary" />
          <h1 className="text-3xl font-bold ml-2">
            Course<span className="text-lms-primary">Path</span>
          </h1>
        </div>
        <p className="text-gray-600 mt-2">Learning Management System</p>
      </div>
      
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
