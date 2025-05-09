
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

const CourseContent = ({ modules, activeModule }) => {
  if (!modules || modules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>
            Preview course content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-gray-500">
            No content available for this course yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
        <CardDescription>
          Progress through the modules to complete the course
        </CardDescription>
      </CardHeader>
      
      <CardContent>
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
      </CardContent>
    </Card>
  );
};

export default CourseContent;
