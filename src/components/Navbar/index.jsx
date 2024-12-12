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
    // Update token state if it changes in localStorage
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
        },
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
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo or Brand */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-white text-2xl font-bold flex items-center"
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
                className="text-gray-300 hover:bg-gray-700 hover:text-white 
                           px-3 py-2 rounded-md flex items-center 
                           transition duration-300 ease-in-out 
                           transform hover:scale-105"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-300 
                         focus:outline-none focus:ring-2 
                         focus:ring-white rounded-md"
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleMenu}
                className="text-gray-300 hover:bg-gray-600 hover:text-white 
                           block px-3 py-2 rounded-md flex items-center 
                           transition duration-300 ease-in-out"
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
