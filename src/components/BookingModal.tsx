import React, { useState } from 'react';
import { ServiceProvider } from '../types';
import { X, Calendar, MapPin, Calculator, ShieldCheck, ArrowRight, ArrowLeft, CreditCard } from 'lucide-react';
import { sanitizeString, sanitizeNumber } from '../sanitizer';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProvider: ServiceProvider | null;
  onSubmitBooking: (bookingData: {
    service: string;
    dateTime: string;
    location: string;
    agreedPrice: number;
    notes: string;
  }) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedProvider,
  onSubmitBooking,
}) => {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 States
  const [service, setService] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [agreedPrice, setAgreedPrice] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Auto populating default pricing values from provider on load
  React.useEffect(() => {
    if (selectedProvider) {
      setAgreedPrice(selectedProvider.priceVal.toString());
      setService(`${selectedProvider.cat} services with ${selectedProvider.name}`);
    }
  }, [selectedProvider]);

  if (!isOpen || !selectedProvider) return null;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanService = sanitizeString(service, 150);
    const cleanLocation = sanitizeString(location, 100);

    if (!cleanService) {
      alert('What specific help or task do you need handled? Please enter valid characters.');
      return;
    }
    if (!dateTime) {
      alert('Please specify the date and time of task execution.');
      return;
    }
    if (!cleanLocation) {
      alert('Please specify the delivery campus location block or room.');
      return;
    }

    const { parsed: priceNum, isValid: priceValid } = sanitizeNumber(agreedPrice, 100, 1000000);
    if (!priceValid || priceNum <= 100) {
      alert('Negotiated escrow price must be between ₦100 and ₦1,000,000.');
      return;
    }

    // Refresh display values with cleaned variants
    setService(cleanService);
    setLocation(cleanLocation);
    setAgreedPrice(priceNum.toString());
    setStep(2);
  };

  const handleFinalPayment = () => {
    const { parsed: priceNum } = sanitizeNumber(agreedPrice, 100, 1000000);
    const cleanService = sanitizeString(service, 150);
    const cleanLocation = sanitizeString(location, 100);
    const cleanNotes = sanitizeString(notes, 500);

    onSubmitBooking({
      service: cleanService,
      dateTime,
      location: cleanLocation,
      agreedPrice: priceNum,
      notes: cleanNotes,
    });
    // Reset states
    setStep(1);
    setService('');
    setDateTime('');
    setLocation('');
    setNotes('');
  };

  const priceNum = parseFloat(agreedPrice) || selectedProvider.priceVal;
  const platformFee = Math.round(priceNum * 0.125);
  const totalDueEscrow = priceNum; // The actual escrow is held on the exact price client and provider negotiate!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl relative border border-slate-200 overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full p-1.5 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title */}
        <div className="mb-6">
          <h2 className="font-display text-2xl font-black text-slate-905">Book Campus Operator</h2>
          <p className="text-xs text-slate-500 mt-1">Book {selectedProvider.name} &bull; Service escrow is fully monitored</p>
        </div>

        {/* STEP 1: SPEC DETAILS */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="flex flex-col gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-750 uppercase mb-1.5">Deliverable Service Target</label>
              <input
                type="text"
                value={service}
                onChange={(e) => setService(e.target.value)}
                placeholder="e.g. Help with Land Law homework, Screen repairs"
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-750 uppercase mb-1.5">Schedules (Date &amp; Time)</label>
                <div className="relative flex items-center">
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full rounded-lg border-2 border-slate-200 px-3 py-2.5 text-xs focus:border-brand outline-hidden text-slate-900 font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-750 uppercase mb-1.5">Negotiated Price (₦)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(e.target.value)}
                  placeholder="₦ e.g., 3500"
                  className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-905 font-bold"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-750 uppercase mb-1.5">Service Location (Hostel Block/Room)</label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Saddler Hall, Block B Room 14"
                  className="w-full rounded-lg border-2 border-slate-200 pl-9 pr-4 py-3 text-sm focus:border-brand outline-hidden text-slate-900"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-755 uppercase mb-1.5">Extra Instructions/Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="List special materials, references or instructions here..."
                rows={2}
                className="w-full rounded-lg border-2 border-slate-200 px-4 py-2.5 text-sm focus:border-brand outline-hidden text-slate-900"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer btn-accessible-accent rounded-xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 w-full mt-2"
            >
              <span>Proceed to Escrow Checkout</span>
              <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </form>
        )}

        {/* STEP 2: PAYMENT OVERVIEW */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            {/* Payment Summary */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
              <span className="text-xs font-black uppercase text-slate-500 tracking-widest block border-b border-slate-200 pb-2">
                NUBAN Escrow Breakdown
              </span>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Negotiated Base Pay</span>
                <span className="font-bold text-slate-800">₦{priceNum.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Auto ErrandX Commission (12.5% incl.)</span>
                <span className="text-brand font-semibold">₦{platformFee.toLocaleString()}</span>
              </div>

              <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-base">
                <span className="font-bold text-slate-900">Total Upfront Held Escrow</span>
                <span className="font-black text-emerald-600 text-lg">₦{totalDueEscrow.toLocaleString()}</span>
              </div>
            </div>

            {/* Escrow Guarantee Alert Banner */}
            <div className="bg-[#EEF4FF] border border-blue-200 rounded-xl p-3.5 flex gap-3 text-xs text-brand leading-relaxed">
              <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Escrow Refund Protection Guarantee</span>
                <span>These funds are paid up-front but locked securely. They are disbursed to the server only when you approve completion. In dispute, funds are reversed instantly.</span>
              </div>
            </div>

            {/* Card form simulation */}
            <div className="border border-slate-200 rounded-2xl p-4 flex flex-col gap-4">
              <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-brand" />
                <span>Simulated Credit Card Credentials</span>
              </span>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Standard Card Number</label>
                <input
                  type="text"
                  placeholder="4084 0840 8408 4084"
                  defaultValue="4084 0840 8408 4084"
                  className="w-full rounded-lg border-2 border-slate-250 px-3 py-2 text-xs text-slate-800 tracking-widest font-mono font-bold outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="w-full rounded-lg border-2 border-slate-250 px-3 py-2 text-xs font-mono text-slate-850 outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-650 uppercase mb-1">CVV Pin</label>
                  <input
                    type="password"
                    placeholder="123"
                    defaultValue="123"
                    className="w-full rounded-lg border-2 border-slate-250 px-3 py-2 text-xs font-mono text-slate-850 outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Submitions */}
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={handleFinalPayment}
                className="cursor-pointer btn-accessible-accent rounded-xl py-3.5 text-sm font-bold w-full text-center"
              >
                Confirm &amp; Lock Upfront (Paystack Sandbox)
              </button>

              <button
                onClick={() => setStep(1)}
                className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-705 border border-slate-250 py-3 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Negotiation Specs</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
