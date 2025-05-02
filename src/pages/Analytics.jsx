
import React from 'react';
import MainLayout from '../components/layouts/MainLayout';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics = () => {
  const { courses, enrollments } = useData();
  
  // Calculate enrollment data for chart
  const enrollmentData = courses.map(course => ({
    name: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
    students: course.enrolledStudents?.length || 0,
  })).sort((a, b) => b.students - a.students);
  
  // Calculate progress data for pie chart
  const calculateProgressDistribution = () => {
    const progressGroups = {
      'Not Started (0%)': 0,
      'Just Started (1-25%)': 0,
      'In Progress (26-75%)': 0,
      'Almost Complete (76-99%)': 0,
      'Completed (100%)': 0
    };
    
    enrollments.forEach(enrollment => {
      const progress = enrollment.progress || 0;
      
      if (progress === 0) {
        progressGroups['Not Started (0%)']++;
      } else if (progress <= 25) {
        progressGroups['Just Started (1-25%)']++;
      } else if (progress <= 75) {
        progressGroups['In Progress (26-75%)']++;
      } else if (progress < 100) {
        progressGroups['Almost Complete (76-99%)']++;
      } else {
        progressGroups['Completed (100%)']++;
      }
    });
    
    return Object.keys(progressGroups).map(key => ({
      name: key,
      value: progressGroups[key]
    }));
  };
  
  const progressData = calculateProgressDistribution();
  
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];
  
  // Calculate overall metrics
  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);
  const totalModules = courses.reduce((sum, course) => sum + (course.modules?.length || 0), 0);
  const completedModules = enrollments.reduce((sum, enrollment) => sum + (enrollment.completedModules?.length || 0), 0);
  const moduleCompletionRate = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
  
  return (
    <MainLayout>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Courses</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">{courses.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Enrollments</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-3xl font-bold">{totalStudents}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Module Completion Rate</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center">
                <Progress value={moduleCompletionRate} className="h-2 flex-grow" />
                <span className="ml-2 text-sm">{Math.round(moduleCompletionRate)}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Enrollment</CardTitle>
              <CardDescription>Number of students enrolled in each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={enrollmentData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{fontSize: 12}}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="students" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress Distribution</CardTitle>
              <CardDescription>Student progress across all enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Completion statistics for each course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courses.map(course => {
                const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
                const totalModules = course.modules.length * courseEnrollments.length;
                const completedModules = courseEnrollments.reduce(
                  (sum, e) => sum + (e.completedModules?.length || 0), 
                  0
                );
                const completionRate = totalModules > 0 
                  ? (completedModules / totalModules) * 100 
                  : 0;
                
                return (
                  <div key={course.id}>
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium">{course.title}</p>
                      <span className="text-sm text-gray-500">
                        {Math.round(completionRate)}% complete
                      </span>
                    </div>
                    <Progress value={completionRate} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Analytics;
