import React, { useState } from 'react';
import { ActivePage, User } from '../types';
import { Shield, Wallet, BookOpen, Layers, Settings, UserCheck, LogIn, LogOut, Menu, X } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={() => { setActivePage('home'); setIsMobileMenuOpen(false); }} 
          className="flex cursor-pointer items-center gap-1.5 focus:outline-hidden"
          id="nav-logo"
        >
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-brand text-lg sm:text-xl font-extrabold text-white shadow-sm">
            EX
          </div>
          <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-brand">
            ErrandX<span className="text-accent">.</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            id="nav-home"
            onClick={() => setActivePage('home')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'home'
                ? 'bg-[#EEF4FF] text-brand font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Home
          </button>
          
          <button
            id="nav-browse"
            onClick={() => setActivePage('browse')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'browse'
                ? 'bg-[#EEF4FF] text-brand font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Browse Help
          </button>

          <button
            id="nav-dashboard"
            onClick={() => setActivePage('dashboard')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'dashboard'
                ? 'bg-[#EEF4FF] text-brand font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Dashboard
          </button>

          <button
            id="nav-wallet"
            onClick={() => setActivePage('wallet')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'wallet'
                ? 'bg-[#EEF4FF] text-brand font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Escrow Wallet
          </button>

          <button
            id="nav-safety"
            onClick={() => setActivePage('safety')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'safety'
                ? 'bg-[#EEF4FF] text-brand font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Safety Centre
          </button>

          <button
            id="nav-admin"
            onClick={() => setActivePage('admin')}
            className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
              activePage === 'admin'
                ? 'bg-[#FEE2E2] text-danger font-semibold'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            Admin Support
          </button>
        </nav>

        {/* User Interaction & Auth State Buttons */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Vetted badge */}
              <div className="hidden lg:flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {currentUser.role === 'both' ? 'Dual Account' : `${currentUser.role.toUpperCase()}`}
              </div>

              {/* Wallet Quick Balance badge */}
              <div 
                onClick={() => setActivePage('wallet')}
                className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-50 text-[11px] sm:text-xs font-bold text-orange-750 hover:bg-orange-100 transition-colors shrink-0"
              >
                <Wallet className="h-3.5 w-3.5 shrink-0" />
                <span>₦{currentUser.walletBalance.toLocaleString()}</span>
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div 
                  onClick={() => setActivePage('dashboard')}
                  className="h-8 w-8 sm:h-10 sm:w-10 cursor-pointer rounded-full bg-brand-light flex items-center justify-center font-display font-semibold text-xs sm:text-sm text-white shadow-inner uppercase border border-slate-200 hover:scale-105 transition-transform"
                >
                  {currentUser.firstName[0]}
                  {currentUser.lastName[0]}
                </div>
                <div className="hidden xl:block text-right">
                  <div className="text-xs font-bold text-slate-800 leading-3">{currentUser.firstName} {currentUser.lastName}</div>
                  <span className="text-[10px] text-slate-500">{currentUser.email}</span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="cursor-pointer flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-700 transition shrink-0"
                title="Log Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <button
              id="header-signin-btn"
              onClick={onOpenAuth}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-brand-light transition duration-150 shadow-md border border-brand shrink-0"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Hamburger Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="cursor-pointer md:hidden flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-200 border border-slate-220 transition-colors shrink-0"
          >
            {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white shadow-xl animate-fade-in divide-y divide-slate-100">
          <div className="flex flex-col gap-0.5 p-2 bg-slate-50">
            <button
              onClick={() => { setActivePage('home'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'home' ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-white'
              }`}
            >
              🏠 Home
            </button>
            <button
              onClick={() => { setActivePage('browse'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'browse' ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-white'
              }`}
            >
              🔍 Browse Help
            </button>
            <button
              onClick={() => { setActivePage('dashboard'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'dashboard' ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-white'
              }`}
            >
              ⚙️ Dashboard Layouts
            </button>
            <button
              onClick={() => { setActivePage('wallet'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'wallet' ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-white'
              }`}
            >
              💳 Escrow Ledger Wallet
            </button>
            <button
              onClick={() => { setActivePage('safety'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'safety' ? 'bg-brand/10 text-brand' : 'text-slate-600 hover:bg-white'
              }`}
            >
              🛡️ Safety Security Centre
            </button>
            <button
              onClick={() => { setActivePage('admin'); setIsMobileMenuOpen(false); }}
              className={`text-left px-4 py-3 text-xs font-bold rounded-lg transition ${
                activePage === 'admin' ? 'bg-red-50 text-red-650' : 'text-slate-600 hover:bg-white'
              }`}
            >
              👑 Admin Command Room
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
