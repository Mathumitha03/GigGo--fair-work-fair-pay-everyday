import React, { useState } from 'react';
import { AtSign, KeyRound, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import Logo from './Logo';

export default function LoginForm({ onNotify, onLoginSubmit, onForgotPassword }) {
  const [identifier, setIdentifier] = useState('admin@giggo.coop');
  const [password, setPassword] = useState('Admin@GigGo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      onNotify?.({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your Admin email or username.',
      });
      return;
    }
    if (!password) {
      onNotify?.({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter your secure password.',
      });
      return;
    }

    setIsLoading(true);

    if (onLoginSubmit) {
      await onLoginSubmit(identifier, password);
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        onNotify?.({
          type: 'success',
          title: 'Access Granted',
          message: `Welcome back, ${identifier}! Redirecting to Admin Dashboard...`,
        });
      }, 1000);
    }
  };

  const handleGoogleLogin = () => {
    onNotify?.({
      type: 'info',
      title: 'Google SSO Initiated',
      message: 'Redirecting to enterprise identity provider...',
    });
  };

  return (
    <div className="bg-[#FFFDF6] p-8 sm:p-10 lg:p-12 flex flex-col justify-center rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
      {/* Container inside Login Form */}
      <div className="w-full max-w-sm mx-auto">
        {/* Brand Logo with official image */}
        <div className="flex justify-center mb-6">
          <Logo size="md" center={true} />
        </div>

        {/* Section Heading */}
        <h2 className="text-2xl sm:text-[26px] font-bold text-center text-[#1E293B] mb-7">
          Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email or Username Field */}
          <div className="space-y-1.5">
            <label 
              htmlFor="identifier" 
              className="block text-xs sm:text-sm font-semibold text-slate-700"
            >
              Email or Username
            </label>
            <div className="relative rounded-2xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <AtSign className="w-4 h-4 text-[#6F9E94]" />
              </div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. admin@giggo.co"
                required
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white/90 hover:bg-white border border-[#A3C4BC]/50 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#A3C4BC]/30 focus:border-[#4B7D73] transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="block text-xs sm:text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-semibold text-[#4B7D73] hover:text-[#2B4D47] hover:underline transition"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative rounded-2xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4 text-[#6F9E94]" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/90 hover:bg-white border border-[#A3C4BC]/50 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#A3C4BC]/30 focus:border-[#4B7D73] transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me Row */}
          <div className="flex items-center justify-start pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#4B7D73] border-slate-300 focus:ring-[#A3C4BC]/30 transition cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600">Remember me</span>
            </label>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#4B7D73] hover:bg-[#39635B] text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all duration-150 flex items-center justify-center gap-2 focus:outline-none focus:ring-4 focus:ring-[#A3C4BC]/30 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#A3C4BC]/30" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
            <span className="bg-[#FFFDF6] px-3 text-slate-400">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* Social SSO Button (Google) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-[#F4F8F7] border border-[#A3C4BC]/50 text-slate-700 font-semibold text-sm transition shadow-xs flex items-center justify-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#A3C4BC]/30 active:scale-[0.99]"
        >
          {/* Authentic Google Multi-color G icon */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}
