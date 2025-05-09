
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import StudentDashboard from "./pages/StudentDashboard";
import AdminCourses from "./pages/AdminCourses";
import AdminCreateCourse from "./pages/AdminCreateCourse";
import AdminEditCourse from "./pages/AdminEditCourse";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:courseId" element={<CourseDetail />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Student Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={["STUDENT"]}>
          <StudentDashboard />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/courses" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminCourses />
        </ProtectedRoute>
      } />
      <Route path="/admin/courses/create" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminCreateCourse />
        </ProtectedRoute>
      } />
      <Route path="/admin/courses/:courseId/edit" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminEditCourse />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Analytics />
        </ProtectedRoute>
      } />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
          <Sonner />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
