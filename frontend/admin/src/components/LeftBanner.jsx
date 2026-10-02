import React from 'react';
import { 
  Network, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

export default function LeftBanner() {
  return (
    <div className="relative overflow-hidden left-panel-gradient p-8 sm:p-10 lg:p-12 flex flex-col justify-center rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl border-b lg:border-b-0 lg:border-r border-[#A3C4BC]/40">
      {/* Decorative subtle ambient glows in cream and pastel blue */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#A3C4BC]/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-16 w-80 h-80 bg-[#FDEEC7]/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 space-y-5">
        {/* Tag Pill - Centered without blinking in Cream & Pastel Blue styling */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#A3C4BC]/60 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#4B7D73]" />
            <span className="text-xs font-semibold text-[#2B4D47] tracking-wide">
              Fair work, fair pay, every day
            </span>
          </div>
        </div>

        {/* Hero Headings */}
        <div className="space-y-2 text-center lg:text-left">
          <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1E293B] leading-tight tracking-tight">
            GigGo Enterprise &amp; Coop<br />Admin Management
          </h1>
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed max-w-md mx-auto lg:mx-0">
            Centralized orchestration for multi-region fleet logistics, verified credential management, and cryptographic audit controls.
          </p>
        </div>

        {/* Interactive Floating Glassmorphic Fleet Live Sync Card */}
        <div className="pt-3 pb-1">
          <div className="relative subtle-glass-card rounded-2xl p-5 border border-white/95 transition-all duration-300 hover:shadow-xl group">
            {/* Peeking preview decoration */}
            <div className="absolute -bottom-2 -right-2 w-32 h-24 bg-[#FFF8E1]/80 backdrop-blur-md rounded-xl border border-[#A3C4BC]/50 -z-10 transform rotate-3 opacity-80 group-hover:rotate-6 transition-transform hidden sm:block">
              <div className="p-2 text-[9px] text-[#2B4D47] font-bold">GigGo</div>
              <div className="px-2 text-[8px] text-[#557E75]">Choose who you are</div>
            </div>

            {/* Header of the Live Sync Card */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#E6F0ED] flex items-center justify-center text-[#39635B]">
                  <Network className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm sm:text-base">
                  Fleet Live Sync
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#E6F0ED] text-[#2B4D47] text-xs font-bold border border-[#CCE1DC]">
                99.98% SLA
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 my-4">
              {/* Metric 1 */}
              <div className="bg-[#FFFDF6]/80 rounded-xl p-3 border border-[#E6F0ED]">
                <div className="text-xs font-medium text-slate-500">Coop Drivers</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  14,820
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#39635B]">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.4% w/w</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-[#FFFDF6]/80 rounded-xl p-3 border border-[#E6F0ED]">
                <div className="text-xs font-medium text-slate-500">Gate Checks</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  100% OK
                </div>
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#4B7D73]">
                  <CheckCircle2 className="w-3 h-3 text-[#4B7D73]" />
                  <span>Secured 2FA</span>
                </div>
              </div>
            </div>

            {/* Bottom active feature inside card */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4F8F7] text-[#2B4D47] text-xs font-medium border border-[#CCE1DC]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4B7D73]" />
              <span>Automated Biometric Checks Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
