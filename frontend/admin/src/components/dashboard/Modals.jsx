import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Building2,
  Fingerprint,
  Download,
  Search,
  Scale,
  ExternalLink,
  Layers,
  KeyRound,
  Check
} from 'lucide-react';

/* 1. VERIFY WORKER MODAL */
export function VerifyWorkerModal({ isOpen, onClose, onVerifySuccess }) {
  const [workerId, setWorkerId] = useState('GIG-8822');
  const [name, setName] = useState('Sundaramoorthy P.');
  const [trade, setTrade] = useState('Electrician');
  const [cooperative, setCooperative] = useState('Salem Skilled Electricians Guild');
  const [aadhaarVerified, setAadhaarVerified] = useState(true);
  const [biometricsVerified, setBiometricsVerified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onVerifySuccess({
        workerId,
        name,
        trade,
        cooperative,
      });
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Verify Worker Credential</h3>
              <p className="text-[11px] text-slate-500">Authorize certified guild member on tamper-proof ledger</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Worker ID</label>
            <input
              type="text"
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Certified Trade</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="Electrician">Electrician (Grade A)</option>
                <option value="Plumbing">Plumbing (Gold Seal)</option>
                <option value="Carpentry">Carpentry (Master Guild)</option>
                <option value="Cleaning">Cleaning &amp; Sanitation</option>
                <option value="Painting">Commercial Painting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Affiliated Cooperative Society</label>
            <input
              type="text"
              value={cooperative}
              onChange={(e) => setCooperative(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                DigiLocker / Aadhaar Authentication
              </span>
              <span className="text-emerald-600 font-bold">VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
                Biometric Token Signature Match
              </span>
              <span className="text-emerald-600 font-bold">MATCH (99.8%)</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Registering on Ledger...</span>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify &amp; Authorize</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 2. REVIEW & VERIFY APPROVAL MODAL */
export function ReviewApprovalModal({ item, isOpen, onClose, onApprove, onReject }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${item.typeBadgeColor}`}>
                {item.type}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{item.submittedDate}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Certification Details</span>
              <p className="font-semibold text-slate-800 text-xs mt-0.5">{item.certDetails}</p>
            </div>
            <div className="pt-2 border-t border-slate-200/60 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400">Jurisdiction Authority:</span>
                <div className="font-medium text-slate-700">Tamil Nadu Labour Welfare Board</div>
              </div>
              <div>
                <span className="text-slate-400">Validation Status:</span>
                <div className="font-bold text-emerald-600">{item.verificationTag?.text || 'Pending'}</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            <strong>Compliance Note:</strong> Society meets all required minimum membership quotas and fair wage escrow criteria under the Digital Worker Cooperative Framework.
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                onReject(item);
                onClose();
              }}
              className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-semibold rounded-xl transition"
            >
              Reject Application
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onApprove(item);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve &amp; Mint On-Chain</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. CRYPTOGRAPHIC AUDIT EXPLORER MODAL */
export function AuditExplorerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const blocks = [
    { block: '#14,892,104', hash: '0x9f...8a12', action: 'VERIFY_WORKER', signer: 'Labour_Board_TN_Key01', time: '4 mins ago' },
    { block: '#14,892,103', hash: '0x3d...77b1', action: 'POOL_DISBURSEMENT', signer: 'Chennai_Coop_Treasury', time: '28 mins ago' },
    { block: '#14,892,102', hash: '0x11...e04b', action: 'BOOKING_SETTLEMENT', signer: 'Dispatch_Oracle_Mesh', time: '1 hr ago' },
    { block: '#14,892,101', hash: '0x8b...39fc', action: 'KYC_ATTESTATION', signer: 'DigiLocker_Gov_Gateway', time: '3 hrs ago' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">GigGo Cryptographic Audit Explorer</h3>
              <p className="text-[11px] text-slate-500">Immutable federated ledger telemetry • Chain ID: 4182 (GigGo-Main)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry status row */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Consensus</span>
            <div className="font-bold text-slate-800 mt-0.5">Proof-of-Cooperative</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Validators</span>
            <div className="font-bold text-emerald-600 mt-0.5">18 Nodes Synced</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Merkle Root</span>
            <div className="font-mono text-slate-700 text-[11px] mt-0.5 truncate">0x7c4f...a891</div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px]">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Block / Hash</th>
                <th className="py-2.5 px-3 font-semibold">Action</th>
                <th className="py-2.5 px-3 font-semibold">Signer Key</th>
                <th className="py-2.5 px-3 font-semibold text-right">Age</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blocks.map((b) => (
                <tr key={b.block} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-800">{b.block}</span>
                    <span className="block font-mono text-[10px] text-blue-600">{b.hash}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[10px]">
                      {b.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{b.signer}</td>
                  <td className="py-2.5 px-3 text-right text-[11px] text-slate-400">{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            Close Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

/* 4. FAST LANE DISPUTE QUEUE MODAL */
export function DisputeQueueModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const disputes = [
    { id: 'CMP-104', trade: 'Carpentry', parties: 'Coimbatore Hub vs Customer #942', type: 'Rate Discrepancy', amount: '₹1,200', sla: '18m remaining' },
    { id: 'CMP-103', trade: 'Plumbing', parties: 'Chennai Plumbers vs Client #312', type: 'Late Arrival', amount: '₹450', sla: '42m remaining' },
    { id: 'CMP-102', trade: 'Electrician', parties: 'Salem Guild vs Tech Corp', type: 'Job Scope Overrun', amount: '₹3,400', sla: '1h 10m' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Fast Lane Dispute Triage</h3>
              <p className="text-[11px] text-slate-500">Autonomous co-op arbitration &amp; escrow freeze queue</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {disputes.map((d) => (
            <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600">{d.id}</span>
                  <span className="font-semibold text-slate-800">{d.type}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">{d.trade}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{d.parties}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-bold text-slate-900">{d.amount}</div>
                <div className="text-[10px] text-amber-600 font-semibold">{d.sla}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* 5. COMMAND PALETTE (⌘K) */
export function CommandPaletteModal({ isOpen, onClose, onSelectAction }) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const actions = [
    { title: 'Verify Worker Credential', category: 'Action', shortcut: 'V' },
    { title: 'Export Weekly Fair Wage Ledger', category: 'Finance', shortcut: 'E' },
    { title: 'View Salem Skilled Electricians Guild', category: 'Cooperative', shortcut: 'S' },
    { title: 'Review Madurai Carpenter Co-op Batch', category: 'Approvals', shortcut: 'M' },
    { title: 'Open Dispute Resolution Console', category: 'Fast Lane', shortcut: 'D' },
    { title: 'Inspect On-Chain Cryptographic Block Explorer', category: 'Telemetry', shortcut: 'C' },
  ].filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workers, guilds, bookings..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-100 rounded border border-slate-200">ESC</kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {actions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">No matching commands found.</div>
          ) : (
            actions.map((act) => (
              <div
                key={act.title}
                onClick={() => {
                  onSelectAction(act);
                  onClose();
                }}
                className="px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {act.category}
                  </span>
                  <span className="font-medium text-slate-700">{act.title}</span>
                </div>
                <kbd className="text-[10px] font-mono text-slate-400">{act.shortcut}</kbd>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
