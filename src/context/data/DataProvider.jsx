
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { courseAPI } from '../../services/api';
import { MOCK_COURSES } from './mockData';
import { createCourseService } from './courseService';
import { createEnrollmentService } from './enrollmentService';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load courses when component mounts
  useEffect(() => {
    if (!initialized) {
      fetchCourses();
      setInitialized(true);
    }
  }, [initialized]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      console.log('Attempting to fetch courses from API...');
      const response = await courseAPI.getAllCourses();
      if (response && response.status === 200 && Array.isArray(response.data)) {
        console.log('Courses fetched from API successfully:', response.data);
        setCourses(response.data);
        setUsingMockData(false);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Failed to fetch courses from API, using mock data:', error);
      // Use mock data if API fails
      setCourses(MOCK_COURSES);
      setUsingMockData(true);
      toast.warning('Using demo data - Backend API is not available');
    } finally {
      setLoading(false);
    }
  };

  // Create services
  const courseService = createCourseService(courses, setCourses, usingMockData);
  const enrollmentService = createEnrollmentService(
    courses, 
    setCourses, 
    enrollments, 
    setEnrollments, 
    usingMockData
  );

  // Combine all services and state into a single context value
  const contextValue = {
    courses,
    enrollments,
    loading,
    usingMockData,
    ...courseService,
    ...enrollmentService
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};
