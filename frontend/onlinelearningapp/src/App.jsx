import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import CourseList from './components/CourseList';
import CreateCourse from './components/CreateCourse';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import MyCourse from './components/MyCourses';
import Navbar from './components/Navbar';
import Recommend from './components/Recommend';
import Register from './components/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// Instructor Route Component
const InstructorRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (user.role !== 'instructor') {
    return <Navigate to="/courses" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/courses" />} />
            
            {/* Protected Routes */}
            <Route path="/courses" element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            } />
            
            <Route path="/my-courses" element={
              <ProtectedRoute>
                <MyCourse />
              </ProtectedRoute>
            } />
            
            <Route path="/recommendations" element={
              <ProtectedRoute>
                <Recommend />
              </ProtectedRoute>
            } />
            
            {/* Instructor Only Routes */}
            <Route path="/dashboard" element={
              <InstructorRoute>
                <Dashboard />
              </InstructorRoute>
            } />
            
            <Route path="/create-course" element={
              <InstructorRoute>
                <CreateCourse />
              </InstructorRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/courses" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
