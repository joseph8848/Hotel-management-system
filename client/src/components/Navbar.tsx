import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#1a365d]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-display text-xl group-hover:scale-110 transition-transform">CH</div>
          <span className="text-white font-display text-xl tracking-wider uppercase">Champion Hotel</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`nav-link ${isHome ? 'active' : ''}`}>Home</Link>
          <Link to="/#rooms" className="nav-link">Rooms</Link>
          <Link to="/#amenities" className="nav-link">Amenities</Link>
          <Link to="/#about" className="nav-link">About</Link>
        </div>
        
        <div className="flex gap-4">
          <Link to="/login" className="btn btn-outline border-white/20 text-white hover:bg-white/10 hidden sm:block">Sign In</Link>
          <Link to="/login" className="btn btn-primary">Book Now</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
