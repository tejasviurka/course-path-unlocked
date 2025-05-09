
import { toast } from 'sonner';
import { courseAPI } from '../../services/api';

export const createEnrollmentService = (
  courses, 
  setCourses, 
  enrollments, 
  setEnrollments, 
  usingMockData
) => {
  return {
    enrollStudent: async (courseId, studentId) => {
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
    },

    updateProgress: async (courseId, studentId, moduleId, isCompleted) => {
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
    },

    getEnrollments: async (studentId) => {
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
    },

    getEnrollmentByCourseAndStudent: async (courseId, studentId) => {
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
    },

    getEnrolledCourses: async (studentId) => {
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
    },

    getStudentsByCourse: (courseId) => {
      if (usingMockData) {
        const course = courses.find(c => c.id === courseId);
        return course?.enrolledStudents || [];
      }
      return enrollments
        .filter(enrollment => enrollment.courseId === courseId)
        .map(enrollment => enrollment.studentId);
    }
  };
};
