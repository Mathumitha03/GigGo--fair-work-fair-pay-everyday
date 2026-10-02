import React from 'react';
import {
  MoreVertical,
  Zap,
  Wrench,
  Sparkles,
  Hammer,
  Paintbrush,
  ArrowRight
} from 'lucide-react';

export default function DemandBreakdown({ onViewAllTrades = () => {} }) {
  const categories = [
    {
      name: 'Electrician',
      icon: Zap,
      iconColor: 'text-blue-600',
      percentage: 32,
      orders: '274 completed orders',
      avg: 'Avg: ₹850/visit',
      barColor: 'bg-blue-600',
    },
    {
      name: 'Plumbing',
      icon: Wrench,
      iconColor: 'text-blue-500',
      percentage: 24,
      orders: '205 completed orders',
      avg: 'Avg: ₹720/visit',
      barColor: 'bg-blue-500',
    },
    {
      name: 'Cleaning',
      icon: Sparkles,
      iconColor: 'text-emerald-600',
      percentage: 18,
      orders: '154 completed orders',
      avg: 'Avg: ₹950/visit',
      barColor: 'bg-emerald-500',
    },
    {
      name: 'Carpentry',
      icon: Hammer,
      iconColor: 'text-amber-600',
      percentage: 15,
      orders: '128 completed orders',
      avg: 'Avg: ₹1,200/visit',
      barColor: 'bg-amber-500',
    },
    {
      name: 'Painting',
      icon: Paintbrush,
      iconColor: 'text-indigo-600',
      percentage: 11,
      orders: '95 completed orders',
      avg: 'Avg: ₹3,400/contract',
      barColor: 'bg-indigo-500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Demand Breakdown
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Category share by validated service volume
            </p>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Categories List */}
        <div className="mt-4 space-y-3.5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="group">
                {/* Title + Percentage */}
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <Icon className={`w-3.5 h-3.5 ${cat.iconColor}`} />
                    <span>{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{cat.percentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.barColor} transition-all duration-500`}
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{cat.orders}</span>
                  <span className="font-medium text-slate-500">{cat.avg}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="pt-3 border-t border-slate-100 mt-4">
        <button
          onClick={onViewAllTrades}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition group"
        >
          <span>View all 9 certified trades</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
