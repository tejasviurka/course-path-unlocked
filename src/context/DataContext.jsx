
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { courseAPI } from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await courseAPI.getAllCourses();
      if (response.status === 200) {
        setCourses(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  // Course management functions
  const addCourse = async (newCourse) => {
    try {
      setLoading(true);
      const response = await courseAPI.createCourse(newCourse);
      if (response.status === 200) {
        setCourses(prev => [...prev, response.data]);
        toast.success('Course added successfully');
      }
    } catch (error) {
      console.error('Failed to add course:', error);
      toast.error('Failed to add course');
    } finally {
      setLoading(false);
    }
  };

  const updateCourse = async (updatedCourse) => {
    try {
      setLoading(true);
      const response = await courseAPI.updateCourse(updatedCourse.id, updatedCourse);
      if (response.status === 200) {
        setCourses(prev => 
          prev.map(course => 
            course.id === updatedCourse.id ? response.data : course
          )
        );
        toast.success('Course updated successfully');
      }
    } catch (error) {
      console.error('Failed to update course:', error);
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await courseAPI.deleteCourse(courseId);
      if (response.status === 200) {
        setCourses(prev => prev.filter(course => course.id !== courseId));
        toast.success('Course deleted successfully');
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  const getAllCourses = () => {
    return courses;
  };

  const getCourseById = async (courseId) => {
    // First check if we have it in state
    const cachedCourse = courses.find(course => course.id === courseId);
    if (cachedCourse) return cachedCourse;
    
    // If not, fetch from API
    try {
      const response = await courseAPI.getCourseById(courseId);
      if (response.status === 200) {
        // Add to cache
        if (!courses.some(c => c.id === response.data.id)) {
          setCourses(prev => [...prev, response.data]);
        }
        return response.data;
      }
    } catch (error) {
      console.error('Failed to get course:', error);
      return null;
    }
  };

  // Enrollment functions
  const enrollStudent = async (courseId, studentId) => {
    try {
      const response = await courseAPI.enrollInCourse(courseId);
      if (response.status === 200) {
        // Update courses state to reflect enrollment
        setCourses(prev => 
          prev.map(course => {
            if (course.id === courseId) {
              if (!course.enrolledStudents.includes(studentId)) {
                return {
                  ...course,
                  enrolledStudents: [...course.enrolledStudents, studentId]
                };
              }
            }
            return course;
          })
        );
        
        // Add enrollment record
        const newEnrollment = response.data;
        setEnrollments(prev => [...prev, newEnrollment]);
      }
    } catch (error) {
      console.error('Failed to enroll student:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const updateProgress = async (courseId, studentId, moduleId, isCompleted) => {
    try {
      const response = await courseAPI.updateProgress(courseId, moduleId, isCompleted);
      if (response.status === 200) {
        setEnrollments(prev => 
          prev.map(enrollment => {
            if (enrollment.courseId === courseId && enrollment.studentId === studentId) {
              return response.data;
            }
            return enrollment;
          })
        );
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error('Failed to update progress');
    }
  };

  const getEnrollments = async (studentId) => {
    try {
      const response = await courseAPI.getEnrollments();
      if (response.status === 200) {
        setEnrollments(response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to get enrollments:', error);
      return [];
    }
  };

  const getEnrollmentByCourseAndStudent = async (courseId, studentId) => {
    // Check cached enrollments first
    const cachedEnrollment = enrollments.find(
      enrollment => enrollment.courseId === courseId && enrollment.studentId === studentId
    );
    
    if (cachedEnrollment) return cachedEnrollment;
    
    // If not found, fetch from API
    try {
      const response = await courseAPI.getEnrollment(courseId);
      if (response.status === 200) {
        // Add to cache if not already there
        if (!enrollments.some(e => e.id === response.data.id)) {
          setEnrollments(prev => [...prev, response.data]);
        }
        return response.data;
      }
    } catch (error) {
      console.error('Failed to get enrollment:', error);
      return null;
    }
  };

  const getEnrolledCourses = async (studentId) => {
    try {
      const response = await courseAPI.getEnrolledCourses();
      if (response.status === 200) {
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Failed to get enrolled courses:', error);
      return [];
    }
  };

  const getStudentsByCourse = (courseId) => {
    return enrollments
      .filter(enrollment => enrollment.courseId === courseId)
      .map(enrollment => enrollment.studentId);
  };

  return (
    <DataContext.Provider value={{
      courses,
      enrollments,
      loading,
      addCourse,
      updateCourse,
      deleteCourse,
      getAllCourses,
      getCourseById,
      enrollStudent,
      updateProgress,
      getEnrollments,
      getEnrollmentByCourseAndStudent,
      getEnrolledCourses,
      getStudentsByCourse
    }}>
      {children}
    </DataContext.Provider>
  );
};
