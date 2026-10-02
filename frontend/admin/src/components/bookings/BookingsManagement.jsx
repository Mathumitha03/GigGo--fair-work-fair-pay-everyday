import React, { useState, useMemo } from 'react';
import Sidebar from '../dashboard/Sidebar';
import {
  CreateManualBookingModal,
  BookingDetailsModal,
  ArbitrationModal,
  EscrowInspectModal
} from './BookingModals';
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
  AlertCircle,
  FileText,
  Clock,
  Lock,
  ExternalLink,
  Zap,
  Droplets,
  Snowflake,
  Hammer,
  Scale,
  Gavel,
  Phone,
  Eye,
  SlidersHorizontal,
  Columns,
  Calendar,
  ChevronDown,
  Check,
  Radio,
  CreditCard,
  CheckCircle,
  Shield,
  Volume2,
  X
} from 'lucide-react';

export default function BookingsManagement({
  onNavigate = () => {},
  onLogout = () => {}
}) {
  // Tabs: 'All Bookings' | 'Active / In Progress' | 'Completed & Paid' | 'Disputed / In Escrow' | 'Cancelled'
  const [activeTab, setActiveTab] = useState('All Bookings');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTrade, setSelectedTrade] = useState('All');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState('Today (24h)');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedBookingForDetails, setSelectedBookingForDetails] = useState(null);
  const [selectedBookingForArbitration, setSelectedBookingForArbitration] = useState(null);
  const [isEscrowInspectOpen, setIsEscrowInspectOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 6 Bookings from the screenshot
  const [bookings, setBookings] = useState([
    {
      id: 'bk-1',
      bookingId: '#BK-9482',
      isEmergency: true,
      urgencyTag: 'EMERGENCY',
      customerAddress: 'Sundaram Residency, Apt 4B',
      timeAgo: '12 mins ago',
      serviceName: 'High-Voltage Conduit Repair',
      guild: 'Electrical Guild',
      guildIcon: Zap,
      tierBadge: 'Tier 1 Certified',
      workerName: 'Senthil Kumar V.',
      workerId: 'ID #GIG-8821',
      coopName: 'Chennai Labour Co-op #1',
      workerAvatar: 'SK',
      totalAmount: '₹1,250',
      splitType: 'standard',
      workerAmount: '₹1,100 Worker',
      coopAmount: '₹150 Co-op Guild',
      status: 'In Transit',
      statusType: 'in-transit',
      slaText: 'ETA 8 mins',
      slaSub: 'Standard SLA: <20m',
      slaAlert: false,
      slaIcon: 'alert-triangle-blue',
      actionsType: 'transit'
    },
    {
      id: 'bk-2',
      bookingId: '#BK-9481',
      isEmergency: false,
      customerAddress: 'Alacrity Towers, Sector 9',
      timeAgo: '44 mins ago',
      serviceName: 'Main Line Pipe Burst Containment',
      guild: 'Plumbing & Sanitation',
      guildIcon: Droplets,
      tierBadge: 'Master Guild',
      workerName: 'Rajeshwari M.',
      workerId: 'ID #GIG-6410',
      coopName: 'Velachery Sanitary Union',
      workerAvatar: 'RM',
      totalAmount: '₹2,800',
      splitType: 'standard',
      workerAmount: '₹2,500 Worker',
      coopAmount: '₹300 Co-op Guild',
      status: 'On-Site / Active',
      statusType: 'active',
      slaText: '26m Elapsed',
      slaSub: 'Est completion: 15 mins',
      slaAlert: false,
      slaIcon: 'clock',
      actionsType: 'active'
    },
    {
      id: 'bk-3',
      bookingId: '#BK-9480',
      isEmergency: false,
      customerAddress: 'Kothari Tech Park, Block C',
      timeAgo: '1h 20m ago',
      serviceName: 'HVAC Compressor Circuit Overhaul',
      guild: 'Climate Mechanics',
      guildIcon: Snowflake,
      tierBadge: 'Industrial Tier',
      workerName: 'Karthik N.',
      workerId: 'ID #GIG-7104',
      coopName: 'Guindy Guild Central',
      workerAvatar: 'KN',
      totalAmount: '₹3,400',
      splitType: 'paid',
      paidNote: 'Paid: ₹3,050 to Worker Node',
      status: 'Completed - Escrow Disbursed',
      statusType: 'completed',
      slaText: '38m (SLA <45m)',
      slaSub: 'Perfect 100% SLA credit',
      slaAlert: false,
      slaIcon: 'check-circle-green',
      actionsType: 'completed'
    },
    {
      id: 'bk-4',
      bookingId: '#BK-9477',
      isEmergency: false,
      isDisputed: true,
      urgencyTag: 'DISPUTED',
      customerAddress: 'Meenakshi Hospital Staff Quarters',
      timeAgo: '3h 15m ago',
      serviceName: 'Emergency Submersible Pump Rewind',
      guild: 'Parts Warranty Scope Dispute',
      guildIcon: AlertCircle,
      isGuildAlert: true,
      workerName: 'Arumugam P.',
      workerId: 'ID #GIG-4299',
      coopName: 'Madras Artisans Co-op',
      workerAvatar: 'AP',
      totalAmount: '₹4,200',
      splitType: 'locked',
      lockedNote: 'Locked in Escrow Vault',
      status: 'Pending Arbitration',
      statusType: 'disputed',
      slaText: 'Hearing at 16:30',
      slaSub: 'Guild Arbiter: S. Natarajan',
      slaAlert: true,
      slaIcon: 'hearing-red',
      actionsType: 'arbitration'
    },
    {
      id: 'bk-5',
      bookingId: '#BK-9475',
      isEmergency: false,
      customerAddress: 'Phoenix Market City Annex, Fl 2',
      timeAgo: '1h 45m ago',
      serviceName: 'Precision Carpentry Frame Restoration',
      guild: 'Woodcraft Guild',
      guildIcon: Hammer,
      tierBadge: 'Master Joiner',
      workerName: 'Vijayaraghavan T.',
      workerId: 'ID #GIG-9032',
      coopName: 'South Zone Artisans Co-op',
      workerAvatar: 'VT',
      totalAmount: '₹1,850',
      splitType: 'standard',
      workerAmount: '₹1,620 Worker',
      coopAmount: '₹230 Co-op Guild',
      status: 'In Transit',
      statusType: 'in-transit',
      slaText: 'Delayed +15m',
      slaSub: 'Sector 4 Traffic Bottleneck',
      slaAlert: true,
      slaIcon: 'alert-triangle-red',
      actionsType: 'transit'
    },
    {
      id: 'bk-6',
      bookingId: '#BK-9472',
      isEmergency: false,
      customerAddress: 'Anna Nagar Cooperative Housing',
      timeAgo: '2h 10m ago',
      serviceName: '3-Phase Distribution Box Inspection',
      guild: 'Electrical Guild',
      guildIcon: Zap,
      tierBadge: 'Certified Inspector',
      workerName: 'Deepa Srinivasan',
      workerId: 'ID #GIG-5510',
      coopName: 'Chennai Labour Co-op #1',
      workerAvatar: 'DS',
      totalAmount: '₹950',
      splitType: 'paid',
      paidNote: 'Paid: ₹850 to Worker Node',
      status: 'Completed - Escrow Disbursed',
      statusType: 'completed',
      slaText: '24m (SLA <30m)',
      slaSub: 'Direct customer 5★ rating',
      slaAlert: false,
      slaIcon: 'check-circle-green',
      actionsType: 'completed'
    }
  ]);

  // Tab Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === 'Active / In Progress' && b.statusType !== 'in-transit' && b.statusType !== 'active') return false;
      if (activeTab === 'Completed & Paid' && b.statusType !== 'completed') return false;
      if (activeTab === 'Disputed / In Escrow' && b.statusType !== 'disputed') return false;
      if (activeTab === 'Cancelled' && b.statusType !== 'cancelled') return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesId = b.bookingId.toLowerCase().includes(q);
        const matchesCustomer = b.customerAddress.toLowerCase().includes(q);
        const matchesWorker = b.workerName.toLowerCase().includes(q);
        const matchesCoop = b.coopName.toLowerCase().includes(q);
        const matchesService = b.serviceName.toLowerCase().includes(q);
        if (!matchesId && !matchesCustomer && !matchesWorker && !matchesCoop && !matchesService) return false;
      }

      if (selectedTrade !== 'All' && !b.guild.toLowerCase().includes(selectedTrade.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [bookings, activeTab, searchFilter, selectedTrade]);

  const handleCreateSuccess = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    showNotification('Booking Dispatched', `${newBooking.bookingId} active on cooperative dispatch mesh.`);
  };

  const handleArbitrationResolve = (resolutionType, booking) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              isDisputed: false,
              status: 'Arbitration Resolved',
              statusType: 'completed',
              splitType: 'paid',
              paidNote: `Settled: ${resolutionType}`,
              slaText: 'Resolved by Tribunal',
              slaSub: 'Consensus Signed'
            }
          : b
      )
    );
    showNotification('Tribunal Verdict Recorded', `${booking.bookingId} escrow settlement executed.`);
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
        activeNav="bookings"
        onSelectNav={(id) => onNavigate(id)}
        onLogout={onLogout}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">
              Admin Portal
            </button>
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-900 font-semibold">Bookings &amp; Dispatch</span>
          </div>

          {/* Center Search Input with (Ctrl + K) */}
          <div className="relative hidden md:flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs text-slate-400 transition w-64 lg:w-80">
            <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Global dispatch search (Ctrl + K)"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
            />
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Links */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-600">
              <button
                className="text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5"
                onClick={() => showNotification('Dispatch Feed', 'Real-time telemetry stream synchronized.', 'info')}
              >
                Dispatch Feed
              </button>
              <button
                onClick={() => showNotification('Dividend Ledgers', 'Rate card wage splits in escrow pool.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dividend Ledgers
              </button>
              <button
                onClick={() => showNotification('Gov Council', 'Dispute tribunal hearing docket active.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Gov Council
              </button>
            </div>

            {/* Escrow Vault: Verified Badge */}
            <button
              onClick={() => setIsEscrowInspectOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold hover:bg-emerald-100 transition shadow-2xs"
            >
              <Lock className="w-3 h-3 text-emerald-700" />
              <span>Escrow Vault: Verified</span>
            </button>

            {/* Export Ledger */}
            <button
              onClick={() => showNotification('Export Ledger', 'Compiling municipal booking telemetry CSV...', 'info')}
              className="hidden xl:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Ledger</span>
            </button>

            {/* Emergency Freeze Action */}
            <button
              onClick={() => showNotification('Emergency Freeze Triggered', 'All surge dispatch algorithms placed on hold.', 'error')}
              className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs px-3 py-2 rounded-xl transition shadow-xs"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Emergency Freeze</span>
            </button>
          </div>
        </header>

        {/* Bookings Tracker Main Content */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Title Row & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Bookings &amp; Dispatch Tracker
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                  <span>Real-Time Dispatch Engine v4.8</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Live municipal service dispatch feed, automated cooperative escrow distribution, and dispute tracking across regional sectors.
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
              <button
                onClick={() => showNotification('Export Dispatch Log', 'Dispatch log exported with cryptographically signed hashes.', 'info')}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Dispatch Log</span>
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Create Manual Booking</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Dispatches */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Active Dispatches</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">342</span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                      +8.2%
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Average response time: <strong className="text-slate-800">14 mins</strong></span>
              </div>
            </div>

            {/* Card 2: Escrow Locked Value */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Escrow Locked Value</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">₹18,42,500</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Guaranteed</span>
                </div>
                <span className="text-slate-500">Instant payout</span>
              </div>
            </div>

            {/* Card 3: SLA Fulfillment Rate */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">SLA Fulfillment Rate</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-2xl font-extrabold text-slate-900">98.6%</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-600">Co-op standard: <strong className="text-slate-800">&gt;95% threshold</strong></span>
              </div>
            </div>

            {/* Card 4: Disputed Bookings */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Disputed Bookings</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-red-600">3</span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200/60 px-1.5 py-0.2 rounded-md">
                      In Review
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-red-600 font-semibold">
                <Volume2 className="w-3.5 h-3.5 shrink-0" />
                <span>Worker arbitration hearing active</span>
              </div>
            </div>
          </div>

          {/* Tabs Row */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl flex-wrap">
            {[
              { label: 'All Bookings', count: '1,840' },
              { label: 'Active / In Progress', count: '342' },
              { label: 'Completed & Paid', count: '1,418' },
              { label: 'Disputed / In Escrow', count: '12', hasRedDot: true },
              { label: 'Cancelled', count: '68' },
            ].map((tab) => {
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-2xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                      }`}
                    >
                      ({tab.count})
                    </span>
                  )}
                  {tab.hasRedDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Filter Toolbar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => showNotification('More Filters', 'Filter matrix opened.', 'info')}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>More Filters</span>
              </button>

              <button
                onClick={() => showNotification('Columns', 'All 7 columns enabled.', 'info')}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <Columns className="w-3.5 h-3.5 text-slate-500" />
                <span>Columns (7)</span>
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Bar */}
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-400 transition w-full sm:w-64 lg:w-72 shadow-2xs">
                <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search Booking ID, Customer, Worker, or Co-op..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none text-xs"
                />
              </div>

              {/* All Categories Dropdown */}
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-7 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Emergency">Emergency</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* All Trades Dropdown */}
              <div className="relative">
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-7 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                >
                  <option value="All">All Trades</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing &amp; Sanitation</option>
                  <option value="Climate">Climate Mechanics</option>
                  <option value="Woodcraft">Woodcraft</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Date Filter: Today (24h) */}
              <div className="relative">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl shadow-2xs cursor-pointer">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedTimeWindow}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Booking ID &amp; Date</th>
                    <th className="py-3 px-4">Service &amp; Trade</th>
                    <th className="py-3 px-4">Assigned Worker &amp; Co-op</th>
                    <th className="py-3 px-4">Total Amount &amp; Escrow Split</th>
                    <th className="py-3 px-4">Live Dispatch Status</th>
                    <th className="py-3 px-4">SLA Timer / ETA</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const GuildIcon = b.guildIcon;
                    return (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Booking ID & Date */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-slate-900">{b.bookingId}</span>
                            {b.isEmergency && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-700 tracking-wider">
                                EMERGENCY
                              </span>
                            )}
                            {b.isDisputed && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-red-100 text-red-700 tracking-wider">
                                DISPUTED
                              </span>
                            )}
                          </div>
                          <div className="text-slate-700 font-medium mt-0.5">{b.customerAddress}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{b.timeAgo}</span>
                          </div>
                        </td>

                        {/* 2. Service & Trade */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-bold text-slate-900 leading-tight">{b.serviceName}</div>
                          <div className="flex items-center gap-1 mt-1 text-[11px]">
                            {b.isGuildAlert ? (
                              <div className="flex items-center gap-1 text-red-600 font-medium">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                <span>{b.guild}</span>
                              </div>
                            ) : (
                              <>
                                <span className="p-1 rounded bg-blue-50 text-blue-600 inline-flex items-center">
                                  <GuildIcon className="w-3 h-3" />
                                </span>
                                <span className="font-semibold text-blue-700">{b.guild}</span>
                                <span className="text-slate-300">&bull;</span>
                                <span className="text-slate-500 font-medium">{b.tierBadge}</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* 3. Assigned Worker & Co-op */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-300">
                              {b.workerAvatar}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 leading-tight">{b.workerName}</div>
                              <div className="text-[11px] text-slate-500 mt-0.5">{b.workerId}</div>
                              <div className="text-[11px] font-medium text-emerald-700">{b.coopName}</div>
                            </div>
                          </div>
                        </td>

                        {/* 4. Total Amount & Escrow Split */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="font-extrabold text-slate-900 text-sm">{b.totalAmount}</div>
                          {b.splitType === 'standard' && (
                            <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[10px] font-bold text-blue-700">
                              <span>{b.workerAmount}</span>
                              <span className="text-slate-300">/</span>
                              <span>{b.coopAmount}</span>
                            </div>
                          )}
                          {b.splitType === 'paid' && (
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-100 rounded text-[10px] font-bold text-emerald-700">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{b.paidNote}</span>
                            </div>
                          )}
                          {b.splitType === 'locked' && (
                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-100 rounded text-[10px] font-bold text-red-700">
                              <Lock className="w-2.5 h-2.5" />
                              <span>{b.lockedNote}</span>
                            </div>
                          )}
                        </td>

                        {/* 5. Live Dispatch Status */}
                        <td className="py-3.5 px-4 align-top">
                          {b.statusType === 'in-transit' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                              <span>In Transit</span>
                            </span>
                          )}
                          {b.statusType === 'active' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                              <span>On-Site / Active</span>
                            </span>
                          )}
                          {b.statusType === 'completed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Completed - Escrow Disbursed</span>
                            </span>
                          )}
                          {b.statusType === 'disputed' && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                              <span>Pending Arbitration</span>
                            </span>
                          )}
                        </td>

                        {/* 6. SLA Timer / ETA */}
                        <td className="py-3.5 px-4 align-top">
                          <div className="flex items-center gap-1.5 font-bold">
                            {b.slaIcon === 'alert-triangle-blue' && (
                              <AlertTriangle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            )}
                            {b.slaIcon === 'clock' && (
                              <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                            {b.slaIcon === 'check-circle-green' && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            {b.slaIcon === 'hearing-red' && (
                              <Scale className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            )}
                            {b.slaIcon === 'alert-triangle-red' && (
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            )}

                            <span
                              className={
                                b.slaIcon === 'hearing-red' || b.slaIcon === 'alert-triangle-red'
                                  ? 'text-red-600'
                                  : b.slaIcon === 'check-circle-green'
                                  ? 'text-emerald-600'
                                  : 'text-slate-800'
                              }
                            >
                              {b.slaText}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{b.slaSub}</div>
                        </td>

                        {/* 7. Action Icons */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedBookingForDetails(b)}
                              title="View Booking Details"
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {b.actionsType === 'arbitration' ? (
                              <button
                                onClick={() => setSelectedBookingForArbitration(b)}
                                title="Open Arbitration Tribunal"
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-2xs"
                              >
                                <Gavel className="w-3.5 h-3.5" />
                              </button>
                            ) : b.actionsType === 'completed' ? (
                              <button
                                onClick={() => showNotification('Audit Receipt', `Verified escrow receipt for ${b.bookingId}.`, 'info')}
                                title="Escrow Disbursed Receipt"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              >
                                <FileText className="w-4 h-4" />
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => showNotification('Audit Receipt', `Live dispatch manifest for ${b.bookingId}.`, 'info')}
                                  title="Dispatch Manifest"
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => showNotification('Call Dispatch', `Calling worker ${b.workerName}...`, 'info')}
                                  title="Direct Dispatch Line"
                                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                                >
                                  <Phone className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Telemetry Indicator */}
            <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 bg-white">
              <div className="flex items-center gap-2">
                <span>Showing <strong>1 to 6</strong> of <strong>1,840</strong> bookings</span>
                <span className="text-slate-300">&bull;</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Feed updating real-time</span>
                </div>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-1 self-start sm:self-auto">
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
                  307
                </button>
                <button className="px-2.5 py-1 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs transition">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Protocol Banner */}
          <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 leading-snug">
                    Cooperative Escrow &amp; Dispute Governance v2.1
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-md">
                    Cryptographically Signed
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Funds are locked in municipal multi-signature smart escrow contracts. 100% of customer funds are guaranteed with automated disbursement upon customer verification or 48-hour clear threshold.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => showNotification('Arbitration Charter', 'Municipal arbitration bylaws v4.8 loaded.', 'info')}
                className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition shadow-2xs flex items-center gap-1.5"
              >
                <Scale className="w-3.5 h-3.5 text-slate-500" />
                <span>View Arbitration Charter</span>
              </button>

              <button
                onClick={() => setIsEscrowInspectOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Inspect Smart Contract Escrow</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <CreateManualBookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSuccess={handleCreateSuccess}
      />

      <BookingDetailsModal
        isOpen={!!selectedBookingForDetails}
        onClose={() => setSelectedBookingForDetails(null)}
        booking={selectedBookingForDetails}
      />

      <ArbitrationModal
        isOpen={!!selectedBookingForArbitration}
        onClose={() => setSelectedBookingForArbitration(null)}
        booking={selectedBookingForArbitration}
        onResolve={handleArbitrationResolve}
      />

      <EscrowInspectModal
        isOpen={isEscrowInspectOpen}
        onClose={() => setIsEscrowInspectOpen(false)}
      />
    </div>
  );
}
