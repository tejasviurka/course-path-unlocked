
import React from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Award } from 'lucide-react';

const CourseHeader = ({ course, isEnrolled, enrollment, handleEnroll, enrolling, user }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="h-48 md:h-64 bg-gray-200 relative">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {isEnrolled && enrollment && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center text-white">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-lms-primary h-2 rounded-full" 
                  style={{ width: `${enrollment.progress || 0}%` }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-medium">{Math.round(enrollment.progress || 0)}%</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
          
          {!isEnrolled && user?.role === 'STUDENT' && (
            <Button 
              onClick={handleEnroll} 
              className="shrink-0"
              disabled={enrolling}
            >
              {enrolling ? 'Enrolling...' : 'Enroll Now'}
            </Button>
          )}
          
          {isEnrolled && (
            <Button onClick={() => navigate('/profile')} variant="outline" className="shrink-0">
              View My Profile
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span>{course.enrolledStudents?.length || 0} students enrolled</span>
          </div>
          <div className="flex items-center">
            <Award className="h-4 w-4 mr-1 text-gray-500" />
            <span>Instructor: {course.instructor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHeader;
