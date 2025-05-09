import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/data'; // Updated import
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import StudentDashboard from './pages/StudentDashboard';
import Profile from './pages/Profile';
import AdminCourses from './pages/AdminCourses';
import AdminCreateCourse from './pages/AdminCreateCourse';
import AdminEditCourse from './pages/AdminEditCourse';
import Analytics from './pages/Analytics';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:courseId" element={<CourseDetail />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/courses" element={<AdminCourses />} />
            <Route path="/admin/courses/create" element={<AdminCreateCourse />} />
            <Route path="/admin/courses/:courseId/edit" element={<AdminEditCourse />} />
            <Route path="/admin/courses/:courseId" element={<CourseDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
