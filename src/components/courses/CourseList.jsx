
import React, { useState, useEffect } from 'react';
import CourseCard from './CourseCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Search, Loader2 } from 'lucide-react';

const CourseList = ({ isAdminView = false }) => {
  const data = useData();
  const auth = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Safe unwrapping of methods
  const getAllCourses = data?.getAllCourses;
  const getEnrollmentByCourseAndStudent = data?.getEnrollmentByCourseAndStudent;
  const enrollStudent = data?.enrollStudent;
  const usingMockData = data?.usingMockData || false;
  const user = auth?.user;
  const enrollInCourse = auth?.enrollInCourse;
  
  useEffect(() => {
    fetchCourses();
  }, [data]); // Re-fetch when data context changes
  
  const fetchCourses = async () => {
    setLoading(true);
    try {
      let fetchedCourses = [];
      
      // Get all courses
      if (getAllCourses) {
        const courseData = getAllCourses();
        // Ensure courses is an array
        fetchedCourses = Array.isArray(courseData) ? courseData : [];
      }
      
      // If user is a student, fetch enrollment data
      if (user && user.role === 'STUDENT' && getEnrollmentByCourseAndStudent) {
        fetchEnrollmentData(fetchedCourses);
      }
      
      setCourses(fetchedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
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
        const enrollment = await getEnrollmentByCourseAndStudent(course.id, user.id);
        if (enrollment) {
          enrollmentData[course.id] = enrollment;
        }
      }
      
      setEnrollments(enrollmentData);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };
  
  const handleEnroll = async (courseId) => {
    if (!user || user.role !== 'STUDENT' || !enrollStudent) return;
    
    setLoading(true);
    try {
      let result = true;
      if (!usingMockData && enrollInCourse) {
        result = await enrollInCourse(courseId);
      }
      
      if (result && enrollStudent) {
        await enrollStudent(courseId, user.id);
        await fetchCourses(); // Refresh courses after enrollment
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Ensure courses is an array before filtering
  const filteredCourses = Array.isArray(courses) 
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          className="pl-10"
          placeholder="Search courses by title or description"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
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
