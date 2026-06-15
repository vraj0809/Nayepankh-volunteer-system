import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import RegisterPage from './pages/public/RegisterPage';
import LoginPage from './pages/public/LoginPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import EditProfile from './pages/volunteer/EditProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AllVolunteers from './pages/admin/AllVolunteers';
import VolunteerDetail from './pages/admin/VolunteerDetail';
import Reports from './pages/admin/Reports';

// Route Guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Volunteer Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <VolunteerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/edit"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/volunteers"
        element={
          <AdminRoute>
            <AllVolunteers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/volunteers/:id"
        element={
          <AdminRoute>
            <VolunteerDetail />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <AdminRoute>
            <Reports />
          </AdminRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
