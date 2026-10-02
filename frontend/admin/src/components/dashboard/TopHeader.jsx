import React from 'react';
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  Download,
  UserCheck
} from 'lucide-react';

export default function TopHeader({
  onOpenSearch = () => {},
  onOpenVerifyModal = () => {},
  onExportLedger = () => {},
  onOpenHelp = () => {},
  onOpenNotifications = () => {},
  onOpenCouncil = () => {},
  onOpenLedgers = () => {}
}) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Admin Portal</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-800 font-semibold">Dashboard Overview</span>
      </div>

      {/* Right / Center Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar with ⌘K shortcut */}
        <div
          onClick={onOpenSearch}
          className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 cursor-pointer transition w-44 md:w-56"
        >
          <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
          <span className="truncate flex-1 text-slate-400">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            ⌘K
          </kbd>
        </div>

        {/* Quick Links */}
        <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-600">
          <button
            onClick={onOpenLedgers}
            className="hover:text-blue-600 transition px-1 py-1"
          >
            Dividend Ledgers
          </button>
          <button
            onClick={onOpenCouncil}
            className="hover:text-blue-600 transition px-1 py-1"
          >
            Gov Council
          </button>
        </div>

        {/* Gateway SLA Pill */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5">
          <div className="flex flex-col text-right leading-none">
            <span className="text-[10px] text-slate-500 font-medium">Central Gateway:</span>
            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              99.98% SLA
            </span>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
          <button
            onClick={onOpenNotifications}
            title="Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
          </button>
          <button
            title="Messages"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenHelp}
            title="Help & Support"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pl-1">
          <button
            onClick={onExportLedger}
            className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Ledger</span>
          </button>

          <button
            onClick={onOpenVerifyModal}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verify Worker</span>
          </button>
        </div>
      </div>
    </header>
  );
}
