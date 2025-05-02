
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { BookOpen, Clock } from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEnrolledCourses, getEnrollments } = useData();
  
  const enrolledCourses = user ? getEnrolledCourses(user.id) : [];
  const enrollments = user ? getEnrollments(user.id) : [];
  
  // Calculate overall progress across all courses
  const calculateOverallProgress = () => {
    if (enrollments.length === 0) return 0;
    
    const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
    return totalProgress / enrollments.length;
  };
  
  const overallProgress = calculateOverallProgress();
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Learning Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">My Courses</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">{enrolledCourses.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Progress</CardTitle>
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
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">
                {enrollments.filter(e => e.progress === 100).length}
              </p>
            </CardContent>
          </Card>
        </div>
        
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </MainLayout>
  );
};

export default StudentDashboard;
