import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Fingerprint,
  Building2,
  Star,
  Clock,
  Coins,
  Upload,
  Scale,
  ExternalLink,
  Check
} from 'lucide-react';

/* 1. WORKER DETAIL MODAL / DRAWER */
export function WorkerDetailModal({ worker, isOpen, onClose }) {
  if (!isOpen || !worker) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-100 bg-blue-50 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">
              {worker.avatarUrl ? (
                <img src={worker.avatarUrl} alt={worker.name} className="w-full h-full object-cover" />
              ) : (
                <span>{worker.avatarText || worker.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{worker.name}</h3>
                <span className="font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {worker.idCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {worker.primaryTrade} • Joined {worker.joinedDate}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Settled</span>
              <div className="text-base font-extrabold text-slate-900 mt-0.5">{worker.monthlyWage}</div>
              <span className="text-[10px] text-emerald-600 font-semibold">✓ 100% Escrow Backed</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Performance</span>
              <div className="text-base font-extrabold text-amber-500 mt-0.5 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{worker.rating || 'New'}</span>
              </div>
              <span className="text-[10px] text-slate-500">{worker.jobsDone}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400">Punctuality</span>
              <div className="text-base font-extrabold text-blue-600 mt-0.5">{worker.punctuality || '100%'}</div>
              <span className="text-[10px] text-slate-500">Dispatch verified</span>
            </div>
          </div>

          {/* Affiliation & Guild */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Assigned Cooperative:</span>
              <span className="font-bold text-slate-800">{worker.cooperativeName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Guild Sector &amp; Zone:</span>
              <span className="font-semibold text-blue-600">{worker.cooperativeZone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Guild Trade Authority:</span>
              <span className="font-medium text-slate-700">{worker.guildClass}</span>
            </div>
          </div>

          {/* KYC & Biometrics Verification */}
          <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Identity &amp; Biometric Verification
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                worker.kycStatus === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {worker.kycStatus === 'verified' ? 'UIDAI & POLICE VERIFIED' : 'PENDING BIOMETRICS'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Biometric token linked with Tamil Nadu Municipal Labour Board key. Aadhaar identity verified via DigiLocker Government Gateway.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 2. VERIFY WORKER ACTION MODAL (e.g. for Parthiban Krishnan) */
export function VerifyWorkerActionModal({ worker, isOpen, onClose, onVerifySuccess }) {
  const [biometricsScanned, setBiometricsScanned] = useState(true);
  const [policeCleared, setPoliceCleared] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen || !worker) return null;

  const handleConfirm = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess(worker);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Complete Worker KYC &amp; Biometrics</h3>
              <p className="text-[11px] text-slate-500">{worker.name} ({worker.idCode})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-medium">UIDAI Aadhaar Biometric Scan</span>
              <input
                type="checkbox"
                checked={biometricsScanned}
                onChange={(e) => setBiometricsScanned(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-200/60">
              <span className="font-medium">State Police Verification NOC</span>
              <input
                type="checkbox"
                checked={policeCleared}
                onChange={(e) => setPoliceCleared(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
            </label>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Approving this record will mint a verified worker identity on the municipal federated ledger and switch the dispatch status to <strong>Available for Shift</strong>.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isVerifying || !biometricsScanned || !policeCleared}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Minting Verification...</span>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify &amp; Authorize</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. BATCH UPLOAD MODAL */
export function BatchUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onUploadSuccess();
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Batch Worker Roster Upload</h3>
              <p className="text-[11px] text-slate-500">CSV or XLSX formatted municipal worker roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-800">Click to upload roster CSV</div>
            <div className="text-[11px] text-slate-400 mt-1">Columns: Name, Trade, Aadhaar, Zone, Cooperative</div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition shadow-xs"
            >
              {isUploading ? 'Validating Roster...' : 'Upload & Validate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 4. DISPUTE QUEUE TRIBUNAL MODAL */
export function DisputeTribunalModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Dispute Tribunal Queue</h3>
              <p className="text-[11px] text-slate-500">Arbitration tribunal hearing scheduled for 3:30 PM IST</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">#DSP-771: Rate Dispute • Madurai Hub</div>
              <div className="text-[11px] text-slate-500">Customer OTP sign-off discrepancy on job #BK-4921</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">HEARING TODAY</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">#DSP-769: Safety Violation Appeal • Chennai</div>
              <div className="text-[11px] text-slate-500">Escrow hold on job payout ₹1,850</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">REVIEW IN PROGRESS</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">#DSP-765: Attendance Quorum • Erode Weavers</div>
              <div className="text-[11px] text-slate-500">AGM quorum documentation audit pending</div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800">FROZEN</span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
