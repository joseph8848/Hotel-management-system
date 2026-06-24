import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type UserType = 'customer' | 'staff' | 'admin';

export const LoginPage: React.FC = () => {
  const [userType, setUserType] = useState<UserType>('customer');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials: any = { user_type: userType, password };
      if (userType === 'customer') {
        credentials.email = identifier;
      } else {
        credentials.username = identifier;
      }

      await login(credentials);
      navigate(userType === 'customer' ? '/booking' : '/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 glass-card p-10 fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-secondary/20">
            <LogIn className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-display text-white mb-2 uppercase tracking-tight">Welcome Back</h2>
          <p className="text-white/60">Choose your portal to sign in</p>
        </div>

        {/* User Type Tabs */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-8">
          {(['customer', 'staff', 'admin'] as UserType[]).map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-300 capitalize ${
                userType === type 
                ? 'bg-secondary text-white shadow-md' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">
              {userType === 'customer' ? 'Email Address' : 'Username'}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-secondary transition-colors">
                {userType === 'customer' ? <Mail size={18} /> : <User size={18} />}
              </div>
              <input
                type={userType === 'customer' ? 'email' : 'text'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-secondary transition-all"
                placeholder={userType === 'customer' ? 'name@example.com' : 'Your username'}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/40 group-focus-within:text-secondary transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-secondary transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm py-2">
            <label className="flex items-center gap-2 text-white/60 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary/20" />
              Remember me
            </label>
            <a href="#" className="text-secondary hover:underline underline-offset-4">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/50 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In to {userType.charAt(0).toUpperCase() + userType.slice(1)} Portal
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-white/40 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-secondary hover:underline font-medium">Create one for free</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
