import axios from 'axios';
import { useEffect, useState } from 'react';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrollmentMessage, setEnrollmentMessage] = useState('');
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setEnrollingCourse(courseId);
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEnrollmentMessage('Successfully enrolled in the course!');
      setTimeout(() => setEnrollmentMessage(''), 3000);
    } catch (err) {
      setError('Failed to enroll in course');
      setTimeout(() => setError(''), 3000);
    } finally {
      setEnrollingCourse(null);
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Available Courses</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {enrollmentMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {enrollmentMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  By: {course.instructor?.name || 'Unknown'}
                </span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {course.category || 'General'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-600">
                  ${course.price || 'Free'}
                </span>
                <button
                  onClick={() => handleEnroll(course._id)}
                  disabled={enrollingCourse === course._id}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    enrollingCourse === course._id
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {enrollingCourse === course._id ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No courses available at the moment.</div>
        </div>
      )}
    </div>
  );
};

export default CourseList;