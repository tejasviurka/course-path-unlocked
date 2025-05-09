
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { checkBackendConnection } from '../services/api';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const useCourseDetail = (courseId) => {
  const navigate = useNavigate();
  const data = useData();
  const auth = useAuth();
  
  // Safely extract methods from contexts
  const getCourseById = data?.getCourseById;
  const getEnrollmentByCourseAndStudent = data?.getEnrollmentByCourseAndStudent;
  const enrollStudent = data?.enrollStudent;
  const user = auth?.user;
  const enrollInCourse = auth?.enrollInCourse;
  
  // State variables
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  
  // Backend connection states
  const [checking, setChecking] = useState(true);
  const [connected, setConnected] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Check backend connection
  const checkConnection = async () => {
    setChecking(true);
    setIsRetrying(true);
    try {
      const result = await checkBackendConnection();
      setConnected(result.connected);
      if (result.connected) {
        fetchCourseData();
      } else {
        setApiError(result.error || 'Server connection failed');
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setConnected(false);
      setApiError('Error checking server connection');
    } finally {
      setChecking(false);
      setIsRetrying(false);
    }
  };
  
  const fetchCourseData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (getCourseById && courseId) {
        const fetchedCourse = await getCourseById(courseId);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
        } else {
          setError('Course not found');
          toast.error('Course not found');
          navigate('/courses');
        }
      }
      
      if (user && getEnrollmentByCourseAndStudent && courseId) {
        const studentEnrollment = await getEnrollmentByCourseAndStudent(courseId, user.id);
        setIsEnrolled(!!studentEnrollment);
        setEnrollment(studentEnrollment);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
      setError('Error loading course data');
      toast.error('Error loading course data');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return;
    }
    
    setEnrolling(true);
    try {
      // First enroll in the course through the auth context
      if (enrollInCourse) {
        await enrollInCourse(courseId);
      }
      
      // Then register the enrollment through the data context
      if (enrollStudent) {
        const newEnrollment = await enrollStudent(courseId, user.id);
        if (newEnrollment) {
          setIsEnrolled(true);
          setEnrollment(newEnrollment);
          toast.success('Successfully enrolled in the course');
          // Re-fetch course to update enrolledStudents count
          if (getCourseById) {
            const updatedCourse = await getCourseById(courseId);
            if (updatedCourse) {
              setCourse(updatedCourse);
            }
          }
          return;
        }
      }
      
      toast.error('Failed to enroll in course');
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, [courseId]);
  
  return {
    course,
    isEnrolled,
    enrollment,
    loading,
    error,
    enrolling,
    checking,
    connected,
    apiError,
    isRetrying,
    handleEnroll,
    checkConnection
  };
};
