import React from 'react';
import { Shield } from 'lucide-react';

export default function Footer({ onOpenModal }) {
  return (
    <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500 font-medium">
      {/* Left Copyright */}
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4 text-[#6F9E94]" />
        <span>GigGo Enterprise Access Control &copy; 2025</span>
      </div>

      {/* Right Policy Links */}
      <div className="flex items-center gap-5 sm:gap-6">
        <button
          type="button"
          onClick={() => onOpenModal?.('Security Policy')}
          className="hover:text-[#2B4D47] transition"
        >
          Security Policy
        </button>
        <button
          type="button"
          onClick={() => onOpenModal?.('Terms of Service')}
          className="hover:text-[#2B4D47] transition"
        >
          Terms of Service
        </button>
        <button
          type="button"
          onClick={() => onOpenModal?.('System Status')}
          className="hover:text-[#2B4D47] transition flex items-center gap-1.5"
        >
          <span className="w-2 h-2 rounded-full bg-[#4B7D73] animate-pulse" />
          <span>System Status</span>
        </button>
      </div>
    </footer>
  );
}
