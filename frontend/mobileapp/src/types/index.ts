export type UserRole = 
  | 'role-selection' 
  | 'customer' 
  | 'worker' 
  | 'coop-manager' 
  | 'languages' 
  | 'help-center';

export type BackendRole = 'CUSTOMER' | 'WORKER' | 'COOPERATIVE_MANAGER' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: BackendRole;
  status?: string;
  languagePreference?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  skills?: string;
  experienceYears?: number;
  hourlyRate?: number;
  verificationStatus?: string;
  affiliationStatus?: string;
  primaryCooperativeId?: string;
  primaryCooperativeName?: string;
  welfareMemberId?: string;
  insurancePolicyNumber?: string;
  managedCooperativeId?: string;
  managedCooperativeName?: string;
  designation?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn?: number;
  user: UserProfile;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface CooperativeItem {
  id: string;
  name: string;
  registrationNumber: string;
  region: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  commissionRate: number;
  welfareFundBalance: number;
  insuranceSchemeDetails: string;
  isActive: boolean;
}

export interface MembershipItem {
  id: string;
  workerId: string;
  workerName: string;
  workerSkills?: string;
  cooperativeId: string;
  cooperativeName: string;
  joinDate: string;
  membershipNumber?: string;
  status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'EXPIRED';
  requestNotes?: string;
  rejectionReason?: string;
}
