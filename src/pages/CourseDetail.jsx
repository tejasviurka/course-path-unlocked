
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import MainLayout from '../components/layouts/MainLayout';
import CourseHeader from '../components/courses/CourseHeader';
import CourseContent from '../components/courses/CourseContent';
import ModuleProgress from '../components/student/ModuleProgress';
import ConnectionStatus from '../components/auth/ConnectionStatus';
import ApiErrorAlert from '../components/auth/ApiErrorAlert';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState(0);
  
  const {
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
  } = useCourseDetail(courseId);
  
  if (loading && !connected) {
    return (
      <MainLayout>
        <div className="container mx-auto">
          <ConnectionStatus
            checking={checking}
            connected={connected}
            apiError={apiError}
            onRetryConnection={checkConnection}
            isLoading={isRetrying}
          />
          
          <div className="text-center py-12">
            Loading course...
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto">
          {!connected && (
            <ConnectionStatus
              checking={checking}
              connected={connected}
              apiError={apiError}
              onRetryConnection={checkConnection}
              isLoading={isRetrying}
            />
          )}
          
          {error && <ApiErrorAlert error={error} />}
          
          <div className="text-center py-12">
            Course not found. <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  // Ensure modules is always an array
  const modules = Array.isArray(course.modules) ? course.modules : [];
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        {!connected && (
          <ConnectionStatus
            checking={checking}
            connected={connected}
            apiError={apiError}
            onRetryConnection={checkConnection}
            isLoading={isRetrying}
          />
        )}
        
        {error && <ApiErrorAlert error={error} />}
        
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/courses')}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Button>
        
        <CourseHeader 
          course={course} 
          isEnrolled={isEnrolled} 
          enrollment={enrollment} 
          handleEnroll={handleEnroll} 
          enrolling={enrolling}
          user={user}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <CourseContent 
              modules={modules} 
              activeModule={activeModule}
            />
          </div>
          
          <div>
            <ModuleProgress 
              courseId={courseId} 
              activeModule={activeModule}
              setActiveModule={setActiveModule}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CourseDetail;
