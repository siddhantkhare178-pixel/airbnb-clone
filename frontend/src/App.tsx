import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import BecomeHostPage from './pages/BecomeHostPage';

// Buyer / Guest protected pages
import BookingPage from './pages/BookingPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import MyBookingsPage from './pages/MyBookingsPage';
import GuestsPage from './pages/GuestsPage';
import ProfilePage from './pages/ProfilePage';

// Seller / Host protected pages
import HostDashboardPage from './pages/host/HostDashboardPage';
import HostPropertiesPage from './pages/host/HostPropertiesPage';
import PropertyDetailsHostPage from './pages/host/PropertyDetailsHostPage';
import PropertyFormPage from './pages/host/PropertyFormPage';
import RoomManagementPage from './pages/host/RoomManagementPage';
import HotelInventoryPage from './pages/host/HotelInventoryPage';
import InventoryManagementPage from './pages/host/InventoryManagementPage';
import HotelBookingsPage from './pages/host/HotelBookingsPage';
import HotelReportsPage from './pages/host/HotelReportsPage';

// Auto scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route element={<MainLayout />}>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/hotels/:id" element={<HotelDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/become-a-host" element={<BecomeHostPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Buyer / Guest protected routes */}
            <Route
              path="/booking/:hotelId"
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking/cancel"
              element={
                <ProtectedRoute>
                  <PaymentCancelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/guests"
              element={
                <ProtectedRoute>
                  <GuestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Seller / Host protected routes (requires HOTEL_MANAGER role) */}
            <Route
              path="/host"
              element={
                <ProtectedRoute requireHost={true}>
                  <HostDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties"
              element={
                <ProtectedRoute requireHost={true}>
                  <HostPropertiesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/new"
              element={
                <ProtectedRoute requireHost={true}>
                  <PropertyFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId"
              element={
                <ProtectedRoute requireHost={true}>
                  <PropertyDetailsHostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/edit"
              element={
                <ProtectedRoute requireHost={true}>
                  <PropertyFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:id/edit"
              element={
                <ProtectedRoute requireHost={true}>
                  <PropertyFormPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/rooms"
              element={
                <ProtectedRoute requireHost={true}>
                  <RoomManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/inventory"
              element={
                <ProtectedRoute requireHost={true}>
                  <HotelInventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/rooms/:roomId/inventory"
              element={
                <ProtectedRoute requireHost={true}>
                  <InventoryManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/bookings"
              element={
                <ProtectedRoute requireHost={true}>
                  <HotelBookingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/properties/:hotelId/reports"
              element={
                <ProtectedRoute requireHost={true}>
                  <HotelReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
