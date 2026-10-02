import React from 'react';
import {
  CheckCircle2,
  CheckCircle,
  AlertCircle,
  Coins,
  BookOpen,
  ExternalLink
} from 'lucide-react';

export default function PlatformAuditFeed({ onOpenAuditExplorer = () => {} }) {
  const feedItems = [
    {
      id: 'feed-1',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-200',
      title: (
        <span>
          Worker ID <span className="font-bold text-blue-600">#GIG-8821</span> verification completed
        </span>
      ),
      description: 'Signed by Tamil Nadu Labour Board key authority.',
      time: '4 mins ago',
      txHash: '0x9f...8a12',
    },
    {
      id: 'feed-2',
      icon: Coins,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      title: 'Chennai Labour Cooperative settled weekly pool',
      description: (
        <span>
          <strong className="text-emerald-600 font-bold">₹1,85,000</strong> disbursed to 42 worker wallets via UPI
        </span>
      ),
      time: '28 mins ago',
      txHash: '0x3d...77b1',
    },
    {
      id: 'feed-3',
      icon: CheckCircle,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-200',
      title: (
        <span>
          Booking <span className="font-bold text-blue-600">#BK-4921</span> marked completed
        </span>
      ),
      description: '⭐ 4.9/5.0 • Verified customer sign-off OTP verified',
      time: '1 hour ago',
      txHash: '0x11...e04b',
    },
    {
      id: 'feed-4',
      icon: AlertCircle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-200',
      title: (
        <span>
          Complaint <span className="font-bold text-rose-600">#CMP-104</span> assigned
        </span>
      ),
      description: 'Assigned to Dispute Officer (Coimbatore Zone). Rate dispute.',
      time: '2 hours ago',
      priority: 'Priority: High',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 leading-snug">
            Platform Audit Feed
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Immutable Ledger</span>
          </div>
        </div>

        {/* Timeline Feed */}
        <div className="mt-4 relative pl-6 space-y-4">
          {/* Vertical connecting line */}
          <div className="absolute left-[11px] top-2 bottom-3 w-[1.5px] bg-slate-200"></div>

          {feedItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative group">
                {/* Node icon marker */}
                <div
                  className={`absolute -left-6 top-0.5 w-[22px] h-[22px] rounded-full border ${item.iconBg} flex items-center justify-center bg-white shadow-2xs`}
                >
                  <Icon className={`w-3 h-3 ${item.iconColor}`} />
                </div>

                {/* Content */}
                <div className="text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {item.description}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>{item.time}</span>
                    {item.txHash && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-slate-400 group-hover:text-blue-600 transition flex items-center gap-0.5 cursor-pointer">
                          Tx: {item.txHash}
                        </span>
                      </>
                    )}
                    {item.priority && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-500">{item.priority}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-5 pt-3 border-t border-slate-100">
        <button
          onClick={onOpenAuditExplorer}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 text-blue-700 text-xs font-semibold rounded-xl transition duration-150 shadow-2xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Open Cryptographic Audit Explorer</span>
        </button>
      </div>
    </div>
  );
}
