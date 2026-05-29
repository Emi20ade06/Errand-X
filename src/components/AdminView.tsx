import React, { useState, useMemo } from 'react';
import { VerificationRequest, Booking, User } from '../types';
import { Users, Shield, RefreshCw, BarChart3, Radio, ArrowUpRight, Search, CheckCircle2, XCircle } from 'lucide-react';

interface AdminViewProps {
  verifications: VerificationRequest[];
  bookings: Booking[];
  users: User[];
  onApproveVerification: (verSeq: string) => void;
  onRejectVerification: (verSeq: string) => void;
  onResolveDispute: (bookingId: string, resolution: 'refund' | 'release') => void;
  onSuspendUser: (userId: string) => void;
  onActivateUser: (userId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  verifications,
  bookings,
  users,
  onApproveVerification,
  onRejectVerification,
  onResolveDispute,
  onSuspendUser,
  onActivateUser,
}) => {
  const [adminTab, setAdminTab] = useState<'verif' | 'disputes' | 'users' | 'stats'>('verif');
  const [userSearch, setUserSearch] = useState<string>('');

  // Count metrics
  const pendingCount = verifications.filter((v) => v.status === 'Pending').length;
  const activeDisputes = bookings.filter((b) => b.status === 'Disputed');
  const totalRevenueMock = 681400;

  // Filter users based on query
  const filteredUsers = useMemo(() => {
    if (userSearch.trim() === '') return users;
    const q = userSearch.toLowerCase();
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.matricNumber && u.matricNumber.toLowerCase().includes(q))
    );
  }, [users, userSearch]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900">Admin Console</h1>
          <p className="text-sm text-slate-500 mt-1">Bowen University &amp; Joint Nigerian Campus Operator Control Room</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1 text-xs font-black text-red-700 animate-pulse border border-red-250">
          <Radio className="h-3 w-3" />
          Live Moderator Mode
        </span>
      </div>

      {/* Admin Quick Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Network Users</div>
          <div className="font-display text-2xl font-black text-brand">{users.length * 125}</div>
          <span className="text-[10px] font-bold text-emerald-600 mt-1 block">↑ +43 this week</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Partner Verifications</div>
          <div className="font-display text-2xl font-black text-orange-600">{pendingCount}</div>
          <span className="text-[10px] font-bold text-slate-400 mt-1 block">Awaiting credential check</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Unresolved Disputes</div>
          <div className="font-display text-2xl font-black text-red-650">{activeDisputes.length}</div>
          <span className="text-[10px] font-bold text-red-500 mt-1 block">Requires escrow mediation</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-3xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Platform Revenue (12.5%)</div>
          <div className="font-display text-2xl font-black text-slate-900">₦{totalRevenueMock.toLocaleString()}</div>
          <span className="text-[10px] font-bold text-emerald-600 mt-1 block">↑ Bowen campus pilot net</span>
        </div>
      </div>

      {/* Admin Nav Selectors */}
      <div className="border-b border-slate-200 flex gap-6">
        <button
          onClick={() => setAdminTab('verif')}
          className={`cursor-pointer pb-4 text-sm font-bold transition-all ${
            adminTab === 'verif' ? 'text-brand border-b-3 border-brand font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🛡️ Credential Audits ({pendingCount})
        </button>

        <button
          onClick={() => setAdminTab('disputes')}
          className={`cursor-pointer pb-4 text-sm font-bold transition-all ${
            adminTab === 'disputes' ? 'text-brand border-b-3 border-brand font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          ⚖️ Escrow Arbitration ({activeDisputes.length})
        </button>

        <button
          onClick={() => setAdminTab('users')}
          className={`cursor-pointer pb-4 text-sm font-bold transition-all ${
            adminTab === 'users' ? 'text-brand border-b-3 border-brand font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          👥 User Directory Management
        </button>

        <button
          onClick={() => setAdminTab('stats')}
          className={`cursor-pointer pb-4 text-sm font-bold transition-all ${
            adminTab === 'stats' ? 'text-brand border-b-3 border-brand font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📈 Pilot KPI Analytics
        </button>
      </div>

      {/* VERIFICATIONS VIEW TAB */}
      {adminTab === 'verif' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">Partner Applications</h3>
              <p className="text-xs text-slate-400 mt-0.5">Approve verified badges after validating student ID credentials and university matric catalogs.</p>
            </div>
            <span className="bg-orange-50 text-orange-850 text-xs font-bold border border-orange-200 px-3 py-1 rounded-full">
              {pendingCount} Awaiting Review
            </span>
          </div>

          {verifications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-3 px-6">Applicant Name</th>
                    <th className="py-3 px-6">Service Area</th>
                    <th className="py-3 px-6">Identity Form</th>
                    <th className="py-3 px-6">Matric Number</th>
                    <th className="py-3 px-6 text-right">Moderator Decisions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-sm">
                  {verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">{v.userName}</td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-brand text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {v.cat}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium text-xs font-mono">{v.idSubmitted}</td>
                      <td className="py-4 px-6 font-bold text-slate-650 font-mono text-xs">{v.matricNo}</td>
                      <td className="py-4 px-6 text-right">
                        {v.status === 'Pending' ? (
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => {
                                if (confirm(`Approve verification badge for ${v.userName}?`)) {
                                  onApproveVerification(v.id);
                                }
                              }}
                              className="cursor-pointer bg-emerald-600 text-white font-bold hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg text-xs transition"
                            >
                              Approve Badge
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Reject verification for ${v.userName}?`)) {
                                  onRejectVerification(v.id);
                                }
                              }}
                              className="cursor-pointer bg-red-650 hover:bg-red-750 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            v.status === 'Approved' ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'
                          }`}>
                            {v.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              No pending partner credential applications submitted.
            </div>
          )}
        </div>
      )}

      {/* DISPUTES TABLE TAB */}
      {adminTab === 'disputes' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="font-display font-black text-lg text-slate-900">Escrow Arbitration Desk</h3>
            <p className="text-xs text-slate-400 mt-0.5">Mediate client complaints. Review statements and execute held transaction resolutions.</p>
          </div>

          {activeDisputes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-3 px-6">Ref ID</th>
                    <th className="py-3 px-6">Claimant Customer</th>
                    <th className="py-3 px-6">Service Partner</th>
                    <th className="py-3 px-6">Incident Reason</th>
                    <th className="py-3 px-6">Held Funds</th>
                    <th className="py-3 px-6 text-right">Escrow Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-sm">
                  {activeDisputes.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-brand">#{d.id}</td>
                      <td className="py-4 px-6 text-slate-800 font-medium">{d.clientName}</td>
                      <td className="py-4 px-6 text-slate-800 font-medium">{d.providerName}</td>
                      <td className="py-4 px-6">
                        <div className="text-xs font-bold text-red-600">{d.disputeReason}</div>
                        <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] truncate" title={d.disputeDescription}>
                          {d.disputeDescription}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-black text-slate-900">₦{d.agreedPrice.toLocaleString()}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => {
                              if (confirm(`Approve arbitration on #${d.id}? Held ₦${d.agreedPrice} will be fully refunded to client ${d.clientName}.`)) {
                                onResolveDispute(d.id, 'refund');
                              }
                            }}
                            className="cursor-pointer bg-red-600 text-white font-bold hover:bg-red-700 px-3.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Refund Client
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Authorize release for #${d.id}? Held ₦${d.agreedPrice} will be disbursed directly to provider ${d.providerName}.`)) {
                                onResolveDispute(d.id, 'release');
                              }
                            }}
                            className="cursor-pointer bg-emerald-600 text-white font-bold hover:bg-emerald-700 px-3.5 py-1.5 rounded-lg text-xs transition"
                          >
                            Release to Provider
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm">
              All client dispute arbitration tickets have been finalized and solved.
            </div>
          )}
        </div>
      )}

      {/* USERS DIRECTORY VIEW */}
      {adminTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div>
              <h3 className="font-display font-black text-lg text-slate-900">User Network Directory</h3>
              <p className="text-xs text-slate-400 mt-0.5">Search or freeze active client/provider profiles immediately to preserve safety standards.</p>
            </div>

            <div className="relative flex items-center bg-slate-50 px-3.5 py-2.5 rounded-lg border border-slate-200 max-w-sm">
              <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, matric..."
                className="w-full bg-transparent text-xs border-none outline-hidden text-slate-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10.5px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Profile Role</th>
                  <th className="py-3 px-6">Student Checked</th>
                  <th className="py-3 px-6">Escrow Balance</th>
                  <th className="py-3 px-6">System Status</th>
                  <th className="py-3 px-6 text-right">Action Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 font-bold text-slate-900">
                      {u.firstName} {u.lastName}
                      <div className="text-[10px] text-slate-450 font-normal leading-tight">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-105 text-brand text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      {u.verified ? (
                        <span className="text-emerald-600">✓ Yes</span>
                      ) : (
                        <span className="text-amber-500">Awaiting ID</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">₦{u.walletBalance.toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-850 border border-red-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {u.status === 'Active' ? (
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to SUSPEND user ${u.firstName}? This will freeze their logins.`)) {
                              onSuspendUser(u.id);
                            }
                          }}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          Suspend User
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (confirm(`RESTORE logins for user ${u.firstName}?`)) {
                              onActivateUser(u.id);
                            }
                          }}
                          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition"
                        >
                          Activate User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KPI ANALYTICS VIEW */}
      {adminTab === 'stats' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* Revenue distribution bar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 mb-6">Revenue Split by Category</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Peer-to-Peer Tutors</span>
                  <span>31%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-brand h-full" style={{ width: '31%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Hardware/Device Repairs</span>
                  <span>22%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full" style={{ width: '22%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Hair &amp; Barbering Sessions</span>
                  <span>19%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-orange-500 h-full" style={{ width: '19%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Laundry &amp; hostel errands</span>
                  <span>14%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-sky-500 h-full" style={{ width: '14%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>Food prep delivery runs</span>
                  <span>14%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: '14%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* User performance growth */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-slate-900 mb-6">User Adoption Metrics (Pilot Campus)</h3>
            
            <div className="h-44 flex items-end gap-3.5 border-b border-slate-200 pb-3">
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">120</div>
                <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: '10px' }}></div>
                <div className="text-[9px] text-slate-500 font-medium">Dec</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">280</div>
                <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: '24px' }}></div>
                <div className="text-[9px] text-slate-500 font-medium">Jan</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">680</div>
                <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: '48px' }}></div>
                <div className="text-[9px] text-slate-500 font-medium">Feb</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">1.3k</div>
                <div className="w-full bg-orange-400 rounded-t-sm" style={{ height: '72px' }}></div>
                <div className="text-[9px] text-slate-500 font-medium">Mar</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">1.8k</div>
                <div className="w-full bg-orange-400 rounded-t-sm animate-pulse" style={{ height: '90px' }}></div>
                <div className="text-[9px] text-slate-505 font-bold">Apr</div>
              </div>
              <div className="flex-1 flex flex-col items-center gap-1 bg-slate-50 rounded-t-lg pt-2">
                <div className="text-[9px] text-slate-400 font-bold">2.8k</div>
                <div className="w-full bg-brand rounded-t-sm animate-pulse" style={{ height: '120px' }}></div>
                <div className="text-[9px] text-slate-700 font-bold">May</div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center text-xs text-slate-500">
              <span className="font-semibold">Current Pilot Growth Rate: +52% MoM</span>
              <span>Bowen University campus focus</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
