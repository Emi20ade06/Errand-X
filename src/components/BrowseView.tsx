import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../mockData';
import { ServiceProvider } from '../types';
import { Search, Star, CheckCircle, Award, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface BrowseViewProps {
  providers: ServiceProvider[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BrowseView: React.FC<BrowseViewProps> = ({
  providers,
  selectedCategory,
  setSelectedCategory,
  onSelectProvider,
  searchQuery,
  setSearchQuery,
}) => {
  const [sortBy, setSortBy] = useState<string>('rating');

  // Filter & Sort Logic
  const filteredAndSortedProviders = useMemo(() => {
    let result = [...providers];

    // Filter by Category
    if (selectedCategory) {
      result = result.filter((p) => p.cat === selectedCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.priceVal - b.priceVal);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.priceVal - a.priceVal);
    } else if (sortBy === 'jobs') {
      result.sort((a, b) => b.jobs - a.jobs);
    }

    return result;
  }, [providers, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Search Header Area */}
      <div className="bg-white border-b border-slate-200 py-5 sm:py-8 px-4">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1.5">Find Campus Operators</h1>
          <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">Instantly list, sort, and book checked-in student colleagues with escrow protection</p>

          <div className="flex flex-col md:flex-row gap-2.5 sm:gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center bg-white rounded-lg border-2 border-slate-200 px-3 sm:px-4 py-2 sm:py-3 shadow-2xs focus-within:border-brand transition">
              <Search className="h-4.5 w-4.5 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skill, service (e.g. Barber, Python tutoring)..."
                className="w-full bg-transparent border-none outline-hidden text-xs sm:text-sm focus:ring-0 text-slate-900"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-slate-500 gap-1 sm:gap-1.5 shrink-0 text-xs sm:text-sm font-medium">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-2 sm:py-3 outline-hidden cursor-pointer"
              >
                <option value="rating">Highest Rated ⭐</option>
                <option value="price_asc">Price: Low to High ₦</option>
                <option value="price_desc">Price: High to Low ₦</option>
                <option value="jobs">Most Jobs Handled 💼</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:py-6 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex gap-2 overflow-x-auto pb-2 items-center flex-row whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold border-2 transition-all duration-150 ${
              selectedCategory === null
                ? 'bg-brand text-white border-brand shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
            }`}
          >
            🌟 All Categories
          </button>
          
          {CATEGORIES.map((c) => {
            const isSelected = selectedCategory === c.name;
            return (
              <button
                key={c.name}
                onClick={() => setSelectedCategory(isSelected ? null : c.name)}
                className={`cursor-pointer shrink-0 rounded-full px-3.5 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold border-2 flex items-center gap-1 sm:gap-1.5 transition-all duration-150 ${
                  isSelected
                    ? 'bg-brand text-white border-brand shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                }`}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Provider Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
            Found {filteredAndSortedProviders.length} active service providers
          </span>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        {filteredAndSortedProviders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProviders.map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProvider(p)}
                className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-lg hover:border-brand-light"
              >
                {/* Visual Header */}
                <div className="h-24 bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-3xl relative text-white">
                  <span className="relative z-10 drop-shadow-md">{p.emoji}</span>
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  {p.vetted && (
                    <span className="absolute top-3 left-3 bg-indigo-650 text-white border border-indigo-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
                      Vetted Rep
                    </span>
                  )}
                </div>

                {/* Body info */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-start justify-between min-h-12 mb-2 gap-1">
                    <h3 className="font-display font-black text-base text-slate-900 leading-tight group-hover:text-brand transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex shrink-0">
                      {p.verified && (
                        <CheckCircle className="h-4.5 w-4.5 text-brand fill-white" title="ID Verification Approved" />
                      )}
                      {p.vetted && (
                        <Award className="h-4.5 w-4.5 text-accent fill-white ml-0.5" title="Vetted Operator" />
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-semibold mb-3">
                    {p.cat} &bull; {p.jobs} jobs completed
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4 grow">
                    {p.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {p.skills.slice(0, 3).map((tag) => (
                      <span key={tag} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                    {p.skills.length > 3 && (
                      <span className="text-[9px] font-bold text-slate-400 self-center">
                        +{p.skills.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Pricing Footer */}
                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center bg-slate-50 -mx-4 -mb-4 p-4 mt-auto">
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="h-4 w-4 fill-amber-500" />
                      <span>{p.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10.5px] text-slate-400 font-medium">starting at</div>
                      <div className="text-sm font-black text-slate-800">
                        {p.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border rounded-3xl p-16 text-center max-w-xl mx-auto shadow-xs my-8 border-slate-200">
            <div className="text-5xl mb-4 font-sans">🔍</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Campus Providers Found</h3>
            <p className="text-sm text-slate-500 mb-6">We couldn't find any student listings matching your filters or search term "{searchQuery}". Give it another try!</p>
            <button
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); }}
              className="cursor-pointer btn-accessible-primary rounded-xl px-5 py-2.5 text-sm font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
