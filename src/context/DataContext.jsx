
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Sample course data (would come from API in real app)
const initialCourses = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build modern websites.',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=500',
    instructor: 'Jane Smith',
    duration: '8 weeks',
    modules: [
      {
        id: 'm1',
        title: 'HTML Fundamentals',
        content: 'Learn the basics of HTML, the backbone of any website.',
        videoUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'CSS Styling',
        content: 'Learn how to style your HTML elements with CSS.',
        videoUrl: 'https://www.youtube.com/watch?v=1PnVor36_40',
        isCompleted: false
      },
      {
        id: 'm3',
        title: 'JavaScript Basics',
        content: 'Introduction to JavaScript programming language.',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        isCompleted: false
      }
    ],
    enrolledStudents: []
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React by building real-world applications with hooks, context API, and more.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500',
    instructor: 'John Doe',
    duration: '10 weeks',
    modules: [
      {
        id: 'm1',
        title: 'React Hooks',
        content: 'Learn how to use React Hooks to manage state and side effects.',
        videoUrl: 'https://www.youtube.com/watch?v=dpw9EHDh2bM',
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'Context API',
        content: 'Learn how to use Context API for state management.',
        videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
        isCompleted: false
      }
    ],
    enrolledStudents: []
  },
  {
    id: '3',
    title: 'MongoDB for Developers',
    description: 'Learn how to use MongoDB for modern web applications.',
    thumbnail: 'https://images.unsplash.com/photo-1580894896813-652ff5aa8146?q=80&w=500',
    instructor: 'Alice Johnson',
    duration: '6 weeks',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to MongoDB',
        content: 'Learn the basics of MongoDB and how it differs from SQL databases.',
        videoUrl: 'https://www.youtube.com/watch?v=pWbMrx5rVBE',
        isCompleted: false
      },
      {
        id: 'm2',
        title: 'CRUD Operations',
        content: 'Learn how to perform Create, Read, Update, and Delete operations in MongoDB.',
        videoUrl: 'https://www.youtube.com/watch?v=UzLwcPjJtIU',
        isCompleted: false
      }
    ],
    enrolledStudents: []
  }
];

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  // In a real app, this would fetch data from your API
  useEffect(() => {
    // Load any stored data from localStorage
    const storedCourses = localStorage.getItem('lmsCourses');
    const storedEnrollments = localStorage.getItem('lmsEnrollments');
    
    if (storedCourses) {
      try {
        setCourses(JSON.parse(storedCourses));
      } catch (error) {
        console.error('Failed to parse stored courses', error);
      }
    } else {
      // Initialize with sample data if nothing in storage
      localStorage.setItem('lmsCourses', JSON.stringify(initialCourses));
    }
    
    if (storedEnrollments) {
      try {
        setEnrollments(JSON.parse(storedEnrollments));
      } catch (error) {
        console.error('Failed to parse stored enrollments', error);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('lmsCourses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lmsEnrollments', JSON.stringify(enrollments));
  }, [enrollments]);

  // Course management functions
  const addCourse = (newCourse) => {
    setCourses(prev => {
      const updated = [...prev, { ...newCourse, id: Date.now().toString(), enrolledStudents: [] }];
      return updated;
    });
    toast.success('Course added successfully');
  };

  const updateCourse = (updatedCourse) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
    toast.success('Course updated successfully');
  };

  const deleteCourse = (courseId) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    toast.success('Course deleted successfully');
  };

  const getAllCourses = () => {
    return courses;
  };

  const getCourseById = (courseId) => {
    return courses.find(course => course.id === courseId) || null;
  };

  // Enrollment functions
  const enrollStudent = (courseId, studentId) => {
    // Update course enrolled students
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
    const newEnrollment = {
      id: Date.now().toString(),
      courseId,
      studentId,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      completedModules: []
    };

    setEnrollments(prev => [...prev, newEnrollment]);
  };

  const updateProgress = (courseId, studentId, moduleId, isCompleted) => {
    setEnrollments(prev => 
      prev.map(enrollment => {
        if (enrollment.courseId === courseId && enrollment.studentId === studentId) {
          let completedModules = [...enrollment.completedModules];
          
          if (isCompleted && !completedModules.includes(moduleId)) {
            completedModules.push(moduleId);
          } else if (!isCompleted) {
            completedModules = completedModules.filter(id => id !== moduleId);
          }

          const course = courses.find(c => c.id === courseId);
          const totalModules = course ? course.modules.length : 0;
          const progress = totalModules > 0 ? (completedModules.length / totalModules) * 100 : 0;

          return {
            ...enrollment,
            completedModules,
            progress
          };
        }
        return enrollment;
      })
    );
  };

  const getEnrollments = (studentId) => {
    return enrollments.filter(enrollment => enrollment.studentId === studentId);
  };

  const getEnrollmentByCourseAndStudent = (courseId, studentId) => {
    return enrollments.find(
      enrollment => enrollment.courseId === courseId && enrollment.studentId === studentId
    );
  };

  const getEnrolledCourses = (studentId) => {
    const studentEnrollments = getEnrollments(studentId);
    return courses.filter(course => 
      studentEnrollments.some(enrollment => enrollment.courseId === course.id)
    );
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
