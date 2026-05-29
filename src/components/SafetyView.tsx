import React, { useState } from 'react';
import { User, Booking } from '../types';
import { ShieldCheck, ShieldAlert, HeartHandshake, Eye, AlertCircle, FileSpreadsheet, MapIcon, Check, Users } from 'lucide-react';
import { sanitizeString, sanitizeName } from '../sanitizer';

interface SafetyViewProps {
  currentUser: User | null;
  activeBookings: Booking[];
  onTriggerSOS: () => void;
  onSubmitDispute: (bookingId: string, reason: string, desc: string) => void;
  onReportUser: (targetUsername: string, reportType: string, desc: string) => void;
}

export const SafetyView: React.FC<SafetyViewProps> = ({
  currentUser,
  activeBookings,
  onTriggerSOS,
  onSubmitDispute,
  onReportUser,
}) => {
  const [disputeBookingId, setDisputeBookingId] = useState<string>('');
  const [disputeReason, setDisputeReason] = useState<string>('');
  const [disputeDesc, setDisputeDesc] = useState<string>('');

  const [reportTarget, setReportTarget] = useState<string>('');
  const [reportType, setReportType] = useState<string>('Select Type');
  const [reportDesc, setReportDesc] = useState<string>('');

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeBookingId || disputeBookingId === 'Select Booking') {
      alert('Please choose a valid active booking to dispute');
      return;
    }
    if (!disputeReason || disputeReason === 'Select Reason') {
      alert('Please specify a dispute reason');
      return;
    }

    const cleanDisputeDesc = sanitizeString(disputeDesc, 800);
    if (cleanDisputeDesc.length < 15) {
      alert('Please describe your dispute in at least 15 characters to assist our arbitration team');
      return;
    }

    onSubmitDispute(disputeBookingId, disputeReason, cleanDisputeDesc);
    setDisputeBookingId('');
    setDisputeReason('');
    setDisputeDesc('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTarget = sanitizeName(reportTarget, 50);
    if (!cleanTarget) {
      alert('Please provide a valid target user name (alphanumeric, max 50 characters).');
      return;
    }
    if (reportType === 'Select Type') {
      alert('Please pick a report category');
      return;
    }

    const cleanReportDesc = sanitizeString(reportDesc, 800);
    if (cleanReportDesc.length < 10) {
      alert('Please provide at least 10 characters of event evidence or details');
      return;
    }

    onReportUser(cleanTarget, reportType, cleanReportDesc);
    setReportTarget('');
    setReportType('Select Type');
    setReportDesc('');
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-10">
      
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Safety Centre</h1>
        <p className="text-sm text-slate-500 mt-1">
          Your campus safety is our absolute, non-negotiable priority. Real-time protection tools.
        </p>
      </div>

      {/* Safety Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SOS Panic Panic Card */}
        <div className="bg-white border-2 border-red-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between items-center text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="bg-red-50 text-red-600 h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">🆘</span>
            <h3 className="font-display font-extrabold text-lg text-red-600">SOS Panic Button</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-[240px]">
              If you feel visually unsafe, threatened, or in physical danger on-campus, press this immediately.
            </p>
          </div>

          <div className="my-6 relative">
            <span className="absolute inset-0 rounded-full bg-red-500/20 blur-md animate-ping"></span>
            <button
              onClick={onTriggerSOS}
              className="cursor-pointer relative h-28 w-28 rounded-full bg-red-600 text-white font-display font-black text-2xl shadow-xl hover:bg-red-700 active:scale-95 transition flex items-center justify-center border-4 border-white"
            >
              SOS
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-semibold leading-tight px-4 bg-slate-50 py-1.5 rounded-lg">
            ⚠️ Triggers SMS to campus security + emergency contact.
          </p>
        </div>

        {/* Live Location Widget */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-150">
                PULSING LOCATION
              </span>
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2">Live Location Sharing</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              During any active task, ErrandX shares your live GPS telemetry with your emergency contacts. This sharing shuts off automatically when the task completes.
            </p>
            
            {activeBookings.length > 0 ? (
              <div className="bg-emerald-50/80 border border-emerald-250 p-4 rounded-xl flex items-center gap-3">
                <MapIcon className="h-5 w-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-emerald-900">Current Share Active</div>
                  <div className="text-[10.5px] text-emerald-700">Tracking #EX-20264</div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-205 p-4 rounded-xl flex items-center gap-3">
                <Eye className="h-5 w-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-700">Offline Standby</div>
                  <div className="text-[10.5px] text-slate-500">Awaiting your next active session</div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => alert('Emergency tracking parameters are synced via campus SMS services.')}
            className="cursor-pointer btn-accessible-outline py-2.5 rounded-xl text-xs w-full text-center mt-4"
          >
            Manage Safety Contacts
          </button>
        </div>

        {/* Escrow Resolution Info Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3">
              <ShieldCheck className="h-5 w-5 text-brand" />
              <span className="bg-blue-50 text-brand text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-150">
                DAY-1 PROTECTION
              </span>
            </div>
            <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2">Arbitration Shield</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              If a provider fails to show up, cooks bad/expired food, or does sloppy, incompetent work, DO NOT MARK THE JOB COMPLETED. Your money is protected in escrow. Raising a dispute freezes the funds to prevent payouts.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-[10.5px] text-slate-600 leading-tight">
              Disputes must be registered strictly within 2 hours of scheduled delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Double forms row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Raise Dispute Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-brand" />
            <span>Raise an Escrow Dispute</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">Lock transactions and claim full refunds back into your balance.</p>

          <form onSubmit={handleDisputeSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Select Active Booking</label>
              <select
                value={disputeBookingId}
                onChange={(e) => setDisputeBookingId(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-200 px-3 py-2.5 text-sm outline-hidden text-slate-900 font-medium"
              >
                <option>Select Booking</option>
                {activeBookings.length > 0 ? (
                  activeBookings.map((b) => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.providerName} ({b.service}) - ₦{b.agreedPrice.toLocaleString()}
                    </option>
                  ))
                ) : (
                  <option disabled>No active bookings found to dispute</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Arbitration Reason</label>
              <select
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-200 px-3 py-2.5 text-sm outline-hidden text-slate-900"
              >
                <option>Select Reason</option>
                <option value="Service was never delivered">Service was never delivered</option>
                <option value="Extremely poor service outcome">Extremely poor service outcome</option>
                <option value="Provider behaved unprofessionally">Provider behaved unprofessionally</option>
                <option value="Disagree with additional pricing demands">Disagree with additional pricing demands</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Describe what happened</label>
              <textarea
                value={disputeDesc}
                onChange={(e) => setDisputeDesc(e.target.value)}
                placeholder="Explain the incident with dates, details, and agreed requirements..."
                rows={3}
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg py-3 text-sm w-full text-center transition shadow-md border-2 border-red-600"
            >
              Submit Safety Arbitration Ticket
            </button>
          </form>
        </div>

        {/* Report a User Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-brand" />
            <span>Report Suspicious User Behavior</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">Report violations of campus conduct directly to student moderators.</p>

          <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">User Handle / ID / Name</label>
                <input
                  type="text"
                  value={reportTarget}
                  onChange={(e) => setReportTarget(e.target.value)}
                  placeholder="e.g. @john_tutors"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Violation Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-300 px-3 py-2.5 text-sm outline-hidden text-slate-900"
                >
                  <option>Select Type</option>
                  <option value="Scams / Fake Services">Scams / Fake Services</option>
                  <option value="Threat in physical session">Threat in physical session</option>
                  <option value="Verbal abuse / Harassment">Verbal abuse / Harassment</option>
                  <option value="Stolen properties / theft">Stolen properties / theft</option>
                  <option value="Fake ID Profile photo match">Fake ID Profile photo match</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-705 uppercase mb-1.5">Incident Details / Evidence Link</label>
              <textarea
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                placeholder="Please describe exactly what happened..."
                rows={3}
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-lg py-3 text-sm w-full text-center transition shadow-md border-2 border-slate-900"
            >
              Report User to Admin Moderation
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
