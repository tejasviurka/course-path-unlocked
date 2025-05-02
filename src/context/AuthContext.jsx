
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('lmsUser');
    const storedToken = localStorage.getItem('lmsUserToken');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('lmsUser');
        localStorage.removeItem('lmsUserToken');
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials.username, credentials.password);
      
      if (response.status === 200 && response.data) {
        const userData = {
          id: response.data.id,
          username: response.data.username,
          role: response.data.role,
          name: response.data.name,
          email: response.data.email,
          token: response.data.token,
          enrolledCourses: []
        };
        
        setUser(userData);
        localStorage.setItem('lmsUser', JSON.stringify(userData));
        localStorage.setItem('lmsUserToken', response.data.token);
        toast.success(`Logged in as ${userData.role}`);
        return { success: true };
      } else {
        toast.error('Login failed');
        return { success: false, message: 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid credentials';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.status === 200) {
        toast.success('Registration successful! Please log in.');
        return { success: true };
      } else {
        toast.error('Registration failed');
        return { success: false, message: 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lmsUser');
    localStorage.removeItem('lmsUserToken');
    toast.info('Logged out successfully');
  };
  
  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };
  
  const isStudent = () => {
    return user?.role === 'STUDENT';
  };
  
  const isAuthenticated = () => {
    return !!user;
  };

  // Now we'll use the actual API for enrollment
  const enrollInCourse = async (courseId) => {
    if (!user || user.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return false;
    }
    
    try {
      const { courseAPI } = await import('../services/api');
      await courseAPI.enrollInCourse(courseId);
      
      // Update the user's enrolled courses list
      const updatedUser = {
        ...user,
        enrolledCourses: [...(user.enrolledCourses || []), courseId]
      };
      
      setUser(updatedUser);
      localStorage.setItem('lmsUser', JSON.stringify(updatedUser));
      toast.success('Successfully enrolled in course!');
      return true;
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
      return false;
    }
  };
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isStudent,
        isAuthenticated,
        enrollInCourse
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
