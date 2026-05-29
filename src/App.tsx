import { useState, useEffect } from 'react';
import { ActivePage, User, ServiceProvider, Booking, Transaction, VerificationRequest, UserRole } from './types';
import { CATEGORIES, INITIAL_PROVIDERS, INITIAL_TRANSACTIONS, INITIAL_BOOKINGS, INITIAL_VERIFICATIONS, INITIAL_USERS } from './mockData';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { BrowseView } from './components/BrowseView';
import { DashboardView } from './components/DashboardView';
import { WalletView } from './components/WalletView';
import { SafetyView } from './components/SafetyView';
import { AdminView } from './components/AdminView';
import { AuthModal } from './components/AuthModal';
import { BookingModal } from './components/BookingModal';
import { ProviderModal } from './components/ProviderModal';
import { RatingModal } from './components/RatingModal';
import { Shield, Sparkles } from 'lucide-react';

export default function App() {
  // Page routing
  const [activePage, setActivePage] = useState<ActivePage>('home');

  // Core transactional states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Filtering states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dialog visual states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isProviderOpen, setIsProviderOpen] = useState(false);
  const [isRatingOpen, setIsRatingOpen] = useState(false);

  // Dialog payloads
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingProviderName, setRatingProviderName] = useState<string | null>(null);

  // Custom Toast State
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Toast dispatch helper
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4050);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Initializing state from localStorage or mock seed data
  useEffect(() => {
    const cachedUsers = localStorage.getItem('ex_users');
    const cachedProviders = localStorage.getItem('ex_providers');
    const cachedBookings = localStorage.getItem('ex_bookings');
    const cachedTransactions = localStorage.getItem('ex_transactions');
    const cachedVerifications = localStorage.getItem('ex_verifications');
    const cachedCurrentUser = localStorage.getItem('ex_current_user');

    if (cachedUsers) {
      setUsers(JSON.parse(cachedUsers));
    } else {
      setUsers(INITIAL_USERS as User[]);
      localStorage.setItem('ex_users', JSON.stringify(INITIAL_USERS));
    }

    if (cachedProviders) {
      setProviders(JSON.parse(cachedProviders));
    } else {
      setProviders(INITIAL_PROVIDERS);
      localStorage.setItem('ex_providers', JSON.stringify(INITIAL_PROVIDERS));
    }

    if (cachedBookings) {
      setBookings(JSON.parse(cachedBookings));
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem('ex_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }

    if (cachedTransactions) {
      setTransactions(JSON.parse(cachedTransactions));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
      localStorage.setItem('ex_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
    }

    if (cachedVerifications) {
      setVerifications(JSON.parse(cachedVerifications));
    } else {
      setVerifications(INITIAL_VERIFICATIONS);
      localStorage.setItem('ex_verifications', JSON.stringify(INITIAL_VERIFICATIONS));
    }

    // Auto load Emmanuel Adebagbo with active credentials on starts for visual preview
    if (cachedCurrentUser) {
      setCurrentUser(JSON.parse(cachedCurrentUser));
    } else {
      const emmanuelObj = INITIAL_USERS.find((u) => u.email === 'theadebagbo@gmail.com') as User;
      if (emmanuelObj) {
        setCurrentUser(emmanuelObj);
        localStorage.setItem('ex_current_user', JSON.stringify(emmanuelObj));
      }
    }
  }, []);

  // Syncing modifications to localStorage helpers
  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('ex_users', JSON.stringify(updatedUsers));
  };

  const saveBookings = (updatedBookings: Booking[]) => {
    setBookings(updatedBookings);
    localStorage.setItem('ex_bookings', JSON.stringify(updatedBookings));
  };

  const saveTransactions = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    localStorage.setItem('ex_transactions', JSON.stringify(updatedTransactions));
  };

  const saveVerifications = (updatedVerifs: VerificationRequest[]) => {
    setVerifications(updatedVerifs);
    localStorage.setItem('ex_verifications', JSON.stringify(updatedVerifs));
  };

  const saveCurrentUser = (updatedUser: User | null) => {
    setCurrentUser(updatedUser);
    if (updatedUser) {
      localStorage.setItem('ex_current_user', JSON.stringify(updatedUser));
      // update also inside list
      const index = users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) {
        const uList = [...users];
        uList[index] = updatedUser;
        saveUsers(uList);
      }
    } else {
      localStorage.removeItem('ex_current_user');
    }
  };

  // HANDLERS
  const handleLoginSuccess = (email: string) => {
    const cleanMail = email.trim().toLowerCase();
    const foundUser = users.find((u) => u.email.toLowerCase() === cleanMail);

    if (foundUser) {
      if (foundUser.status === 'Suspended') {
        showToast('This account has been banned due to safety policy violations.', 'error');
        return;
      }
      saveCurrentUser(foundUser);
      setIsAuthOpen(false);
      showToast(`Welcome back to ErrandX Workspace, ${foundUser.firstName}! 🎉`, 'success');
      setActivePage('dashboard');
    } else {
      // Automatic fallback registration to keep it interactive
      const newUser: User = {
        id: 'user-' + Date.now(),
        firstName: email.split('@')[0],
        lastName: 'UniMember',
        email: cleanMail,
        phone: '+234 810 555 4444',
        role: 'client',
        status: 'Active',
        verified: true,
        vetted: false,
        walletBalance: 25000,
        escrowBalance: 0,
        joinedDate: 'May 2026',
      };
      const updatedList = [...users, newUser];
      saveUsers(updatedList);
      saveCurrentUser(newUser);
      setIsAuthOpen(false);
      showToast(`Welcome! Simulated campus login approved with ₦25,000 credit.`, 'success');
      setActivePage('dashboard');
    }
  };

  const handleSignupSuccess = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    matricNo?: string;
    skillsCat?: string;
  }) => {
    const newUser: User = {
      id: 'user-' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.trim().toLowerCase(),
      phone: data.phone,
      role: data.role,
      status: 'Active',
      verified: data.role === 'provider' ? false : true, // provider needs admin audit
      vetted: false,
      walletBalance: 15000, // onboarding gift
      escrowBalance: 0,
      matricNumber: data.matricNo,
      primaryCategory: data.skillsCat,
      joinedDate: 'May 2126',
    };

    saveUsers([...users, newUser]);
    saveCurrentUser(newUser);
    setIsAuthOpen(false);

    if (data.role === 'provider') {
      // Append pending verification request
      const newVerReq: VerificationRequest = {
        id: 'ver-' + Date.now(),
        userName: `${data.firstName} ${data.lastName}`,
        userEmail: data.email,
        cat: data.skillsCat || 'All Services',
        idSubmitted: '✓ Student ID card',
        matricNo: data.matricNo || 'BU26LAW999',
        submittedDate: 'May 28, 2026',
        status: 'Pending',
      };
      saveVerifications([newVerReq, ...verifications]);
      showToast('Account profile registered! Partner verification is pending admin review.', 'success');
    } else {
      showToast('Client profile set up! Complete. ₦15,050 gift added.', 'success');
    }
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    saveCurrentUser(null);
    showToast('Logged out of ErrandX workspace. Stay safe!', 'info');
    setActivePage('home');
  };

  // WALLET DEPOSITS/PAYOUTS
  const handleTopUp = (amount: number) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      walletBalance: currentUser.walletBalance + amount,
    };
    saveCurrentUser(updated);

    const newTx: Transaction = {
      id: 'tx-' + Date.now().toString().slice(-5),
      date: 'May 28, 2026',
      desc: 'Wallet Top-Up via Paystack Sandbox',
      type: 'Top-Up',
      amount: amount,
      status: 'done',
    };
    saveTransactions([newTx, ...transactions]);
    showToast(`₦${amount.toLocaleString()} top up approved by Paystack! 💳`, 'success');
  };

  const handleWithdraw = (amount: number, bank: string, accNo: string) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - amount,
    };
    saveCurrentUser(updated);

    const newTx: Transaction = {
      id: 'tx-' + Date.now().toString().slice(-5),
      date: 'May 28, 2026',
      desc: `Payout to ${bank} #${accNo}`,
      type: 'Withdrawal',
      amount: -amount,
      status: 'done',
    };
    saveTransactions([newTx, ...transactions]);
    showToast(`Withdrawal of ₦${amount.toLocaleString()} authorized. Dispatched in 1-2 hours.`, 'success');
  };

  // BOOKING TRIGGERS
  const handleProviderModalSelect = (p: ServiceProvider) => {
    setSelectedProvider(p);
    setIsProviderOpen(true);
  };

  const handleBookingModalTrigger = (provName: string) => {
    if (!currentUser) {
      showToast('Please sign in to book partner operators', 'error');
      setIsAuthOpen(true);
      return;
    }
    const prov = providers.find((p) => p.name === provName);
    if (prov) {
      setSelectedProvider(prov);
      setIsBookingOpen(true);
    }
  };

  const handleBookingSubmit = (bookData: {
    service: string;
    dateTime: string;
    location: string;
    agreedPrice: number;
    notes: string;
  }) => {
    if (!currentUser || !selectedProvider) return;

    if (currentUser.walletBalance < bookData.agreedPrice) {
      showToast('Insufficient wallet credit. Kindly Top Up in the Escrow Wallet tab first!', 'error');
      setIsBookingOpen(false);
      setActivePage('wallet');
      return;
    }

    // Process escrow lock
    const updatedUser: User = {
      ...currentUser,
      walletBalance: currentUser.walletBalance - bookData.agreedPrice,
      escrowBalance: currentUser.escrowBalance + bookData.agreedPrice,
    };
    saveCurrentUser(updatedUser);

    const newBooking: Booking = {
      id: 'EX-' + Math.floor(20200 + Math.random() * 800),
      clientName: `${currentUser.firstName} ${currentUser.lastName}`,
      clientEmail: currentUser.email,
      serviceProviderId: selectedProvider.id,
      providerName: selectedProvider.name,
      service: bookData.service,
      dateTime: bookData.dateTime,
      location: bookData.location,
      agreedPrice: bookData.agreedPrice,
      commission: Math.round(bookData.agreedPrice * 0.125),
      status: 'In Progress',
      createdDate: 'May 28, 2026',
    };

    saveBookings([newBooking, ...bookings]);

    const newTx: Transaction = {
      id: 'tx-' + Math.floor(10000 + Math.random() * 90000),
      date: 'May 28, 2026',
      desc: `Booking #${newBooking.id} Escrow (Hold)`,
      type: 'Escrow Hold',
      amount: -bookData.agreedPrice,
      status: 'held',
    };
    saveTransactions([newTx, ...transactions]);

    setIsBookingOpen(false);
    showToast(`Booking locked! 🔒 ₦${bookData.agreedPrice.toLocaleString()} upfront held securely in escrow.`, 'success');
    setActivePage('dashboard');
  };

  // ESCROW RELEASING & REVIEWS
  const handleReleaseEscrow = (bookingId: string) => {
    if (!currentUser) return;
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    // Release held escrow
    const updatedUser: User = {
      ...currentUser,
      escrowBalance: Math.max(0, currentUser.escrowBalance - target.agreedPrice),
    };
    saveCurrentUser(updatedUser);

    // Swap status to completed
    const list = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'Completed' as const } : b));
    saveBookings(list);

    // Update Transaction held reference
    const txList = transactions.map((t) =>
      t.desc.includes(bookingId) ? { ...t, status: 'done' as const, type: 'Released' as const } : t
    );
    saveTransactions(txList);

    // Prompt Reviews Dialog
    setRatingBookingId(bookingId);
    setRatingProviderName(target.providerName);
    setIsRatingOpen(true);
    showToast(`Escrow cleared! ₦${target.agreedPrice.toLocaleString()} paid to ${target.providerName}. 🎉`, 'success');
  };

  const handleRatingSubmit = (bookingId: string, ratingValue: number, comment: string) => {
    const list = bookings.map((b) =>
      b.id === bookingId ? { ...b, rating: ratingValue, review: comment } : b
    );
    saveBookings(list);
    setIsRatingOpen(false);
    setRatingBookingId(null);
    showToast(`Review published! Operator rated ${ratingValue} stars. Thank you! ⭐`, 'success');
  };

  const handleOpenDisputeForm = (bookingId: string) => {
    setActivePage('safety');
    showToast('Dispute form ready below. Enter event particulars to block payout.', 'info');
  };

  const handleVerifyApproval = (verId: string) => {
    const updatedVerifs = verifications.map((v) => (v.id === verId ? { ...v, status: 'Approved' as const } : v));
    saveVerifications(updatedVerifs);

    const verObj = verifications.find((v) => v.id === verId);
    if (verObj) {
      showToast(`Approved verification certificate for ${verObj.userName}! Check badge updated. ✅`, 'success');
    }
  };

  const handleVerifyRejection = (verId: string) => {
    const updatedVerifs = verifications.map((v) => (v.id === verId ? { ...v, status: 'Rejected' as const } : v));
    saveVerifications(updatedVerifs);
    showToast('Verification application rejected.', 'info');
  };

  const handleResolveDispute = (bookingId: string, resolution: 'refund' | 'release') => {
    if (!currentUser) return;
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    if (resolution === 'refund') {
      // Put balance back to claimant, deduct escrow
      const updatedUser: User = {
        ...currentUser,
        walletBalance: currentUser.walletBalance + target.agreedPrice,
        escrowBalance: Math.max(0, currentUser.escrowBalance - target.agreedPrice),
      };
      saveCurrentUser(updatedUser);

      // Log back refund
      const newTx: Transaction = {
        id: 'tx-' + Math.floor(10000 + Math.random() * 90000),
        date: 'May 28, 2026',
        desc: `Booking #${bookingId} Escrow Dispute Refund`,
        type: 'Refunded',
        amount: target.agreedPrice,
        status: 'done',
      };
      saveTransactions([newTx, ...transactions]);
      showToast(`Arbitration Solved: Fully refunded ₦${target.agreedPrice.toLocaleString()} to client wallet!`, 'success');
    } else {
      // Disburse directly
      const updatedUser: User = {
        ...currentUser,
        escrowBalance: Math.max(0, currentUser.escrowBalance - target.agreedPrice),
      };
      saveCurrentUser(updatedUser);
      showToast(`Arbitration Solved: Escrow disbursed safely to provider: ${target.providerName}.`, 'success');
    }

    const updatedBookings = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'Completed' as const } : b));
    saveBookings(updatedBookings);
  };

  const handleSuspendUser = (userId: string) => {
    const list = users.map((u) => (u.id === userId ? { ...u, status: 'Suspended' as const } : u));
    saveUsers(list);
    showToast('User account suspended under safety policy.', 'error');
  };

  const handleActivateUser = (userId: string) => {
    const list = users.map((u) => (u.id === userId ? { ...u, status: 'Active' as const } : u));
    saveUsers(list);
    showToast('User account logins restored successfully.', 'success');
  };

  const handleSOSAlert = () => {
    showToast('🆘 SOS ALERTS SENT: GPS Coordinates dispatched to campus guards & support dispatch.', 'error');
  };

  const handleAddArbitrationDispute = (bookingId: string, reason: string, desc: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    const list = bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'Disputed' as const, disputeReason: reason, disputeDescription: desc } : b
    );
    saveBookings(list);
    showToast(`Dispute logged under ticket Reference #${bookingId}. Arbitrators will resolve within 24 hours.`, 'success');
    setActivePage('dashboard');
  };

  const handleReportUserAction = (handle: string, type: string, desc: string) => {
    showToast(`Violation report registered on ${handle} for ${type}. Auditing.`, 'success');
  };

  const handleAcceptIncomingProposals = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'In Progress' as const } : b));
    saveBookings(updated);
    showToast('Proposal request accepted! Client has been notified by automated Bowen SMS.', 'success');
  };

  const handleDeclineIncomingProposals = (bookingId: string) => {
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' as const } : b));
    saveBookings(updated);
    showToast('Proposal offer declined.', 'info');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans antialiased text-slate-900">
      
      {/* Dynamic Accessible Header Nav */}
      <Header
        activePage={activePage}
        setActivePage={(p) => {
          setActivePage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Floating high-contrast accessible toast notification banner */}
      {toast && (
        <div 
          className={`fixed top-20 right-4 z-55 max-w-sm rounded-2xl p-4 shadow-xl border flex items-center gap-3 animate-slideIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold'
              : toast.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-950 font-bold'
              : 'bg-[#EEF4FF] border-blue-300 text-slate-950 font-semibold'
          }`}
          style={{ animation: 'slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="h-6 w-6 rounded-full shrink-0 flex items-center justify-center font-bold">
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </div>
          <span className="text-xs leading-normal">{toast.msg}</span>
        </div>
      )}

      {/* Page Content viewport */}
      <main className="flex-1 pb-16">
        
        {/* HOMEPAGE VIEW PORT */}
        {activePage === 'home' && (
          <HomeView
            providers={providers}
            onSelectCategory={(cat) => setSelectedCategory(cat)}
            onSelectProvider={handleProviderModalSelect}
            setActivePage={(p) => {
              setActivePage(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => setIsAuthOpen(true)}
            currentUser={currentUser}
            setSearchQuery={(q) => setSearchQuery(q)}
          />
        )}

        {/* BROWSE VIEW PORT */}
        {activePage === 'browse' && (
          <BrowseView
            providers={providers}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProvider={handleProviderModalSelect}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {/* PRIVATE STATE DASHBOARDS */}
        {activePage === 'dashboard' && (
          <DashboardView
            bookings={bookings}
            currentUser={currentUser}
            onOpenBookingModal={() => {
              if (providers.length > 0) {
                setSelectedProvider(providers[0]);
                setIsBookingOpen(true);
              }
            }}
            onOpenDispute={handleOpenDisputeForm}
            onReleaseEscrow={handleReleaseEscrow}
            onAcceptIncoming={handleAcceptIncomingProposals}
            onDeclineIncoming={handleDeclineIncomingProposals}
          />
        )}

        {/* LEDGER ESCROW WALLET */}
        {activePage === 'wallet' && (
          <WalletView
            transactions={transactions}
            currentUser={currentUser}
            onTopUp={handleTopUp}
            onWithdraw={handleWithdraw}
          />
        )}

        {/* CAMPUS SECURITY HUB */}
        {activePage === 'safety' && (
          <SafetyView
            currentUser={currentUser}
            activeBookings={bookings.filter((b) => b.clientEmail === currentUser?.email && ['Pending', 'Confirmed', 'In Progress'].includes(b.status))}
            onTriggerSOS={handleSOSAlert}
            onSubmitDispute={handleAddArbitrationDispute}
            onReportUser={handleReportUserAction}
          />
        )}

        {/* MODERATORS COMMAND ROOM */}
        {activePage === 'admin' && (
          <AdminView
            verifications={verifications}
            bookings={bookings}
            users={users}
            onApproveVerification={handleVerifyApproval}
            onRejectVerification={handleVerifyRejection}
            onResolveDispute={handleResolveDispute}
            onSuspendUser={handleSuspendUser}
            onActivateUser={handleActivateUser}
          />
        )}
      </main>

      {/* Interactive Floating Action for Safety SOS */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSOSAlert}
          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold h-12 w-12 rounded-full shadow-2xl flex items-center justify-center transition hover:scale-105 border-2 border-white"
          title="SOS campus security alert trigger"
        >
          🆘
        </button>
      </div>

      {/* Accessible Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <span className="font-display text-lg font-black text-white">ErrandX.</span>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Award-winning Entrepreneurship Startup Group 15 Bowen university pilot MVP. On-demand campus service &amp; escrow-protected trade pipeline. Academic Year 2025/2026.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Service Sectors</h4>
            <ul className="text-xs space-y-2">
              <li>Calculus &amp; Study Tutorials</li>
              <li>Hostel Laundry &amp; Ironing</li>
              <li>Hardware &amp; Laptop Repair</li>
              <li>Meal Prep &amp; Food Delivery</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Protection Layers</h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li>✓ Secure Paystack escrow hold</li>
              <li>✓ OTP live mobile phone match</li>
              <li>✓ Verified student matric database</li>
              <li>✓ 24hr arbitration dispute panel</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest mb-3">Group co-founders</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Emmanuel Adebagbo (#BU22LAW1001), Gideon Adeosun, Fehintoluwa, and colleagues of Bowen group 15, Course code: EES 402.
            </p>
          </div>
        </div>
      </footer>

      {/* DIALOG MODALS LIST */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedProvider={selectedProvider}
        onSubmitBooking={handleBookingSubmit}
      />

      <ProviderModal
        isOpen={isProviderOpen}
        onClose={() => setIsProviderOpen(false)}
        provider={selectedProvider}
        onBookNow={handleBookingModalTrigger}
      />

      <RatingModal
        isOpen={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        bookingId={ratingBookingId}
        providerName={ratingProviderName}
        onSubmitRating={handleRatingSubmit}
      />

    </div>
  );
}
