import React, { useState, useEffect } from 'react';
import { X, LogIn, ChevronRight, UserPlus } from 'lucide-react';
import { UserRole } from '../types';
import { sanitizeEmail, sanitizePhone, sanitizeName, sanitizeMatric } from '../sanitizer';

const LIMIT_MAX_ATTEMPTS = 5;
const COOLDOWN_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

const getAttempts = (key: string): number[] => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter((t: number) => Date.now() - t < COOLDOWN_PERIOD_MS);
    }
  } catch (e) {
    console.error('Failed to parse attempts list', e);
  }
  return [];
};

const recordAttempt = (key: string) => {
  const attempts = getAttempts(key);
  attempts.push(Date.now());
  localStorage.setItem(key, JSON.stringify(attempts));
};

const getCooldownRemaining = (key: string): number => {
  const attempts = getAttempts(key);
  if (attempts.length < LIMIT_MAX_ATTEMPTS) return 0;
  // The oldest attempt in the 15-minute window needs to expire
  const oldestActiveAttempt = attempts[0];
  const timePassed = Date.now() - oldestActiveAttempt;
  return Math.max(0, COOLDOWN_PERIOD_MS - timePassed);
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onSignupSuccess: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    matricNo?: string;
    skillsCat?: string;
  }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onSignupSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [signupRole, setSignupRole] = useState<'client' | 'provider'>('client');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPwd, setLoginPwd] = useState('');

  // Signup States
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pwd, setPwd] = useState('');
  const [matric, setMatric] = useState('');
  const [skillsCat, setSkillsCat] = useState('Select Category');

  // Rate limiting states
  const [loginCooldown, setLoginCooldown] = useState(0);
  const [signupCooldown, setSignupCooldown] = useState(0);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Initial check of cooldowns
    const loginRemMs = getCooldownRemaining('errandx_login_attempts');
    const signupRemMs = getCooldownRemaining('errandx_signup_attempts');
    
    setLoginCooldown(Math.ceil(loginRemMs / 1000));
    setSignupCooldown(Math.ceil(signupRemMs / 1000));

    if (loginRemMs > 0 || signupRemMs > 0) {
      setRateLimitError('Too many authentication attempts. Rate limits are actively enforced.');
    }

    const interval = setInterval(() => {
      const loginRemainingMs = getCooldownRemaining('errandx_login_attempts');
      const signupRemainingMs = getCooldownRemaining('errandx_signup_attempts');
      
      setLoginCooldown(Math.ceil(loginRemainingMs / 1000));
      setSignupCooldown(Math.ceil(signupRemainingMs / 1000));

      if (loginRemainingMs === 0 && signupRemainingMs === 0) {
        setRateLimitError(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const remainingMs = getCooldownRemaining('errandx_login_attempts');
    if (remainingMs > 0) {
      const minutes = Math.ceil(remainingMs / 1000 / 60);
      setRateLimitError(`Too many sign in attempts! Access locked. Please wait ${minutes} minute(s) before trying again.`);
      return;
    }

    if (!loginEmail || !loginPwd) {
      alert('Please fill in both email and password fields.');
      return;
    }

    // Sanitize and validate login email
    const { sanitized: cleanEmail, isValid: emailValid } = sanitizeEmail(loginEmail);
    if (!emailValid) {
      alert('Invalid email address format. Please provide a standard email (e.g. you@example.com).');
      return;
    }

    // Force safety ceiling for password field to protect offline/hashing limits
    if (loginPwd.length > 72) {
      alert('Password parameter is malformed or oversized.');
      return;
    }

    // Record attempt
    recordAttempt('errandx_login_attempts');
    const updatedRemainingMs = getCooldownRemaining('errandx_login_attempts');
    if (updatedRemainingMs > 0) {
      setLoginCooldown(Math.ceil(updatedRemainingMs / 1000));
      setRateLimitError('Rate limit exceeded. Too many attempts. Access locked for 15 minutes.');
      return;
    }

    onLoginSuccess(cleanEmail);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const remainingMs = getCooldownRemaining('errandx_signup_attempts');
    if (remainingMs > 0) {
      const minutes = Math.ceil(remainingMs / 1000 / 60);
      setRateLimitError(`Too many sign up attempts! Access locked. Please wait ${minutes} minute(s) before trying again.`);
      return;
    }

    if (!first || !last || !email || !phone || !pwd) {
      alert('Please fill in all mandatory sign up fields.');
      return;
    }

    // Deep sanitization of names, email, and phone
    const cleanFirst = sanitizeName(first, 30);
    const cleanLast = sanitizeName(last, 30);
    const { sanitized: cleanEmail, isValid: emailValid } = sanitizeEmail(email);
    const { sanitized: cleanPhone, isValid: phoneValid } = sanitizePhone(phone);

    if (!cleanFirst || !cleanLast) {
      alert('Names must contain only valid alphanumeric letters, spaces, and hyphens (max 30 characters).');
      return;
    }

    if (!emailValid) {
      alert('Invalid email format. Please provide a standard address.');
      return;
    }

    if (!phoneValid) {
      alert('Please enter a valid phone number (8 to 15 digits only).');
      return;
    }

    if (pwd.length < 6) {
      alert('Security password must contain at least 6 characters.');
      return;
    }
    if (pwd.length > 72) {
      alert('Security password cannot exceed 72 characters.');
      return;
    }

    let cleanMatric = '';
    if (signupRole === 'provider') {
      if (!matric) {
        alert('Please fill in your Bowen University student/matriculation number for verification.');
        return;
      }
      const { sanitized: matricVal, isValid: matricValid } = sanitizeMatric(matric);
      if (!matricValid) {
        alert('Malformed matriculation number. Format must be alphanumeric and between 5 and 20 characters.');
        return;
      }
      cleanMatric = matricVal;

      if (skillsCat === 'Select Category') {
        alert('Please pick your primary skilled category area of operation.');
        return;
      }
    }

    // Record attempt
    recordAttempt('errandx_signup_attempts');
    const updatedRemainingMs = getCooldownRemaining('errandx_signup_attempts');
    if (updatedRemainingMs > 0) {
      setSignupCooldown(Math.ceil(updatedRemainingMs / 1000));
      setRateLimitError('Rate limit exceeded. Too many attempts. Access locked for 15 minutes.');
      return;
    }

    onSignupSuccess({
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      phone: cleanPhone,
      role: signupRole === 'provider' ? 'provider' : 'client',
      matricNo: signupRole === 'provider' ? cleanMatric : undefined,
      skillsCat: signupRole === 'provider' ? skillsCat : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-y-auto max-h-[90vh]">
        {/* Close trigger */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Form Title */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-black text-slate-950">
            {authMode === 'login' ? 'Welcome Back To ErrandX' : 'Join as Campus Operator'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'login' 
              ? 'Enter email credentials to verify locks, ledger, and disputes' 
              : 'Setup a secure workspace to trade skills or order campus help safely'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-slate-100 rounded-xl p-1 mb-6 grid grid-cols-2">
          <button
            onClick={() => setAuthMode('login')}
            className={`cursor-pointer rounded-lg py-2.5 text-xs font-bold transition ${
              authMode === 'login' ? 'bg-white text-brand shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In Account
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`cursor-pointer rounded-lg py-2.5 text-xs font-bold transition ${
              authMode === 'signup' ? 'bg-white text-brand shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Rate Limiting Active Cooldown Banners */}
        {rateLimitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-900 text-xs font-semibold leading-relaxed flex flex-col gap-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-red-950">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              <span>Rate Limit Lock Active 🔐</span>
            </div>
            <p className="font-medium text-[11px] text-red-800 leading-normal">{rateLimitError}</p>
          </div>
        )}

        {authMode === 'login' && loginCooldown > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold leading-relaxed flex flex-col gap-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>Sign In Locked (Attempts Exhausted)</span>
            </div>
            <p>Please wait <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950">{Math.floor(loginCooldown / 60)}m {loginCooldown % 60}s</span> before retrying.</p>
          </div>
        )}

        {authMode === 'signup' && signupCooldown > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold leading-relaxed flex flex-col gap-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              <span>Sign Up Locked (Attempts Exhausted)</span>
            </div>
            <p>Please wait <span className="font-mono font-bold bg-amber-100 px-1 py-0.5 rounded text-amber-950">{Math.floor(signupCooldown / 60)}m {signupCooldown % 60}s</span> before retrying.</p>
          </div>
        )}

        {/* LOGIN MODE FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Campus Email Address</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="e.g. emmanuel@uni.edu.ng"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Password</label>
              <input
                type="password"
                value={loginPwd}
                onChange={(e) => setLoginPwd(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loginCooldown > 0}
              className={`cursor-pointer btn-accessible-primary rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 w-full mt-2 transition-all ${
                loginCooldown > 0 ? 'opacity-50 cursor-not-allowed bg-slate-300 hover:bg-slate-300 border-slate-300 text-slate-500' : ''
              }`}
            >
              <LogIn className="h-4.5 w-4.5" />
              <span>Sign In to ErrandX Workspace</span>
            </button>
          </form>
        )}

        {/* SIGNUP MODE FORM */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            
            {/* Step 1 Profile Selector Tabs */}
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase mb-1.5 font-display">Are you looking to buy or earn?</span>
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSignupRole('client')}
                  className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition ${
                    signupRole === 'client' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🙋 Need Services
                </button>
                <button
                  type="button"
                  onClick={() => setSignupRole('provider')}
                  className={`cursor-pointer rounded-lg py-2 text-xs font-bold transition ${
                    signupRole === 'provider' ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  🚀 Offer Services
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">First Name</label>
                <input
                  type="text"
                  value={first}
                  onChange={(e) => setFirst(e.target.value)}
                  placeholder="e.g. Ada"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={last}
                  onChange={(e) => setLast(e.target.value)}
                  placeholder="e.g. Okafor"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Active WhatsApp/Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 810 000 0000"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Campus Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. ada.okafor@uni.edu.ng"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            {/* IF PROVIDER ROLE: Extras */}
            {signupRole === 'provider' && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-4">
                <span className="text-xs font-extrabold text-brand tracking-tight">Vetted Operator Credentials</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">University Matric Key</label>
                    <input
                      type="text"
                      value={matric}
                      onChange={(e) => setMatric(e.target.value)}
                      placeholder="e.g. BU22LAW1001"
                      className="w-full rounded-lg border-2 border-slate-250 bg-white px-3 py-2 text-xs focus:border-brand outline-hidden text-slate-900 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Primary Skill Area</label>
                    <select
                      value={skillsCat}
                      onChange={(e) => setSkillsCat(e.target.value)}
                      className="w-full rounded-lg border-2 border-slate-250 bg-white px-3 py-2 text-xs outline-hidden text-slate-900 font-medium"
                    >
                      <option>Select Category</option>
                      <option value="Tutoring">Tutoring</option>
                      <option value="Food & Cooking">Food & Cooking</option>
                      <option value="Repairs & Tech">Repairs & Tech</option>
                      <option value="Laundry">Laundry</option>
                      <option value="Hair & Beauty">Hair & Beauty</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Photography">Photography</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Choose Password</label>
              <input
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                placeholder="Min. 6 alphanumeric characters"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              disabled={signupCooldown > 0}
              className={`cursor-pointer btn-accessible-primary rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 w-full mt-2 transition-all ${
                signupCooldown > 0 ? 'opacity-50 cursor-not-allowed bg-slate-300 hover:bg-slate-300 border-slate-300 text-slate-500' : ''
              }`}
            >
              <UserPlus className="h-4.5 w-4.5" />
              <span>Create Free Account Profile</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
