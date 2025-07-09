import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';


const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const isActiveRoute = (path) => {
    return location.pathname === path ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-blue-700 hover:text-white';
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Logo"
                className="h-8 w-8 mr-3 rounded-full"
              />
              <span className="text-white text-xl font-bold">Online Learning Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/courses"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/courses')}`}
                  >
                    All Courses
                  </Link>
                  <Link
                    to="/my-courses"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/my-courses')}`}
                  >
                    My Courses
                  </Link>

                  {user?.role !== 'instructor' && (
                    <Link
                      to="/recommendations"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/recommendations')}`}
                    >
                      Recommendations
                    </Link>
                  )}
                  {user?.role === 'instructor' && (
                    <>
                      <Link
                        to="/dashboard"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/dashboard')}`}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/create-course"
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/create-course')}`}
                      >
                        Create Course
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/login')}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActiveRoute('/register')}`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User Menu */}
          {isLoggedIn && (
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <span className="text-white text-sm">
                      Welcome, {user?.name}
                    </span>
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white hover:bg-blue-700 inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            {isLoggedIn ? (
              <>
                <Link
                  to="/courses"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/courses')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Courses
                </Link>
                <Link
                  to="/my-courses"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/my-courses')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Courses
                </Link>
                {user?.role !== 'instructor' && (
                  <Link
                    to="/recommendations"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/recommendations')}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Recommendations
                  </Link>
                )}
                
                {user?.role === 'instructor' && (
                  <>
                    <Link
                      to="/dashboard"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/dashboard')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/create-course"
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/create-course')}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Course
                    </Link>
                  </>
                )}
                <div className="border-t border-blue-600 pt-4 pb-3">
                  <div className="flex items-center px-3">
                    <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">{user?.name}</div>
                      <div className="text-sm font-medium text-gray-300">{user?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-blue-800 w-full text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/login')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActiveRoute('/register')}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;