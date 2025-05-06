
import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ConnectionStatus from '../auth/ConnectionStatus';
import { checkBackendConnection } from '../../services/api';

const CourseList = ({ isAdminView = false }) => {
  const data = useData();
  const auth = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Backend connection states
  const [checking, setChecking] = useState(true);
  const [connected, setConnected] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Safe unwrapping of methods
  const getAllCourses = data?.getAllCourses;
  const getEnrollmentByCourseAndStudent = data?.getEnrollmentByCourseAndStudent;
  const enrollStudent = data?.enrollStudent;
  const usingMockData = data?.usingMockData || false;
  const user = auth?.user;
  const enrollInCourse = auth?.enrollInCourse;
  
  // Check backend connection
  const checkConnection = async () => {
    setChecking(true);
    setIsRetrying(true);
    try {
      const result = await checkBackendConnection();
      setConnected(result.connected);
      if (result.connected) {
        fetchCourses();
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
  
  useEffect(() => {
    checkConnection();
  }, [data]); // Re-fetch when data context changes
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Get all courses
      if (getAllCourses) {
        const courseData = await getAllCourses();
        
        // Ensure courses is an array
        const fetchedCourses = Array.isArray(courseData) ? courseData : [];
        setCourses(fetchedCourses);
        
        // Log courses for debugging
        console.log('Fetched courses:', fetchedCourses);
        
        // If user is a student, fetch enrollment data
        if (user && user.role === 'STUDENT' && getEnrollmentByCourseAndStudent) {
          fetchEnrollmentData(fetchedCourses);
        }
      } else {
        console.error('getAllCourses function not available');
        toast.error('Error loading courses data');
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Error loading courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEnrollmentData = async (coursesList) => {
    if (!getEnrollmentByCourseAndStudent || !user) return;
    
    try {
      const enrollmentData = {};
      
      for (const course of coursesList) {
        if (course && course.id) {
          const enrollment = await getEnrollmentByCourseAndStudent(course.id, user.id);
          if (enrollment) {
            enrollmentData[course.id] = enrollment;
          }
        }
      }
      
      setEnrollments(enrollmentData);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };
  
  const handleEnroll = async (courseId) => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }
    
    if (user.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return;
    }
    
    setLoading(true);
    try {
      let result = true;
      if (!usingMockData && enrollInCourse) {
        result = await enrollInCourse(courseId);
      }
      
      if (result && enrollStudent) {
        await enrollStudent(courseId, user.id);
        toast.success('Successfully enrolled in course');
        await fetchCourses(); // Refresh courses after enrollment
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };
  
  // Ensure courses is an array before filtering
  const filteredCourses = Array.isArray(courses) 
    ? courses.filter(course => 
        course && course.title && 
        (course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())))
      )
    : [];
  
  if (loading && !connected) {
    return (
      <div>
        <ConnectionStatus
          checking={checking}
          connected={connected}
          apiError={apiError}
          onRetryConnection={checkConnection}
          isLoading={isRetrying}
        />
        
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {!connected && (
        <ConnectionStatus
          checking={checking}
          connected={connected}
          apiError={apiError}
          onRetryConnection={checkConnection}
          isLoading={isRetrying}
        />
      )}
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search courses by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            if (!course || !course.id) return null;
            
            const enrollment = enrollments[course.id];
            const isEnrolled = !!enrollment;
            const progress = enrollment ? enrollment.progress : 0;
            
            return (
              <CourseCard 
                key={course.id}
                course={course}
                enrolled={isEnrolled}
                progress={progress}
                admin={isAdminView}
                onEnroll={handleEnroll}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseList;
