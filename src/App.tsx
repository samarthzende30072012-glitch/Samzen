import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FounderCEO } from './components/FounderCEO';
import { About } from './components/About';
import { Services } from './components/Services';
import { Pricing } from './components/Pricing';
import { WorkProcess } from './components/WorkProcess';
import { ServicePolicy } from './components/ServicePolicy';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AccountDashboard } from './components/AccountDashboard';
import { Chatbot } from './components/Chatbot';
import { authStorage } from './services/api';
import { User } from './types';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import { SAMZEN_BRAND } from './assets/samzenBranding';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot_password'>('login');
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load existing session on mount
  useEffect(() => {
    const savedUser = authStorage.getUser();
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

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
    showNotification('You have been logged out.');
  };

  const handleSelectPlan = (planId: string, planName: string) => {
    if (!currentUser) {
      // Suggest login/signup so the plan attaches to their verified account
      handleOpenAuth('signup');
    } else {
      setAccountModalOpen(true);
    }
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
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
        className="fixed bottom-6 left-6 z-40 p-3.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black shadow-2xl shadow-[#25D366]/40 transition duration-300 hover:scale-110 flex items-center justify-center"
      >
        <MessageSquare className="w-6 h-6" />
      </a>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenAccount={() => setAccountModalOpen(true)}
        onOpenServiceModal={() => setAccountModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero
          onExplorePlans={scrollToPricing}
          onOpenAuth={handleOpenAuth}
        />
        <FounderCEO />
        <About />
        <Services />
        <Pricing onSelectPlan={handleSelectPlan} />
        <WorkProcess />
        <ServicePolicy />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Real OTP & Authentication Modal */}
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
    </div>
  );
}
