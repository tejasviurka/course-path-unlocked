
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { BookOpen, Clock, Award, CalendarDays } from 'lucide-react';
import ConnectionStatus from '../components/auth/ConnectionStatus';
import { useQuery } from '@tanstack/react-query';
import { courseAPI, checkBackendConnection } from '../services/api';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEnrolledCourses, getEnrollments, usingMockData } = useData();
  
  // Backend connection check
  const [checking, setChecking] = useState(true);
  const [connected, setConnected] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dashboard data
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Check backend connection
  const checkConnection = async () => {
    setChecking(true);
    setIsLoading(true);
    try {
      const result = await checkBackendConnection();
      setConnected(result.connected);
      if (!result.connected) {
        setApiError(result.error || 'Server connection failed');
      }
    } catch (error) {
      console.error('Connection check error:', error);
      setConnected(false);
      setApiError('Error checking server connection');
    } finally {
      setChecking(false);
      setIsLoading(false);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      let courseData = [];
      let enrollmentData = [];
      
      if (!usingMockData) {
        // Fetch from real API
        const coursesResponse = await courseAPI.getEnrolledCourses();
        courseData = coursesResponse.data;
        
        const enrollmentsResponse = await courseAPI.getEnrollments();
        enrollmentData = enrollmentsResponse.data;
      } else {
        // Use mock data
        courseData = await getEnrolledCourses(user.id);
        enrollmentData = await getEnrollments(user.id);
      }
      
      setEnrolledCourses(courseData);
      setEnrollments(enrollmentData);
      
      // Generate recent activity based on enrollments
      // This would typically come from a separate API endpoint
      const activity = enrollmentData.slice(0, 3).map(e => ({
        id: e.id,
        courseId: e.courseId,
        date: new Date(e.enrolledDate || Date.now()),
        type: 'progress_update',
        details: `Updated progress to ${Math.round(e.progress)}%`
      }));
      setRecentActivity(activity);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    }
  };
  
  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);
  
  // Fetch data when connected
  useEffect(() => {
    if (connected && user) {
      fetchDashboardData();
    }
  }, [connected, user]);
  
  // Calculate overall progress across all courses
  const calculateOverallProgress = () => {
    if (enrollments.length === 0) return 0;
    
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
    return totalProgress / enrollments.length;
  };
  
  const overallProgress = calculateOverallProgress();
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto text-center py-12">
          <p>Please log in to view your dashboard.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Login
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-2">My Learning Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome back, {user.name || user.username}!</p>
        
        <ConnectionStatus
          checking={checking}
          connected={connected}
          apiError={apiError}
          onRetryConnection={checkConnection}
          isLoading={isLoading}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Courses</CardTitle>
              <CardDescription>Total enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
              <CardDescription>Average completion rate</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <Progress value={overallProgress} className="h-2 flex-grow" />
                <span className="ml-2 text-sm">{Math.round(overallProgress)}%</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Completed Courses</CardTitle>
              <CardDescription>Fully completed courses</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">
                {enrollments.filter(e => e.progress === 100).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">My Enrolled Courses</h2>
            
            {enrolledCourses.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                  <p className="text-gray-500 mb-4">
                    You haven't enrolled in any courses yet. Explore our course catalog to get started.
                  </p>
                  <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map(course => {
                  const enrollment = enrollments.find(e => e.courseId === course.id);
                  const progress = enrollment ? enrollment.progress : 0;
                  
                  return (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <div className="flex items-center text-white">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-lms-primary h-2 rounded-full" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-xs font-medium">{Math.round(progress)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <CardContent className="pt-4 pb-0">
                        <h3 className="font-medium text-lg mb-1">{course.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{course.duration}</span>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-4">
                        <Button 
                          className="w-full" 
                          onClick={() => navigate(`/courses/${course.id}`)}
                        >
                          {progress === 0 ? 'Start Learning' : 'Continue Learning'}
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="pt-6">
                {recentActivity.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No recent activity</p>
                ) : (
                  <ul className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <li key={`${activity.id}-${index}`} className="flex items-start">
                        <div className="mr-3 bg-primary/20 p-2 rounded-full">
                          <CalendarDays className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.details}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-bold mb-4 mt-6">Learning Goals</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Weekly goal (5 hours)</span>
                      <span className="text-sm text-gray-500">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Monthly courses (2 courses)</span>
                      <span className="text-sm text-gray-500">50%</span>
                    </div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
