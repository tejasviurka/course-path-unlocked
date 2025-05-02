
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, Clock, Award } from 'lucide-react';

const CourseCard = ({ course, enrolled = false, progress = 0, admin = false, onEnroll }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        {enrolled && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
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
        )}
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          {enrolled && (
            <Badge variant="outline" className="bg-lms-primary/10 text-lms-primary border-lms-primary">
              Enrolled
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {enrolled ? (
          <Link to={`/courses/${course.id}`} className="w-full">
            <Button variant="secondary" className="w-full">
              Continue Learning
            </Button>
          </Link>
        ) : admin ? (
          <div className="flex space-x-2 w-full">
            <Link to={`/admin/courses/${course.id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full">Edit</Button>
            </Link>
            <Link to={`/admin/courses/${course.id}`} className="flex-1">
              <Button variant="secondary" className="w-full">View</Button>
            </Link>
          </div>
        ) : (
          <div className="w-full flex space-x-2">
            <Link to={`/courses/${course.id}`} className="flex-1">
              <Button variant="outline" className="w-full">Preview</Button>
            </Link>
            <Button 
              variant="default" 
              className="flex-1" 
              onClick={() => onEnroll && onEnroll(course.id)}
            >
              Enroll
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
