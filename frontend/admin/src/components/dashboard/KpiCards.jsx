import React from 'react';
import {
  Users,
  Briefcase,
  Wrench,
  CalendarCheck,
  FileText,
  AlertTriangle,
  ArrowUp,
  TrendingUp,
  CheckCircle2,
  Package,
  AlertCircle,
  Clock
} from 'lucide-react';

export default function KpiCards({
  stats = {
    totalCooperatives: 48,
    totalWorkers: '1,240',
    activeServices: 320,
    totalBookings: 856,
    pendingApprovals: 18,
    openComplaints: 7,
  },
  onCardClick = () => {}
}) {
  const cards = [
    {
      id: 'cooperatives',
      title: 'Total Cooperatives',
      value: stats.totalCooperatives,
      icon: Users,
      iconBg: 'bg-blue-50 text-blue-600',
      trend: '+3 this month',
      trendIcon: ArrowUp,
      trendColor: 'text-emerald-600',
    },
    {
      id: 'workers',
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: Briefcase,
      iconBg: 'bg-blue-50 text-blue-600',
      trend: '+12.4% w/w',
      trendIcon: TrendingUp,
      trendColor: 'text-emerald-600',
    },
    {
      id: 'services',
      title: 'Active Services',
      value: stats.activeServices,
      icon: Wrench,
      iconBg: 'bg-blue-50 text-blue-600',
      trend: '9 categories active',
      trendIcon: CheckCircle2,
      trendColor: 'text-blue-600',
    },
    {
      id: 'bookings',
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarCheck,
      iconBg: 'bg-blue-50 text-blue-600',
      trend: '₹14.2L guild GMV',
      trendIcon: Package,
      trendColor: 'text-blue-600',
    },
    {
      id: 'approvals',
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: FileText,
      iconBg: 'bg-amber-50 text-amber-600',
      trend: 'Requires review',
      trendIcon: AlertCircle,
      trendColor: 'text-amber-600',
    },
    {
      id: 'complaints',
      title: 'Open Complaints',
      value: stats.openComplaints,
      icon: AlertTriangle,
      iconBg: 'bg-red-50 text-red-600',
      trend: 'SLA: 1.4h avg',
      trendIcon: Clock,
      trendColor: 'text-slate-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.trendIcon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick(card.id)}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 hover:border-slate-300 hover:shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 leading-tight">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <div className={`mt-1.5 flex items-center gap-1 text-[11px] font-semibold ${card.trendColor}`}>
                <TrendIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{card.trend}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
