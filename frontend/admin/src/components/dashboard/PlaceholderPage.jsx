import React from 'react';
import Sidebar from './Sidebar';
import {
  AlertTriangle,
  BarChart2,
  Settings,
  ScrollText,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  Download,
  Search,
  Bell,
  HelpCircle,
  MessageSquare
} from 'lucide-react';

const PAGE_CONFIGS = {
  complaints: {
    title: 'Grievance & Complaints Tribunal',
    subtitle: 'Worker dispute mediation, wage claim arbitration, and municipal complaint filings.',
    badge: 'Arbitration Council v4.8',
    icon: AlertTriangle,
    iconColor: 'text-amber-600 bg-amber-50',
    phase: 'Phase 2 Sprint Module',
    stats: [
      { label: 'Active Complaints', value: '7', note: '3 require council review' },
      { label: 'Avg Resolution Time', value: '3.4 hrs', note: 'Arbitration standard <6h' },
      { label: 'Escrow Under Dispute', value: '₹42,800', note: 'Multi-sig lock active' }
    ]
  },
  reports: {
    title: 'Federation Analytics & Financial Reports',
    subtitle: 'Consolidated cooperative wage distribution, municipality trade volumes, and dividend yield audit.',
    badge: 'Fiscal Ledger 2026',
    icon: BarChart2,
    iconColor: 'text-blue-600 bg-blue-50',
    phase: 'Phase 2 Sprint Module',
    stats: [
      { label: 'Total Volume Dispatched', value: '₹1.84 Cr', note: 'Across 6 guild sectors' },
      { label: 'Co-op Dividend Distributed', value: '₹14.2 Lakh', note: 'Quarterly payout complete' },
      { label: 'Worker Wage Retention', value: '88.4%', note: 'Statutory minimum met' }
    ]
  },
  settings: {
    title: 'Platform Governance & Protocol Settings',
    subtitle: 'Configure municipal trade rate floors, consensus quorum, 2-of-3 steward multi-sig keys, and SLA rules.',
    badge: 'Consensus Node v4.8',
    icon: Settings,
    iconColor: 'text-slate-700 bg-slate-100',
    phase: 'Administrative Settings Module',
    stats: [
      { label: 'Consensus Threshold', value: '66.7%', note: '2-of-3 Stewards required' },
      { label: 'Rate Floor Rule', value: 'Enforced', note: 'Statutory Living Wage Lock' },
      { label: 'Smart Escrow Mesh', value: 'Active', note: 'Cryptographic ledger live' }
    ]
  },
  'audit-logs': {
    title: 'Cryptographic Audit & Consensus Logs',
    subtitle: 'Tamper-evident hash records for all rate card modifications, worker credentialings, and escrow releases.',
    badge: 'Hash Chain Verified',
    icon: ScrollText,
    iconColor: 'text-emerald-700 bg-emerald-50',
    phase: 'Ledger Audit Module',
    stats: [
      { label: 'Ledger Height', value: '#482,910', note: 'Block time 12s' },
      { label: 'Signatures Verified', value: '14,290', note: '0 invalid cryptographic proofs' },
      { label: 'Audit Compliance', value: 'ISO 27001', note: 'SOC-2 Type II Certified' }
    ]
  }
};

export default function PlaceholderPage({
  viewId = 'complaints',
  onNavigate = () => {},
  onLogout = () => {}
}) {
  const config = PAGE_CONFIGS[viewId] || {
    title: `${viewId.charAt(0).toUpperCase() + viewId.slice(1)} Module`,
    subtitle: 'Worker-owned cooperative platform module under governance review.',
    badge: 'Co-op Protocol v4.8',
    icon: Layers,
    iconColor: 'text-blue-600 bg-blue-50',
    phase: 'Module Active',
    stats: []
  };

  const Icon = config.icon;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* Base Layout Shell: Sidebar */}
      <Sidebar
        activeNav={viewId}
        onSelectNav={(id) => onNavigate(id)}
        onLogout={onLogout}
      />

      {/* Base Layout Shell: Main Content with Navbar */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">
              Admin Portal
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-900 font-semibold">{config.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 w-56">
              <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                readOnly
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <Bell className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content Shell */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {config.title}
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {config.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {config.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                <span>Return to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          {config.stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {config.stats.map((st, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <div className="text-xs font-medium text-slate-500">{st.label}</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{st.value}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{st.note}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Card Shell / Placeholder Box */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs text-center flex flex-col items-center justify-center min-h-[340px]">
            <div className={`w-14 h-14 rounded-2xl ${config.iconColor} flex items-center justify-center mb-4 shadow-xs`}>
              <Icon className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-2 border border-slate-200">
              {config.phase}
            </span>

            <h3 className="text-lg font-bold text-slate-800">
              {config.title} Shell Active
            </h3>

            <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
              This module is wired to the GigGo Base Layout Shell. Full data telemetry, arbitration queues, and cooperative exports connect to the backend services mesh.
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-xs"
              >
                Go to Overview
              </button>
              <button
                onClick={() => onNavigate('cooperatives')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Explore Cooperatives
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
