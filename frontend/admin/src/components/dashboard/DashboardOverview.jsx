import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import KpiCards from './KpiCards';
import WeeklyVolumeChart from './WeeklyVolumeChart';
import DemandBreakdown from './DemandBreakdown';
import PendingApprovalsQueue from './PendingApprovalsQueue';
import PlatformAuditFeed from './PlatformAuditFeed';
import {
  VerifyWorkerModal,
  ReviewApprovalModal,
  AuditExplorerModal,
  DisputeQueueModal,
  CommandPaletteModal
} from './Modals';
import {
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Shield,
  Layers,
  Users,
  Briefcase,
  Wrench,
  CalendarCheck,
  AlertTriangle,
  BarChart2
} from 'lucide-react';

export default function DashboardOverview({ onLogout = () => {}, onNavigate = () => {} }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [timeFilter, setTimeFilter] = useState('Last 7 Days');
  const [toast, setToast] = useState(null);

  // Modals state
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedApprovalItem, setSelectedApprovalItem] = useState(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDisputeQueueOpen, setIsDisputeQueueOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Interactive state
  const [complaintsCount, setComplaintsCount] = useState(7);
  const [kpiStats, setKpiStats] = useState({
    totalCooperatives: 48,
    totalWorkers: '1,240',
    activeServices: 320,
    totalBookings: 856,
    pendingApprovals: 18,
    openComplaints: 7,
  });

  const [approvalItems, setApprovalItems] = useState([
    {
      id: 'app-1',
      title: 'Salem Skilled Electricians Guild',
      type: 'Co-op Registration',
      typeBadgeColor: 'bg-blue-50 text-blue-600',
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
      certDetails: 'Trade Cert: TN-ELEC-492 • 14 Certified Electricians • Salem District',
      submittedDate: 'Submitted: Oct 24, 2025',
      verificationTag: {
        text: 'KYC Done',
        icon: CheckCircle2,
        color: 'text-emerald-600 font-semibold',
      },
    },
    {
      id: 'app-2',
      title: 'Madurai Carpenter Co-op (Batch of 6)',
      type: 'Worker Expansion',
      typeBadgeColor: 'bg-blue-50 text-blue-600',
      icon: Users,
      iconBg: 'bg-amber-50 text-amber-600',
      certDetails: 'Trade Cert: National Skill Dev Council (NSDC Level 3) • Madurai Hub',
      submittedDate: 'Submitted: Oct 23, 2025',
      verificationTag: {
        text: 'Trade Audit Req.',
        icon: AlertTriangle,
        color: 'text-amber-600 font-semibold',
      },
    },
    {
      id: 'app-3',
      title: 'Karthik R. (Individual Guild Plumber)',
      type: 'Direct Member',
      typeBadgeColor: 'bg-emerald-50 text-emerald-700',
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
      certDetails: 'Trade Cert: ITI Plumbing Gold Seal • Chennai Central Cooperative',
      submittedDate: 'Submitted: Today, 10:14 AM',
      verificationTag: {
        text: 'Biometrics Verified',
        icon: CheckCircle2,
        color: 'text-emerald-600 font-semibold',
      },
    },
  ]);

  // Keyboard shortcut for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showNotification = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleApprove = (item) => {
    setApprovalItems((prev) => prev.filter((p) => p.id !== item.id));
    setKpiStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
      totalCooperatives: item.type === 'Co-op Registration' ? prev.totalCooperatives + 1 : prev.totalCooperatives,
    }));
    showNotification(
      'Certification Approved & Minted',
      `${item.title} has been authenticated and registered to the cooperative mesh.`
    );
  };

  const handleReject = (item) => {
    setApprovalItems((prev) => prev.filter((p) => p.id !== item.id));
    setKpiStats((prev) => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1),
    }));
    showNotification(
      'Application Rejected',
      `Application for ${item.title} was rejected with notification to district officer.`,
      'error'
    );
  };

  const handleExportLedger = () => {
    const csvContent =
      'Date,Cooperative,Worker_ID,Gross_Wage,Platform_Mesh_Fee,Net_Disbursed,Tx_Hash\n' +
      '2025-10-24,Salem Skilled Electricians,GIG-8821,₹12400,₹347,₹12053,0x9f32...8a12\n' +
      '2025-10-24,Chennai Labour Co-op,GIG-7112,₹8500,₹238,₹8262,0x3d41...77b1\n' +
      '2025-10-23,Madurai Carpenter Co-op,GIG-6604,₹15400,₹431,₹14969,0x11ab...e04b\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `giggo-fair-wage-ledger-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Fair Wage Ledger Exported', 'Verified settlement records downloaded successfully.');
  };

  const handleWorkerVerified = (worker) => {
    setKpiStats((prev) => {
      const num = parseInt(prev.totalWorkers.replace(/,/g, ''), 10) + 1;
      return { ...prev, totalWorkers: num.toLocaleString() };
    });
    showNotification(
      'Worker Verified & Added to Ledger',
      `${worker.name} (${worker.workerId}) authorized with ${worker.trade} credentials.`
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`p-3.5 rounded-2xl shadow-xl border flex items-start gap-3 backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-white'
                : toast.type === 'error'
                ? 'bg-rose-950/95 border-rose-500/40 text-white'
                : 'bg-slate-900/95 border-slate-700 text-white'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-100">{toast.title}</p>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={(id) => {
          setActiveNav(id);
          onNavigate(id);
        }}
        onOpenDisputeQueue={() => setIsDisputeQueueOpen(true)}
        onLogout={onLogout}
        complaintsCount={complaintsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
          onExportLedger={handleExportLedger}
          onOpenHelp={() =>
            showNotification(
              'Federation Support Desk',
              'Need assistance? Hotline: 1800-GIGGO-OPS • Helpdesk: support@giggo.coop',
              'info'
            )
          }
          onOpenNotifications={() =>
            showNotification(
              'Telemetry Alerts',
              'All nodes operating at 99.98% SLA. Next automated pool dividend split in 3h 24m.',
              'info'
            )
          }
          onOpenCouncil={() =>
            showNotification(
              'Governance Council',
              'Next Tripartite Labour Council voting session opens Friday 10:00 AM IST.',
              'info'
            )
          }
          onOpenLedgers={() => setIsAuditModalOpen(true)}
        />

        {/* Dashboard Main View */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Title & Filter Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Dashboard Overview
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Unified governance and operations console for certified labour cooperatives across India. Real-time wage dispersals, dispatch mesh telemetry, and worker verification audits.
              </p>
            </div>

            {/* Time Filter Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
              <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                {['Last 7 Days', '30 Days', 'Quarter'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setTimeFilter(tab);
                      showNotification('Range Filter Updated', `Viewing metrics for ${tab}.`, 'info');
                    }}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      timeFilter === tab
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Sliders Filter Button */}
              <button
                onClick={() =>
                  showNotification(
                    'Regional Filters',
                    'Filters: State = All (TN, KA, MH), Trade Mesh = 9 Active.',
                    'info'
                  )
                }
                title="Filter Settings"
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPI Stat Cards (6 in a row) */}
          <KpiCards
            stats={kpiStats}
            onCardClick={(id) => {
              if (id === 'cooperatives') onNavigate('cooperatives');
              else if (id === 'complaints') setIsDisputeQueueOpen(true);
              else if (id === 'approvals') {
                const el = document.getElementById('pending-approvals');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />

          {/* Middle Section: Volume Chart (65%) + Demand Breakdown (35%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-8">
              <WeeklyVolumeChart timeFilter={timeFilter} />
            </div>
            <div className="lg:col-span-4">
              <DemandBreakdown
                onViewAllTrades={() =>
                  showNotification(
                    'Certified Trade Registry',
                    '9 active certified trades: Electrician, Plumbing, Cleaning, Carpentry, Painting, Masonry, Appliance Repair, Gardening, Heavy Lifting.',
                    'info'
                  )
                }
              />
            </div>
          </div>

          {/* Bottom Section: Pending Approvals Queue (60%) + Platform Audit Feed (40%) */}
          <div id="pending-approvals" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div className="lg:col-span-7">
              <PendingApprovalsQueue
                items={approvalItems}
                onReview={(item) => setSelectedApprovalItem(item)}
                onReject={(item) => handleReject(item)}
                onViewAll={() =>
                  showNotification(
                    'Approvals Catalog',
                    `Displaying 3 high-priority applications. Total 18 pending review in queue.`,
                    'info'
                  )
                }
              />
            </div>
            <div className="lg:col-span-5">
              <PlatformAuditFeed onOpenAuditExplorer={() => setIsAuditModalOpen(true)} />
            </div>
          </div>
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>GigGo Enterprise Access Control © 2025</span>
            <span className="text-slate-300">•</span>
            <span>Worker Cooperative Digital Federation</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <button
              onClick={() => showNotification('Security Policy', 'SOC 2 Type II & ISO 27001 Certified Governance', 'info')}
              className="hover:text-blue-600 transition"
            >
              Security Policy
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => showNotification('Terms of Service', 'Federation Constitution and Co-op By-laws v4.5', 'info')}
              className="hover:text-blue-600 transition"
            >
              Terms of Service
            </button>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              System Status
            </span>
          </div>
        </footer>
      </div>

      {/* Interactive Modals */}
      <VerifyWorkerModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        onVerifySuccess={handleWorkerVerified}
      />

      <ReviewApprovalModal
        item={selectedApprovalItem}
        isOpen={Boolean(selectedApprovalItem)}
        onClose={() => setSelectedApprovalItem(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AuditExplorerModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      <DisputeQueueModal
        isOpen={isDisputeQueueOpen}
        onClose={() => setIsDisputeQueueOpen(false)}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={(action) => {
          if (action.title.includes('Verify Worker')) setIsVerifyModalOpen(true);
          else if (action.title.includes('Export Weekly')) handleExportLedger();
          else if (action.title.includes('Dispute')) setIsDisputeQueueOpen(true);
          else if (action.title.includes('Cryptographic Block Explorer')) setIsAuditModalOpen(true);
          else showNotification('Command Executed', action.title, 'info');
        }}
      />
    </div>
  );
}
