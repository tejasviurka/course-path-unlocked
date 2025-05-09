
// Mock data for development/fallback
export const MOCK_COURSES = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Learn the basics of React, hooks, state management and more.',
    thumbnail: 'https://placehold.co/600x400?text=React+Course',
    instructor: 'John Doe',
    duration: '8 weeks',
    modules: [
      { id: '1-1', title: 'Getting Started', content: 'React basics', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { id: '1-2', title: 'Components', content: 'Creating components', videoUrl: '' }
    ],
    enrolledStudents: ['101', '102']
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Deep dive into JavaScript advanced concepts and patterns.',
    thumbnail: 'https://placehold.co/600x400?text=JavaScript+Course',
    instructor: 'Jane Smith',
    duration: '6 weeks',
    modules: [
      { id: '2-1', title: 'Closures', content: 'Understanding closures', videoUrl: '' },
      { id: '2-2', title: 'Promises', content: 'Async programming', videoUrl: '' }
    ],
    enrolledStudents: ['101']
  },
  {
    id: '3',
    title: 'Full Stack Development',
    description: 'Build complete web applications with modern technologies.',
    thumbnail: 'https://placehold.co/600x400?text=Full+Stack+Course',
    instructor: 'Mike Johnson',
    duration: '12 weeks',
    modules: [
      { id: '3-1', title: 'Frontend Basics', content: 'HTML, CSS, JS', videoUrl: '' },
      { id: '3-2', title: 'Backend Development', content: 'Node.js, Express', videoUrl: '' }
    ],
    enrolledStudents: []
  }
];
