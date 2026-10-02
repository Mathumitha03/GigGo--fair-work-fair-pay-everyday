import React, { useState } from 'react';

export default function WeeklyVolumeChart({ timeFilter = 'Last 7 Days' }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  // Bar chart data matching the screenshot
  const data = [
    { day: 'Mon', completed: 78, inFlight: 24, total: 102, payout: '₹1,42,800', compHeight: 34, inflightHeight: 14 },
    { day: 'Tue', completed: 96, inFlight: 28, total: 124, payout: '₹1,76,400', compHeight: 44, inflightHeight: 16 },
    { day: 'Wed', completed: 118, inFlight: 34, total: 152, payout: '₹2,12,000', compHeight: 54, inflightHeight: 18 },
    { day: 'Thu', completed: 132, inFlight: 30, total: 162, payout: '₹2,38,500', compHeight: 60, inflightHeight: 15 },
    { day: 'Fri', completed: 154, inFlight: 38, total: 192, payout: '₹2,84,200', compHeight: 70, inflightHeight: 18 },
    { day: 'Sat', completed: 178, inFlight: 42, total: 220, payout: '₹3,22,600', compHeight: 80, inflightHeight: 20 },
    { day: 'Sun', completed: 142, inFlight: 32, total: 174, payout: '₹2,48,000', compHeight: 65, inflightHeight: 16 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Chart Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Weekly Booking Volume &amp; Fair Wage Disbursal
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Dispatched vs successfully settled jobs with worker co-op dividend split
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-blue-200 inline-block"></span>
              <span>In-Flight</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="mt-8 mb-4 relative h-48 sm:h-52 flex items-end justify-between px-3 sm:px-6">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-30">
            <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-200 w-full h-0"></div>
            <div className="border-b border-slate-200 w-full h-0"></div>
          </div>

          {/* Stacked Bars */}
          {data.map((item, index) => {
            const isHovered = hoveredDay?.day === item.day;
            return (
              <div
                key={item.day}
                className="relative flex flex-col items-center flex-1 max-w-[42px] sm:max-w-[48px] h-full justify-end group cursor-pointer"
                onMouseEnter={() => setHoveredDay(item)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-30 bg-slate-900 text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <div className="font-bold">{item.day} Breakdown</div>
                    <div className="text-slate-300 text-[10px] mt-0.5">
                      ✓ {item.completed} completed • ✈ {item.inFlight} in-flight
                    </div>
                    <div className="text-emerald-400 font-semibold text-[10px]">
                      Payout: {item.payout}
                    </div>
                  </div>
                )}

                {/* Bar Stack */}
                <div className="w-full flex flex-col items-center justify-end rounded-t-sm overflow-hidden transition-all duration-200 group-hover:opacity-90">
                  {/* In-Flight portion (Top bar - Light Blue) */}
                  <div
                    style={{ height: `${item.inflightHeight * 1.5}px` }}
                    className="w-full bg-blue-200 transition-all duration-300"
                  ></div>
                  {/* Completed portion (Bottom bar - Royal Blue) */}
                  <div
                    style={{ height: `${item.compHeight * 1.5}px` }}
                    className="w-full bg-blue-600 transition-all duration-300"
                  ></div>
                </div>

                {/* Day Label */}
                <span className="mt-3 text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Summary KPI Metrics */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <div className="text-[11px] font-medium text-slate-400">Week Payout</div>
          <div className="text-base font-extrabold text-slate-900 tracking-tight mt-0.5">
            ₹14,24,500
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Direct Labor Share</div>
          <div className="text-base font-extrabold text-emerald-600 tracking-tight mt-0.5">
            92.4% <span className="text-xs font-semibold text-emerald-700">(Direct to Guild)</span>
          </div>
        </div>
        <div>
          <div className="text-[11px] font-medium text-slate-400">Co-op Mesh Fee</div>
          <div className="text-base font-extrabold text-slate-800 tracking-tight mt-0.5">
            2.8% <span className="text-xs font-semibold text-slate-500">(Platform Maint.)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
