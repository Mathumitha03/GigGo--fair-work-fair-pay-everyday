import React, { useState } from 'react';
import {
  X,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Clock,
  Layers,
  Check,
  Lock,
  ExternalLink,
  Zap,
  Wrench,
  Gavel,
  Scale,
  Phone,
  User,
  MapPin,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

/* 1. CREATE MANUAL DISPATCH BOOKING MODAL */
export function CreateManualBookingModal({ isOpen, onClose, onCreateSuccess }) {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [trade, setTrade] = useState('Electrical Guild');
  const [serviceName, setServiceName] = useState('High-Voltage Conduit Repair');
  const [urgency, setUrgency] = useState('EMERGENCY'); // 'EMERGENCY' | 'STANDARD' | 'SCHEDULED'
  const [amount, setAmount] = useState('1250');
  const [workerName, setWorkerName] = useState('Senthil Kumar V.');
  const [coopName, setCoopName] = useState('Chennai Labour Co-op #1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerAddress.trim()) return;
    setIsSubmitting(true);

    const numAmount = Number(amount) || 1000;
    const workerAmt = Math.round(numAmount * 0.88);
    const coopAmt = numAmount - workerAmt;

    setTimeout(() => {
      setIsSubmitting(false);
      onCreateSuccess({
        id: 'bk-' + Date.now(),
        bookingId: `#BK-${Math.floor(9400 + Math.random() * 99)}`,
        isEmergency: urgency === 'EMERGENCY',
        urgencyTag: urgency,
        customerAddress,
        timeAgo: 'Just now',
        serviceName,
        guild: trade,
        guildIcon: trade.includes('Electrical') ? Zap : Wrench,
        tierBadge: 'Tier 1 Certified',
        workerName,
        workerId: `ID #GIG-${Math.floor(1000 + Math.random() * 9000)}`,
        coopName,
        workerAvatar: workerName.slice(0, 2).toUpperCase(),
        totalAmount: `₹${numAmount.toLocaleString()}`,
        workerAmount: `₹${workerAmt.toLocaleString()} Worker`,
        coopAmount: `₹${coopAmt.toLocaleString()} Co-op Guild`,
        status: 'In Transit',
        statusType: 'in-transit',
        slaText: 'ETA 15 mins',
        slaSub: 'Standard SLA: <25m',
        slaAlert: true
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                Create Manual Municipal Booking
              </h3>
              <p className="text-[11px] text-slate-500">
                Direct dispatch to authorized cooperative trade guild
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Customer Name / Entity
              </label>
              <input
                type="text"
                placeholder="e.g. Sundaram Residency RWA"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Dispatch Location / Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sundaram Residency, Apt 4B"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Assigned Guild Trade
              </label>
              <select
                value={trade}
                onChange={(e) => {
                  setTrade(e.target.value);
                  if (e.target.value.includes('Electrical')) setServiceName('High-Voltage Conduit Repair');
                  else if (e.target.value.includes('Plumbing')) setServiceName('Main Line Pipe Burst Containment');
                  else setServiceName('Emergency Trade Repair');
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Electrical Guild">Electrical Guild</option>
                <option value="Plumbing & Sanitation">Plumbing & Sanitation Guild</option>
                <option value="Climate Mechanics">Climate Mechanics</option>
                <option value="Woodcraft Guild">Woodcraft Guild</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Service Specification
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Urgency Tier
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="EMERGENCY">EMERGENCY (SLA &lt;20m)</option>
                <option value="PRIORITY">PRIORITY (SLA &lt;45m)</option>
                <option value="STANDARD">STANDARD (SLA &lt;2h)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Total Escrow Value (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Assigned Worker Node
              </label>
              <input
                type="text"
                value={workerName}
                onChange={(e) => setWorkerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Escrow Preview Pill */}
          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2 text-blue-800 font-medium">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Multi-sig Escrow Lock:</span>
            </div>
            <div className="font-bold text-slate-800">
              ₹{Math.round((Number(amount) || 1250) * 0.88)} (Worker) + ₹{Math.round((Number(amount) || 1250) * 0.12)} (Co-op Pool)
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Transmitting to Mesh...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Dispatch Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 2. BOOKING DETAILS MODAL */
export function BookingDetailsModal({ isOpen, onClose, booking }) {
  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm leading-tight">
                  Booking {booking.bookingId}
                </h3>
                {booking.isEmergency && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    EMERGENCY
                  </span>
                )}
                {booking.isDisputed && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                    DISPUTED
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Created {booking.timeAgo} &bull; Consensus Node Validated
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {/* Location & Service Info */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500">SERVICE &amp; TRADE</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">{booking.serviceName}</div>
                <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                  <span>{booking.guild}</span> &bull; <span>{booking.tierBadge}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-slate-500">ESCROW AMOUNT</div>
                <div className="font-extrabold text-slate-900 text-base">{booking.totalAmount}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center gap-2 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-medium">{booking.customerAddress}</span>
            </div>
          </div>

          {/* Assigned Worker */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs border border-slate-200">
                {booking.workerAvatar || 'W'}
              </div>
              <div>
                <div className="font-bold text-slate-900">{booking.workerName}</div>
                <div className="text-[11px] text-slate-500">{booking.workerId} &bull; {booking.coopName}</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition">
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Status & SLA telemetry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Dispatch Status</div>
              <div className="font-bold text-slate-800 mt-1">{booking.status}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="text-[10px] font-bold text-slate-400 uppercase">SLA Telemetry</div>
              <div className="font-bold text-slate-800 mt-1">{booking.slaText}</div>
              <div className="text-[10px] text-slate-500">{booking.slaSub}</div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-xs"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. ARBITRATION TRIBUNAL MODAL */
export function ArbitrationModal({ isOpen, onClose, booking, onResolve }) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

  if (!isOpen || !booking) return null;

  const handleResolveAction = (type) => {
    setIsResolving(true);
    setTimeout(() => {
      setIsResolving(false);
      onResolve(type, booking);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-red-100 flex items-center justify-between bg-red-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-red-900 text-sm leading-tight">
                  Tribunal Arbitration: {booking.bookingId}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
                  DISPUTE ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-red-700/80">
                Guild Arbiter S. Natarajan &bull; Scheduled 16:30 IST
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-200/70 space-y-1.5 text-slate-700">
            <div className="font-bold text-red-800 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Issue: Parts Warranty Scope Dispute</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Customer claims rewound pump impeller casing cracked during standard testing. Worker {booking.workerName} reports preexisting motor shaft distortion.
            </p>
            <div className="text-[11px] font-bold text-slate-800 pt-1">
              Escrow Value In Custody: <span className="text-red-700">{booking.totalAmount}</span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Tribunal Verdict / Settlement Terms
            </label>
            <textarea
              rows="3"
              placeholder="Enter arbitration resolution notes for the immutable audit ledger..."
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            ></textarea>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Defer Hearing
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleResolveAction('50-50 Split')}
                disabled={isResolving}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                50/50 Compromise
              </button>
              <button
                type="button"
                onClick={() => handleResolveAction('Disburse to Worker')}
                disabled={isResolving}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-800 rounded-xl transition shadow-xs"
              >
                Release Escrow
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. SMART CONTRACT ESCROW INSPECT MODAL */
export function EscrowInspectModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm leading-tight">
                Cooperative Escrow Multi-Sig Vault
              </h3>
              <p className="text-[11px] text-slate-500">
                Protocol v2.1 &bull; Cryptographically Verified Mesh
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Locked Pool Total</div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">₹18,42,500</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">342 Dispatches Buffered</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Consensus Status</div>
              <div className="text-xl font-extrabold text-emerald-600 mt-1">Active</div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Node: Chennai-South-04</div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
            <div className="text-slate-400">// Smart Contract Ledger Anchor</div>
            <div className="text-emerald-400">Vault: 0x8a92...3f1c</div>
            <div className="text-slate-400">Signatures: 2 of 3 Regional Guild Stewards verified</div>
            <div className="text-slate-400">Escrow Clearance: Automated upon OTP verification</div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Close Vault Telemetry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
