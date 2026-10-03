export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  createdAt: string;
  role?: string;
  activePlan?: string;
  supportExpiresAt?: string;
}

export interface PlanItem {
  id: string;
  num: string;
  name: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  supportDays: number;
  featured?: boolean;
  description: string;
  features: string[];
  suitableFor: string;
}

export interface ServicePolicyItem {
  number: number;
  text: string;
}

export interface WorkStep {
  number: string;
  title: string;
  description: string;
}

export interface OtpRequestResponse {
  success: boolean;
  message: string;
  targetType: 'email' | 'phone';
  targetValue: string;
  expiresInSeconds: number;
  directGmailUrl?: string;
  directWhatsappUrl?: string;
  testOtp?: string; // provided for seamless preview verification if mail server not yet configured
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  businessName: string;
  projectPlan: string;
  requestType: 'free_support' | 'paid_service';
  fee: number;
  details: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

