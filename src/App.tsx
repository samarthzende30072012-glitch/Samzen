import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickTaskBar } from './components/QuickTaskBar';
import { FounderCEO } from './components/FounderCEO';
import { About } from './components/About';
import { AboutLeadership } from './components/AboutLeadership';
import { NetworkValuation } from './components/NetworkValuation';
import { FeaturedPartner } from './components/FeaturedPartner';
import { GoogleDriveManager } from './components/GoogleDriveManager';
import { Services } from './components/Services';
import { Pricing } from './components/Pricing';
import { SponsorPortal } from './components/SponsorPortal';
import { WorkWithSamzen } from './components/WorkWithSamzen';
import { AIKnowledgeEngine } from './components/AIKnowledgeEngine';
import { WorkProcess } from './components/WorkProcess';
import { ServicePolicy } from './components/ServicePolicy';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AccountDashboard } from './components/AccountDashboard';
import { Chatbot } from './components/Chatbot';
import { CreateWebsiteModal } from './components/CreateWebsiteModal';
import { TimedSponsorModal } from './components/TimedSponsorModal';
import { ClickRippleManager } from './components/ClickRippleManager';
import { AccessCodeAuthModal } from './components/AccessCodeAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MembersWorkspace } from './components/MembersWorkspace';
import { SecureLogoutModal } from './components/SecureLogoutModal';
import { authStorage } from './services/api';
import { workspaceStorage, checkMemberSession } from './services/workspaceApi';
import { testFirestoreConnection } from './services/firestoreService';
import { User, WorkspaceMember } from './types';
import { CheckCircle2, MessageSquare, Shield, Crown } from 'lucide-react';
import { SAMZEN_BRAND } from './assets/samzenBranding';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaceMember, setWorkspaceMember] = useState<WorkspaceMember | null>(null);
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'members'>('public');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [workspaceAuthOpen, setWorkspaceAuthOpen] = useState(false);
  const [workspaceLogoutModalOpen, setWorkspaceLogoutModalOpen] = useState(false);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [createWebsiteModalOpen, setCreateWebsiteModalOpen] = useState(false);
  const [timedAdModalOpen, setTimedAdModalOpen] = useState(false);
  const [selectedPlanForEnquiry, setSelectedPlanForEnquiry] = useState<string | undefined>(undefined);
  const [selectedCategoryForEnquiry, setSelectedCategoryForEnquiry] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<string | null>(null);
  const { t } = useLanguage();

  // Load existing sessions on mount and test Firestore connectivity
  useEffect(() => {
    testFirestoreConnection();
    
    // Public user session
    const savedUser = authStorage.getUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }

    // Workspace member session (8-digit authenticated)
    const savedMember = workspaceStorage.getMember();
    if (savedMember) {
      setWorkspaceMember(savedMember);
    }
  }, []);

  // Live Member Removal Sync: Periodically verify session with database
  // If CEO removes the member from directory, session is terminated immediately
  useEffect(() => {
    if (!workspaceMember) return;
    
    const interval = setInterval(async () => {
      try {
        const res = await checkMemberSession(workspaceMember.code);
        if (!res.valid) {
          workspaceStorage.clearMember();
          setWorkspaceMember(null);
          setCurrentView('public');
          setWorkspaceLogoutModalOpen(false);
          showNotification('Notice: Your workspace member access has been removed or revoked by the CEO.');
        }
      } catch (e) {
        // network issue, keep session
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [workspaceMember]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showNotification(`Welcome back, ${user.name}! Your account is verified.`);
  };

  const handleLogout = () => {
    authStorage.clearUser();
    setCurrentUser(null);
    showNotification('You have been logged out from your client account.');
  };

  const handleWorkspaceLoginSuccess = (member: WorkspaceMember) => {
    setWorkspaceMember(member);
    workspaceStorage.setMember(member);
    if (member.role === 'ceo' || member.role === 'cofounder') {
      setCurrentView('admin');
      showNotification(`Welcome ${member.name}! Admin Suite active.`);
    } else {
      setCurrentView('members');
      showNotification(`Welcome ${member.name}! Members Workspace active.`);
    }
  };

  const handleWorkspaceLogout = () => {
    workspaceStorage.clearMember();
    setWorkspaceMember(null);
    setCurrentView('public');
    showNotification('Workspace session ended.');
  };

  const handleOpenCreateWebsite = (planId?: string, category?: string) => {
    setSelectedPlanForEnquiry(planId);
    setSelectedCategoryForEnquiry(category);
    setCreateWebsiteModalOpen(true);
  };

  const handleSelectPlan = (planId: string, _planName: string) => {
    handleOpenCreateWebsite(planId);
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If in Full-Screen Admin Page
  if (currentView === 'admin' && workspaceMember) {
    return (
      <>
        <ClickRippleManager />
        <AdminDashboard
          currentMember={workspaceMember}
          onBackToPublic={() => setCurrentView('public')}
          onOpenMembersPage={() => setCurrentView('members')}
          onLogout={handleWorkspaceLogout}
        />
      </>
    );
  }

  // If in Full-Screen Members Page
  if (currentView === 'members' && workspaceMember) {
    return (
      <>
        <ClickRippleManager />
        <MembersWorkspace
          currentMember={workspaceMember}
          onBackToPublic={() => setCurrentView('public')}
          onOpenAdminPage={
            workspaceMember.role === 'ceo' || workspaceMember.role === 'cofounder'
              ? () => setCurrentView('admin')
              : undefined
          }
          onLogout={handleWorkspaceLogout}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff] w-full overflow-x-hidden relative">
      {/* Global Interactive Click Ripple Feedback */}
      <ClickRippleManager />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl bg-[#0e1726] border border-[#3da9fc] text-white text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#59e3ff] flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Quick Action Button for WhatsApp */}
      <a
        href={SAMZEN_BRAND.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="btn-interactive fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black shadow-2xl shadow-[#25D366]/40 transition duration-300 hover:scale-110 flex items-center justify-center animate-ripple"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/30 animate-ping -z-10" />
        <MessageSquare className="w-6 h-6" />
      </a>

      {/* Floating Workspace Quick Launch (when logged in as team member) */}
      {workspaceMember && (
        <button
          onClick={() =>
            setCurrentView(
              workspaceMember.role === 'ceo' || workspaceMember.role === 'cofounder'
                ? 'admin'
                : 'members'
            )
          }
          className="btn-interactive fixed bottom-6 right-20 z-40 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-2xl shadow-[#3da9fc]/30 flex items-center gap-2 hover:scale-105 transition cursor-pointer"
        >
          {workspaceMember.role === 'ceo' ? (
            <Crown className="w-4 h-4 text-[#070b14]" />
          ) : (
            <Shield className="w-4 h-4 text-[#070b14]" />
          )}
          <span>{workspaceMember.role === 'ceo' ? 'Open Admin Suite' : 'Open Workspace'}</span>
        </button>
      )}

      {/* Top Navbar with Language Selector, Workspace link, and Create Website CTA (Smooth single header) */}
      <Navbar
        currentUser={currentUser}
        currentWorkspaceMember={workspaceMember}
        onOpenAuth={handleOpenAuth}
        onOpenWorkspaceAuth={() => setWorkspaceAuthOpen(true)}
        onOpenWorkspacePage={() =>
          setCurrentView(
            workspaceMember?.role === 'ceo' || workspaceMember?.role === 'cofounder'
              ? 'admin'
              : 'members'
          )
        }
        onOpenAccount={() => setAccountModalOpen(true)}
        onOpenServiceModal={() => setAccountModalOpen(true)}
        onOpenCreateWebsite={() => handleOpenCreateWebsite()}
        onLogout={handleLogout}
        onWorkspaceLogout={() => setWorkspaceLogoutModalOpen(true)}
      />

      {/* Main Sections */}
      <main className="flex-1">
        {/* 1. Hero with Founder & Company Net Worth (₹1,15,237) shown first */}
        <Hero
          onExplorePlans={scrollToPricing}
          onOpenAuth={handleOpenAuth}
          onOpenCreateWebsite={() => handleOpenCreateWebsite()}
        />

        {/* 2. Direct Vertical Task Bar & Services Directory (Smooth vertical stack - NO side-swiping) */}
        <QuickTaskBar
          currentWorkspaceMember={workspaceMember}
          onOpenWorkspaceAuth={() => setWorkspaceAuthOpen(true)}
          onOpenAdmin={() => setCurrentView('admin')}
          onOpenMembers={() => setCurrentView('members')}
          onOpenCreateWebsite={() => handleOpenCreateWebsite()}
        />

        {/* 3. Founder & CEO Showcase (Mr. Samarth Zende - 100% Owner) */}
        <FounderCEO />

        {/* 4. Condensed About & Leadership */}
        <About />
        <AboutLeadership />

        {/* 5. Comprehensive Network Valuation & Breakdown */}
        <NetworkValuation />

        {/* 6. Featured Strategic Partner (Pro Trading Course) */}
        <FeaturedPartner />

        {/* 7. Google Drive & Docs Asset Center */}
        <GoogleDriveManager />

        {/* 8. Development Services & Custom Capabilities */}
        <Services onSelectCategory={(cat) => handleOpenCreateWebsite(undefined, cat)} />

        {/* 9. Transparent Pricing Plans (From ₹799) */}
        <Pricing onSelectPlan={handleSelectPlan} />

        {/* 10. Commercial Sponsorship & Ad Booking (From ₹49) */}
        <SponsorPortal />

        {/* 11. Work With Samzen (25% Commission Roles) */}
        <WorkWithSamzen />

        {/* 12. SAMZEN AI Knowledge Engine */}
        <AIKnowledgeEngine />

        {/* 13. Work Process & Milestones */}
        <WorkProcess />

        {/* 14. Service Policy (Free Support & ₹199 maintenance) */}
        <ServicePolicy />

        {/* 15. Contact & WhatsApp */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer onOpenSponsorAd={() => setTimedAdModalOpen(true)} />

      {/* Timed Sponsor Ad Modal (Pro Trading Course) */}
      <TimedSponsorModal
        isOpen={timedAdModalOpen ? true : undefined}
        onClose={() => setTimedAdModalOpen(false)}
      />

      {/* "Create Your Website" & "Select Your Plan" Professional Enquiry Modal */}
      <CreateWebsiteModal
        isOpen={createWebsiteModalOpen}
        onClose={() => setCreateWebsiteModalOpen(false)}
        initialPlanId={selectedPlanForEnquiry}
        initialCategory={selectedCategoryForEnquiry}
      />

      {/* 8-Digit Access Code Workspace Authentication Modal */}
      <AccessCodeAuthModal
        isOpen={workspaceAuthOpen}
        onClose={() => setWorkspaceAuthOpen(false)}
        onSuccess={handleWorkspaceLoginSuccess}
      />

      {/* Public Client OTP & Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Client Portal & Support Requests Modal */}
      <AccountDashboard
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* AI Customer Support Chatbot */}
      <Chatbot
        onOpenPricing={scrollToPricing}
        onOpenContact={() => {
          const el = document.getElementById('contact');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
      />

      {/* Secure Workspace Logout Re-Verification Modal */}
      {workspaceMember && (
        <SecureLogoutModal
          isOpen={workspaceLogoutModalOpen}
          onClose={() => setWorkspaceLogoutModalOpen(false)}
          expectedCode={workspaceMember.code}
          memberName={workspaceMember.name}
          onConfirmLogout={handleWorkspaceLogout}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
