
import { toast } from 'sonner';
import { courseAPI } from '../../services/api';
import { MOCK_COURSES } from './mockData';

export const createCourseService = (courses, setCourses, usingMockData) => {
  return {
    addCourse: async (newCourse) => {
      try {
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
      }
      return null;
    },

    updateCourse: async (updatedCourse) => {
      try {
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
      }
      return null;
    },

    deleteCourse: async (courseId) => {
      try {
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
      }
      return false;
    },

    getAllCourses: () => {
      // Always ensure we return the courses array, use mock data if empty
      if (!Array.isArray(courses) || courses.length === 0) {
        if (usingMockData) {
          return MOCK_COURSES;
        }
        return [];
      }
      return courses;
    },

    getCourseById: async (courseId) => {
      if (!courseId) return null;
      
      // First check if we have it in state
      const courseArray = Array.isArray(courses) ? courses : [];
      const cachedCourse = courseArray.find(course => course && course.id === courseId);
        
      if (cachedCourse) {
        console.log('Found course in cache:', cachedCourse);
        return cachedCourse;
      }
      
      // If using mock data, check mock courses
      if (usingMockData) {
        const mockCourse = MOCK_COURSES.find(course => course.id === courseId);
        if (mockCourse) {
          console.log('Found course in mock data:', mockCourse);
          // Add to cache if not already there
          setCourses(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            if (!prevArray.some(c => c && c.id === mockCourse.id)) {
              return [...prevArray, mockCourse];
            }
            return prevArray;
          });
          return mockCourse;
        }
        return null;
      }
      
      // If not, fetch from API
      try {
        const response = await courseAPI.getCourseById(courseId);
        if (response && response.status === 200) {
          // Add to cache
          setCourses(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            if (!prevArray.some(c => c && c.id === response.data.id)) {
              return [...prevArray, response.data];
            }
            return prevArray;
          });
          return response.data;
        }
      } catch (error) {
        console.error('Failed to get course:', error);
        return null;
      }
    }
  };
};
