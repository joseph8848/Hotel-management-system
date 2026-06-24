import React from 'react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-transparent z-10" />
        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
      </div>
      
      <div className="container relative z-20 px-6 text-center text-white">
        <h1 className="text-5xl md:text-8xl font-display uppercase tracking-tighter mb-6 fade-in">
          Welcome to <span className="text-secondary">Champion</span> Hotel
        </h1>
        <p className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto opacity-90 delay-100 fade-in">
          Experience world-class luxury, unparalleled comfort, and exceptional service in the heart of Nairobi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 delay-200 fade-in">
          <Link to="/login" className="btn btn-primary btn-lg px-12 py-4 text-lg">Book Your Stay</Link>
          <a href="#rooms" className="btn btn-outline border-white text-white btn-lg px-12 py-4 text-lg hover:bg-white/10 text-center">Explore Rooms</a>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 opacity-70">
        <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
