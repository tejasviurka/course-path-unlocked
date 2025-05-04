
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ChevronLeft, Clock, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ModuleProgress from '../components/student/ModuleProgress';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const data = useData();
  const auth = useAuth();
  
  // Safely extract methods from contexts
  const getCourseById = data?.getCourseById;
  const getEnrollmentByCourseAndStudent = data?.getEnrollmentByCourseAndStudent;
  const enrollStudent = data?.enrollStudent;
  const user = auth?.user;
  const enrollInCourse = auth?.enrollInCourse;
  
  const [activeModule, setActiveModule] = useState(0);
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        if (getCourseById && courseId) {
          const fetchedCourse = await getCourseById(courseId);
          if (fetchedCourse) {
            setCourse(fetchedCourse);
          } else {
            toast.error('Course not found');
            navigate('/courses');
          }
        }
        
        if (user && getEnrollmentByCourseAndStudent && courseId) {
          const studentEnrollment = await getEnrollmentByCourseAndStudent(courseId, user.id);
          setIsEnrolled(!!studentEnrollment);
          setEnrollment(studentEnrollment);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        toast.error('Error loading course data');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, getCourseById, getEnrollmentByCourseAndStudent, user, navigate]);
  
  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'STUDENT') {
      toast.error('Only students can enroll in courses');
      return;
    }
    
    try {
      if (enrollStudent && enrollInCourse && user) {
        await enrollStudent(courseId, user.id);
        await enrollInCourse(courseId);
        setIsEnrolled(true);
        toast.success('Successfully enrolled in the course');
      }
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error('Failed to enroll in course');
    }
  };
  
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto text-center py-12">
          Loading course...
        </div>
      </MainLayout>
    );
  }
  
  if (!course) {
    return (
      <MainLayout>
        <div className="container mx-auto text-center py-12">
          Course not found. <Button onClick={() => navigate('/courses')}>Back to Courses</Button>
        </div>
      </MainLayout>
    );
  }
  
  // Ensure modules is always an array
  const modules = Array.isArray(course.modules) ? course.modules : [];
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/courses')}
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Courses
        </Button>
        
        {/* Course Header */}
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
                <Button onClick={handleEnroll} className="shrink-0">
                  Enroll Now
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
        
        {/* Course Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {/* Module Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {isEnrolled 
                    ? 'Progress through the modules to complete the course'
                    : 'Preview course content'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {modules.length > 0 ? (
                  <Tabs defaultValue="content">
                    <TabsList className="mb-4">
                      <TabsTrigger value="content">Content</TabsTrigger>
                      {modules[activeModule]?.videoUrl && (
                        <TabsTrigger value="video">Video</TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="content" className="mt-0">
                      <div className="prose max-w-none">
                        <h3 className="text-xl font-bold mb-4">
                          {modules[activeModule]?.title || 'No content available'}
                        </h3>
                        <div className="whitespace-pre-line">
                          {modules[activeModule]?.content || 'No content available for this module.'}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="video" className="mt-0">
                      {modules[activeModule]?.videoUrl && (
                        <div className="aspect-video">
                          <iframe
                            className="w-full h-full"
                            src={modules[activeModule].videoUrl.replace('watch?v=', 'embed/')}
                            title={modules[activeModule].title}
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    No content available for this course yet.
                  </p>
                )}
              </CardContent>
            </Card>
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
