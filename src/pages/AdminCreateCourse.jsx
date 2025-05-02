
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import CourseForm from '../components/admin/CourseForm';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminCreateCourse = () => {
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
        
        <h1 className="text-2xl font-bold mb-6">Create New Course</h1>
        
        <CourseForm />
      </div>
    </MainLayout>
  );
};

export default AdminCreateCourse;
