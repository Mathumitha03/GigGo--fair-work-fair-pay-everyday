import React, { useState, useMemo } from 'react';
import Sidebar from '../dashboard/Sidebar';
import {
  WorkerDetailModal,
  VerifyWorkerActionModal,
  BatchUploadModal,
  DisputeTribunalModal
} from './WorkerModals';
import {
  Search,
  Bell,
  MessageSquare,
  HelpCircle,
  Download,
  Users,
  Send,
  Fingerprint,
  Wallet,
  Star,
  CheckCircle2,
  Clock,
  Eye,
  SlidersHorizontal,
  Upload,
  LayoutGrid,
  ChevronDown,
  Landmark,
  ExternalLink,
  Check,
  TrendingUp,
  X,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

export default function WorkersManagement({
  onNavigate = () => {},
  onLogout = () => {}
}) {
  // Tab & Filters
  const [activeTab, setActiveTab] = useState('All Workers'); // 'All Workers' | 'Active / On Duty' | 'Available / Idle' | 'Pending KYC' | 'Suspended'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCoop, setSelectedCoop] = useState('All');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [density, setDensity] = useState('normal'); // 'normal' | 'compact'

  // Modals state
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [verifyWorkerItem, setVerifyWorkerItem] = useState(null);
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false);
  const [isDisputeTribunalOpen, setIsDisputeTribunalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 7 workers matching screenshot data
  const [workers, setWorkers] = useState([
    {
      id: 'w-1',
      idCode: '#GIG-8821',
      name: 'Senthil Kumar V.',
      joinedDate: 'Mar 2022',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      primaryTrade: 'Master Electrician',
      guildClass: 'Class 1 High-Voltage Guild',
      cooperativeName: 'Chennai Labour Co-op',
      cooperativeZone: 'Zone 1 • T. Nagar Sub-circle',
      rating: '4.9',
      jobsDone: '148 jobs',
      punctuality: '99.2% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'On Duty - Dispatched',
      dispatchType: 'on_duty',
      monthlyWage: '₹34,800',
      wageSub: 'Escrow Settled',
    },
    {
      id: 'w-2',
      idCode: '#GIG-8840',
      name: 'Meenakshi Sundaram',
      joinedDate: 'Jan 2021',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      primaryTrade: 'Industrial Plumber',
      guildClass: 'Sanitary & Pipeline Guild',
      cooperativeName: 'Madurai Guild Union',
      cooperativeZone: 'Zone 3 • Simmakkal District',
      rating: '4.8',
      jobsDone: '210 jobs',
      punctuality: '98.7% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'Available for Shift',
      dispatchType: 'available',
      monthlyWage: '₹31,200',
      wageSub: 'Escrow Settled',
    },
    {
      id: 'w-3',
      idCode: '#GIG-9012',
      name: 'Ananya Murugan',
      joinedDate: 'Aug 2023',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      primaryTrade: 'HVAC & Chillers Specialist',
      guildClass: 'Refrigeration Engineers Guild',
      cooperativeName: 'Coimbatore Industrial Co-op',
      cooperativeZone: 'Zone 4 • Peelamedu Ward',
      rating: '5.0',
      jobsDone: '89 jobs',
      punctuality: '100% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'On Duty - Dispatched',
      dispatchType: 'on_duty',
      monthlyWage: '₹38,500',
      wageSub: 'Escrow Settled',
    },
    {
      id: 'w-4',
      idCode: '#GIG-9402',
      name: 'Parthiban Krishnan',
      joinedDate: 'Yesterday',
      avatarText: 'KP',
      primaryTrade: 'Mason & Tile Artisan',
      guildClass: 'Civil Construction Guild',
      cooperativeName: 'Salem Artisans Co-op',
      cooperativeZone: 'Zone 2 • Suramangalam Hub',
      rating: 'New Member',
      jobsDone: '0 jobs logged',
      kycBadgeText: 'Pending Biometrics',
      kycStatus: 'pending',
      dispatchStatus: 'Queue Inactive',
      dispatchType: 'inactive',
      monthlyWage: '₹0',
      wageSub: 'Onboarding',
      requiresVerification: true,
    },
    {
      id: 'w-5',
      idCode: '#GIG-8610',
      name: 'Rajeshwari D.',
      joinedDate: 'Nov 2020',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
      primaryTrade: 'Sanitation & Hygiene Lead',
      guildClass: 'Municipal Green Guild',
      cooperativeName: 'Chennai Labour Co-op',
      cooperativeZone: 'Zone 1 • Mylapore Sector',
      rating: '4.9',
      jobsDone: '342 jobs',
      punctuality: '99.8% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'On Duty - Dispatched',
      dispatchType: 'on_duty',
      monthlyWage: '₹29,400',
      wageSub: 'Escrow Settled',
    },
    {
      id: 'w-6',
      idCode: '#GIG-8190',
      name: 'Arumugam C.',
      joinedDate: 'Jun 2019',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      primaryTrade: 'Master Carpenter',
      guildClass: 'Fine Woodwork & Joinery Guild',
      cooperativeName: 'Madurai Guild Union',
      cooperativeZone: 'Zone 3 • Thirunagar Ward',
      rating: '4.9',
      jobsDone: '275 jobs',
      punctuality: '99.1% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'Available for Shift',
      dispatchType: 'available',
      monthlyWage: '₹36,100',
      wageSub: 'Escrow Settled',
    },
    {
      id: 'w-7',
      idCode: '#GIG-8994',
      name: 'Govindaraj S.',
      joinedDate: 'Oct 2022',
      avatarText: 'GS',
      primaryTrade: 'Appliance Diagnostics Specialist',
      guildClass: 'Consumer Electronics Guild',
      cooperativeName: 'Coimbatore Industrial Co-op',
      cooperativeZone: 'Zone 4 • Gandhipuram Sector',
      rating: '4.7',
      jobsDone: '112 jobs',
      punctuality: '97.8% punctuality',
      kycBadgeText: 'UIDAI & Police Verified',
      kycStatus: 'verified',
      dispatchStatus: 'On Duty - Dispatched',
      dispatchType: 'on_duty',
      monthlyWage: '₹27,900',
      wageSub: 'Escrow Settled',
    },
  ]);

  // Filtered workers list
  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
      // Tab filter
      if (activeTab === 'Active / On Duty' && w.dispatchType !== 'on_duty') return false;
      if (activeTab === 'Available / Idle' && w.dispatchType !== 'available') return false;
      if (activeTab === 'Pending KYC' && w.kycStatus !== 'pending') return false;
      if (activeTab === 'Suspended') return false;

      // Cooperative filter
      if (selectedCoop !== 'All' && !w.cooperativeName.toLowerCase().includes(selectedCoop.toLowerCase())) {
        return false;
      }

      // Trade filter
      if (selectedTrade !== 'All' && !w.primaryTrade.toLowerCase().includes(selectedTrade.toLowerCase())) {
        return false;
      }

      // Zone filter
      if (selectedZone !== 'All' && !w.cooperativeZone.toLowerCase().includes(selectedZone.toLowerCase())) {
        return false;
      }

      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = w.name.toLowerCase().includes(q);
        const matchesId = w.idCode.toLowerCase().includes(q);
        const matchesTrade = w.primaryTrade.toLowerCase().includes(q);
        if (!matchesName && !matchesId && !matchesTrade) return false;
      }

      return true;
    });
  }, [workers, activeTab, selectedCoop, selectedTrade, selectedZone, searchFilter]);

  const toggleSelectWorker = (id) => {
    if (selectedWorkers.includes(id)) {
      setSelectedWorkers(selectedWorkers.filter((i) => i !== id));
    } else {
      setSelectedWorkers([...selectedWorkers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedWorkers.length === filteredWorkers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(filteredWorkers.map((w) => w.id));
    }
  };

  const handleVerifyWorkerSuccess = (worker) => {
    setWorkers((prev) =>
      prev.map((w) =>
        w.id === worker.id
          ? {
              ...w,
              kycStatus: 'verified',
              kycBadgeText: 'UIDAI & Police Verified',
              requiresVerification: false,
              dispatchStatus: 'Available for Shift',
              dispatchType: 'available',
              wageSub: 'Escrow Active',
            }
          : w
      )
    );
    showNotification(
      'Worker KYC Verified',
      `${worker.name} successfully linked with DigiLocker UIDAI & Police NOC.`
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
        activeNav="workers"
        onSelectNav={(id) => onNavigate(id)}
        onLogout={onLogout}
        onOpenDisputeQueue={() => setIsDisputeTribunalOpen(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">
              Admin Portal
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-900 font-semibold">Workers</span>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input with ⌘K */}
            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 transition w-52 md:w-64">
              <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search worker, trade, or ID..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
              />
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
                ⌘K
              </kbd>
            </div>

            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-3 text-xs font-semibold text-slate-600">
              <button
                onClick={() => showNotification('Dispatch Feed', 'Real-time telemetry active across 4 municipal zones.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dispatch Feed
              </button>
              <button
                onClick={() => showNotification('Dividend Ledgers', 'Automated escrow fair wage distribution verified.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dividend Ledgers
              </button>
              <button
                onClick={() => showNotification('Gov Council', 'Worker cooperative steering committee session.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Gov Council
              </button>
            </div>

            {/* Escrow SLA Pill */}
            <div className="hidden xl:flex items-center gap-1.5 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-[10px] text-slate-500 font-medium">Escrow SLA:</span>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                99.98%
              </span>
            </div>

            {/* Icon Buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => showNotification('Alerts', 'No critical worker dispatch exceptions pending.', 'info')}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <MessageSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => showNotification('Worker Support Hotline', 'Dial 1800-GIGGO-WORK for direct steward dispatch.', 'info')}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => showNotification('Export Queue', 'Generating encrypted roster export...', 'info')}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Header Title & Federation Jurisdiction */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Workers Management
              </h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Municipal roster, cooperative guild assignments, biometric KYC validation, and direct escrow payouts.
              </p>
            </div>

            {/* Federation Jurisdiction Selector */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <span className="text-xs text-slate-400 font-medium">Federation Jurisdiction:</span>
              <div className="relative">
                <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition">
                  <Landmark className="w-3.5 h-3.5 text-blue-600" />
                  <span>Tamil Nadu Municipal Federation (Zone 1-4)</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: TOTAL REGISTERED WORKERS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    TOTAL REGISTERED WORKERS
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">1,240</div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.4% vs last month</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">KYC Compliance</span>
                <span className="font-bold text-emerald-600">98.4% Verified</span>
              </div>
            </div>

            {/* Card 2: ON ACTIVE SHIFT / DISPATCHED */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    ON ACTIVE SHIFT / DISPATCHED
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">842</div>
                  <div className="flex items-center gap-2 mt-1.5 w-full max-w-[140px]">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: '67.9%' }}></div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600">67.9% utilization</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Available Reserve</span>
                <span className="font-bold text-slate-800">378 Ready for Dispatch</span>
              </div>
            </div>

            {/* Card 3: VERIFIED KYC & BIOMETRICS */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    VERIFIED KYC &amp; BIOMETRICS
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">1,220</div>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                    Aadhaar UIDAI Linked
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Action Required</span>
                <span className="font-bold text-blue-600">20 Pending Biometrics</span>
              </div>
            </div>

            {/* Card 4: AVG MONTHLY FAIR WAGE */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
                    AVG MONTHLY FAIR WAGE
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">₹28,450</div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>100% Escrow Backed</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Co-op Dividend Share</span>
                <span className="font-bold text-blue-600">+8.5% Guild Surplus</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Utility Actions */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl flex-wrap">
                {[
                  { label: 'All Workers', count: '1,240' },
                  { label: 'Active / On Duty', count: '842' },
                  { label: 'Available / Idle', count: '378' },
                  { label: 'Pending KYC', count: '20', pillBg: 'bg-red-50 text-red-600' },
                  { label: 'Suspended', count: '0' },
                ].map((t) => {
                  const isActive = activeTab === t.label;
                  return (
                    <button
                      key={t.label}
                      onClick={() => setActiveTab(t.label)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{t.label}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive
                            ? 'bg-blue-50 text-blue-600'
                            : t.pillBg || 'text-slate-400'
                        }`}
                      >
                        {t.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Utility Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDensity(density === 'normal' ? 'compact' : 'normal')}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Density</span>
                </button>
                <button
                  onClick={() => setIsBatchUploadOpen(true)}
                  className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Batch Upload</span>
                </button>
              </div>
            </div>

            {/* Filter Search & Dropdown Selectors */}
            <div className="flex flex-col md:flex-row items-center gap-2.5">
              {/* Search input */}
              <div className="relative flex-1 w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter by Name, ID (#GIG-8821), or Aadhaar No..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-2xs"
                />
              </div>

              {/* Dropdown 1: Cooperative */}
              <div className="relative w-full md:w-44">
                <select
                  value={selectedCoop}
                  onChange={(e) => setSelectedCoop(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-medium text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="All">Cooperative: All</option>
                  <option value="Chennai">Chennai Labour Co-op</option>
                  <option value="Madurai">Madurai Guild Union</option>
                  <option value="Coimbatore">Coimbatore Industrial Co-op</option>
                  <option value="Salem">Salem Artisans Co-op</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Dropdown 2: Trade */}
              <div className="relative w-full md:w-44">
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-medium text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="All">Trade: All Skills</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="HVAC">HVAC Specialist</option>
                  <option value="Mason">Mason &amp; Tile</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Appliance">Appliance Diagnostics</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Dropdown 3: Zone */}
              <div className="relative w-full md:w-40">
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-medium text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="All">Zone: All Districts</option>
                  <option value="Zone 1">Zone 1 (Chennai)</option>
                  <option value="Zone 2">Zone 2 (Salem)</option>
                  <option value="Zone 3">Zone 3 (Madurai)</option>
                  <option value="Zone 4">Zone 4 (Coimbatore)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>

              {/* Filter Slider icon */}
              <button
                onClick={() => {
                  setSelectedCoop('All');
                  setSelectedTrade('All');
                  setSelectedZone('All');
                  setSearchFilter('');
                  showNotification('Filters Reset', 'All filter facets cleared.', 'info');
                }}
                title="Reset Filters"
                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition shadow-2xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workers Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Table Header */}
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedWorkers.length > 0 && selectedWorkers.length === filteredWorkers.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 font-semibold">WORKER NAME &amp; ID</th>
                    <th className="py-3 px-4 font-semibold">PRIMARY TRADE &amp; GUILD</th>
                    <th className="py-3 px-4 font-semibold">ASSIGNED COOPERATIVE</th>
                    <th className="py-3 px-4 font-semibold">RATING &amp; JOBS DONE</th>
                    <th className="py-3 px-4 font-semibold">KYC &amp; BIOMETRIC</th>
                    <th className="py-3 px-4 font-semibold">DISPATCH STATUS</th>
                    <th className="py-3 px-4 font-semibold">MONTHLY WAGES</th>
                    <th className="py-3 px-3.5 font-semibold text-right">ACTIONS</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-12 text-center text-slate-400 text-xs">
                        No workers found matching the selected query.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((w) => {
                      const isSelected = selectedWorkers.includes(w.id);

                      return (
                        <tr
                          key={w.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            density === 'compact' ? 'py-2.5' : 'py-3.5'
                          } ${isSelected ? 'bg-blue-50/30' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectWorker(w.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* Column 1: Worker Name & ID */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-blue-50 flex items-center justify-center shrink-0 text-blue-700 font-bold text-xs shadow-2xs">
                                {w.avatarUrl ? (
                                  <img src={w.avatarUrl} alt={w.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span>{w.avatarText || w.name.substring(0, 2).toUpperCase()}</span>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">
                                  {w.name}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                  <span className="font-mono text-slate-500 font-semibold">{w.idCode}</span>
                                  <span className="mx-1">•</span>
                                  <span>Joined {w.joinedDate}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Primary Trade & Guild */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 leading-tight">
                              {w.primaryTrade}
                            </div>
                            <div className="text-[11px] text-blue-600 hover:underline cursor-pointer mt-0.5 leading-tight">
                              {w.guildClass}
                            </div>
                          </td>

                          {/* Column 3: Assigned Cooperative */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800 leading-tight">
                              {w.cooperativeName}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">
                              {w.cooperativeZone}
                            </div>
                          </td>

                          {/* Column 4: Rating & Jobs Done */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900 leading-tight">
                              {w.rating !== 'New Member' ? (
                                <>
                                  <span className="text-amber-500 flex items-center gap-0.5">
                                    {w.rating}
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  </span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-slate-600 font-normal">{w.jobsDone}</span>
                                </>
                              ) : (
                                <span className="text-slate-400 font-medium">New Member</span>
                              )}
                            </div>
                            <div className={`text-[11px] font-semibold mt-0.5 ${
                              w.punctuality ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              {w.punctuality || '0 jobs logged'}
                            </div>
                          </td>

                          {/* Column 5: KYC & Biometric */}
                          <td className="py-3.5 px-4">
                            {w.kycStatus === 'verified' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span>{w.kycBadgeText}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-rose-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                                <span>Pending Biometrics</span>
                              </span>
                            )}
                          </td>

                          {/* Column 6: Dispatch Status */}
                          <td className="py-3.5 px-4">
                            {w.dispatchType === 'on_duty' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                                On Duty - Dispatched
                              </span>
                            )}
                            {w.dispatchType === 'available' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Available for Shift
                              </span>
                            )}
                            {w.dispatchType === 'inactive' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                Queue Inactive
                              </span>
                            )}
                          </td>

                          {/* Column 7: Monthly Wages */}
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-slate-900 leading-tight">
                              {w.monthlyWage}
                            </div>
                            <div className={`text-[11px] font-medium mt-0.5 ${
                              w.wageSub === 'Escrow Settled' ? 'text-emerald-600' : 'text-slate-400'
                            }`}>
                              {w.wageSub}
                            </div>
                          </td>

                          {/* Column 8: Actions */}
                          <td className="py-3.5 px-3.5 text-right">
                            {w.requiresVerification ? (
                              <button
                                onClick={() => setVerifyWorkerItem(w)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-2xs transition"
                              >
                                Verify
                              </button>
                            ) : (
                              <button
                                onClick={() => setSelectedWorker(w)}
                                title="View Worker Dossier"
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                              >
                                <Eye className="w-4 h-4" />
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

            {/* Pagination Row */}
            <div className="py-3 px-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span>Showing <strong>1 to 7</strong> of <strong>1,240</strong> workers</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">Rows per page:</span>
                <select className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none">
                  <option value="7">7</option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition"
                >
                  &lt;
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
                  177
                </button>
                <button className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs transition">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Protocol Banner */}
          <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900 leading-snug">
                  Decentralized Labour Protocol v4.2 Active
                </div>
                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Worker shares and monthly dividend allocations are immutable and verified on the Tamil Nadu Civic Ledger.
                </div>
              </div>
            </div>

            <button
              onClick={() => showNotification('Civic Ledger Explorer', 'Opening block #14,892,104 cryptographic consensus report...', 'info')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1 shrink-0 self-start sm:self-auto hover:underline"
            >
              <span>Inspect Protocol Audit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <WorkerDetailModal
        worker={selectedWorker}
        isOpen={Boolean(selectedWorker)}
        onClose={() => setSelectedWorker(null)}
      />

      <VerifyWorkerActionModal
        worker={verifyWorkerItem}
        isOpen={Boolean(verifyWorkerItem)}
        onClose={() => setVerifyWorkerItem(null)}
        onVerifySuccess={handleVerifyWorkerSuccess}
      />

      <BatchUploadModal
        isOpen={isBatchUploadOpen}
        onClose={() => setIsBatchUploadOpen(false)}
        onUploadSuccess={() => showNotification('Batch Upload Complete', 'Processed 48 new worker roster rows with 100% schema match.')}
      />

      <DisputeTribunalModal
        isOpen={isDisputeTribunalOpen}
        onClose={() => setIsDisputeTribunalOpen(false)}
      />
    </div>
  );
}
