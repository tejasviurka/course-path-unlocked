
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Loader2, PlusCircle, Trash2, X } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { toast } from 'sonner';

const CourseForm = ({ courseId = null }) => {
  const navigate = useNavigate();
  const { addCourse, updateCourse, getCourseById } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    instructor: '',
    duration: '',
    modules: []
  });
  const [errors, setErrors] = useState({});
  
  useEffect(() => {
    if (courseId) {
      const course = getCourseById(courseId);
      if (course) {
        setFormData({
          ...course,
          // Create a deep copy of modules to prevent reference issues
          modules: course.modules.map(module => ({ ...module }))
        });
      }
    }
  }, [courseId, getCourseById]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleModuleChange = (index, field, value) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setFormData(prev => ({ ...prev, modules: updatedModules }));
  };
  
  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          id: `m${Date.now()}`,
          title: '',
          content: '',
          videoUrl: '',
          isCompleted: false
        }
      ]
    }));
  };
  
  const removeModule = (index) => {
    const updatedModules = [...formData.modules];
    updatedModules.splice(index, 1);
    setFormData(prev => ({ ...prev, modules: updatedModules }));
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.instructor.trim()) {
      newErrors.instructor = 'Instructor name is required';
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Course duration is required';
    }
    
    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail URL is required';
    }
    
    // Validate modules
    const moduleErrors = [];
    formData.modules.forEach((module, index) => {
      const moduleError = {};
      let hasError = false;
      
      if (!module.title.trim()) {
        moduleError.title = 'Module title is required';
        hasError = true;
      }
      
      if (!module.content.trim()) {
        moduleError.content = 'Module content is required';
        hasError = true;
      }
      
      if (hasError) {
        moduleErrors[index] = moduleError;
      }
    });
    
    if (moduleErrors.length > 0) {
      newErrors.modules = moduleErrors;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please correct the errors in the form');
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (courseId) {
        // Update existing course
        await updateCourse({ ...formData, id: courseId });
        toast.success('Course updated successfully!');
      } else {
        // Add new course
        await addCourse(formData);
        toast.success('New course added successfully!');
      }
      
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter course title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor</Label>
            <Input
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Enter instructor name"
              className={errors.instructor ? 'border-red-500' : ''}
            />
            {errors.instructor && (
              <p className="text-sm text-red-500">{errors.instructor}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter course description"
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              placeholder="Enter thumbnail image URL"
              className={errors.thumbnail ? 'border-red-500' : ''}
            />
            {errors.thumbnail && (
              <p className="text-sm text-red-500">{errors.thumbnail}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 8 weeks, 10 hours"
              className={errors.duration ? 'border-red-500' : ''}
            />
            {errors.duration && (
              <p className="text-sm text-red-500">{errors.duration}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Course Modules</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addModule}
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Module
            </Button>
          </div>
          
          {formData.modules.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No modules added yet. Click "Add Module" to create your course content.
            </p>
          )}
          
          {formData.modules.map((module, index) => (
            <Card key={module.id || index} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeModule(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`module-${index}-title`}>Module Title</Label>
                    <Input
                      id={`module-${index}-title`}
                      value={module.title}
                      onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                      placeholder="Enter module title"
                      className={errors.modules?.[index]?.title ? 'border-red-500' : ''}
                    />
                    {errors.modules?.[index]?.title && (
                      <p className="text-sm text-red-500">{errors.modules[index].title}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`module-${index}-content`}>Content</Label>
                    <Textarea
                      id={`module-${index}-content`}
                      value={module.content}
                      onChange={(e) => handleModuleChange(index, 'content', e.target.value)}
                      placeholder="Enter module content"
                      rows={3}
                      className={errors.modules?.[index]?.content ? 'border-red-500' : ''}
                    />
                    {errors.modules?.[index]?.content && (
                      <p className="text-sm text-red-500">{errors.modules[index].content}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`module-${index}-video`}>Video URL (optional)</Label>
                    <Input
                      id={`module-${index}-video`}
                      value={module.videoUrl || ''}
                      onChange={(e) => handleModuleChange(index, 'videoUrl', e.target.value)}
                      placeholder="Enter YouTube or video URL"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/courses')}
          >
            Cancel
          </Button>
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {courseId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              courseId ? 'Update Course' : 'Create Course'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CourseForm;
