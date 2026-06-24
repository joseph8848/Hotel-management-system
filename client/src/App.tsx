import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Overview } from './pages/dashboard/Overview';

const App: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="relative min-h-screen bg-[#0f172a]">
      {/* Only show public Navbar if not on dashboard */}
      {!isDashboard && <Navbar />}
      
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout>
                  <Routes>
                    <Route index element={<Overview />} />
                    <Route path="rooms" element={<div className="text-white p-8">Rooms Management coming soon...</div>} />
                    <Route path="bookings" element={<div className="text-white p-8">Bookings Management coming soon...</div>} />
                    <Route path="users" element={<div className="text-white p-8">User Management coming soon...</div>} />
                    <Route path="settings" element={<div className="text-white p-8">Settings coming soon...</div>} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      
      {/* Only show public Footer if not on dashboard */}
      {!isDashboard && (
        <footer className="bg-primary/95 text-white/60 py-12 border-t border-white/5">
          <div className="container mx-auto px-6 text-center">
            <p>© 2025 Champion Hotel Management System. All rights reserved.</p>
            <p className="mt-2 text-sm">Developed by Joseph Kilonzo Nzomo - Zetech University</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
