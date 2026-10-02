import React from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Wrench,
  CalendarCheck,
  AlertTriangle,
  BarChart2,
  Settings,
  ScrollText,
  ShieldCheck,
  LogOut,
  Scale
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

export default function Sidebar({
  activeNav = 'dashboard',
  onSelectNav = () => {},
  onOpenDisputeQueue = () => {},
  onLogout = () => {},
  complaintsCount = 7
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cooperatives', label: 'Cooperatives', icon: Users },
    { id: 'workers', label: 'Workers', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: '342', badgeColor: 'bg-blue-100 text-blue-700' },
    { id: 'complaints', label: 'Complaints', icon: AlertTriangle, hasDot: true },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-screen flex flex-col justify-between py-5 px-4 select-none shrink-0">
      <div>
        {/* Brand / Logo Header */}
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-xs bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <img src={logoImg} alt="GigGo" className="w-7 h-7 object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="font-bold text-slate-900 text-[15px] leading-tight flex items-center gap-1.5">
              GigGo Portal
            </div>
            <div className="text-[11px] text-slate-400 font-medium leading-tight">
              Worker-Owned Admin
            </div>
          </div>
        </div>

        {/* Top Dispute Queue Banner matching screenshot */}
        <button
          onClick={onOpenDisputeQueue}
          className="w-full flex items-center justify-between px-3 py-2 mb-5 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 text-blue-700 border border-blue-100/90 transition shadow-2xs group"
        >
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs font-bold">Dispute Queue</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
            3 Active
          </span>
        </button>

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                <span className="flex-1">{item.label}</span>
                {item.hasDot ? (
                  <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                ) : item.badge !== undefined ? (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-600 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Section */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="space-y-1">
          <button
            onClick={() => onSelectNav('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
              activeNav === 'settings' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </button>
          <button
            onClick={() => onSelectNav('audit-logs')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition text-left ${
              activeNav === 'audit-logs' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ScrollText className="w-4 h-4 text-slate-500" />
            <span>Audit Logs</span>
          </button>
        </div>

        {/* Municipal Union Hub Status Card */}
        <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100/80 flex items-center gap-2.5 shadow-2xs">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-800 leading-tight truncate">
              Municipal Union Hub
            </div>
            <div className="text-[10px] text-slate-500 leading-tight truncate">
              Consensus Node: v4.8
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="border border-slate-200 bg-white rounded-xl p-2.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
              PA
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-800 leading-tight truncate">
                Admin
              </div>
              <div className="text-[11px] text-slate-400 leading-tight truncate">
                admin@giggo.coop
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
