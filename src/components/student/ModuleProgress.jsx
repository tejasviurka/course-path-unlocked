
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

const ModuleProgress = ({ courseId, activeModule, setActiveModule }) => {
  const { user } = useAuth();
  const { 
    getCourseById, 
    getEnrollmentByCourseAndStudent, 
    updateProgress 
  } = useData();
  
  const course = getCourseById(courseId);
  const enrollment = user ? getEnrollmentByCourseAndStudent(courseId, user.id) : null;
  const completedModules = enrollment?.completedModules || [];
  const progress = enrollment?.progress || 0;
  
  const handleToggleComplete = (moduleId) => {
    if (!user) return;
    
    const isCompleted = completedModules.includes(moduleId);
    updateProgress(courseId, user.id, moduleId, !isCompleted);
    
    if (!isCompleted) {
      toast.success('Module marked as completed!');
    } else {
      toast.info('Module marked as incomplete');
    }
  };
  
  if (!course) return null;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Course Progress</span>
          <span className="text-sm font-normal">{Math.round(progress)}%</span>
        </CardTitle>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      
      <CardContent className="pt-1">
        <div className="space-y-1">
          {course.modules.map((module, index) => {
            const isCompleted = completedModules.includes(module.id);
            const isCurrent = activeModule === index;
            
            return (
              <div key={module.id}>
                <div className={`
                  flex items-center p-2 rounded-md transition-colors
                  ${isCurrent ? 'bg-primary/10' : 'hover:bg-muted'}
                `}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start w-full h-auto p-0 font-normal text-left"
                    onClick={() => setActiveModule(index)}
                  >
                    <div className="flex items-center">
                      <div className="mr-2 flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : isCurrent ? (
                          <PlayCircle className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                        {module.title}
                      </span>
                    </div>
                  </Button>
                  
                  {user && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleComplete(module.id)}
                      className="ml-auto flex-shrink-0"
                    >
                      {isCompleted ? 'Undo' : 'Complete'}
                    </Button>
                  )}
                </div>
                {index < course.modules.length - 1 && <Separator className="my-1" />}
              </div>
            );
          })}
        </div>
        
        {course.modules.length === 0 && (
          <p className="text-center py-4 text-muted-foreground">
            This course has no modules yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModuleProgress;
