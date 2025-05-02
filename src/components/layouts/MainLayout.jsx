
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, User, BarChart3, Home } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

const MainLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <Home className="w-5 h-5 mr-2" />
    },
    {
      name: 'Courses',
      path: '/courses',
      icon: <BookOpen className="w-5 h-5 mr-2" />
    }
  ];
  
  // Add admin-only navigation items
  if (isAdmin()) {
    navItems.push({
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart3 className="w-5 h-5 mr-2" />
    });
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-lms-primary" />
              <span className="ml-2 text-xl font-bold text-lms-dark">Course<span className="text-lms-primary">Path</span></span>
            </Link>
          </div>
          
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center">
                <div className="mr-4">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.role}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                    <User className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')}>
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {user && (
        <div className="flex flex-grow">
          {/* Sidebar Navigation */}
          <aside className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link 
                      to={item.path}
                      className="flex items-center p-2 rounded-lg hover:bg-gray-100 transition-all"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          
          {/* Main Content */}
          <main className="flex-grow p-6 bg-gray-50">
            {children}
          </main>
        </div>
      )}
      
      {/* If not authenticated, just render the content without sidebar */}
      {!user && (
        <main className="flex-grow bg-gray-50">
          {children}
        </main>
      )}
    </div>
  );
};

export default MainLayout;
