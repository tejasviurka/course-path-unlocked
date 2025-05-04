
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import CourseList from '../components/courses/CourseList';
import { useAuth } from '../context/AuthContext';

const Courses = () => {
  const { user, isAdmin } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isAdmin ? 'Manage Courses' : 'Available Courses'}
        </h1>
        
        <CourseList isAdminView={user && isAdmin()} />
      </div>
    </MainLayout>
  );
};

export default Courses;
