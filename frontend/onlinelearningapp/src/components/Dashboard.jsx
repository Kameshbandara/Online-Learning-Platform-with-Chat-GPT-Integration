import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    activeEnrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch instructor's courses
      const coursesResponse = await axios.get('http://localhost:5000/api/courses/instructor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(coursesResponse.data);
      
      // Fetch dashboard stats
      const statsResponse = await axios.get('http://localhost:5000/api/instructor/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(courses.filter(course => course._id !== courseId));
        // Refresh stats after deletion
        fetchInstructorData();
      } catch (err) {
        setError('Failed to delete course');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Instructor Dashboard</h1>
        <p className="text-gray-600">Manage your courses and track your performance</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
        <Link
          to="/create-course"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          
          Create New Course
        </Link>
      </div>

      {/* Courses List */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses created yet</h3>
          <p className="text-gray-600 mb-4">Start creating your first course to share your knowledge!</p>
          <Link
            to="/create-course"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
                    {course.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {course.category || 'General'}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Created: {formatDate(course.createdAt)}</span>
                  <span className="font-medium text-green-600">
                    ${course.price || 'Free'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Enrolled: {course.enrolledStudents || 0} students</span>
                  <span>Lessons: {course.lessons?.length || 0}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDeleteCourse(course._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200 text-sm"
                  >
                    Delete
                  </button>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm">
                    Edit
                  </button>
                  <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200">
                    
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/create-course"
            className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow duration-200 flex items-center">
            
            <div>
              <div className="text-sm font-medium text-gray-900">Create Course</div>
              <div className="text-xs text-gray-500">Add new course</div>
            </div>
          </Link>
          
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow duration-200 flex items-center">
            
            <div>
              <div className="text-sm font-medium text-gray-900">View Analytics</div>
              <div className="text-xs text-gray-500">Course performance</div>
            </div>
          </button>
          
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow duration-200 flex items-center">
             
            <div>
              <div className="text-sm font-medium text-gray-900">Student Reviews</div>
              <div className="text-xs text-gray-500">Feedback & ratings</div>
            </div>
          </button>
          
          <button className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow duration-200 flex items-center">
            
            <div>
              <div className="text-sm font-medium text-gray-900">Settings</div>
              <div className="text-xs text-gray-500">Profile & preferences</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;