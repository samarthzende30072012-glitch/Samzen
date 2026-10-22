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
  limitations?: string[];
  suitableFor: string;
  domainRule?: string;
  brandingRule?: string;
  sponsorshipRule?: string;
}

export interface SponsorshipPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  priceNum: number;
  featured?: boolean;
  benefits: string[];
}

export interface WorkRole {
  id: string;
  title: string;
  badge: string;
  payout: string;
  description: string;
  responsibilities: string[];
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

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  tagline: string;
  planUsed: string;
  price: string;
  deliveryDays: string;
  features: string[];
  mockStats: { label: string; value: string }[];
  colorTheme: string;
  gradient: string;
  demoUrl?: string;
  previewHeroTitle: string;
  previewDescription: string;
  previewCta: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  businessName: string;
  businessType: string;
  location: string;
  rating: number;
  text: string;
  plan: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface WebsiteEnquiryPayload {
  fullName: string;
  businessName: string;
  mobileNumber: string;
  email: string;
  websiteType: string;
  otherWebsiteType?: string;
  preferredPlan: string;
  planPrice: string;
  requiredFeatures: string[];
  additionalRequirements: string;
  preferredContactMethod: 'WhatsApp' | 'Email' | 'Both';
  _hp?: string;
}

export interface WebsiteEnquiryResponse {
  success: boolean;
  message: string;
  enquiry?: {
    id: string;
    fullName: string;
    businessName: string;
    mobileNumber: string;
    email: string;
    websiteType: string;
    preferredPlan: string;
    planPrice: string;
    requiredFeatures: string[];
    additionalRequirements: string;
    preferredContactMethod: string;
    createdAt: string;
    status: string;
  };
  whatsappUrl: string;
  directGmailUrl: string;
  emailSent?: boolean;
  emailError?: string | null;
  smtpConfigured?: boolean;
}

export type WorkspaceRole = 'ceo' | 'cofounder' | 'member';

export interface WorkspaceMember {
  id: string;
  code: string; // 8-digit numeric access code
  name: string;
  email: string;
  phone: string;
  position: string;
  role: WorkspaceRole;
  status: 'active' | 'suspended';
  createdAt: string;
  createdById?: string;
  avatarUrl?: string;
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  budget: string;
  status: 'open' | 'in_progress' | 'completed';
  postedBy: {
    id?: string;
    name: string;
    role: WorkspaceRole;
    position: string;
  };
  createdAt: string;
  applicantCount: number;
}

export interface WorkspaceApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberPosition: string;
  coverNote: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  appliedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface MemberCreationRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  requestedBy: {
    id: string;
    name: string;
    role: WorkspaceRole;
  };
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  generatedCode?: string;
  reviewedAt?: string;
}

export interface ProfileChangeRequest {
  id: string;
  memberId: string;
  currentProfile: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  requestedProfile: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
}

export interface WorkspaceMessage {
  id: string;
  senderId: string;
  senderCode?: string;
  senderName: string;
  senderRole: WorkspaceRole;
  senderPosition: string;
  content: string;
  channel: string;
  timestamp: string;
}

