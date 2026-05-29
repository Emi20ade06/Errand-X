/**
 * ErrandX Types Definition
 */

export type UserRole = 'client' | 'provider' | 'both' | 'admin';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'Active' | 'Suspended' | 'Pending';
  verified: boolean;
  vetted: boolean;
  walletBalance: number;
  escrowBalance: number;
  matricNumber?: string;
  primaryCategory?: string;
  joinedDate: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  cat: string;
  emoji: string;
  rating: number;
  jobs: number;
  price: string; // e.g. "₦2,000/hr"
  priceVal: number; // e.g. 2000
  verified: boolean;
  vetted: boolean;
  bio: string;
  skills: string[];
  userId?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceProviderId: string;
  providerName: string;
  service: string;
  dateTime: string;
  location: string;
  agreedPrice: number;
  commission: number;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Disputed' | 'Cancelled';
  rating?: number;
  review?: string;
  disputeReason?: string;
  disputeDescription?: string;
  createdDate: string;
}

export interface Transaction {
  id: string;
  date: string;
  desc: string;
  type: 'Top-Up' | 'Escrow Hold' | 'Released' | 'Refunded' | 'Withdrawal';
  amount: number;
  status: 'done' | 'held' | 'refunded';
}

export interface VerificationRequest {
  id: string;
  userName: string;
  userEmail: string;
  cat: string;
  idSubmitted: string;
  matricNo: string;
  submittedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export type ActivePage = 'home' | 'browse' | 'dashboard' | 'wallet' | 'safety' | 'admin';
