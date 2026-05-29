import React, { useState } from 'react';
import { CATEGORIES } from '../mockData';
import { ServiceProvider, ActivePage } from '../types';
import { Search, ChevronRight, Star, CheckCircle, Award, Users, ShieldCheck, Briefcase } from 'lucide-react';

interface HomeViewProps {
  providers: ServiceProvider[];
  onSelectCategory: (category: string | null) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  setActivePage: (page: ActivePage) => void;
  onOpenAuth: () => void;
  currentUser: any;
  setSearchQuery: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  providers,
  onSelectCategory,
  onSelectProvider,
  setActivePage,
  onOpenAuth,
  currentUser,
  setSearchQuery,
}) => {
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setActivePage('browse');
  };

  const handleQuickCategory = (cat: string) => {
    onSelectCategory(cat);
    setActivePage('browse');
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-brand-light py-10 px-4 text-center text-white sm:py-20 lg:px-8">
        {/* Abstract circles backgrounds */}
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-xl"></div>
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-accent/10 blur-2xl"></div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <div className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-xs font-semibold backdrop-blur-md">
            <span className="flex h-1.5 w-1.5 rounded-full bg-yellow-400"></span>
            🇳🇬 Campus-first · Trust-verified · Escrow-protected
          </div>

          <h1 className="font-display text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight sm:leading-none mb-4 sm:mb-6">
            Get anything done on <br />
            <span className="text-amber-200 underline decoration-amber-300/80 decoration-2 underline-offset-4">campus</span> in seconds
          </h1>

          <p className="mx-auto max-w-xl text-xs sm:text-lg text-slate-100 mb-6 sm:mb-8 font-light leading-relaxed">
            Connect with verified students offering tutoring, tech repairs, laundry, hair styling, meals, and hosteling runs. Zero risk escrow payments.
          </p>

          {/* Large Search Container */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="mx-auto max-w-2xl bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 flex flex-col sm:flex-row gap-2 shadow-xl border border-slate-200"
          >
            <div className="flex-1 flex items-center px-2 sm:px-3 gap-2">
              <Search className="text-slate-400 h-4.5 w-4.5 sm:h-5 sm:w-5 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="What do you need help with? (e.g., Calculus, Laundry)"
                className="w-full border-none bg-transparent outline-hidden text-slate-850 font-sans text-xs sm:text-base placeholder-slate-450 focus:ring-0 py-1 sm:py-2"
              />
            </div>
            <button
              type="submit"
              className="cursor-pointer btn-accessible-accent rounded-lg sm:rounded-xl px-4 sm:px-6 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>Search Help</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Buttons under Hero */}
          <div className="mt-5 sm:mt-8 flex flex-wrap gap-2.5 sm:gap-4 justify-center">
            {currentUser ? (
              <button
                onClick={() => setActivePage('browse')}
                className="cursor-pointer btn-hero-solid-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center gap-1.5"
              >
                Book a Provider
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="cursor-pointer btn-hero-solid-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center gap-1.5"
              >
                Get Started
              </button>
            )}

            <button
              onClick={() => {
                if (currentUser) {
                  setActivePage('dashboard');
                } else {
                  onOpenAuth();
                }
              }}
              className="cursor-pointer btn-hero-outline-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm flex items-center gap-1.5"
            >
              Offer Services & Earn
            </button>
          </div>
        </div>
      </section>

      {/* Live Campus Statistics Bar */}
      <section className="bg-white border-b border-slate-200 py-3 sm:py-6 px-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center divide-slate-100 lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="py-2.5 sm:py-4">
              <div className="font-display text-xl sm:text-4xl font-extrabold text-brand">2,847</div>
              <div className="text-[9px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">Users Registered</div>
            </div>
            <div className="py-2.5 sm:py-4">
              <div className="font-display text-xl sm:text-4xl font-extrabold text-brand">438</div>
              <div className="text-[9px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">Shield-Verified Providers</div>
            </div>
            <div className="py-2.5 sm:py-4">
              <div className="font-display text-xl sm:text-4xl font-extrabold text-brand">5,209</div>
              <div className="text-[9px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">completed transactions</div>
            </div>
            <div className="py-2.5 sm:py-4">
              <div className="font-display text-xl sm:text-4xl font-extrabold text-emerald-600 animate-pulse">₦0 Risk</div>
              <div className="text-[9px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase mt-0.5">escrow financial protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Container */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-16">
        
        {/* Categories Section */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Browse Campus Categories</h2>
              <p className="text-sm text-slate-500 mt-1">Select a category to view vetted specialized student listings</p>
            </div>
            <button 
              onClick={() => { onSelectCategory(null); setActivePage('browse'); }}
              className="text-sm font-semibold text-brand hover:text-brand-light transition"
            >
              View all
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {CATEGORIES.map((c) => (
              <div
                key={c.name}
                onClick={() => handleQuickCategory(c.name)}
                className="group cursor-pointer rounded-2xl border border-slate-150 p-5 text-center transition-all hover:scale-103 hover:shadow-md hover:border-brand-light"
                style={{ backgroundColor: c.color }}
              >
                <div className="text-3xl mb-3 transform transition duration-150 group-hover:scale-110">{c.icon}</div>
                <div className="font-display font-semibold text-xs py-1 text-slate-800 tracking-tight">
                  {c.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Providers Section */}
        <section className="flex flex-col gap-6">
          <div className="flex justify-between items-end border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Vetted Student Hustlers</h2>
              <p className="text-sm text-slate-500 mt-1">Top rated peers ready to help you save time today</p>
            </div>
            <button
              onClick={() => setActivePage('browse')}
              className="text-sm font-semibold text-brand hover:text-brand-light flex items-center gap-1 transition"
            >
              <span>Explore all</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProvider(p)}
                className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-lg hover:border-brand-light"
              >
                {/* Visual Header */}
                <div className="h-28 bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-4xl relative text-white">
                  <span className="relative z-10 drop-shadow-md">{p.emoji}</span>
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                {/* Body info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between min-h-12 mb-2 gap-1">
                    <h3 className="font-display font-bold text-base text-slate-900 leading-tight group-hover:text-brand transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex shrink-0">
                      {p.verified && (
                        <CheckCircle className="h-4.5 w-4.5 text-brand fill-white" title="ID Checked" />
                      )}
                      {p.vetted && (
                        <Award className="h-4.5 w-4.5 text-accent fill-white ml-0.5" title="Vetted Badge" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {p.cat} &bull; {p.jobs} jobs completed
                  </p>

                  <p className="text-xs text-slate-605 line-clamp-2 leading-relaxed mb-4 grow flex-1">
                    {p.bio}
                  </p>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-auto">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-sm font-extrabold text-slate-800">
                      {p.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Earn Promotion */}
        <section className="rounded-3xl bg-gradient-to-r from-brand to-brand-light p-8 text-white sm:p-12 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden border border-brand-dark">
          <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-accent/20 blur-xl"></div>
          <div className="relative z-10 flex flex-col gap-3 max-w-lg">
            <span className="inline-flex max-w-fit items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
              <Briefcase className="h-3 w-3" />
              Enroll as Partner
            </span>
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Earn doing things you are already good at!</h2>
            <p className="text-sm text-slate-105 leading-relaxed font-light">
              List your services (cleaning, photo shoot, repair, design, cooking), build your campus reputation with permanent reviews, and collect payments securely through escrow. We charge a tiny commission only on successful transactions.
            </p>
          </div>
          <button
            onClick={() => {
              if (currentUser) {
                setActivePage('dashboard');
              } else {
                onOpenAuth();
              }
            }}
            className="cursor-pointer btn-hero-solid-white rounded-xl px-6 py-4 text-sm font-bold shadow-md relative z-10 text-brand shrink-0 shrink-0 self-start md:self-center"
          >
            Become a Provider Now &rarr;
          </button>
        </section>

        {/* Informative Safety Guarantee Bar */}
        <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="font-display text-2xl font-bold text-slate-950">Six-Layer Safety & Escrow Architecture</h3>
            <p className="text-sm text-slate-500 mt-2">Every student transaction is fortified by security systems that prevent fraud, poor service, and harassment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-150 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Complete ID Verification</h4>
                <p className="text-xs text-slate-500 mt-1">We require government-issued IDs, students matric cards, and live selfies for active listings.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-150 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Escrow Safeguards</h4>
                <p className="text-xs text-slate-500 mt-1">Funds are paid upfront and locked securely. They are released ONLY after the client clicks "Mark Done".</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-150 flex gap-4">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Dispute & SOS Help</h4>
                <p className="text-xs text-slate-500 mt-1">One-click SOS alerts community leaders. Dedicated dispute panel locks funds and refunds clients in 24 hours.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
