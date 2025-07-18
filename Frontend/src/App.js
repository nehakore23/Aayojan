import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './pages/Navbar';
import Login from './pages/login';
import Home from './pages/home';
import Workshops from './pages/Workshops';
import Seminars from './pages/Seminars';
import AboutUs from './pages/AboutUs';
import ContactUsPage from './pages/ContactUsPage';
import Signup from './pages/signup';
import CompleteEventDetails from './pages/complete-event-details';
import EditEventPage from './pages/editEventPage';
import ManageEvents from './pages/ManageEvents';
import GenerateEvent from './pages/generateEventPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfileOptions from './pages/ProfileOptions';
import Logout from './pages/Logout';
import EditEventContainer from './pages/EditEventContainer';
import CompleteFacultyProfile from './pages/complete-profile-faculty';
import CompleteStudentProfile from './pages/complete-profile-student';
import Settings from './pages/Settings.jsx';
import StudentProfile from './pages/StudentProfile.jsx';
import FacultyProfilePage from './pages/FacultyProfilePage';
import MyEvents from './pages/MyEvents';
import Footer from './pages/Footer';
import { useParams } from 'react-router-dom';


// ProtectedRoute component
function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

// This component now has access to useLocation
function AppContent({ isAuthenticated, currentUserRole, setIsAuthenticated, setCurrentUserRole }) {
  const location = useLocation();
  const userProfileLink = "/my-profile";
  const hideNavbarOnRoutes = ['/', '/signup', '/forgot-password'];
  const shouldHideNavAndFooter = hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {isAuthenticated && !shouldHideNavAndFooter && (
        <Navbar userRole={currentUserRole} profileLink={userProfileLink} />
      )}

      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Login
              setIsAuthenticated={setIsAuthenticated}
              setCurrentUserRole={(role) => {
                setCurrentUserRole(role);
                localStorage.setItem('role', role);
              }}
            />
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Private routes */}
        <Route path="/Home" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Home userRole={currentUserRole} profileLink={userProfileLink} /></ProtectedRoute>} />
        <Route path="/workshops" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Workshops /></ProtectedRoute>} />
        <Route path="/seminars" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Seminars /></ProtectedRoute>} />
        <Route path="/about-us" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AboutUs /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ContactUsPage /></ProtectedRoute>} />

        {/* Normalize role for comparison */}
        {currentUserRole?.toUpperCase() === 'ROLE_EVENT_AUTHORITY' && (
          <>
            <Route path="/eventAuthority/manageEvents" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ManageEvents /></ProtectedRoute>} />
            <Route path="/create-event" element={<ProtectedRoute isAuthenticated={isAuthenticated}><GenerateEvent /></ProtectedRoute>} />
          </>
        )}

        {/* Add /create-event for faculty roles as well */}
        {(currentUserRole?.toUpperCase().includes('FACULTY')) && (
          <Route path="/create-event" element={<ProtectedRoute isAuthenticated={isAuthenticated}><GenerateEvent /></ProtectedRoute>} />
        )}

        <Route path="/faculty/:facultyId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><MyEvents /></ProtectedRoute>} />
        <Route path="/profile-options" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProfileOptions profileLink={userProfileLink} /></ProtectedRoute>} />
        <Route path="/my-profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
            {currentUserRole?.toUpperCase().includes('FACULTY') || currentUserRole?.toUpperCase() === 'ROLE_EVENT_AUTHORITY' ? 
                <CompleteFacultyProfile /> : 
                currentUserRole?.toUpperCase() === 'ROLE_STUDENT' ? 
                    <CompleteStudentProfile /> : 
                    <Navigate to="/home" replace />
            }
        </ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><StudentProfile /></ProtectedRoute>} />
        <Route path="/faculty-profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}>
            {currentUserRole?.toUpperCase().includes('FACULTY') || currentUserRole?.toUpperCase() === 'ROLE_EVENT_AUTHORITY' ? 
                <FacultyProfilePage /> : 
                <Navigate to="/home" replace />
            }
        </ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Settings /></ProtectedRoute>} />

        <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} setCurrentUserRole={() => { setCurrentUserRole(""); localStorage.removeItem('role'); }} />} />
        <Route path="/faculty/completeEventDetails/:eventId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><CompleteEventDetails /></ProtectedRoute>} />
        <Route path="/edit-event" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditEventPage generateEventDto={null} allFacultyOptions={[]} errorMessage="" /></ProtectedRoute>} />
        <Route path="/eventAuthority/generateEvent" element={<ProtectedRoute isAuthenticated={isAuthenticated}><GenerateEvent generateEventDto={{ eventName: '', eventDate: '', noOfFaculty: 1, assignedFacultyNames: ['', '', '', '', ''], allfacultyNames: [] }} errorMessage="" /></ProtectedRoute>} />
        <Route path="/eventAuthority/event/edit/:eventId" element={<ProtectedRoute isAuthenticated={isAuthenticated}><EditEventContainer allFacultyNames={[]} /></ProtectedRoute>} />
        
        {/* 404 fallback */}
        <Route path="*" element={<div>404: Page Not Found</div>} />
      </Routes>

      {isAuthenticated && !shouldHideNavAndFooter && <Footer />}
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [currentUserRole, setCurrentUserRole] = useState(localStorage.getItem('role') || "");

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setCurrentUserRole(localStorage.getItem('role') || "");
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        currentUserRole={currentUserRole}
        setIsAuthenticated={setIsAuthenticated}
        setCurrentUserRole={setCurrentUserRole}
      />
    </Router>
  );
}const CompleteEventDetailsWrapper = () => {
  const { eventId } = useParams();
  return <CompleteEventDetails eventId={eventId} />;
};


export default App;
