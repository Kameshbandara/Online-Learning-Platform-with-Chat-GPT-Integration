import axios from 'axios';
import { useEffect, useState } from 'react';
import.meta.env.VITE_API_URL

const MyCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    // Get user role from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role || 'student');
    
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      let response;
      if (user.role === 'instructor') {
        // Fetch courses created by the instructor
        response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/instructor/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      } else {
        // Fetch enrolled courses for students
        response = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses/my-courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(response.data);
      }
      
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch ${userRole === 'instructor' ? 'created' : 'enrolled'} courses`);
      setLoading(false);
    }
  };

  const getProgressPercentage = (courseOrEnrollment) => {
    // For instructor view, courses don't have progress
    if (userRole === 'instructor') return null;
    
    // For student view, calculate progress from enrollment data
    if (!courseOrEnrollment.progress) return 0;
    return Math.round((courseOrEnrollment.progress.completedLessons / courseOrEnrollment.totalLessons) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCompletedCoursesCount = () => {
    if (userRole === 'instructor') return 0;
    return courses.filter(enrollment => getProgressPercentage(enrollment) === 100).length;
  };

  const getInProgressCoursesCount = () => {
    if (userRole === 'instructor') return 0;
    return courses.filter(enrollment => {
      const progress = getProgressPercentage(enrollment);
      return progress > 0 && progress < 100;
    }).length;
  };

  const getTotalEnrollments = () => {
    if (userRole === 'student') return 0;
    return courses.reduce((total, course) => total + (course.enrollmentCount || 0), 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {userRole === 'instructor' ? 'My Created Courses' : 'My Courses'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'instructor' 
            ? 'Manage your created courses and track student progress' 
            : 'Continue your learning journey'
          }
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {userRole === 'instructor' ? 'No courses created yet' : 'No courses enrolled yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {userRole === 'instructor' 
              ? 'Start sharing your knowledge by creating your first course!' 
              : 'Start your learning journey by enrolling in some courses!'
            }
          </p>
          <a
            href={userRole === 'instructor' ? '/create-course' : '/courses'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            {userRole === 'instructor' ? 'Create Course' : 'Browse Courses'}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((item) => {
            // For students: item is enrollment with course data
            // For instructors: item is the course itself
            const course = userRole === 'instructor' ? item : item.course;
            const enrollment = userRole === 'instructor' ? null : item;
            
            return (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 line-clamp-2">
                      {course?.title || 'Course Title'}
                    </h2>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                      userRole === 'instructor' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {userRole === 'instructor' ? 'Created' : 'Enrolled'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {course?.description || 'No description available'}
                  </p>
                  
                  {/* Progress bar for students only */}
                  {userRole === 'student' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{getProgressPercentage(enrollment)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getProgressPercentage(enrollment)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Course info */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>
                      {userRole === 'instructor' 
                        ? `Created: ${formatDate(course.createdAt)}` 
                        : `Enrolled: ${formatDate(enrollment.enrolledAt)}`
                      }
                    </span>
                    <span>
                      {userRole === 'instructor' 
                        ? `${course.enrollmentCount || 0} students` 
                        : `By: ${course?.instructor?.name || 'Unknown'}`
                      }
                    </span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex space-x-3">
                    {userRole === 'instructor' ? (
                      <>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                          Edit Course
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200">
                          Continue Learning
                        </button>
                        <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200">
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Statistics section */}
      {courses.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {userRole === 'instructor' ? 'Teaching Statistics' : 'Learning Statistics'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
              <div className="text-sm text-gray-600">
                {userRole === 'instructor' ? 'Total Courses Created' : 'Total Courses'}
              </div>
            </div>
            
            {userRole === 'instructor' ? (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {getTotalEnrollments()}
                  </div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {courses.filter(course => course.isPublished !== false).length}
                  </div>
                  <div className="text-sm text-gray-600">Published Courses</div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {getCompletedCoursesCount()}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {getInProgressCoursesCount()}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourse;