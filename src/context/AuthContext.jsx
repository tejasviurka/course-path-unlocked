
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem('lmsUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('lmsUser');
      }
    }
    setLoading(false);
  }, []);
  
  // In a real app, these functions would make API calls to your backend
  const login = async (credentials) => {
    try {
      setLoading(true);
      // This is a mock login - in a real app you'd call your API
      return new Promise((resolve) => {
        setTimeout(() => {
          // Hardcoded users for demo purposes
          if (credentials.username === 'admin' && credentials.password === 'admin123') {
            const userData = { 
              id: '1', 
              username: 'admin', 
              role: 'ADMIN', 
              name: 'Admin User',
              email: 'admin@lms.com',
              token: 'mock-jwt-token-admin'
            };
            setUser(userData);
            localStorage.setItem('lmsUser', JSON.stringify(userData));
            toast.success('Logged in as Admin');
            resolve({ success: true });
          } else if (credentials.username === 'student' && credentials.password === 'student123') {
            const userData = { 
              id: '2', 
              username: 'student', 
              role: 'STUDENT', 
              name: 'Student User',
              email: 'student@lms.com',
              token: 'mock-jwt-token-student',
              enrolledCourses: []
            };
            setUser(userData);
            localStorage.setItem('lmsUser', JSON.stringify(userData));
            toast.success('Logged in as Student');
            resolve({ success: true });
          } else {
            toast.error('Invalid credentials');
            resolve({ success: false, message: 'Invalid credentials' });
          }
          setLoading(false);
        }, 1000);
      });
    } catch (error) {
      setLoading(false);
      toast.error('Login failed');
      return { success: false, message: error.message };
    }
  };
  
  const register = async (userData) => {
    try {
      setLoading(true);
      // This is a mock registration - in a real app you'd call your API
      return new Promise((resolve) => {
        setTimeout(() => {
          // In a real app, this would be handled by your backend
          toast.success('Registration successful! Please log in.');
          setLoading(false);
          resolve({ success: true });
        }, 1000);
      });
    } catch (error) {
      setLoading(false);
      toast.error('Registration failed');
      return { success: false, message: error.message };
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('lmsUser');
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

  // Mock function to enroll a student in a course
  const enrollInCourse = (courseId) => {
    if (!user || user.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return false;
    }
    
    // In a real app, this would be an API call
    const updatedUser = {
      ...user,
      enrolledCourses: [...(user.enrolledCourses || []), courseId]
    };
    
    setUser(updatedUser);
    localStorage.setItem('lmsUser', JSON.stringify(updatedUser));
    toast.success('Successfully enrolled in course!');
    return true;
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
