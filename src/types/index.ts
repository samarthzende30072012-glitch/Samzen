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

export type WorkspaceRole = 
  | 'ceo' 
  | 'cofounder' 
  | 'executive_head' 
  | 'contractor' 
  | 'home_servicer' 
  | 'caller_helper' 
  | 'member';

export interface RoleConfig {
  role: WorkspaceRole;
  title: string;
  hierarchyRank: number;
  share: string;
  responsibilities: string;
  badgeColor: string;
}

export const WORKSPACE_ROLES_CONFIG: RoleConfig[] = [
  {
    role: 'ceo',
    title: 'Founder & CEO',
    hierarchyRank: 1,
    share: '100% Owner & Executive Direction',
    responsibilities: 'Overall company leadership, exclusive code generation, project oversight, and final approvals.',
    badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/40',
  },
  {
    role: 'cofounder',
    title: 'Co-Founder',
    hierarchyRank: 2,
    share: '10% to 20% Share',
    responsibilities: 'Finds clients and helps build websites. Submits member requests and co-manages projects.',
    badgeColor: 'bg-[#3da9fc]/20 text-[#59e3ff] border-[#3da9fc]/40',
  },
  {
    role: 'executive_head',
    title: 'Executive Head / Manager',
    hierarchyRank: 3,
    share: '10% to 15% Share',
    responsibilities: 'Oversees and handles the duties of contractors, home servicers, and callers.',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  {
    role: 'contractor',
    title: 'Contractor',
    hierarchyRank: 4,
    share: '3% to 10% Share',
    responsibilities: 'Calls and convinces people to create websites. Generates qualified client deals.',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  {
    role: 'home_servicer',
    title: 'Home Servicer',
    hierarchyRank: 5,
    share: 'Field / Service Share',
    responsibilities: 'Conducts home visits, checks if websites are working, or publishes websites.',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  {
    role: 'caller_helper',
    title: 'Caller & Helper',
    hierarchyRank: 6,
    share: '1% to 3% Share',
    responsibilities: 'Helps reach out to clients and prospects with phone calls and customer follow-ups.',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
];

export interface WorkspaceMember {
  id: string;
  code: string; // 8-character access code with symbols
  name: string;
  email: string;
  phone: string;
  position: string;
  role: WorkspaceRole;
  commissionShare?: string;
  status: 'active' | 'suspended' | 'inactive';
  contractSignedAt?: string;
  signatureDataUrl?: string;
  createdAt: string;
  createdById?: string;
  avatarUrl?: string;
  isStealthGhost?: boolean;
  isSupremeOwner?: boolean;
}

export interface ProjectAssignedMember {
  id: string;
  name: string;
  role: WorkspaceRole;
  position: string;
  assignedAt: string;
  assignedBy?: string;
}

export interface WorkspaceProject {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  budget: string;
  status: 'open' | 'in_progress' | 'completed' | 'active' | 'inactive';
  postedBy: {
    id?: string;
    name: string;
    role: WorkspaceRole;
    position: string;
  };
  createdAt: string;
  applicantCount: number;
  assignedMembers?: ProjectAssignedMember[];
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
  role?: WorkspaceRole;
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

export interface DirectMessage {
  id: string;
  senderId: string;
  senderCode?: string;
  senderName: string;
  senderRole: WorkspaceRole;
  senderPosition: string;
  recipientId: string;
  recipientName: string;
  recipientRole: WorkspaceRole;
  recipientPosition?: string;
  content: string;
  timestamp: string;
}

export type MailboxItemType =
  | 'team_application'
  | 'member_request'
  | 'project_application'
  | 'profile_change'
  | 'general_inquiry'
  | 'website_inquiry'
  | 'service_request'
  | 'permission_request';

export interface PermissionRequestPayload {
  coFounderName: string;
  coFounderCode: string;
  actionType: 'toggle_member_status' | 'edit_project' | 'change_pricing';
  targetType: 'member' | 'project';
  targetId: string;
  targetTitle: string;
  oldValue: string;
  newValue: string;
  proposedChanges: Record<string, any>;
}

export interface MailboxItem {
  id: string;
  type: MailboxItemType;
  title: string;
  senderName: string;
  senderEmail?: string;
  senderPhone?: string;
  roleApplied?: string;
  occupation?: string;
  reference?: string;
  content: string;
  details?: Record<string, any>;
  status: 'unread' | 'read' | 'reviewed' | 'approved' | 'rejected' | 'archived';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
  generatedCode?: string;
}


