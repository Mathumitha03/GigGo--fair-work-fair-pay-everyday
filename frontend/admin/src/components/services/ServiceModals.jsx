import React, { useState } from 'react';
import {
  X,
  Wrench,
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
  Plus,
  Percent,
  Calculator
} from 'lucide-react';

/* 1. ADD NEW SERVICE MODAL */
export function AddServiceModal({ isOpen, onClose, onAddSuccess }) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [guild, setGuild] = useState('Electrical Guild');
  const [baseRate, setBaseRate] = useState('650');
  const [rateType, setRateType] = useState('hourly'); // 'hourly' | 'flat'
  const [workerSplit, setWorkerSplit] = useState(88);
  const [slaTime, setSlaTime] = useState('< 45 mins');
  const [tag, setTag] = useState('Priority 1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAddSuccess({
        id: 'srv-' + Date.now(),
        code: code || `#SRV-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        tag: tag || 'Standard',
        guild,
        baseRate: rateType === 'hourly' ? `₹${baseRate} / hr` : `₹${baseRate} flat`,
        rateSub: rateType === 'hourly' ? `Floor: ₹${Math.max(450, baseRate - 100)} / hr` : 'Diagnostics included',
        workerSplit: Number(workerSplit),
        coopSplit: 100 - Number(workerSplit),
        certifiedWorkersCount: '45 Certified',
        safetyBadge: 'Safety Badge LV-2',
        slaTime,
        slaSub: 'Escrow Backed',
        status: 'Active',
        statusType: 'active',
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Add New Municipal Service Rate Card</h3>
              <p className="text-[11px] text-slate-500">Under Cooperative Living Wage Guarantee Ordinance #104</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Industrial Solar Inverter Maintenance"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Trade Guild Assignment</label>
              <select
                value={guild}
                onChange={(e) => setGuild(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Electrical Guild">Electrical Guild</option>
                <option value="Sanitary & Pipeline Guild">Sanitary &amp; Pipeline Guild</option>
                <option value="Municipal Green Guild">Municipal Green Guild</option>
                <option value="Refrigeration Guild">Refrigeration Guild</option>
                <option value="Civil Construction Guild">Civil Construction Guild</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Service Priority / Tag</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Priority 1">Priority 1 (Emergency)</option>
                <option value="Standard">Standard Dispatch</option>
                <option value="Monsoon Surge">Monsoon Surge</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Contract Basis">Contract Basis</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Base Rate (₹) *</label>
              <input
                type="number"
                min="450"
                required
                value={baseRate}
                onChange={(e) => setBaseRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-emerald-600 mt-0.5 block">Statutory floor: ₹450 / hr</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">SLA Dispatch Window</label>
              <input
                type="text"
                value={slaTime}
                onChange={(e) => setSlaTime(e.target.value)}
                placeholder="e.g. < 45 mins"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Fair Wage Split Formula</label>
              <span className="font-bold text-slate-900">
                <span className="text-emerald-600">{workerSplit}% Worker</span> • <span className="text-blue-600">{100 - workerSplit}% Co-op Welfare</span>
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="95"
              value={workerSplit}
              onChange={(e) => setWorkerSplit(e.target.value)}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-900 leading-relaxed">
              New rate cards require 2-of-3 steward multi-sig signatures before live activation on the municipal dispatch mesh.
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                <span>Registering Rate Card...</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Rate Card</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 2. RATE CARD AUDIT MODAL */
export function RateCardAuditModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Rate Card Compliance Audit</h3>
              <p className="text-[11px] text-slate-500">Tamil Nadu Municipal Ordinance #104 Living Wage Check</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Statutory Minimum</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">₹450 / hour</div>
              <span className="text-[10px] text-emerald-600 font-semibold">100% Guild Compliant</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Max Co-op Retention</span>
              <div className="text-base font-extrabold text-blue-600 mt-0.5">15% Cap</div>
              <span className="text-[10px] text-slate-500">Average actual: 11.5%</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Audit Passed: All 48 Services Pass Fair Wage Tests</span>
            </div>
            <p>
              No predatory discounts detected. Automated smart contract enforces ₹450/hr minimum floor on all dispatch matches.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. EMERGENCY FREEZE MODAL */
export function EmergencyFreezeModal({ isOpen, onClose, onFreezeConfirm }) {
  const [reason, setReason] = useState('Severe weather / cyclone alert protocol');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onFreezeConfirm(reason);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Emergency Dispatch Rate Freeze</h3>
              <p className="text-[11px] text-slate-500">Lock surge pricing &amp; mandate essential services</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900">
            <strong>Warning:</strong> Initiating an Emergency Freeze locks all dynamic surge fees and transitions high-voltage electrical and drainage jetting to essential public relief tariffs.
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">State Freeze Justification</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              {isProcessing ? 'Enforcing Freeze...' : 'Authorize Emergency Freeze'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. POLICY LEDGER MODAL */
export function PolicyLedgerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Fair-Price Guarantee Policy Ledger</h3>
              <p className="text-[11px] text-slate-500">Protocol v2.1 • 2-of-3 Multi-Sig Policy Consensus</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Signer 1 (Tamil Nadu Labour Dept):</span>
              <span className="font-mono text-emerald-600 font-bold">0x89f2...3c12 [SIGNED]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Signer 2 (Federation Chief Steward):</span>
              <span className="font-mono text-emerald-600 font-bold">0x44a1...99bb [SIGNED]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Signer 3 (Municipal Consumer Council):</span>
              <span className="font-mono text-slate-400 font-medium">Pending quorum vote</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[11px] text-blue-900">
            <strong>Consensus State:</strong> 2-of-3 required signatures present. Floor price rate card is cryptographically active on block #14,892,104.
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
