import React, { useState } from 'react';
import { Transaction, User } from '../types';
import { Wallet, Landmark, ArrowDownLeft, ArrowUpRight, HelpCircle, Check, CreditCard, RefreshCw } from 'lucide-react';
import { sanitizeNumber, sanitizeNuban } from '../sanitizer';

interface WalletViewProps {
  transactions: Transaction[];
  currentUser: User | null;
  onTopUp: (amount: number) => void;
  onWithdraw: (amount: number, bank: string, accNo: string) => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  transactions,
  currentUser,
  onTopUp,
  onWithdraw,
}) => {
  const [topUpAmount, setTopUpAmount] = useState<string>('5000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('10000');
  const [selectedBank, setSelectedBank] = useState<string>('GTBank');
  const [accountNo, setAccountNo] = useState<string>('0123456789');

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 mb-6">You need to sign in to your ErrandX account to check your financial escrow balances, make secure deposits, and view payout trails.</p>
      </div>
    );
  }

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { parsed: val, isValid } = sanitizeNumber(topUpAmount, 100, 500000);
    if (!isValid || val <= 100) {
      alert('Invalid Deposit Amount. Please specify a clean numeric value between ₦100 and ₦500,000.');
      return;
    }
    // Update input display with formatted number
    setTopUpAmount(val.toString());
    onTopUp(val);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { parsed: val, isValid } = sanitizeNumber(withdrawAmount, 500, 500000);
    if (!isValid || val <= 500) {
      alert('Minimum payout withdrawal is ₦500. Limit per cashout check is ₦500,000.');
      return;
    }
    if (val > currentUser.walletBalance) {
      alert('Insufficient available wallet balance for requested payout.');
      return;
    }

    const { sanitized: cleanNuban, isValid: nubanValid } = sanitizeNuban(accountNo);
    if (!nubanValid) {
      alert('Malformed account number. Please provide a structurally valid, 10-digit Nigerian NUBAN account number.');
      return;
    }

    // Reflect clean data on state
    setAccountNo(cleanNuban);
    setWithdrawAmount(val.toString());
    onWithdraw(val, selectedBank, cleanNuban);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
      
      {/* Page Title */}
      <div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900">Virtual Escrow Wallet</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete campus-specific multi-faceted ledger. Powered by Paystack (Sandbox Mode).
        </p>
      </div>

      {/* Cards stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Visa Balance Card */}
        <div className="bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white p-6 rounded-3xl shadow-xl border border-brand-dark relative overflow-hidden flex flex-col justify-between min-h-56">
          <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-accent/15 -mr-10 -mt-10"></div>
          
          <div className="flex justify-between items-start relative z-10">
            <div>
              <span className="text-xs uppercase tracking-widest text-slate-200 font-bold">Standard Available Balance</span>
              <div className="font-display text-4xl font-extrabold mt-1">₦{currentUser.walletBalance.toLocaleString()}</div>
            </div>
            <Wallet className="h-9 w-9 text-amber-200" />
          </div>

          <div className="mt-8 relative z-10 flex justify-between items-center bg-white/10 p-3 rounded-xl border border-white/15">
            <span className="text-xs text-slate-100 font-medium">Auto-verification Match: GTBank</span>
            <span className="text-xs font-bold text-amber-20s text-yellow-300">✓ ID Linked</span>
          </div>
        </div>

        {/* Escrow Lock Protection Info */}
        <div className="bg-white p-6 rounded-3xl border-3 border-orange-500 shadow-xs flex flex-col justify-between min-h-56">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block">Locked in Escrow Lockpoint</span>
              <div className="font-display text-4xl font-extrabold text-orange-600 mt-1">₦{currentUser.escrowBalance.toLocaleString()}</div>
            </div>
            <span className="bg-orange-100 text-orange-850 border border-orange-200 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
              🔒 Shield Protection
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mt-4">
            These funds have been paid by the customer for active tasks. Escrow holds these securely. They will move to the provider's wallet only when client signs off completion, or to the client as refunds in a dispute case.
          </p>
        </div>
      </div>

      {/* Double forms container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Fill Deposit Form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand" />
            <span>Simulate Wallet Deposit</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">Add funds to buy services using Paystack Sandbox payment gateways.</p>

          <form onSubmit={handleTopUpSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Amount (₦)</label>
              <input
                type="number"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="₦ e.g., 5000"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900 font-bold"
                required
              />
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-4 gap-2">
              {['1000', '3500', '5000', '10000'].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt)}
                  className={`cursor-pointer border-2 rounded-lg py-2 text-xs font-bold transition ${
                    topUpAmount === amt
                      ? 'bg-brand/10 text-brand border-brand'
                      : 'bg-slate-50 text-slate-705 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₦{parseInt(amt).toLocaleString()}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="cursor-pointer btn-accessible-accent rounded-lg py-3 text-sm font-bold w-full text-center"
            >
              Deposit (Paystack Simulation)
            </button>
          </form>
        </div>

        {/* Withdraw cashouts form */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs">
          <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Landmark className="h-5 w-5 text-emerald-600" />
            <span>Withdraw Earnings Payout</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">Cash-out your available balance directly to any Nigerian retail bank.</p>

          <form onSubmit={handleWithdrawSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Bank Name</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-lg border-2 border-slate-200 px-3 py-3 text-sm outline-hidden text-slate-900 font-medium"
                >
                  <option value="GTBank">Guaranty Trust Bank (GTB)</option>
                  <option value="Access">Access Bank</option>
                  <option value="Zenith">Zenith Bank Plc</option>
                  <option value="Kuda">Kuda Microfinance</option>
                  <option value="UBA">United Bank for Africa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Account Number (NUBAN)</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="0123456789"
                  maxLength={10}
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Withdrawal Amount (₦)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Amount to withdraw"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-950 font-extrabold"
                required
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer btn-accessible-primary rounded-lg py-3 text-sm font-bold w-full text-center"
            >
              Confirm Withdrawal payout
            </button>
          </form>
        </div>
      </div>

      {/* Transactions History Ledger */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <h3 className="font-display font-extrabold text-lg text-slate-900">Wallet Logs & Escrow Statements</h3>
          <p className="text-xs text-slate-500 mt-0.5">Real-time audit record of deposits, releases, holds and payouts</p>
        </div>

        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-55/40 border-b border-slate-100/80 text-[10.5px] uppercase font-bold text-slate-505 tracking-wider">
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Description Reference</th>
                  <th className="py-3 px-6">Transaction Type</th>
                  <th className="py-3 px-6 text-center">Amount (₦)</th>
                  <th className="py-3 px-6 text-right">Escrow Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">{tx.date}</td>
                    <td className="py-4 px-6 font-semibold text-slate-850">{tx.desc}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold border ${
                        tx.type === 'Top-Up'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
                          : tx.type === 'Escrow Hold'
                          ? 'bg-amber-50 text-amber-800 border-amber-250'
                          : 'bg-slate-50 text-slate-800 border-slate-250'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-extrabold text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {tx.amount > 0 ? `+₦${tx.amount.toLocaleString()}` : `-₦${Math.abs(tx.amount).toLocaleString()}`}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold ${
                        tx.status === 'done'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-amber-100 text-amber-900 animate-pulse'
                      }`}>
                        {tx.status === 'done' ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Complete</span>
                          </>
                        ) : (
                          <span>Held in Escrow</span>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            No transactions found on this account ledger.
          </div>
        )}
      </div>

    </div>
  );
};
