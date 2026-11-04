import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Pricing } from './components/Pricing';
import { CostCalculator } from './components/CostCalculator';
import { PortfolioShowcase } from './components/PortfolioShowcase';
import { BusinessCategoriesMatrix } from './components/BusinessCategoriesMatrix';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AccountDashboard } from './components/AccountDashboard';
import { Chatbot } from './components/Chatbot';
import { CreateWebsiteModal } from './components/CreateWebsiteModal';
import { ClickRippleManager } from './components/ClickRippleManager';
import { AccessCodeAuthModal } from './components/AccessCodeAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MembersWorkspace } from './components/MembersWorkspace';
import { SecureLogoutModal } from './components/SecureLogoutModal';
import { WorkPage } from './components/WorkPage';
import { WorkWithSamzen } from './components/WorkWithSamzen';
import { authStorage } from './services/api';
import { workspaceStorage, checkMemberSession, workspaceLogout } from './services/workspaceApi';
import { testFirestoreConnection } from './services/firestoreService';
import { User, WorkspaceMember } from './types';
import { CheckCircle2, MessageSquare, Shield, Crown } from 'lucide-react';
import { SAMZEN_BRAND } from './assets/samzenBranding';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaceMember, setWorkspaceMember] = useState<WorkspaceMember | null>(null);
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'members' | 'work'>('public');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [workspaceAuthOpen, setWorkspaceAuthOpen] = useState(false);
  const [workspaceLogoutModalOpen, setWorkspaceLogoutModalOpen] = useState(false);

  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [createWebsiteModalOpen, setCreateWebsiteModalOpen] = useState(false);
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

  const handleWorkspaceLogout = async () => {
    if (workspaceMember) {
      try {
        await workspaceLogout({ memberId: workspaceMember.id, code: workspaceMember.code });
      } catch {
        // ignore
      }
    }
    workspaceStorage.clearMember();
    setWorkspaceMember(null);
    setCurrentView('public');
    showNotification('Workspace session ended & device session wiped.');
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

  // If in Full-Screen Dedicated Work Hub
  if (currentView === 'work') {
    return (
      <>
        <ClickRippleManager />
        <WorkPage
          onBackToPublic={() => setCurrentView('public')}
          onOpenWorkspaceAuth={() => setWorkspaceAuthOpen(true)}
        />
        <AccessCodeAuthModal
          isOpen={workspaceAuthOpen}
          onClose={() => setWorkspaceAuthOpen(false)}
          onSuccess={handleWorkspaceLoginSuccess}
        />
      </>
    );
  }

  return (
    <div className="main-app-wrapper min-h-[100dvh] bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff] w-screen max-w-[100vw] overflow-x-hidden relative [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
      {/* Dynamic Cohesive Cyan & Electric Blue Ambient Lighting - Confined to Avoid Mobile Overflow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 max-w-full">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] max-w-full bg-gradient-to-br from-[#00f2fe]/10 via-[#3da9fc]/8 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-[450px] h-[450px] max-w-full bg-gradient-to-bl from-[#3da9fc]/10 via-[#00f2fe]/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] max-w-full bg-gradient-to-tr from-[#0072ff]/8 via-[#00f2fe]/5 to-transparent rounded-full blur-[140px]" />
      </div>

      {/* Global Interactive Click Ripple Feedback */}
      <ClickRippleManager />

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
          className="btn-interactive fixed bottom-20 right-4 sm:bottom-6 sm:right-24 z-40 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#3da9fc] text-[#070b14] font-bold text-xs shadow-2xl shadow-[#3da9fc]/30 flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition cursor-pointer"
        >
          {workspaceMember.role === 'ceo' ? (
            <Crown className="w-4 h-4 text-[#070b14]" />
          ) : (
            <Shield className="w-4 h-4 text-[#070b14]" />
          )}
          <span>{workspaceMember.role === 'ceo' ? 'Admin Suite' : 'Workspace'}</span>
        </button>
      )}

      {/* Top Navbar: Minimalist, Trust, Dark Mode, Language Selector, Team Portal */}
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
        onOpenWorkPage={() => setCurrentView('work')}
        onLogout={handleLogout}
        onWorkspaceLogout={() => setWorkspaceLogoutModalOpen(true)}
      />

      {/* Lean, High-Converting Funnel Sections (Top to Bottom) */}
      <main className="flex-1">
        {/* 1. CLEAN FOUNDER HERO SECTION (Photo First) */}
        <Hero
          onExplorePlans={scrollToPricing}
          onOpenCreateWebsite={() => handleOpenCreateWebsite()}
        />

        {/* 2. PRICING PLANS (Directly Below Hero, starting at ₹1,999) */}
        <Pricing onSelectPlan={handleSelectPlan} />

        {/* 3. INTERACTIVE WEBSITE COST & ESTIMATE CALCULATOR */}
        <CostCalculator onSelectPlan={handleSelectPlan} />

        {/* 4. PORTFOLIO SHOWCASE COMPONENT (Screenshots & Live Previews) */}
        <PortfolioShowcase
          onSelectPlan={handleSelectPlan}
          onOpenCreateWebsite={handleOpenCreateWebsite}
        />

        {/* 5. THE 16 BUSINESS CATEGORIES (Click-to-Open Matrix) */}
        <BusinessCategoriesMatrix
          onStartWebsite={(category, planId) => handleOpenCreateWebsite(planId, category)}
        />

        {/* 6. WORK WITH SAMZEN & CAREERS PORTAL */}
        <WorkWithSamzen />

        {/* 7. CONTACT & WHATSAPP SECTION */}
        <Contact />
      </main>

      {/* Clean Footer */}
      <Footer />

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
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
