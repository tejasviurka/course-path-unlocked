
import React, { useState } from 'react';
import CourseCard from './CourseCard';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';

const CourseList = ({ isAdminView = false }) => {
  const { getAllCourses, getEnrolledCourses, getEnrollmentByCourseAndStudent, enrollStudent } = useData();
  const { user, enrollInCourse } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  
  const courses = getAllCourses();
  const enrolledCourses = user && user.role === 'STUDENT' ? getEnrolledCourses(user.id) : [];
  
  const handleEnroll = (courseId) => {
    if (user && user.role === 'STUDENT') {
      enrollStudent(courseId, user.id);
      enrollInCourse(courseId);
    }
  };
  
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
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
            const enrollment = user && user.role === 'STUDENT' 
              ? getEnrollmentByCourseAndStudent(course.id, user.id)
              : null;
              
            const isEnrolled = enrollment !== undefined;
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
