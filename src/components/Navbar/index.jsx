import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  PencilSquareIcon, 
  UserPlusIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { 
      title: 'Home', 
      path: '/', 
      icon: <HomeIcon className="h-5 w-5 mr-2" /> 
    },
    { 
      title: 'Blog Editor', 
      path: '/blog-editor', 
      icon: <PencilSquareIcon className="h-5 w-5 mr-2" /> 
    },
    ...(!token
      ? [
        { 
          title: 'SignUp', 
          path: '/auth', 
          icon: <UserPlusIcon className="h-5 w-5 mr-2" /> 
        }
      ]
      : []
    ),
    ...(token
      ? [
          {
            title: 'Profile',
            path: '/profile',
            icon: <UserCircleIcon className="h-5 w-5 mr-2" />
          },
          {
            title: 'Logout',
            path: '',
            icon: <XMarkIcon className="h-5 w-5 mr-2" onClick={handleLogout} />
          }
        ]
      : [])
  ];

  return (
    <nav className="fixed w-full z-50 top-0 left-0">
      {/* Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-lg shadow-lg"></div>  
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo or Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-gray-800 text-2xl font-bold flex items-center 
                         relative z-10 transition-colors duration-300 
                         hover:text-blue-600"
            >
              Blog Universe
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={item.title === 'Logout' ? handleLogout : undefined}
                className="text-gray-700 hover:bg-gray-200/50 hover:text-blue-600 
                           px-3 py-2 rounded-lg flex items-center 
                           transition duration-300 ease-in-out 
                           transform hover:scale-105 relative z-10"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center relative z-20">
            <button
              onClick={toggleMenu}
              className="text-gray-800 hover:text-blue-600 
                         focus:outline-none focus:ring-2 
                         focus:ring-blue-500 rounded-md 
                         transition duration-300"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu with Smooth Transition */}
      <div 
        className={`md:hidden fixed inset-x-0 top-16 origin-top 
                    transition-all duration-300 ease-in-out 
                    ${isMenuOpen 
                      ? 'opacity-100 scale-y-100 visible' 
                      : 'opacity-0 scale-y-0 invisible'}`}
      >
        <div className="bg-white/80 backdrop-blur-lg shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  toggleMenu();
                  if (item.title === 'Logout') handleLogout();
                }}
                className="text-gray-700 hover:bg-gray-200/50 hover:text-blue-600 
                           block px-3 py-2 rounded-lg flex items-center 
                           transition duration-300 ease-in-out"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;