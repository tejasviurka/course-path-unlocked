
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { checkBackendConnection } from '../services/api';
import ConnectionStatus from '../components/auth/ConnectionStatus';
import ApiErrorAlert from '../components/auth/ApiErrorAlert';

const Profile = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const data = useData();
  
  const { user } = auth;
  const { getEnrolledCourses, getEnrollments } = data;
  
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Backend connection states
  const [checking, setChecking] = useState(true);
  const [connected, setConnected] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Check backend connection
  const checkConnection = async () => {
    setChecking(true);
    setIsRetrying(true);
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
      setIsRetrying(false);
    }
  };
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !connected) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch enrolled courses
        let courseData = [];
        if (getEnrolledCourses) {
          courseData = await getEnrolledCourses(user.id);
          setEnrolledCourses(Array.isArray(courseData) ? courseData : []);
        }
        
        // Fetch enrollments with progress
        if (getEnrollments) {
          const enrollmentData = await getEnrollments(user.id);
          setEnrollments(Array.isArray(enrollmentData) ? enrollmentData : []);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your profile data');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, connected, getEnrolledCourses, getEnrollments]);
  
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto text-center py-12">
          <p>Please log in to view your profile.</p>
          <Button onClick={() => navigate('/login')} className="mt-4">
            Login
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <ConnectionStatus
          checking={checking}
          connected={connected}
          apiError={apiError}
          onRetryConnection={checkConnection}
          isLoading={isRetrying}
        />
        
        {error && <ApiErrorAlert error={error} />}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-4 text-center">
                <div className="mx-auto bg-gray-100 p-6 rounded-full mb-4">
                  <User className="h-16 w-16 text-gray-600" />
                </div>
                <CardTitle>{user.name || user.username}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Role</p>
                    <p>{user.role}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Enrolled Courses</p>
                    <p>{enrolledCourses.length}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Overall Progress</p>
                    <div className="flex items-center">
                      <Progress 
                        value={
                          enrollments.length > 0 
                            ? enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length 
                            : 0
                        } 
                        className="h-2 flex-grow" 
                      />
                      <span className="ml-2 text-sm">
                        {enrollments.length > 0 
                          ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length) 
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Enrolled Courses */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
            
            {loading ? (
              <div className="text-center py-12">Loading your courses...</div>
            ) : enrolledCourses.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                  <p className="text-gray-500 mb-4">You haven't enrolled in any courses yet.</p>
                  <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.map(course => {
                  const enrollment = enrollments.find(e => e.courseId === course.id);
                  const progress = enrollment ? enrollment.progress : 0;
                  
                  return (
                    <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row">
                        <div className="w-full md:w-1/3 h-48 md:h-auto">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-full md:w-2/3 p-6">
                          <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="mr-4">{course.duration}</span>
                            <Award className="h-4 w-4 mr-1" />
                            <span>{course.instructor}</span>
                          </div>
                          <div className="mb-4">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">Progress</span>
                              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                          <Button 
                            onClick={() => navigate(`/courses/${course.id}`)}
                            className="mt-2"
                          >
                            Continue Learning
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
