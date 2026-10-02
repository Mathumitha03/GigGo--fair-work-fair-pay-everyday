import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Coins,
  Scale,
  Download,
  Check,
  Clock,
  ExternalLink,
  Plus
} from 'lucide-react';

/* 1. ADD COOPERATIVE MODAL */
export function AddCooperativeModal({ isOpen, onClose, onAddSuccess }) {
  const [name, setName] = useState('');
  const [regId, setRegId] = useState('');
  const [zone, setZone] = useState('Chennai Central & South');
  const [district, setDistrict] = useState('Chennai');
  const [selectedTrades, setSelectedTrades] = useState(['Plumbing']);
  const [workersCount, setWorkersCount] = useState(25);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const tradesList = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Carpentry',
    'Masonry',
    'Painting',
    'Sanitation',
    'Waste Handling',
    'Metalwork',
    'HVAC',
    'General Repairs',
    'Appliance Care'
  ];

  const toggleTrade = (trade) => {
    if (selectedTrades.includes(trade)) {
      if (selectedTrades.length > 1) {
        setSelectedTrades(selectedTrades.filter(t => t !== trade));
      }
    } else {
      setSelectedTrades([...selectedTrades, trade]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAddSuccess({
        id: 'coop-' + Date.now(),
        name,
        regId: regId || `TN-${district.substring(0, 3).toUpperCase()}-2025-APP-${Math.floor(10 + Math.random() * 90)}`,
        establishedYear: new Date().getFullYear(),
        isApp: true,
        primaryZone: zone,
        subZone: `${district} Corporation Wards`,
        workersCount: Number(workersCount),
        biometricsPercent: 100,
        trades: selectedTrades,
        governanceStatus: 'Pending Bylaw Scrutiny',
        governanceSub: 'Submitted for Municipal Registrar Review',
        status: 'Pending Review',
        statusType: 'pending',
      });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Register New Labour Cooperative</h3>
              <p className="text-[11px] text-slate-500">Under Tamil Nadu Cooperative Societies Act, 1983</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Proposed Cooperative Society Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tiruchirappalli Masonry &amp; Civil Guild"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Municipal District</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Chennai">Chennai</option>
                <option value="Madurai">Madurai</option>
                <option value="Salem">Salem</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Tirunelveli">Tirunelveli</option>
                <option value="Vellore">Vellore</option>
                <option value="Erode">Erode</option>
                <option value="Trichy">Tiruchirappalli</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Worker Quorum</label>
              <input
                type="number"
                min="10"
                max="1000"
                value={workersCount}
                onChange={(e) => setWorkersCount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Primary Municipal Operational Zone</label>
            <input
              type="text"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="e.g. Ward Zones 4, 5 &amp; Industrial Corridor"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Certified Trades Offered (Select multiple)</label>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
              {tradesList.map((trade) => {
                const isSelected = selectedTrades.includes(trade);
                return (
                  <button
                    type="button"
                    key={trade}
                    onClick={() => toggleTrade(trade)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {trade}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-blue-900 leading-relaxed">
              Upon submission, an immutable registration record will be seeded on Node <strong>TN-CORP-SEC-04</strong> and dispatched for Municipal Registrar bylaw scrutiny.
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
                <span>Registering Cooperative...</span>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit for Accreditation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 2. REVIEW COOPERATIVE MODAL */
export function ReviewCoopModal({ coop, isOpen, onClose, onApprove, onReject }) {
  if (!isOpen || !coop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">{coop.name}</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                Pending Approval
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{coop.regId}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Primary Zone:</span>
              <span className="font-semibold text-slate-800">{coop.primaryZone}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Registered Worker Quorum:</span>
              <span className="font-semibold text-slate-800">{coop.workersCount} Workers</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Certified Trades:</span>
              <span className="font-semibold text-blue-600">{coop.trades.join(', ')}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500">Bylaw Status:</span>
              <span className="font-bold text-blue-600">{coop.governanceStatus}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900">
            <strong>Audit Note:</strong> Municipal Registrar requires verification of trade council affiliations and KYC biometric rosters before certificate issuance.
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                onReject(coop);
                onClose();
              }}
              className="px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-xl transition"
            >
              Request Revision
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-xl transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  onApprove(coop);
                  onClose();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve &amp; Activate Society</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. AUDIT LEDGER MODAL */
export function AuditLedgerModal({ coop, isOpen, onClose }) {
  if (!isOpen || !coop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Escrow &amp; Wage Audit Ledger</h3>
              <p className="text-[11px] text-slate-500">{coop.name} • {coop.regId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Escrow Balance</span>
              <div className="text-sm font-extrabold text-slate-900 mt-0.5">₹14,20,500</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Dividend Split</span>
              <div className="text-sm font-extrabold text-emerald-600 mt-0.5">92.4% Direct</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Last Settlement</span>
              <div className="text-xs font-semibold text-slate-700 mt-1">Today, 08:30 AM</div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
            <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-semibold text-slate-600 text-[11px]">
              Recent On-Chain Escrow Settlements
            </div>
            <div className="divide-y divide-slate-100 text-[11px]">
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Weekly Pool Disbursal #W42</div>
                  <div className="font-mono text-[10px] text-blue-600">0x8a92...3b1f</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">₹3,42,000</div>
                  <div className="text-[10px] text-slate-400">42 Wallets Credited</div>
                </div>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">Direct Guild Dividend Pool #W41</div>
                  <div className="font-mono text-[10px] text-blue-600">0x44c1...88ee</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-emerald-600">₹2,98,400</div>
                  <div className="text-[10px] text-slate-400">38 Wallets Credited</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. DISPUTE TRAIL MODAL */
export function DisputeTrailModal({ coop, isOpen, onClose }) {
  if (!isOpen || !coop) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Dispute Trail &amp; Compliance Audit</h3>
              <p className="text-[11px] text-slate-500">{coop.name} • {coop.regId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Status: Escrow Access Frozen (Suspended)</span>
            </div>
            <p>
              Bylaw Dispute #DSP-771: Rate structure alteration without AGM 2/3 quorum approval.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Investigation Officer:</span>
              <span className="font-semibold text-slate-800">Erode District Labour Registrar</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Re-audit Hearing:</span>
              <span className="font-bold text-slate-900">12 Mar 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Affected Workers:</span>
              <span className="font-semibold text-slate-800">{coop.workersCount} Members protected by Wage Guarantee Fund</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Close Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
