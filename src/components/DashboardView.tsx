import React, { useState } from 'react';
import { Booking, User, ServiceProvider } from '../types';
import { Check, ShieldAlert, CheckCircle2, UserCheck, Calendar, MapPin, DollarSign, ListCollapse, PlayCircle, Star, ArrowUpRight } from 'lucide-react';

interface DashboardViewProps {
  bookings: Booking[];
  currentUser: User | null;
  onOpenBookingModal: () => void;
  onOpenDispute: (bookingId: string) => void;
  onReleaseEscrow: (bookingId: string) => void;
  onAcceptIncoming: (bookingId: string) => void;
  onDeclineIncoming: (bookingId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  currentUser,
  onOpenBookingModal,
  onOpenDispute,
  onReleaseEscrow,
  onAcceptIncoming,
  onDeclineIncoming,
}) => {
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 mb-6">You need to sign in to your ErrandX account to view your private booking dashboards and earnings summaries.</p>
        <p className="text-xs text-brand font-medium">Please click the "Sign In" button in the upper right navigation panel.</p>
      </div>
    );
  }

  // Filter Bookings for Current User as Client
  const clientBookings = bookings.filter((b) => b.clientEmail === currentUser.email);
  const activeClientBookings = clientBookings.filter((b) => ['Pending', 'Confirmed', 'In Progress'].includes(b.status));
  const completedClientBookings = clientBookings.filter((b) => ['Completed', 'Disputed', 'Cancelled'].includes(b.status));

  // Filter Bookings for Current User as Provider
  // For simplicity, we assume Emmanuel (user-emmanuel) is linked to 'prov-1' (Adaeze) or has mock incoming records
  const providerBookings = bookings.filter((b) => b.providerName === 'Adaeze Nwachukwu' || b.providerName === 'Ngozi Eze');
  const activeProviderBookings = providerBookings.filter((b) => ['Confirmed', 'In Progress'].includes(b.status));
  const incomingRequests = bookings.filter((b) => b.status === 'Pending' && b.providerName === 'Adaeze Nwachukwu');

  // Stats Counters
  const clientCompletedCount = clientBookings.filter((b) => b.status === 'Completed').length;
  const clientTotalSpent = clientBookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + b.agreedPrice, 0);
  const clientInEscrow = activeClientBookings.reduce((sum, b) => sum + b.agreedPrice, 0);

  // Provider Stats
  const providerEarned = providerBookings
    .filter((b) => b.status === 'Completed')
    .reduce((sum, b) => sum + (b.agreedPrice - b.commission), 0);
  const providerPending = activeProviderBookings.reduce((sum, b) => sum + (b.agreedPrice - b.commission), 0);
  const providerJobsCount = providerBookings.filter((b) => b.status === 'Completed').length;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">My Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Welcome back, {currentUser.firstName} {currentUser.lastName} &bull; Uni Campus Account
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {currentUser.verified ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-850">
              <Check className="h-3.5 w-3.5 stroke-2" />
              ✓ ID Student Verified
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-xs font-bold text-yellow-850 animate-pulse">
              ⚠️ ID Pending Approval
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-light/10 px-3 py-1.5 text-xs font-bold text-brand">
            ⭐ 4.9 Rep Score
          </span>
        </div>
      </div>

      {/* Selector Tabs */}
      <div className="border-b border-slate-200 mb-8 flex gap-6">
        <button
          onClick={() => setActiveTab('client')}
          className={`cursor-pointer pb-4 text-base font-bold transition-all relative ${
            activeTab === 'client'
              ? 'text-brand border-b-3 border-brand font-black'
              : 'text-slate-505 hover:text-slate-800'
          }`}
        >
          👤 Client View (I need services)
        </button>
        
        <button
          onClick={() => setActiveTab('provider')}
          className={`cursor-pointer pb-4 text-base font-bold transition-all relative ${
            activeTab === 'provider'
              ? 'text-brand border-b-3 border-brand font-black'
              : 'text-slate-550 hover:text-slate-850'
          }`}
        >
          💼 Provider View (I earn money)
        </button>
      </div>

      {/* CLIENT DASHBOARD CONTENT */}
      {activeTab === 'client' && (
        <div className="flex flex-col gap-8">
          {/* Client Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Active Bookings</div>
              <div className="font-display text-2xl font-black text-brand">{activeClientBookings.length}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Completed Jobs</div>
              <div className="font-display text-2xl font-black text-emerald-600">{clientCompletedCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Spent</div>
              <div className="font-display text-2xl font-black text-slate-800">₦{clientTotalSpent.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Locked in Escrow</div>
              <div className="font-display text-2xl font-black text-orange-600">₦{clientInEscrow.toLocaleString()}</div>
            </div>
          </div>

          {/* Active Bookings card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">Current Escrow Bookings</h3>
                <p className="text-xs text-slate-500 mt-0.5">Funds are held safely. Only release when work is completed successfully</p>
              </div>
              <button
                onClick={onOpenBookingModal}
                className="cursor-pointer btn-accessible-accent rounded-lg px-4.5 py-2 text-xs font-bold"
              >
                + New Booking
              </button>
            </div>

            {activeClientBookings.length > 0 ? (
              <>
                {/* Desktop view */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-3.5 px-6">Provider</th>
                        <th className="py-3.5 px-6">Service Task</th>
                        <th className="py-3.5 px-6">Location</th>
                        <th className="py-3.5 px-6-center">Price</th>
                        <th className="py-3.5 px-6">SLA Status</th>
                        <th className="py-3.5 px-6 text-right">Escrow Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {activeClientBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-semibold text-slate-850">
                            {b.providerName}
                          </td>
                          <td className="py-4 px-6 font-medium text-slate-800">
                            {b.service}
                          </td>
                          <td className="py-4 px-6 text-slate-500 flex items-center gap-1 mt-1 border-0">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{b.location}</span>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ₦{b.agreedPrice.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 border border-amber-200">
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex gap-2 justify-end">
                              <button
                                onClick={() => {
                                  if (confirm('Are you and the provider done? This releases escrow funds directly to their wallet.')) {
                                    onReleaseEscrow(b.id);
                                  }
                                }}
                                className="cursor-pointer bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded-lg px-3.5 py-1.5 text-xs inline-flex items-center gap-1 transition"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Release Funds</span>
                              </button>
                              <button
                                onClick={() => onOpenDispute(b.id)}
                                className="cursor-pointer bg-red-600 text-white font-bold hover:bg-red-700 rounded-lg px-3.5 py-1.5 text-xs inline-flex items-center gap-1 transition"
                              >
                                <ShieldAlert className="h-3.5 w-3.5" />
                                <span>Dispute</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile view */}
                <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                  {activeClientBookings.map((b) => (
                    <div key={b.id} className="pt-3 first:pt-0 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <div className="text-xs font-black text-slate-900 leading-tight">{b.providerName}</div>
                          <p className="text-xs text-slate-600 font-medium mt-1 leading-snug">{b.service}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-black text-slate-900">₦{b.agreedPrice.toLocaleString()}</div>
                          <span className="inline-block mt-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-800 border border-amber-200">
                            {b.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 gap-1.5">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[150px] font-medium">{b.location}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {b.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => {
                            if (confirm('Are you and the provider done? This releases escrow funds directly to their wallet.')) {
                              onReleaseEscrow(b.id);
                            }
                          }}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg py-1.5 text-xs flex items-center justify-center gap-1 transition shadow-xs"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Release Escrow</span>
                        </button>
                        <button
                          onClick={() => onOpenDispute(b.id)}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-lg py-1.5 text-xs flex items-center justify-center gap-1 transition shadow-xs"
                        >
                          <ShieldAlert className="h-3 w-3" />
                          <span>Dispute</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl">📭</div>
                <p className="text-sm font-semibold text-slate-800 mt-2">No Active Bookings</p>
                <p className="text-xs text-slate-500 mt-1">Book services safely by searching providers in the Browse tab.</p>
              </div>
            )}
          </div>

          {/* Booking History card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-display font-extrabold text-lg text-slate-900">Completed Sessions History</h3>
              <p className="text-xs text-slate-500 mt-0.5">Summary of historically resolved service agreements and ratings</p>
            </div>

            {completedClientBookings.length > 0 ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-3 px-6">Provider</th>
                        <th className="py-3 px-6">Service Task</th>
                        <th className="py-3 px-6">Released Date</th>
                        <th className="py-3 px-6">Paid Amount</th>
                        <th className="py-3 px-6">Rating Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {completedClientBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-semibold text-slate-800">
                            {b.providerName}
                          </td>
                          <td className="py-4 px-6 text-slate-705">{b.service}</td>
                          <td className="py-4 px-6 text-slate-500 text-xs">{b.createdDate}</td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ₦{b.agreedPrice.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {b.status === 'Completed' ? (
                              <div className="flex items-center gap-1 text-amber-500 font-bold">
                                <Star className="h-3.5 w-3.5 fill-amber-500" />
                                <span>{b.rating ? `${b.rating}.0 ★` : 'No rating'}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-bold text-red-800">
                                Disputed / Closed
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                  {completedClientBookings.map((b) => (
                    <div key={b.id} className="pt-3 first:pt-0 flex flex-col gap-1.5">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <div className="text-xs font-bold text-slate-800 leading-tight">{b.providerName}</div>
                          <p className="text-xs text-slate-550 mt-1">{b.service}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-xs font-bold text-slate-900">₦{b.agreedPrice.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{b.createdDate}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-[10px] text-slate-400 font-mono">Ref: {b.id}</span>
                        {b.status === 'Completed' ? (
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="h-3 w-3 fill-amber-500" />
                            <span>{b.rating ? `${b.rating}.0 ★` : 'No rating'}</span>
                          </div>
                        ) : (
                          <span className="rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-bold text-red-800">
                            Disputed / Closed
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No past finalized sessions on record.
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROVIDER DASHBOARD CONTENT */}
      {activeTab === 'provider' && (
        <div className="flex flex-col gap-8">
          {/* Provider Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Net Earned</div>
              <div className="font-display text-2xl font-black text-emerald-600">₦{providerEarned.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Payouts</div>
              <div className="font-display text-2xl font-black text-orange-600">₦{providerPending.toLocaleString()}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jobs Done</div>
              <div className="font-display text-2xl font-black text-brand">{providerJobsCount}</div>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rating Score</div>
              <div className="font-display text-2xl font-black text-amber-500">4.9 ★</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Net Earnings Last 7 Days chart mockup */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5 lg:col-span-2">
              <h3 className="font-display font-extrabold text-base text-slate-900 mb-6">Earnings Timeline (Last 7 Days)</h3>
              
              <div className="h-36 flex items-end gap-3.5 border-b border-slate-200 pb-3">
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2 hover:bg-slate-100 transition">
                  <div className="text-[10px] text-slate-400 font-bold">₦4.5k</div>
                  <div className="w-full bg-brand rounded-t-sm" style={{ height: '40px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Mon</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2 hover:bg-slate-100 transition">
                  <div className="text-[10px] text-slate-400 font-bold">₦6.0k</div>
                  <div className="w-full bg-brand rounded-t-sm" style={{ height: '60px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Tue</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2 hover:bg-slate-100 transition">
                  <div className="text-[10px] text-slate-400 font-bold">₦2.0k</div>
                  <div className="w-full bg-brand rounded-t-sm" style={{ height: '25px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Wed</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2 hover:bg-slate-100 transition">
                  <div className="text-[10px] text-slate-400 font-bold">₦8.5k</div>
                  <div className="w-full bg-brand rounded-t-sm" style={{ height: '85px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Thu</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2 hover:bg-slate-100 transition">
                  <div className="text-[10px] text-slate-400 font-bold">₦5.0k</div>
                  <div className="w-full bg-brand rounded-t-sm animate-pulse" style={{ height: '50px' }}></div>
                  <div className="text-[9px] text-slate-500 font-semibold mt-1 text-brand">Today</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                  <div className="text-[10px] text-slate-400 font-bold">₦0.0k</div>
                  <div className="w-full bg-slate-200 rounded-t-sm" style={{ height: '5px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Sat</div>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                  <div className="text-[10px] text-slate-400 font-bold">₦0.0k</div>
                  <div className="w-full bg-slate-200 rounded-t-sm" style={{ height: '5px' }}></div>
                  <div className="text-[9px] text-slate-500 font-medium mt-1">Sun</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
                <span>Commission fee (12.5% auto-deducted)</span>
                <span className="font-bold text-slate-600">Next payout cycle: Sunday night 12:00 BST</span>
              </div>
            </div>

            {/* Profile strength & milestones checklist */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-5">
              <h3 className="font-display font-extrabold text-base text-slate-900 mb-4">Reputation Milestones</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">University ID Verified</h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">Approved matric BU22LAW1001</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">✓</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Profile Photo Setup</h4>
                    <p className="text-[10.5px] text-slate-500 mt-0.5">Active selfie compliance matches passport ID</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-extrabold shrink-0">3</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Complete Portfolio Uploads</h4>
                    <p className="text-[10.5px] text-slate-550 mt-0.5">Add 3 sample pictures of your past work</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold shrink-0">&bull;</div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 leading-tight">Background Policed vetting check</h4>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">Earn premium "Vetted Partner" blue badge</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incoming Proposals or Requests */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900">Incoming Peer Proposals</h3>
                <p className="text-xs text-slate-500 mt-0.5">Review, accept or decline on-demand campus service queries instantly</p>
              </div>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
                {incomingRequests.length} pending query
              </span>
            </div>

            {incomingRequests.length > 0 ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/70 border-b border-slate-100 text-[10.5px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="py-3 px-6">Client</th>
                        <th className="py-3 px-6">Service Requested</th>
                        <th className="py-3 px-6">Execution Date</th>
                        <th className="py-3 px-6">Estimated Income (Net)</th>
                        <th className="py-3 px-6 text-right">Instant Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {incomingRequests.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-4 px-6 font-semibold text-slate-900">{b.clientName}</td>
                          <td className="py-4 px-6 font-medium text-slate-800">{b.service}</td>
                          <td className="py-4 px-6 text-slate-500 text-xs">{b.dateTime.replace('T', ' ')}</td>
                          <td className="py-4 px-6 font-extrabold text-emerald-600">
                            ₦{(b.agreedPrice - b.commission).toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex gap-2">
                              <button
                                onClick={() => onAcceptIncoming(b.id)}
                                className="cursor-pointer bg-emerald-600 text-white font-bold hover:bg-emerald-700 rounded-lg px-3.5 py-1.5 text-xs transition"
                              >
                                Accept Task
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm('Decline this proposal request?')) {
                                    onDeclineIncoming(b.id);
                                  }
                                }}
                                className="cursor-pointer bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 rounded-lg px-3.5 py-1.5 text-xs transition"
                              >
                                Decline
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="block md:hidden divide-y divide-slate-100 p-3 space-y-3">
                  {incomingRequests.map((b) => (
                    <div key={b.id} className="pt-3 first:pt-0 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-1">
                        <div>
                          <div className="text-xs font-bold text-slate-850">Client: {b.clientName}</div>
                          <p className="text-xs text-slate-600 mt-0.5 font-medium leading-snug">{b.service}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-400 font-medium">Net Est.</div>
                          <div className="text-sm font-black text-emerald-600">₦{(b.agreedPrice - b.commission).toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10.5px] text-slate-400 mt-1">
                        <span>Due: {b.dateTime.replace('T', ' ')}</span>
                        <span>Proposal: {b.id}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <button
                          onClick={() => onAcceptIncoming(b.id)}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg py-1.5 text-xs flex items-center justify-center gap-1 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Decline this proposal request?')) {
                              onDeclineIncoming(b.id);
                            }
                          }}
                          className="cursor-pointer bg-slate-105 text-slate-700 font-bold hover:bg-slate-200 rounded-lg py-1.5 text-xs flex items-center justify-center gap-1 transition"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                No active pending incoming job notifications right now.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
