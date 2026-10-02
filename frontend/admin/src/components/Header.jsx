import React, { useState, useRef, useEffect } from 'react';
import { Globe, HelpCircle, ChevronDown, Check } from 'lucide-react';
import Logo from './Logo';

export default function Header({ onHelpClick }) {
  const [langOpen, setLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'EN', label: 'English (US)' },
    { code: 'TA', label: 'தமிழ் (Tamil)' },
    { code: 'ES', label: 'Español (ES)' },
    { code: 'DE', label: 'Deutsch (DE)' },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 flex items-center justify-between">
      {/* Brand Logo on Left */}
      <a href="/" className="transition-opacity hover:opacity-90">
        <Logo size="md" />
      </a>

      {/* Right Utility Navigation */}
      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-600">
        {/* Language Switcher Dropdown on Top */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#A3C4BC]/60 bg-white/90 hover:bg-[#F4F8F7] text-[#2B4D47] shadow-2xs transition focus:outline-none focus:ring-2 focus:ring-[#A3C4BC]/30"
            aria-expanded={langOpen}
            aria-label="Select Language"
          >
            <Globe className="w-4 h-4 text-[#557E75]" />
            <span className="font-semibold text-xs uppercase">{selectedLang}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-[#557E75] transition-transform duration-150 ${langOpen ? 'rotate-180' : ''}`} />
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-[#A3C4BC]/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setSelectedLang(lang.code);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition ${
                    selectedLang === lang.code
                      ? 'bg-[#E6F0ED] text-[#2B4D47] font-semibold'
                      : 'text-slate-600 hover:bg-[#F4F8F7]'
                  }`}
                >
                  <span>{lang.label}</span>
                  {selectedLang === lang.code && <Check className="w-3.5 h-3.5 text-[#4B7D73]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Support & Help Button */}
        <button
          type="button"
          onClick={onHelpClick}
          className="flex items-center gap-1.5 text-slate-600 hover:text-[#2B4D47] transition px-2.5 py-1.5 rounded-lg hover:bg-[#E6F0ED]/60"
        >
          <HelpCircle className="w-4 h-4 text-[#557E75]" />
          <span className="font-semibold">Support &amp; Help</span>
        </button>
      </div>
    </header>
  );
}
