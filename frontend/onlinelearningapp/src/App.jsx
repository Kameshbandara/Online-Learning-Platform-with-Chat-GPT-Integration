import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation
} from 'react-router-dom';
import './App.css';
import CourseList from './components/CourseList';
import CreateCourse from './components/CreateCourse';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer'; // ✅ Import Footer
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

  if (!token) return <Navigate to="/login" />;
  if (user.role !== 'instructor') return <Navigate to="/courses" />;
  return children;
};

// ✅ Layout wrapper with Navbar and Footer (except on login/register)
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayoutRoutes = ['/login', '/register'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className="flex-grow bg-gray-50">{children}</main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/courses" />} />

            {/* Protected Routes */}
            <Route
              path="/courses"
              element={
                <ProtectedRoute>
                  <CourseList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-courses"
              element={
                <ProtectedRoute>
                  <MyCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommend />
                </ProtectedRoute>
              }
            />

            {/* Instructor Only Routes */}
            <Route
              path="/dashboard"
              element={
                <InstructorRoute>
                  <Dashboard />
                </InstructorRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <InstructorRoute>
                  <CreateCourse />
                </InstructorRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/courses" />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
