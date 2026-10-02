import React, { useState, useMemo } from 'react';
import Sidebar from '../dashboard/Sidebar';
import {
  AddServiceModal,
  RateCardAuditModal,
  EmergencyFreezeModal,
  PolicyLedgerModal
} from './ServiceModals';
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
  Users,
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
  RotateCcw,
  SlidersHorizontal,
  Lock,
  ExternalLink,
  ShieldAlert,
  Percent,
  Calculator,
  Snowflake,
  Droplets,
  Calendar,
  Check
} from 'lucide-react';

export default function ServicesManagement({
  onNavigate = () => {},
  onLogout = () => {}
}) {
  // Filter States
  const [activeTab, setActiveTab] = useState('All Services'); // 'All Services' | 'High Demand' | 'Emergency Dispatch' | 'Pending Guild Approv.'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedTradeCategory, setSelectedTradeCategory] = useState('All');
  const [selectedCoopAssignment, setSelectedCoopAssignment] = useState('All');
  const [selectedRateStructure, setSelectedRateStructure] = useState('All');
  const [selectedOperatingStatus, setSelectedOperatingStatus] = useState('All');

  // Modals State
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isRateAuditOpen, setIsRateAuditOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isPolicyLedgerOpen, setIsPolicyLedgerOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showNotification = (title, message, type = 'success') => {
    setToast({ title, message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 5 Services matching screenshot
  const [services, setServices] = useState([
    {
      id: 'srv-1',
      code: '#SRV-1029',
      name: 'Emergency High-Voltage Conduit Repair',
      tag: 'Priority 1',
      tagColor: 'bg-red-50 text-red-700 border-red-200',
      icon: Zap,
      iconBg: 'bg-blue-50 text-blue-600',
      guild: 'Electrical Guild',
      guildIcon: Zap,
      baseRate: '₹650 / hr',
      rateSub: 'Floor: ₹550 / hr',
      workerSplit: 88,
      coopSplit: 12,
      workerAvatars: ['EL', 'KV'],
      certifiedWorkersCount: '142 Certified',
      safetyBadge: 'Safety Badge LV-3',
      safetyColor: 'text-emerald-600',
      slaTime: '< 45 mins',
      slaColor: 'text-rose-600',
      slaSub: '24/7 Rapid Escrow',
      status: 'Active',
      statusType: 'active',
      isHighDemand: true,
      isEmergency: true,
    },
    {
      id: 'srv-2',
      code: '#SRV-2041',
      name: 'Domestic Water Main Leakage Fix',
      tag: 'Standard',
      tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Wrench,
      iconBg: 'bg-blue-50 text-blue-600',
      guild: 'Sanitary & Pipeline Guild',
      guildIcon: Droplets,
      baseRate: '₹1,200 flat',
      rateSub: 'Diagnostics + 1 hr labor',
      workerSplit: 90,
      coopSplit: 10,
      workerAvatars: ['SP', 'MR'],
      certifiedWorkersCount: '98 Plumbers',
      safetyBadge: 'Pressure Valve Certified',
      safetyColor: 'text-emerald-600',
      slaTime: '< 2 hours',
      slaColor: 'text-slate-600',
      slaSub: 'City Core & Suburbs',
      status: 'Active',
      statusType: 'active',
      isHighDemand: true,
      isEmergency: false,
    },
    {
      id: 'srv-3',
      code: '#SRV-3012',
      name: 'Deep Drain Jetting & Sanitation',
      tag: 'Monsoon Surge',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Sparkles,
      iconBg: 'bg-blue-50 text-blue-600',
      guild: 'Municipal Green Guild',
      guildIcon: Sparkles,
      baseRate: '₹850 / hr',
      rateSub: 'Surge floor: ₹750 / hr',
      workerSplit: 86,
      coopSplit: 14,
      workerAvatars: ['MG'],
      certifiedWorkersCount: '76 Sanitation Crew',
      safetyBadge: 'Hazmat & Gas Safe',
      safetyColor: 'text-emerald-600',
      slaTime: '< 90 mins',
      slaColor: 'text-slate-600',
      slaSub: 'Heavy Rig Dispatched',
      status: 'Season Surge',
      statusType: 'surge',
      isHighDemand: true,
      isEmergency: false,
    },
    {
      id: 'srv-4',
      code: '#SRV-4019',
      name: 'HVAC Inverter Compressor Service',
      tag: 'Diagnostic',
      tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Snowflake,
      iconBg: 'bg-blue-50 text-blue-600',
      guild: 'Refrigeration Guild',
      guildIcon: Snowflake,
      baseRate: '₹750 / hr',
      rateSub: '+ Parts At Wholesale Cost',
      workerSplit: 87,
      coopSplit: 13,
      workerAvatars: ['RF', 'AS'],
      certifiedWorkersCount: '64 Engineers',
      safetyBadge: 'EPA Refrigerant Lead',
      safetyColor: 'text-emerald-600',
      slaTime: '< 3 hours',
      slaColor: 'text-slate-600',
      slaSub: 'Scheduled Slot Booking',
      status: 'Active',
      statusType: 'active',
      isHighDemand: false,
      isEmergency: false,
    },
    {
      id: 'srv-5',
      code: '#SRV-5082',
      name: 'Structural Bricklaying & Plastering',
      tag: 'Contract Basis',
      tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Building2,
      iconBg: 'bg-blue-50 text-blue-600',
      guild: 'Civil Construction Guild',
      guildIcon: Building2,
      baseRate: '₹550 / hr',
      rateSub: 'Daily Cap: ₹4,400',
      workerSplit: 91,
      coopSplit: 9,
      workerAvatars: ['CC'],
      certifiedWorkersCount: '112 Masons',
      safetyBadge: 'Guild Audit Pending',
      safetyColor: 'text-amber-600',
      isPendingAudit: true,
      slaTime: 'Next-day Dispatch',
      slaColor: 'text-slate-600',
      slaSub: 'Site Inspection Required',
      status: 'Under Guild Review',
      statusType: 'review',
      isHighDemand: false,
      isEmergency: false,
    },
  ]);

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Tab filter
      if (activeTab === 'High Demand' && !s.isHighDemand) return false;
      if (activeTab === 'Emergency Dispatch' && !s.isEmergency) return false;
      if (activeTab === 'Pending Guild Approv.' && s.statusType !== 'review') return false;

      // Trade category filter
      if (selectedTradeCategory !== 'All' && !s.guild.toLowerCase().includes(selectedTradeCategory.toLowerCase())) {
        return false;
      }

      // Rate structure filter
      if (selectedRateStructure === 'Hourly' && !s.baseRate.includes('/ hr')) return false;
      if (selectedRateStructure === 'Flat' && !s.baseRate.includes('flat')) return false;

      // Operating status filter
      if (selectedOperatingStatus !== 'All' && s.statusType !== selectedOperatingStatus) return false;

      // Search query
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesCode = s.code.toLowerCase().includes(q);
        const matchesGuild = s.guild.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesGuild) return false;
      }

      return true;
    });
  }, [services, activeTab, selectedTradeCategory, selectedRateStructure, selectedOperatingStatus, searchFilter]);

  const handleAddServiceSuccess = (newService) => {
    setServices((prev) => [newService, ...prev]);
    showNotification('Service Rate Card Registered', `${newService.name} added to municipal dispatch mesh.`);
  };

  const handleFreezeConfirm = (reason) => {
    showNotification('Emergency Freeze Enforced', `Surge rates locked. Relief protocol active: ${reason}`, 'error');
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
        activeNav="services"
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
            <span className="text-slate-300">&gt;</span>
            <span className="text-slate-900 font-semibold">Services</span>
          </div>

          {/* Right Header Navigation & Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input with ⌘K */}
            <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 transition w-44 md:w-56">
              <Search className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search services..."
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
                onClick={() => showNotification('Dispatch Feed', 'Service dispatch telemetry active across all guilds.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dispatch Feed
              </button>
              <button
                onClick={() => showNotification('Dividend Ledgers', 'Rate card wage split auto-routed to escrow.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Dividend Ledgers
              </button>
              <button
                onClick={() => showNotification('Gov Council', 'Rate Card Review session scheduled.', 'info')}
                className="hover:text-blue-600 transition"
              >
                Gov Council
              </button>
            </div>

            {/* Icon Buttons */}
            <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
              <button
                onClick={() => showNotification('Notifications', 'All rate card floors enforced on consensus mesh.', 'info')}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border border-white"></span>
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <HelpCircle className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pl-1">
              <button
                onClick={() => showNotification('Export Queue', 'Generating encrypted rate card export...', 'info')}
                className="hidden sm:flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Ledger</span>
              </button>

              <button
                onClick={() => setIsFreezeModalOpen(true)}
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Emergency Freeze</span>
              </button>

              {/* Steward Profile in Top Header */}
              <div className="hidden xl:flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                  CS
                </div>
                <div className="text-left leading-none">
                  <div className="text-[11px] font-bold text-slate-800">Chief Steward V. Rao</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sanitation &amp; Electrical Coop</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Services Main View */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* Title Row & Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Services Management
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  Co-op Protocol v4.8
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Standardized municipal trade rate cards, cooperative wage split formulas, and verified skill certification tiers across regional guild collectives.
              </p>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
              <button
                onClick={() => {
                  setSelectedTradeCategory('All');
                  setSelectedRateStructure('All');
                  setSelectedOperatingStatus('All');
                  showNotification('Filters Reset', 'Displaying all trade categories.', 'info');
                }}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Category Filter</span>
              </button>

              <button
                onClick={() => setIsRateAuditOpen(true)}
                className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition shadow-2xs"
              >
                <Calculator className="w-3.5 h-3.5 text-slate-500" />
                <span>Rate Card Audit</span>
              </button>

              <button
                onClick={() => setIsAddServiceOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Service</span>
              </button>
            </div>
          </div>

          {/* 4 KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Active Services */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Total Active Services</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">48</div>
                  <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Spread across 6 Certified Trades</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Guild Coverage: <strong className="text-slate-800">100%</strong></span>
                <span className="font-semibold text-emerald-600">+3 this month</span>
              </div>
            </div>

            {/* Card 2: Standard Labor Floor */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Standard Labor Floor</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline gap-1">
                    ₹450 <span className="text-sm font-semibold text-slate-400">/ hr</span>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Statutory Minimum Guaranteed</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Landmark className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Municipal Ordinance #104</span>
                <span className="font-semibold text-slate-700">Living Wage Lock</span>
              </div>
            </div>

            {/* Card 3: Co-op Dividend Retention */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">Co-op Dividend Retention</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">8.5%</div>
                  <div className="text-[11px] font-semibold text-blue-600 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Direct to Guild Welfare &amp; Equipment</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Health &amp; Pension Reserve</span>
                <span className="font-bold text-emerald-600">₹14.2M Pool</span>
              </div>
            </div>

            {/* Card 4: SLA Guarantee / Escrow Lock */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500">SLA Guarantee / Escrow Lock</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">99.8%</div>
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>On-time Automated Payout</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Avg Dispatch: <strong className="text-slate-800">28 mins</strong></span>
                <span className="font-semibold text-emerald-600">Escrow SLA OK</span>
              </div>
            </div>
          </div>

          {/* Filter Tabs & Status Bar */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl flex-wrap">
                {[
                  { label: 'All Services', count: 48 },
                  { label: 'High Demand', count: 18 },
                  { label: 'Emergency Dispatch', count: 9, hasRedDot: true },
                  { label: 'Pending Guild Approv.' },
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
                      {tab.hasRedDot && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      )}
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-400'
                        }`}>
                          ({tab.count})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Enforcer Pill */}
              <div className="flex items-center gap-2 self-start lg:self-auto bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-800">Floor Price Enforcer: Active</span>
                <RotateCcw
                  className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700 cursor-pointer transition ml-1"
                  onClick={() => showNotification('Floor Enforcer Synced', 'All municipal rates synchronized with ledger node.', 'info')}
                />
              </div>
            </div>

            {/* 4 Dropdown Facets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Dropdown 1: Trade Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  TRADE CATEGORY
                </label>
                <div className="relative">
                  <select
                    value={selectedTradeCategory}
                    onChange={(e) => setSelectedTradeCategory(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Trades (6 Selected)</option>
                    <option value="Electrical">Electrical Trades</option>
                    <option value="Sanitary">Sanitary &amp; Pipeline</option>
                    <option value="Green">Green &amp; Sanitation</option>
                    <option value="Refrigeration">Refrigeration &amp; HVAC</option>
                    <option value="Civil">Civil Construction</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 2: Guild Assignment */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  GUILD COOPERATIVE ASSIGNMENT
                </label>
                <div className="relative">
                  <select
                    value={selectedCoopAssignment}
                    onChange={(e) => setSelectedCoopAssignment(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Municipal Co-ops</option>
                    <option value="Chennai">Chennai Labour Co-op</option>
                    <option value="Madurai">Madurai Guild Union</option>
                    <option value="Coimbatore">Coimbatore Industrial Co-op</option>
                    <option value="Salem">Salem Artisans Co-op</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 3: Rate Structure */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  RATE STRUCTURE
                </label>
                <div className="relative">
                  <select
                    value={selectedRateStructure}
                    onChange={(e) => setSelectedRateStructure(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Rates (Hourly &amp; Flat)</option>
                    <option value="Hourly">Hourly Standard Rates</option>
                    <option value="Flat">Flat Fixed Contracts</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 4: Operating Status */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  OPERATING STATUS
                </label>
                <div className="relative">
                  <select
                    value={selectedOperatingStatus}
                    onChange={(e) => setSelectedOperatingStatus(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 pr-8 rounded-xl shadow-2xs focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Operational Statuses</option>
                    <option value="active">Active</option>
                    <option value="surge">Season Surge</option>
                    <option value="review">Under Guild Review</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Services Data Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Header */}
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">SERVICE NAME &amp; CODE</th>
                    <th className="py-3 px-4 font-semibold">TRADE GUILD</th>
                    <th className="py-3 px-4 font-semibold">BASE &amp; FLOOR RATE</th>
                    <th className="py-3 px-4 font-semibold">WORKER WAGE SPLIT</th>
                    <th className="py-3 px-4 font-semibold">CERTIFIED WORKERS</th>
                    <th className="py-3 px-4 font-semibold">SLA / DISPATCH</th>
                    <th className="py-3 px-4 font-semibold">STATUS</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-slate-100">
                  {filteredServices.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                        No service rate cards matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredServices.map((srv) => {
                      const Icon = srv.icon || Wrench;
                      const GuildIcon = srv.guildIcon || Wrench;

                      return (
                        <tr key={srv.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Column 1: Service Name & Code */}
                          <td className="py-4 px-4">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-xl ${srv.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 leading-tight">
                                  {srv.name}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="font-mono text-[11px] text-slate-400">{srv.code}</span>
                                  {srv.tag && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${srv.tagColor}`}>
                                      {srv.tag}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Column 2: Trade Guild */}
                          <td className="py-4 px-4">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                              <GuildIcon className="w-3.5 h-3.5" />
                              <span>{srv.guild}</span>
                            </div>
                          </td>

                          {/* Column 3: Base & Floor Rate */}
                          <td className="py-4 px-4 text-xs">
                            <div className="font-bold text-slate-900 leading-tight">
                              {srv.baseRate}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {srv.rateSub}
                            </div>
                          </td>

                          {/* Column 4: Worker Wage Split */}
                          <td className="py-4 px-4 min-w-[170px]">
                            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                              <span className="text-emerald-600">{srv.workerSplit}% Worker</span>
                              <span className="text-blue-600">{srv.coopSplit}% Co-op</span>
                            </div>
                            {/* Two-segment Progress bar */}
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex">
                              <div
                                className="bg-emerald-500 h-full rounded-l-full"
                                style={{ width: `${srv.workerSplit}%` }}
                              ></div>
                              <div
                                className="bg-blue-600 h-full rounded-r-full"
                                style={{ width: `${srv.coopSplit}%` }}
                              ></div>
                            </div>
                          </td>

                          {/* Column 5: Certified Workers */}
                          <td className="py-4 px-4 text-xs">
                            <div className="flex items-center gap-1.5">
                              {srv.workerAvatars && (
                                <div className="flex -space-x-1.5 overflow-hidden">
                                  {srv.workerAvatars.map((av, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-block w-5 h-5 rounded-full text-[9px] font-bold text-center leading-5 bg-blue-100 text-blue-700 border border-white"
                                    >
                                      {av}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <span className="font-bold text-slate-900">{srv.certifiedWorkersCount}</span>
                            </div>
                            <div className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${srv.safetyColor}`}>
                              {srv.isPendingAudit ? (
                                <Clock className="w-3 h-3 text-amber-500" />
                              ) : (
                                <Check className="w-3 h-3 text-emerald-600" />
                              )}
                              <span>{srv.safetyBadge}</span>
                            </div>
                          </td>

                          {/* Column 6: SLA / Dispatch */}
                          <td className="py-4 px-4 text-xs">
                            <div className={`flex items-center gap-1 font-bold ${srv.slaColor}`}>
                              {srv.slaTime.includes('Next') ? (
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                              ) : (
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                              )}
                              <span>{srv.slaTime}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {srv.slaSub}
                            </div>
                          </td>

                          {/* Column 7: Status */}
                          <td className="py-4 px-4">
                            {srv.statusType === 'active' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            )}
                            {srv.statusType === 'surge' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                Season Surge
                              </span>
                            )}
                            {srv.statusType === 'review' && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                Under Guild Review
                              </span>
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
              <div className="flex items-center gap-2">
                <span>Showing <strong>1 to 5</strong> of <strong>48</strong> services</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-400">Rows per page:</span>
                <select className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-700 focus:outline-none">
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
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
                  10
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
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 leading-snug">
                    Cooperative Fair-Price Guarantee Protocol v2.1
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-md">
                    CRYPTOGRAPHICALLY ANCHORED
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  All trade rate adjustments, base floor changes, and dividend reallocations require 2-of-3 regional guild steward digital signatures prior to ledger commit.
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsPolicyLedgerOpen(true)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition shadow-2xs flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
            >
              <span>Inspect Policy Ledger</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <AddServiceModal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        onAddSuccess={handleAddServiceSuccess}
      />

      <RateCardAuditModal
        isOpen={isRateAuditOpen}
        onClose={() => setIsRateAuditOpen(false)}
      />

      <EmergencyFreezeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        onFreezeConfirm={handleFreezeConfirm}
      />

      <PolicyLedgerModal
        isOpen={isPolicyLedgerOpen}
        onClose={() => setIsPolicyLedgerOpen(false)}
      />
    </div>
  );
}
