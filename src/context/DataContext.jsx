
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { courseAPI } from '../services/api';

// Mock data for development/fallback
const MOCK_COURSES = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React, hooks, state management and more.',
    thumbnail: 'https://placehold.co/600x400?text=React+Course',
    instructor: 'John Doe',
    duration: '8 weeks',
    modules: [
      { id: '1-1', title: 'Getting Started', content: 'React basics', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: '1-2', title: 'Components', content: 'Creating components', videoUrl: '' }
    ],
    enrolledStudents: ['101', '102']
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript advanced concepts and patterns.',
    thumbnail: 'https://placehold.co/600x400?text=JavaScript+Course',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    modules: [
      { id: '2-1', title: 'Closures', content: 'Understanding closures', videoUrl: '' },
      { id: '2-2', title: 'Promises', content: 'Async programming', videoUrl: '' }
    ],
    enrolledStudents: ['101']
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Build complete web applications with modern technologies.',
    thumbnail: 'https://placehold.co/600x400?text=Full+Stack+Course',
    instructor: 'Mike Johnson',
    duration: '12 weeks',
    modules: [
      { id: '3-1', title: 'Frontend Basics', content: 'HTML, CSS, JS', videoUrl: '' },
      { id: '3-2', title: 'Backend Development', content: 'Node.js, Express', videoUrl: '' }
    ],
    enrolledStudents: []
  }
];

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);

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
        setUsingMockData(false);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      // Use mock data if API fails
      setCourses(MOCK_COURSES);
      setUsingMockData(true);
      toast.warning('Using demo data - Backend API is not available');
    } finally {
      setLoading(false);
    }
  };

  // Course management functions
  const addCourse = async (newCourse) => {
    try {
      setLoading(true);
      if (usingMockData) {
        // Mock implementation
        const mockCourse = {
          ...newCourse,
          id: `mock-${Date.now()}`,
          enrolledStudents: []
        };
        setCourses(prev => [...prev, mockCourse]);
        toast.success('Course added (Demo Mode)');
        return mockCourse;
      } else {
        const response = await courseAPI.createCourse(newCourse);
        if (response.status === 200) {
          setCourses(prev => [...prev, response.data]);
          toast.success('Course added successfully');
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to add course:', error);
      toast.error('Failed to add course');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const updateCourse = async (updatedCourse) => {
    try {
      setLoading(true);
      if (usingMockData) {
        // Mock implementation
        setCourses(prev => 
          prev.map(course => 
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
        toast.success('Course updated (Demo Mode)');
        return updatedCourse;
      } else {
        const response = await courseAPI.updateCourse(updatedCourse.id, updatedCourse);
        if (response.status === 200) {
          setCourses(prev => 
            prev.map(course => 
              course.id === updatedCourse.id ? response.data : course
            )
          );
          toast.success('Course updated successfully');
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to update course:', error);
      toast.error('Failed to update course');
    } finally {
      setLoading(false);
    }
    return null;
  };

  const deleteCourse = async (courseId) => {
    try {
      setLoading(true);
      if (usingMockData) {
        // Mock implementation
        setCourses(prev => prev.filter(course => course.id !== courseId));
        toast.success('Course deleted (Demo Mode)');
        return true;
      } else {
        const response = await courseAPI.deleteCourse(courseId);
        if (response.status === 200) {
          setCourses(prev => prev.filter(course => course.id !== courseId));
          toast.success('Course deleted successfully');
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const getAllCourses = () => {
    return courses;
  };

  const getCourseById = async (courseId) => {
    // First check if we have it in state
    const cachedCourse = courses.find(course => course.id === courseId);
    if (cachedCourse) return cachedCourse;
    
    // If not, fetch from API (or use mock)
    try {
      if (usingMockData) {
        const mockCourse = MOCK_COURSES.find(course => course.id === courseId);
        if (mockCourse) {
          // Add to cache if not already there
          if (!courses.some(c => c.id === mockCourse.id)) {
            setCourses(prev => [...prev, mockCourse]);
          }
          return mockCourse;
        }
        return null;
      } else {
        const response = await courseAPI.getCourseById(courseId);
        if (response.status === 200) {
          // Add to cache
          if (!courses.some(c => c.id === response.data.id)) {
            setCourses(prev => [...prev, response.data]);
          }
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to get course:', error);
      return null;
    }
  };

  // Enrollment functions
  const enrollStudent = async (courseId, studentId) => {
    try {
      if (usingMockData) {
        // Mock implementation
        const newEnrollment = {
          id: `mock-enroll-${Date.now()}`,
          courseId,
          studentId,
          enrolledDate: new Date().toISOString(),
          progress: 0,
          completedModules: []
        };
        
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
        
        setEnrollments(prev => [...prev, newEnrollment]);
        toast.success('Enrolled successfully (Demo Mode)');
        return newEnrollment;
      } else {
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
          return newEnrollment;
        }
      }
    } catch (error) {
      console.error('Failed to enroll student:', error);
      toast.error('Failed to enroll in course');
    }
    return null;
  };

  const updateProgress = async (courseId, studentId, moduleId, isCompleted) => {
    try {
      if (usingMockData) {
        // Mock implementation
        setEnrollments(prev => 
          prev.map(enrollment => {
            if (enrollment.courseId === courseId && enrollment.studentId === studentId) {
              const completedModules = [...enrollment.completedModules];
              
              if (isCompleted && !completedModules.includes(moduleId)) {
                completedModules.push(moduleId);
              } else if (!isCompleted) {
                const index = completedModules.indexOf(moduleId);
                if (index !== -1) completedModules.splice(index, 1);
              }
              
              const course = courses.find(c => c.id === courseId);
              const totalModules = course?.modules?.length || 1;
              const progress = (completedModules.length / totalModules) * 100;
              
              return {
                ...enrollment,
                completedModules,
                progress
              };
            }
            return enrollment;
          })
        );
        toast.success('Progress updated (Demo Mode)');
        return enrollments.find(e => e.courseId === courseId && e.studentId === studentId);
      } else {
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
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      toast.error('Failed to update progress');
    }
    return null;
  };

  const getEnrollments = async (studentId) => {
    try {
      if (usingMockData) {
        return enrollments.filter(e => e.studentId === studentId);
      } else {
        const response = await courseAPI.getEnrollments();
        if (response.status === 200) {
          setEnrollments(response.data);
          return response.data;
        }
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
    
    // If not found, fetch from API or mock
    try {
      if (usingMockData) {
        // For demo, we'll create a mock enrollment if the student is in the course's enrolledStudents list
        const course = courses.find(c => c.id === courseId);
        if (course && course.enrolledStudents.includes(studentId)) {
          const mockEnrollment = {
            id: `mock-enrollment-${courseId}-${studentId}`,
            courseId,
            studentId,
            enrolledDate: new Date().toISOString(),
            progress: 0,
            completedModules: []
          };
          setEnrollments(prev => [...prev, mockEnrollment]);
          return mockEnrollment;
        }
        return null;
      } else {
        const response = await courseAPI.getEnrollment(courseId);
        if (response.status === 200) {
          // Add to cache if not already there
          if (!enrollments.some(e => e.id === response.data.id)) {
            setEnrollments(prev => [...prev, response.data]);
          }
          return response.data;
        }
      }
    } catch (error) {
      console.error('Failed to get enrollment:', error);
      return null;
    }
  };

  const getEnrolledCourses = async (studentId) => {
    try {
      if (usingMockData) {
        // Filter courses where the studentId is in the enrolledStudents array
        return courses.filter(course => course.enrolledStudents?.includes(studentId));
      } else {
        const response = await courseAPI.getEnrolledCourses();
        if (response.status === 200) {
          return response.data;
        }
      }
      return [];
    } catch (error) {
      console.error('Failed to get enrolled courses:', error);
      return [];
    }
  };

  const getStudentsByCourse = (courseId) => {
    if (usingMockData) {
      const course = courses.find(c => c.id === courseId);
      return course?.enrolledStudents || [];
    }
    return enrollments
      .filter(enrollment => enrollment.courseId === courseId)
      .map(enrollment => enrollment.studentId);
  };

  return (
    <DataContext.Provider value={{
      courses,
      enrollments,
      loading,
      usingMockData,
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
