
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
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
        <p className="text-gray-600 mt-2">Create a new account</p>
      </div>
      
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;
