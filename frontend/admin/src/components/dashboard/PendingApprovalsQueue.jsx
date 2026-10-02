import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Building2,
  Users2,
  User,
  ArrowRight
} from 'lucide-react';

export default function PendingApprovalsQueue({
  items = [
    {
      id: 'app-1',
      title: 'Salem Skilled Electricians Guild',
      type: 'Co-op Registration',
      typeBadgeColor: 'bg-blue-50 text-blue-600',
      icon: Building2,
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
      icon: Users2,
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
      icon: User,
      iconBg: 'bg-blue-50 text-blue-600',
      certDetails: 'Trade Cert: ITI Plumbing Gold Seal • Chennai Central Cooperative',
      submittedDate: 'Submitted: Today, 10:14 AM',
      verificationTag: {
        text: 'Biometrics Verified',
        icon: Fingerprint,
        color: 'text-emerald-600 font-semibold',
      },
    },
  ],
  onReview = () => {},
  onReject = () => {},
  onViewAll = () => {}
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold text-slate-900 leading-snug">
              Pending Approvals Queue
            </h2>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full">
              3 Urgent
            </span>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
          >
            <span>View all (18)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Approval Items List */}
        <div className="mt-4 space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            const TagIcon = item.verificationTag.icon;

            return (
              <div
                key={item.id}
                className="border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 rounded-xl p-3.5 transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Left: Icon + Information */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${item.typeBadgeColor}`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1 truncate">
                      {item.certDetails}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.submittedDate}</span>
                      </span>
                      <span>•</span>
                      <span className={`flex items-center gap-1 ${item.verificationTag.color}`}>
                        <TagIcon className="w-3 h-3" />
                        <span>{item.verificationTag.text}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                  <button
                    onClick={() => onReview(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-2xs transition w-full sm:w-auto text-center"
                  >
                    Review &amp; Verify
                  </button>
                  <button
                    onClick={() => onReject(item)}
                    className="text-slate-400 hover:text-red-600 text-[11px] font-semibold px-2 py-0.5 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
