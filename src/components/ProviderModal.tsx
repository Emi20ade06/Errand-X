import React from 'react';
import { ServiceProvider } from '../types';
import { X, CheckCircle, Award, Star, Briefcase, DollarSign } from 'lucide-react';

interface ProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ServiceProvider | null;
  onBookNow: (providerName: string) => void;
}

export const ProviderModal: React.FC<ProviderModalProps> = ({
  isOpen,
  onClose,
  provider,
  onBookNow,
}) => {
  if (!isOpen || !provider) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-y-auto max-h-[95vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Info Header */}
        <div className="flex items-center gap-4.5 mb-6 border-b border-slate-100 pb-5">
          <div className="h-16 w-16 bg-gradient-to-br from-brand-dark to-brand flex items-center justify-center text-3xl text-white rounded-2xl shadow-md">
            <span>{provider.emoji}</span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-display font-black text-xl text-slate-900 leading-tight">
                {provider.name}
              </h3>
              {provider.verified && (
                <CheckCircle className="h-5 w-5 text-brand fill-white shrink-0" title="Governance Checked" />
              )}
              {provider.vetted && (
                <Award className="h-5 w-5 text-accent fill-white shrink-0" title="Vetted Rep Badge" />
              )}
            </div>

            <p className="text-xs text-slate-500 font-bold mt-1">
              {provider.cat} &bull; {provider.jobs} completed tasks
            </p>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Peer Biography</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 border border-slate-150 p-4 rounded-2xl">
              "{provider.bio}"
            </p>
          </div>

          {/* Core Tested Skills list */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Vetted Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {provider.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-brand/10 border border-brand/20 text-brand text-xs font-bold px-3.5 py-1.5 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Vetted Rating banner */}
          <div className="flex items-center justify-between border-t border-b border-dashed border-slate-200 py-3.5 my-4">
            <div className="flex items-center gap-1.5">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <span className="text-base font-extrabold text-slate-900">{provider.rating.toFixed(1)} score</span>
              <span className="text-xs text-slate-400 font-medium">({provider.jobs} review ratings)</span>
            </div>
          </div>

          {/* Call-to-action Footer */}
          <div className="flex justify-between items-center pt-2 gap-4">
            <div>
              <div className="text-xs text-slate-420 font-medium leading-none">Starting Standard Rate</div>
              <div className="text-xl font-black text-slate-900 mt-1">{provider.price}</div>
            </div>

            <button
              onClick={() => {
                onClose();
                onBookNow(provider.name);
              }}
              className="cursor-pointer btn-accessible-accent rounded-xl px-6 py-3.5 text-sm font-black text-white shrink-0 flex items-center justify-center gap-1.5 shadow-md flex-1 text-center"
            >
              <Briefcase className="h-4.5 w-4.5" />
              <span>Book Operator Now</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
