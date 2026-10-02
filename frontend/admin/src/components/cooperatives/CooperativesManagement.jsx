import React, { useState, useMemo } from 'react';
import Sidebar from '../dashboard/Sidebar';
import {
  AddCooperativeModal,
  ReviewCoopModal,
  AuditLedgerModal,
  DisputeTrailModal
} from './CooperativeModals';
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  Download,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Briefcase,
  Wrench,
  Clock,
  Landmark,
  Scale,
  Building2,
  ChevronDown,
  X,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
  Zap,
  Sparkles,
  Hammer,
  BadgeCheck,
  RotateCcw
} from 'lucide-react';

export default function CooperativesManagement({
  onNavigate = () => {},
  onLogout = () => {}
}) {
  // Filter states
  const [activeStatusTab, setActiveStatusTab] = useState('All'); // 'All' | 'Active' | 'Pending Review' | 'Suspended'
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedTrade, setSelectedTrade] = useState('All Trades');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reviewCoop, setReviewCoop] = useState(null);
  const [auditCoop, setAuditCoop] = useState(null);
  const [disputeCoop, setDisputeCoop] = useState(null);
  const [toast, setToast] = useState(null);

  const showNotification = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 7 Cooperatives matching screenshot
  const [cooperatives, setCooperatives] = useState([
    {
      id: 'coop-1',
      name: 'Chennai Labour Cooperative',
      verified: true,
      regId: 'Reg: TN-CH-2024-089 • Est. 2021',
      icon: ShieldCheck,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Chennai Central & South',
      subZone: 'Zones 5, 8 & 9 (Corporation)',
      workerAvatars: ['M', 'K', '+3'],
      workersCount: '342 Workers',
      quorumDetail: '99.2% Biometrics Enrolled',
      quorumColor: 'text-emerald-600',
      trades: ['Plumbing', 'Electrical', 'Cleaning'],
      governanceIcon: ShieldCheck,
      governanceColor: 'text-emerald-600',
      governanceStatus: 'KYC & Ledger Verified',
      governanceSub: 'AGM Audit: Passed Jan 2025',
      status: 'Active',
      statusType: 'active',
      actionType: 'audit',
      actionLabel: 'Audit Ledger',
    },
    {
      id: 'coop-2',
      name: 'Madurai Labour Cooperative',
      verified: true,
      regId: 'Reg: TN-MD-2022-114 • Est. 2022',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Madurai District Hub',
      subZone: 'Simmakkal & Mattuthavani',
      workerAvatars: ['S', 'R'],
      workersCount: '218 Workers',
      quorumDetail: '96.8% Biometrics Enrolled',
      quorumColor: 'text-emerald-600',
      trades: ['Carpentry', 'Masonry', 'Painting'],
      governanceIcon: ShieldCheck,
      governanceColor: 'text-emerald-600',
      governanceStatus: 'KYC Verified & Bylaws Filed',
      governanceSub: 'Fair Wage Certified (Grade A)',
      status: 'Active',
      statusType: 'active',
      actionType: 'audit',
      actionLabel: 'Audit Ledger',
    },
    {
      id: 'coop-3',
      name: 'Salem Skilled Electricians Guild',
      verified: false,
      badge: 'Pending Approval',
      regId: 'Reg: TN-SLM-2025-APP-03 • App. Oct 2024',
      icon: Zap,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Salem Municipal Zone',
      subZone: 'Hasthampatti & Shevapet',
      workersCount: '46 Workers',
      quorumDetail: 'Biometrics 100% Complete',
      quorumColor: 'text-blue-600',
      trades: ['Electrical', 'Substation Maintenance'],
      governanceIcon: Clock,
      governanceColor: 'text-blue-600',
      governanceStatus: 'Pending Bylaw Scrutiny',
      governanceSub: 'Municipal Registrar Review',
      status: 'Pending Review',
      statusType: 'pending',
      actionType: 'review',
      actionLabel: 'Review Co-op',
    },
    {
      id: 'coop-4',
      name: 'Coimbatore Allied Artisans Co-op',
      verified: true,
      regId: 'Reg: TN-CBE-2023-042 • Est. 2020',
      icon: Hammer,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Coimbatore Urban',
      subZone: 'Peelamedu & Gandhipuram',
      workerAvatars: ['P', 'V'],
      workersCount: '280 Workers',
      quorumDetail: '97.5% Biometrics Enrolled',
      quorumColor: 'text-emerald-600',
      trades: ['Carpentry', 'Metalwork', 'HVAC'],
      governanceIcon: ShieldCheck,
      governanceColor: 'text-emerald-600',
      governanceStatus: 'Ledger Audited & Fair Wage Passed',
      governanceSub: 'Quarterly Dividend: Disbursed',
      status: 'Active',
      statusType: 'active',
      actionType: 'audit',
      actionLabel: 'Audit Ledger',
    },
    {
      id: 'coop-5',
      name: 'Tirunelveli Civic Sanitation Guild',
      verified: true,
      regId: 'Reg: TN-TNV-2023-018 • Est. 2019',
      icon: Sparkles,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Tirunelveli Corporation',
      subZone: 'Town & Junction Wards',
      workersCount: '195 Workers',
      quorumDetail: '100% Occupational Health Covered',
      quorumColor: 'text-emerald-600',
      trades: ['Sanitation', 'Waste Handling'],
      governanceIcon: ShieldCheck,
      governanceColor: 'text-emerald-600',
      governanceStatus: 'Fair Wage Audited',
      governanceSub: 'State Board Safety Compliant',
      status: 'Active',
      statusType: 'active',
      actionType: 'audit',
      actionLabel: 'Audit Ledger',
    },
    {
      id: 'coop-6',
      name: 'Vellore Home Maintenance Union',
      verified: false,
      badge: 'Doc Review',
      regId: 'Reg: TN-VEL-2025-APP-09 • App. Dec 2024',
      icon: Wrench,
      iconBg: 'bg-blue-50 text-blue-600',
      primaryZone: 'Vellore Cantonment',
      subZone: 'Katpadi & Sathuvachari',
      workersCount: '32 Workers',
      quorumDetail: 'Roster Submission Incomplete',
      quorumColor: 'text-slate-500',
      trades: ['General Repairs', 'Appliance Care'],
      governanceIcon: FileText,
      governanceColor: 'text-blue-600',
      governanceStatus: 'Document Review in Progress',
      governanceSub: 'Pending Police NOC verification',
      status: 'Pending Review',
      statusType: 'pending',
      actionType: 'review',
      actionLabel: 'Review Co-op',
    },
    {
      id: 'coop-7',
      name: 'Erode Weavers & Facility Coop',
      verified: false,
      badge: 'Compliance Hold',
      badgeColor: 'bg-red-50 text-red-600 border-red-200',
      regId: 'Reg: TN-ERD-2021-004 • Est. 2018',
      icon: AlertTriangle,
      iconBg: 'bg-red-50 text-red-600',
      primaryZone: 'Erode Industrial Zone',
      subZone: 'Perundurai Belt',
      workersCount: '127 Workers',
      quorumDetail: 'Escrow Access Frozen',
      quorumColor: 'text-red-600 font-bold',
      trades: ['Facility Care', 'Industrial Cleaning'],
      governanceIcon: AlertTriangle,
      governanceColor: 'text-red-600',
      governanceStatus: 'Bylaw Dispute Unresolved',
      governanceSub: 'Re-audit scheduled 12 Mar 2025',
      status: 'Suspended',
      statusType: 'suspended',
      actionType: 'dispute',
      actionLabel: 'Dispute Trail',
    },
  ]);

  // Filtered cooperatives list
  const filteredCooperatives = useMemo(() => {
    return cooperatives.filter((coop) => {
      // Status filter
      if (activeStatusTab === 'Active' && coop.status !== 'Active') return false;
      if (activeStatusTab === 'Pending Review' && coop.status !== 'Pending Review') return false;
      if (activeStatusTab === 'Suspended' && coop.status !== 'Suspended') return false;

      // Region filter
      if (selectedRegion !== 'All Regions' && !coop.primaryZone.toLowerCase().includes(selectedRegion.toLowerCase())) {
        return false;
      }

      // Trade filter
      if (selectedTrade !== 'All Trades') {
        const matchesTrade = coop.trades.some((t) => t.toLowerCase().includes(selectedTrade.toLowerCase()));
        if (!matchesTrade) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = coop.name.toLowerCase().includes(q);
        const matchesZone = coop.primaryZone.toLowerCase().includes(q);
        const matchesReg = coop.regId.toLowerCase().includes(q);
        if (!matchesName && !matchesZone && !matchesReg) return false;
      }

      return true;
    });
  }, [cooperatives, activeStatusTab, selectedRegion, selectedTrade, searchQuery]);

  const handleApproveCoop = (coop) => {
    setCooperatives((prev) =>
      prev.map((c) =>
        c.id === coop.id
          ? {
              ...c,
              status: 'Active',
              statusType: 'active',
              badge: null,
              verified: true,
              actionType: 'audit',
              actionLabel: 'Audit Ledger',
              governanceStatus: 'KYC & Ledger Verified',
              governanceSub: 'Activated by Super Admin on ' + new Date().toLocaleDateString(),
              governanceColor: 'text-emerald-600',
              governanceIcon: ShieldCheck,
            }
          : c
      )
    );
    showNotification('Cooperative Activated', `${coop.name} has been certified and issued on-chain credentials.`);
  };

  const handleRejectCoop = (coop) => {
    showNotification('Revision Requested', `Notice dispatched to ${coop.name} secretary for documentation revision.`, 'info');
  };

  const handleAddCooperative = (newCoop) => {
    setCooperatives((prev) => [newCoop, ...prev]);
    showNotification('Cooperative Registered', `${newCoop.name} submitted for municipal verification.`);
  };

  const handleExportRegistryCSV = () => {
    let csv = 'Cooperative Name,Registration ID,Primary Zone,Worker Quorum,Trades,Governance Status,Status\n';
    filteredCooperatives.forEach((c) => {
      csv += `"${c.name}","${c.regId}","${c.primaryZone}","${c.workersCount}","${c.trades.join(', ')}","${c.governanceStatus}","${c.status}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `giggo-cooperatives-registry-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Registry Exported', 'Certified cooperatives CSV file downloaded.');
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
              {toast.type === 'info' && <ShieldCheck className="w-4 h-4 text-blue-400" />}
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
        activeNav="cooperatives"
        onSelectNav={(id) => onNavigate(id)}
        onLogout={onLogout}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">
              Admin Portal
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Cooperatives</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 transition w-44 md:w-56">
              <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search cooperatives..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>

            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-600">
              <button
                onClick={() => showNotification('Dividend Ledgers', 'Federation Escrow Pool settlement sync complete.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dividend Ledgers
              </button>
              <button
                onClick={() => showNotification('Gov Council', 'Tripartite Labour Council Voting open.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Gov Council
              </button>
            </div>

            {/* Icon buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => showNotification('Notifications', 'All 18 Node Validators Synced.', 'info')}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>
              <button
                onClick={() => showNotification('Support', 'Municipal Co-op Liaison Desk: +91 44 2855 0100', 'info')}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pl-1">
              <button
                onClick={handleExportRegistryCSV}
                className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Ledger</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Cooperative</span>
              </button>
            </div>
          </div>
        </header>

        {/* Cooperatives Main Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Title Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Cooperatives Management
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  Tamil Nadu State Zone
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage, monitor, and audit certified labour cooperatives across municipal zones.
              </p>
            </div>

            {/* Ledger Node Sync Card */}
            <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold text-slate-800">Ledger Node: TN-CORP-SEC-04</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Synced 2m ago
              </span>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Registered Cooperatives */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Registered Cooperatives</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
                    48
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      +3 this qtr
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                <strong className="text-slate-800">44</strong> Active <span className="text-slate-300">•</span>{' '}
                <strong className="text-blue-600">3</strong> Pending <span className="text-slate-300">•</span>{' '}
                <strong className="text-red-600">1</strong> Suspended
              </div>
            </div>

            {/* Card 2: Active Trades Covered */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Active Trades Covered</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1.5">
                    9 <span className="text-base font-bold text-slate-600">Core Guilds</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Municipal Accreditation</span>
              </div>
            </div>

            {/* Card 3: Member Guild Workers */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Member Guild Workers</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1.5 flex items-center gap-2">
                    1,240
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      98.4% KYC
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                Average guild size: <strong className="text-slate-800">177 members</strong>
              </div>
            </div>

            {/* Card 4: Monthly Disbursed Wage Pool */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Monthly Disbursed Wage Pool</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1.5 flex items-baseline gap-1.5">
                    ₹48.6L
                    <span className="text-xs font-medium text-slate-400">MTD Settled</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>100% Fair Wage Audited via Escrow</span>
              </div>
            </div>
          </div>

          {/* Filter, Tabs, & Query Row */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                {[
                  { label: 'All', count: 48 },
                  { label: 'Active', count: 44 },
                  { label: 'Pending Review', count: 3, badgeColor: 'bg-blue-100 text-blue-700' },
                  { label: 'Suspended', count: 1, badgeColor: 'bg-red-100 text-red-700' },
                ].map((tab) => {
                  const isActive = activeStatusTab === tab.label;
                  return (
                    <button
                      key={tab.label}
                      onClick={() => setActiveStatusTab(tab.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : tab.badgeColor || 'text-slate-400'
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dropdowns + Export Registry */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Region Dropdown */}
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-2xs focus:outline-none"
                  >
                    <option value="All Regions">All Regions / Tamil Nadu</option>
                    <option value="Chennai">Chennai Corporation</option>
                    <option value="Madurai">Madurai District</option>
                    <option value="Salem">Salem Municipal Zone</option>
                    <option value="Coimbatore">Coimbatore Urban</option>
                    <option value="Tirunelveli">Tirunelveli Corporation</option>
                    <option value="Vellore">Vellore Cantonment</option>
                    <option value="Erode">Erode Industrial Zone</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Trade Dropdown */}
                <div className="relative">
                  <select
                    value={selectedTrade}
                    onChange={(e) => setSelectedTrade(e.target.value)}
                    className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-2xs focus:outline-none"
                  >
                    <option value="All Trades">All Trades (9 Guilds)</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Cleaning">Cleaning &amp; Sanitation</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Masonry">Masonry</option>
                    <option value="Painting">Painting</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Export Registry (CSV) */}
                <button
                  onClick={handleExportRegistryCSV}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export Registry (CSV)</span>
                </button>
              </div>
            </div>

            {/* Active Filter Query Chips */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-slate-400">Active filter query:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium text-[11px]">
                  <span>Status: {activeStatusTab}</span>
                  <X
                    className="w-3 h-3 hover:text-slate-900 cursor-pointer"
                    onClick={() => setActiveStatusTab('All')}
                  />
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium text-[11px]">
                  <span>State: Tamil Nadu</span>
                  <X className="w-3 h-3 hover:text-slate-900 cursor-pointer" />
                </span>
                {(activeStatusTab !== 'All' || selectedRegion !== 'All Regions' || selectedTrade !== 'All Trades') && (
                  <button
                    onClick={() => {
                      setActiveStatusTab('All');
                      setSelectedRegion('All Regions');
                      setSelectedTrade('All Trades');
                      setSearchQuery('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold text-[11px] underline ml-1"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="text-[11px] text-slate-400">
                Displaying <strong>{filteredCooperatives.length}</strong> of <strong>48</strong> registered units
              </div>
            </div>
          </div>

          {/* Cooperative Data Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">COOPERATIVE NAME &amp; REG ID</th>
                    <th className="py-3.5 px-4 font-semibold">PRIMARY ZONE</th>
                    <th className="py-3.5 px-4 font-semibold">WORKERS &amp; QUORUM</th>
                    <th className="py-3.5 px-4 font-semibold">TRADES OFFERED</th>
                    <th className="py-3.5 px-4 font-semibold">GOVERNANCE &amp; AUDIT</th>
                    <th className="py-3.5 px-4 font-semibold">STATUS</th>
                    <th className="py-3.5 px-4 font-semibold text-right">ACTIONS</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {filteredCooperatives.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                        No cooperatives found matching the current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredCooperatives.map((coop) => {
                      const Icon = coop.icon || Building2;
                      const GovIcon = coop.governanceIcon || ShieldCheck;

                      return (
                        <tr key={coop.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Column 1: Name & Reg ID */}
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-xl ${coop.iconBg || 'bg-blue-50 text-blue-600'} flex items-center justify-center shrink-0 mt-0.5`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-slate-900 leading-tight">
                                    {coop.name}
                                  </span>
                                  {coop.verified && (
                                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  )}
                                  {coop.badge && (
                                    <span
                                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                        coop.badgeColor || 'bg-blue-50 text-blue-700 border-blue-200/80'
                                      }`}
                                    >
                                      {coop.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">{coop.regId}</p>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Primary Zone */}
                          <td className="py-4 px-4 text-xs">
                            <div className="font-semibold text-slate-800 leading-tight">
                              {coop.primaryZone}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              {coop.subZone}
                            </div>
                          </td>

                          {/* Column 3: Workers & Quorum */}
                          <td className="py-4 px-4 text-xs">
                            <div className="flex items-center gap-2">
                              {coop.workerAvatars && (
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {coop.workerAvatars.map((av, idx) => (
                                    <span
                                      key={idx}
                                      className={`inline-block w-5 h-5 rounded-full text-[9px] font-bold text-center leading-5 border border-white ${
                                        idx === 0
                                          ? 'bg-blue-100 text-blue-700'
                                          : idx === 1
                                          ? 'bg-purple-100 text-purple-700'
                                          : 'bg-emerald-100 text-emerald-700'
                                      }`}
                                    >
                                      {av}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="font-bold text-slate-900">{coop.workersCount}</span>
                            </div>
                            <div className={`text-[11px] font-medium mt-1 ${coop.quorumColor || 'text-slate-500'}`}>
                              {coop.quorumDetail}
                            </div>
                          </td>

                          {/* Column 4: Trades Offered */}
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[190px]">
                              {coop.trades.map((trade) => (
                                <span
                                  key={trade}
                                  className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                                >
                                  {trade}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Column 5: Governance & Audit */}
                          <td className="py-4 px-4 text-xs">
                            <div className={`flex items-center gap-1.5 font-bold ${coop.governanceColor || 'text-emerald-600'}`}>
                              <GovIcon className="w-3.5 h-3.5 shrink-0" />
                              <span>{coop.governanceStatus}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {coop.governanceSub}
                            </div>
                          </td>

                          {/* Column 6: Status */}
                          <td className="py-4 px-4">
                            {coop.statusType === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            )}
                            {coop.statusType === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Pending Review
                              </span>
                            )}
                            {coop.statusType === 'suspended' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                Suspended
                              </span>
                            )}
                          </td>

                          {/* Column 7: Actions */}
                          <td className="py-4 px-4 text-right">
                            {coop.actionType === 'audit' && (
                              <button
                                onClick={() => setAuditCoop(coop)}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                              >
                                Audit Ledger
                              </button>
                            )}
                            {coop.actionType === 'review' && (
                              <button
                                onClick={() => setReviewCoop(coop)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow-2xs transition"
                              >
                                Review Co-op
                              </button>
                            )}
                            {coop.actionType === 'dispute' && (
                              <button
                                onClick={() => setDisputeCoop(coop)}
                                className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition"
                              >
                                Dispute Trail
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="py-3 px-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div>
                Showing <strong>1</strong> to <strong>{filteredCooperatives.length}</strong> of <strong>48</strong> cooperatives
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  &lt; Previous
                </button>
                <button className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  1
                </button>
                <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center transition">
                  2
                </button>
                <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center transition">
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs flex items-center justify-center transition">
                  7
                </button>
                <button className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs transition">
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Global Bottom Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Landmark className="w-3.5 h-3.5 text-blue-600" />
            <span>
              GigGo Admin Portal is anchored on the Municipal Cooperative Union framework under Tamil Nadu Cooperative Societies Act, 1983.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Escrow Audit Engine Active
            </span>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => showNotification('Governance Bylaws', 'Section 12: Municipal Union Charter v4.2', 'info')}
              className="hover:text-blue-600 transition"
            >
              Governance Bylaws
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => showNotification('Audit Trail', 'Cryptographic block height #14,892,104 verified.', 'info')}
              className="hover:text-blue-600 transition"
            >
              Cryptographic Audit Trail
            </button>
          </div>
        </footer>
      </div>

      {/* Interactive Modals */}
      <AddCooperativeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={handleAddCooperative}
      />

      <ReviewCoopModal
        coop={reviewCoop}
        isOpen={Boolean(reviewCoop)}
        onClose={() => setReviewCoop(null)}
        onApprove={handleApproveCoop}
        onReject={handleRejectCoop}
      />

      <AuditLedgerModal
        coop={auditCoop}
        isOpen={Boolean(auditCoop)}
        onClose={() => setAuditCoop(null)}
      />

      <DisputeTrailModal
        coop={disputeCoop}
        isOpen={Boolean(disputeCoop)}
        onClose={() => setDisputeCoop(null)}
      />
    </div>
  );
}
