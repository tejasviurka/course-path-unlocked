
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import CourseForm from '../components/admin/CourseForm';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';

const AdminEditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/admin/courses')}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Button>
        
        <h1 className="text-2xl font-bold mb-6">Edit Course</h1>
        
        <CourseForm courseId={courseId} />
      </div>
    </MainLayout>
  );
};

export default AdminEditCourse;
