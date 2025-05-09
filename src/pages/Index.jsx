import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';
import { BookOpen, User, Award, ChevronRight, Users, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/data';
import { toast } from 'sonner';

const features = [
  {
    name: 'Diverse Courses',
    icon: <BookOpen className="h-6 w-6" />,
    description: 'Access a wide range of courses covering various topics.'
  },
  {
    name: 'Expert Instructors',
    icon: <User className="h-6 w-6" />,
    description: 'Learn from experienced professionals in their fields.'
  },
  {
    name: 'Certification',
    icon: <Award className="h-6 w-6" />,
    description: 'Earn certificates upon successful course completion.'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const data = useData();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Safely access properties with null checks
  const isAuthenticated = auth?.isAuthenticated || (() => false);
  const isAdmin = auth?.isAdmin || (() => false);
  const isStudent = auth?.isStudent || (() => false);
  const user = auth?.user;
  
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        if (data?.getAllCourses) {
          const fetchedCourses = data.getAllCourses();
          console.log("Index page - Fetched courses:", fetchedCourses);
          setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : []);
        }
      } catch (error) {
        console.error('Error fetching courses for homepage:', error);
        toast.error('Error loading courses data');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, [data]); 
  
  // Get enrolled courses for the current user
  let enrolledCourses = [];
  if (user?.id && data?.getEnrolledCourses) {
    try {
      const enrolled = data.getEnrolledCourses(user.id);
      enrolledCourses = Array.isArray(enrolled) ? enrolled : [];
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      enrolledCourses = [];
    }
  }
  
  // Get the featured courses (up to 3)
  const featuredCourses = courses.slice(0, 3);
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-12 px-4 sm:px-6 md:px-8 bg-white rounded-lg shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Welcome to Course<span className="text-lms-primary">Path</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Your journey to knowledge and skills starts here. Explore our courses and unlock your potential.
            </p>
          </div>
          
          {!isAuthenticated() && (
            <div className="flex justify-center space-x-4 mt-8">
              <Button size="lg" onClick={() => navigate('/register')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Choose CoursePath?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-2">{feature.name}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Courses */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Courses</h2>
            <Button variant="ghost" onClick={() => navigate('/courses')}>
              View All <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="py-4">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.enrolledStudents?.length || 0} students</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No courses available at the moment.</p>
              <Button 
                variant="link" 
                className="mt-2" 
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Dashboard Links for Authenticated Users */}
      {isAuthenticated() && (
        <section className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Quick Access</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isAdmin() && (
                <>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-lg mb-2">Manage Courses</h3>
                      <p className="text-gray-600 mb-4">View, add, edit, or delete courses in the system.</p>
                      <Button onClick={() => navigate('/admin/courses')}>
                        Go to Course Management
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-lg mb-2">Analytics</h3>
                      <p className="text-gray-600 mb-4">View enrollment statistics and course analytics.</p>
                      <Button onClick={() => navigate('/analytics')}>
                        View Analytics
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
              
              {isStudent() && (
                <>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-lg mb-2">My Learning</h3>
                      <p className="text-gray-600 mb-4">Continue your enrolled courses and track your progress.</p>
                      <Button onClick={() => navigate('/dashboard')}>
                        Go to My Learning
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-medium text-lg mb-2">Browse Courses</h3>
                      <p className="text-gray-600 mb-4">Discover new courses to enhance your skills.</p>
                      <Button onClick={() => navigate('/courses')}>
                        Explore Courses
                      </Button>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default Index;
