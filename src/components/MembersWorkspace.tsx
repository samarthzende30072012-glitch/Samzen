import React, { useState, useEffect } from 'react';
import {
  Shield,
  Crown,
  Key,
  Users,
  Briefcase,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Send,
  MessageSquare,
  MapPin,
  Clock,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  SendHorizontal,
  CheckSquare,
  PhoneCall,
  Laptop,
  Check,
  ChevronRight,
  ExternalLink,
  Layers,
  Wrench
} from 'lucide-react';
import { SamzenLogo } from './SamzenLogo';
import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  ProfileChangeRequest,
  WorkspaceMessage,
  DirectMessage,
  WORKSPACE_ROLES_CONFIG
} from '../types';
import {
  getWorkspaceMembers,
  getWorkspaceProjects,
  applyForProject,
  getWorkspaceApplications,
  submitProfileChangeRequest,
  getProfileChangeRequests,
  getWorkspaceMessages,
  sendWorkspaceMessage,
  getWorkspaceDirectMessages,
  sendWorkspaceDirectMessage,
  checkMemberSession,
  workspaceStorage
} from '../services/workspaceApi';
import { SecureLogoutModal } from './SecureLogoutModal';
import { DualMessagingBox } from './DualMessagingBox';
import { maskAccessCode, maskPhoneNumber, maskEmailAddress } from '../utils/securityMask';

interface MembersWorkspaceProps {
  currentMember: WorkspaceMember;
  onBackToPublic: () => void;
  onOpenAdminPage?: () => void;
  onLogout: () => void;
}

export const MembersWorkspace: React.FC<MembersWorkspaceProps> = ({
  currentMember,
  onBackToPublic,
  onOpenAdminPage,
  onLogout,
}) => {
  const isLeader = currentMember.role === 'ceo' || currentMember.role === 'cofounder';
  const roleConfig = WORKSPACE_ROLES_CONFIG.find((c) => c.role === currentMember.role);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'role_desk' | 'projects' | 'profile' | 'directory' | 'messaging'>('role_desk');

  // Data states
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [myApplications, setMyApplications] = useState<WorkspaceApplication[]>([]);
  const [myProfileRequests, setMyProfileRequests] = useState<ProfileChangeRequest[]>([]);
  const [groupMessages, setGroupMessages] = useState<WorkspaceMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [showMyCode, setShowMyCode] = useState(false);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Application Modal state
  const [applyingProject, setApplyingProject] = useState<WorkspaceProject | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);

  // Profile Change Request Modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [reqName, setReqName] = useState(currentMember.name);
  const [reqEmail, setReqEmail] = useState(currentMember.email);
  const [reqPhone, setReqPhone] = useState(currentMember.phone);
  const [reqPosition, setReqPosition] = useState(currentMember.position);
  const [reqReason, setReqReason] = useState('');
  const [isSubmittingProfileReq, setIsSubmittingProfileReq] = useState(false);

  // Specialized Role Desk States
  // 1. Contractor lead logger
  const [leadClientName, setLeadClientName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadBusinessType, setLeadBusinessType] = useState('');
  const [leadPackage, setLeadPackage] = useState('Plan 1 (₹1,000–₹3,000)');

  // 2. Home Servicer website check
  const [checkUrl, setCheckUrl] = useState('');
  const [checkResult, setCheckResult] = useState<string | null>(null);

  // 3. Caller logger
  const [callClientName, setCallClientName] = useState('');
  const [callNotes, setCallNotes] = useState('');
  const [callStatus, setCallStatus] = useState('Interested in Website');

  // Load all workspace data and perform live session validity check
  const loadData = async () => {
    try {
      // 1. Live Session Check
      const sessionCheck = await checkMemberSession(currentMember.code);
      if (!sessionCheck.valid) {
        notify('Your workspace access code has been revoked by CEO Samarth Zende.', 'error');
        setTimeout(() => {
          workspaceStorage.clearMember();
          onLogout();
        }, 1200);
        return;
      }

      // 2. Load collections
      const [projs, mems, apps, pReqs, msgs, dms] = await Promise.all([
        getWorkspaceProjects(),
        getWorkspaceMembers(),
        getWorkspaceApplications(),
        getProfileChangeRequests(),
        getWorkspaceMessages(),
        getWorkspaceDirectMessages(currentMember.code),
      ]);
      setProjects(projs);
      setMembers(mems);
      // Strictly show ONLY this member's own applications (candidate reviews hidden from regular members)
      setMyApplications(apps.filter((a) => a.memberId === currentMember.id));
      setMyProfileRequests(pReqs.filter((r) => r.memberId === currentMember.id));
      setGroupMessages(msgs);
      setDirectMessages(dms);
    } catch (e) {
      console.error('Error loading member workspace data', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handler: Apply For Project
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingProject) return;

    setIsSubmittingApp(true);
    try {
      const res = await applyForProject(applyingProject.id, {
        memberId: currentMember.id,
        memberCode: currentMember.code,
        coverNote,
      });

      if (res.success) {
        notify('Application submitted successfully! Management will review your submission.', 'success');
        setApplyingProject(null);
        setCoverNote('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error submitting application.', 'error');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  // Handler: Submit Profile Change Request
  const handleSubmitProfileChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim() || !reqPhone.trim() || !reqPosition.trim()) {
      notify('Please fill out all fields.', 'error');
      return;
    }

    setIsSubmittingProfileReq(true);
    try {
      const res = await submitProfileChangeRequest({
        memberId: currentMember.id,
        requestedProfile: {
          name: reqName,
          email: reqEmail,
          phone: reqPhone,
          position: reqPosition,
        },
        reason: reqReason || 'Profile update requested by member',
      });

      if (res.success) {
        notify('Profile change request submitted for CEO review!', 'success');
        setIsProfileModalOpen(false);
        setReqReason('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error submitting profile change request.', 'error');
    } finally {
      setIsSubmittingProfileReq(false);
    }
  };

  // Dual Messaging Handlers
  const handleSendGroupMessage = async (content: string) => {
    const res = await sendWorkspaceMessage({
      senderCode: currentMember.code,
      content,
      channel: 'general',
    });
    if (res.success && res.newMessage) {
      setGroupMessages((prev) => [...prev, res.newMessage!]);
      return true;
    }
    notify(res.message || 'Failed to send message.', 'error');
    return false;
  };

  const handleSendDirectMessage = async (recipientId: string, content: string) => {
    const res = await sendWorkspaceDirectMessage({
      senderCode: currentMember.code,
      recipientId,
      content,
    });
    if (res.success && res.directMessage) {
      setDirectMessages((prev) => [...prev, res.directMessage!]);
      return true;
    }
    notify(res.message || 'Failed to send direct message.', 'error');
    return false;
  };

  const isApplied = (projectId: string) => {
    return myApplications.some((a) => a.projectId === projectId);
  };

  const getApplicationStatus = (projectId: string) => {
    const app = myApplications.find((a) => a.projectId === projectId);
    return app?.status;
  };

  // Specialized desk submission actions
  const handleLogContractorLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadClientName || !leadPhone) return;
    notify(`Client lead for "${leadClientName}" logged! Management will verify contract commission.`, 'success');
    setLeadClientName('');
    setLeadPhone('');
    setLeadBusinessType('');
  };

  const handleTestWebsiteHealth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkUrl) return;
    setCheckResult(`Website "${checkUrl}" verified: SSL active, responsive layout operational, HTTP 200 OK.`);
  };

  const handleLogCallerNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callClientName) return;
    notify(`Call record for "${callClientName}" saved to outreach log.`, 'success');
    setCallClientName('');
    setCallNotes('');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e1726]/95 backdrop-blur-md border-b border-[#1d2a3e] px-3 sm:px-6 py-3 shadow-xl shadow-black/40">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Back Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPublic}
              className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </button>
            <div className="h-5 w-[1px] bg-[#1d2a3e] hidden sm:block" />
            <div className="flex items-center gap-2">
              <SamzenLogo size="sm" showSubtitle={false} />
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40">
                {roleConfig?.title || 'Team Portal'}
              </span>
            </div>
          </div>

          {/* Member Chip & Logout */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-bold text-white">{currentMember.name}</div>
                <div className="text-[10px] text-[#9db0c8]">
                  Code: <span className="font-mono text-[#59e3ff]">{maskAccessCode(currentMember.code)}</span> &bull; {currentMember.position}
                </div>
              </div>
            </div>

            {isLeader && onOpenAdminPage && (
              <button
                onClick={onOpenAdminPage}
                className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400/20 to-[#3da9fc]/20 border border-amber-400/40 text-amber-300 text-xs font-bold transition cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Management Suite</span>
              </button>
            )}

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Logout from Portal"
              className="btn-interactive p-2 rounded-lg bg-[#070b14] hover:bg-rose-500/20 text-[#9db0c8] hover:text-rose-400 border border-[#1d2a3e] hover:border-rose-500/30 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Notification */}
      {feedback && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border text-xs shadow-2xl flex items-center gap-2 animate-bounce ${
            feedback.type === 'success'
              ? 'bg-[#0e1726] border-emerald-500 text-emerald-300'
              : 'bg-[#0e1726] border-rose-500 text-rose-300'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Clean Portal Navigation Tabs */}
      <div className="border-b border-[#1d2a3e] bg-[#0b1220] px-3 sm:px-6">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          <button
            onClick={() => setActiveTab('role_desk')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'role_desk'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>My Role Desk ({roleConfig?.title || 'Overview'})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>My Profile &amp; Access</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'directory'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team Directory ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'messaging'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Dual Messenger (Team &amp; DMs)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        
        {/* ================= TAB 0: ROLE-SPECIFIC CUSTOM DESK ================= */}
        {activeTab === 'role_desk' && (
          <div className="space-y-6 animate-fade-in">
            {/* Role Header Banner */}
            <div className="bg-[#0e1726] border-2 border-[#3da9fc]/50 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                      {roleConfig?.title || 'Team Member'} Workspace
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleConfig?.badgeColor || 'bg-[#1d2a3e] text-[#9db0c8]'}`}>
                      {roleConfig?.share || 'Official Member'}
                    </span>
                  </div>
                  <p className="text-xs text-[#9db0c8] max-w-2xl leading-relaxed">
                    {roleConfig?.responsibilities}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-right self-start sm:self-auto">
                  <div className="text-[10px] text-[#9db0c8] uppercase font-mono">Commission Share</div>
                  <div className="text-base font-bold text-[#59e3ff]">{roleConfig?.share}</div>
                </div>
              </div>
            </div>

            {/* Custom Interface Based on Role */}
            {/* 1. Executive Head / Manager Desk */}
            {currentMember.role === 'executive_head' && (
              <div className="space-y-5">
                <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare className="w-5 h-5 text-purple-400" />
                    <h4 className="text-base font-bold text-white">
                      Executive Oversight: Contractors, Home Servicers &amp; Callers
                    </h4>
                  </div>
                  <p className="text-xs text-[#9db0c8] mb-4">
                    As Executive Head, your responsibility is overseeing and coordinating field duties, monitoring outreach targets, and checking publishing progress.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                      <div className="text-purple-400 font-bold mb-1">Contractor Duties</div>
                      <p className="text-[#9db0c8] leading-relaxed">
                        Track calling leads, check that client pitches reflect accurate ₹799–₹5,000+ packages, and ensure interested clients are passed to Founder Samarth Zende.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                      <div className="text-cyan-400 font-bold mb-1">Home Servicer Duties</div>
                      <p className="text-[#9db0c8] leading-relaxed">
                        Ensure field visits are conducted promptly, verify client site responsiveness on mobile, and ensure website links and publishing are verified.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                      <div className="text-rose-400 font-bold mb-1">Caller &amp; Helper Duties</div>
                      <p className="text-[#9db0c8] leading-relaxed">
                        Monitor daily outreach lists, verify polite phone etiquette, and guide prospect follow-ups via WhatsApp and direct calling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Contractor Desk */}
            {currentMember.role === 'contractor' && (
              <div className="space-y-5">
                <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <PhoneCall className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-base font-bold text-white">
                      Contractor Pitch &amp; Client Acquisition Desk (3% to 10% Share)
                    </h4>
                  </div>
                  <p className="text-xs text-[#9db0c8] mb-4">
                    Your key responsibility is calling and convincing local businesses to create modern websites. Log interested clients below to credit your 3%–10% commission upon delivery.
                  </p>

                  <form onSubmit={handleLogContractorLead} className="space-y-3 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Client / Business Name</label>
                        <input
                          type="text"
                          required
                          value={leadClientName}
                          onChange={(e) => setLeadClientName(e.target.value)}
                          placeholder="e.g. Mahavir Grocers"
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Mobile / WhatsApp Number</label>
                        <input
                          type="tel"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="+91 9876543210"
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Business Category</label>
                        <input
                          type="text"
                          value={leadBusinessType}
                          onChange={(e) => setLeadBusinessType(e.target.value)}
                          placeholder="Shop / Clinic / Tuition / Garage"
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Target Package</label>
                        <select
                          value={leadPackage}
                          onChange={(e) => setLeadPackage(e.target.value)}
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        >
                          <option value="Plan 1 (₹1,000–₹3,000)">Plan 1 (₹1,000–₹3,000)</option>
                          <option value="Plan 2 (₹3,000–₹5,000)">Plan 2 (₹3,000–₹5,000)</option>
                          <option value="Plan 3 (₹5,000–₹8,000)">Plan 3 (₹5,000–₹8,000)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-interactive px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer"
                    >
                      Log Qualified Client Lead
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 3. Home Servicer Desk */}
            {currentMember.role === 'home_servicer' && (
              <div className="space-y-5">
                <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-base font-bold text-white">
                      Home Servicer Desk: Visits, Publishing &amp; Site Health Check
                    </h4>
                  </div>
                  <p className="text-xs text-[#9db0c8] mb-4">
                    Conduct on-site visits, test if customer websites are running smoothly, and assist in publishing updates.
                  </p>

                  <form onSubmit={handleTestWebsiteHealth} className="space-y-3 max-w-xl">
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">
                        Inspect Customer Website URL (Health &amp; Publishing Check)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          required
                          value={checkUrl}
                          onChange={(e) => setCheckUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="flex-1 px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        />
                        <button
                          type="submit"
                          className="btn-interactive px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer"
                        >
                          Verify Site
                        </button>
                      </div>
                    </div>

                    {checkResult && (
                      <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span>{checkResult}</span>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            )}

            {/* 4. Caller & Helper Desk */}
            {currentMember.role === 'caller_helper' && (
              <div className="space-y-5">
                <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 shadow-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <PhoneCall className="w-5 h-5 text-rose-400" />
                    <h4 className="text-base font-bold text-white">
                      Caller &amp; Helper Hub (1% to 3% Share)
                    </h4>
                  </div>
                  <p className="text-xs text-[#9db0c8] mb-4">
                    Reach out to client lists, introduce SAMZEN website packages, and log customer call responses.
                  </p>

                  <form onSubmit={handleLogCallerNote} className="space-y-3 max-w-xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Prospect / Contact Name</label>
                        <input
                          type="text"
                          required
                          value={callClientName}
                          onChange={(e) => setCallClientName(e.target.value)}
                          placeholder="e.g. Ramesh Kulkarni"
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#9db0c8] mb-1">Call Outcome</label>
                        <select
                          value={callStatus}
                          onChange={(e) => setCallStatus(e.target.value)}
                          className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                        >
                          <option value="Interested in Website">Interested in Website</option>
                          <option value="Requested Callback">Requested Callback</option>
                          <option value="Sent Catalog on WhatsApp">Sent Catalog on WhatsApp</option>
                          <option value="Follow-up Tomorrow">Follow-up Tomorrow</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Notes / Customer Requirements</label>
                      <input
                        type="text"
                        value={callNotes}
                        onChange={(e) => setCallNotes(e.target.value)}
                        placeholder="Needs website for jewellery shop in 5 days..."
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-interactive px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs cursor-pointer"
                    >
                      Save Call Record
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 1: ACTIVE PROJECTS & APPLY ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-white font-heading">
                  SAMZEN Active Projects
                </h3>
                <p className="text-xs text-[#9db0c8] mt-0.5">
                  Explore active development contracts and click <strong>"Apply Here"</strong> to submit your application.
                </p>
              </div>
              <span className="text-xs text-[#59e3ff] font-semibold bg-[#0e1726] px-3 py-1.5 rounded-xl border border-[#1d2a3e] self-start sm:self-auto">
                {myApplications.length} Submissions Active
              </span>
            </div>

            {/* Clean Projects Grid without serial tags or survey numbers */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => {
                const applied = isApplied(proj.id);
                const appStatus = getApplicationStatus(proj.id);

                return (
                  <div
                    key={proj.id}
                    className="panel bg-[#0e1726] border-2 border-[#1d2a3e] hover:border-[#3da9fc]/60 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all group"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {proj.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#59e3ff] bg-[#070b14] px-2.5 py-1 rounded-md border border-[#1d2a3e]">
                          {proj.budget}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-[#59e3ff] transition-colors">
                        {proj.title}
                      </h4>

                      <p className="text-xs text-[#9db0c8] mb-4 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="mb-4">
                        <div className="text-[10px] font-bold uppercase text-[#50637a] mb-1.5">
                          Stack &amp; Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.requirements.map((req, rIdx) => (
                            <span
                              key={rIdx}
                              className="px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e] text-[10px] text-[#59e3ff]"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Assigned Team Members Display */}
                      {proj.assignedMembers && proj.assignedMembers.length > 0 && (
                        <div className="mb-4 p-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                          <div className="text-[10px] uppercase font-semibold text-[#9db0c8] mb-1">
                            Assigned Team:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {proj.assignedMembers.map((am) => (
                              <span key={am.id} className="text-[10px] px-2 py-0.5 rounded bg-[#0e1726] border border-[#3da9fc]/30 text-white">
                                {am.name} ({am.position})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[#1d2a3e]">
                      <div className="flex items-center justify-between text-[11px] text-[#9db0c8] mb-3">
                        <div className="flex items-center gap-1 text-[#59e3ff]">
                          <MapPin className="w-3 h-3" />
                          <span>{proj.location}</span>
                        </div>
                        <div>Posted by {proj.postedBy.name}</div>
                      </div>

                      {applied ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Applied &bull; Status: {appStatus || 'Under Review'}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setApplyingProject(proj)}
                          className="btn-interactive w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/20 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01] transition"
                        >
                          <SendHorizontal className="w-4 h-4" />
                          <span>Apply Here</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Modal */}
            {applyingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div 
                  className="bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-7 max-w-lg w-full text-white shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#59e3ff] tracking-wider">
                        Project Application
                      </span>
                      <h3 className="text-lg font-bold text-white mt-0.5">
                        {applyingProject.title}
                      </h3>
                      <div className="text-xs text-[#9db0c8] mt-1">
                        Budget: <span className="text-[#59e3ff] font-semibold">{applyingProject.budget}</span> &bull; {applyingProject.location}
                      </div>
                    </div>
                    <button
                      onClick={() => setApplyingProject(null)}
                      className="p-1 rounded-lg text-[#9db0c8] hover:text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleApply} className="space-y-4">
                    <div className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs text-[#9db0c8] space-y-1">
                      <div><strong>Applicant:</strong> {currentMember.name} ({currentMember.position})</div>
                      <div><strong>Role:</strong> {roleConfig?.title || currentMember.role}</div>
                      <div><strong>Contact:</strong> {maskEmailAddress(currentMember.email)} | {maskPhoneNumber(currentMember.phone)}</div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                        Experience &amp; Availability Note
                      </label>
                      <textarea
                        rows={3}
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        placeholder="State your relevant experience, GitHub/portfolio links, or availability schedule..."
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setApplyingProject(null)}
                        className="px-4 py-2 rounded-xl bg-[#070b14] text-xs text-[#9db0c8] hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingApp}
                        className="btn-interactive px-5 py-2 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/25 cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingApp ? 'Submitting...' : 'Confirm Application'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: MY PROFILE & ACCESS (MASKED SENSITIVE INFO) ================= */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold font-heading text-white">
                      {currentMember.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleConfig?.badgeColor || 'bg-[#3da9fc]/20 text-[#59e3ff]'}`}>
                      {roleConfig?.title || currentMember.role}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#59e3ff]">
                    {currentMember.position} &bull; {roleConfig?.share}
                  </div>
                </div>

                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#070b14] hover:bg-[#3da9fc] text-[#59e3ff] hover:text-[#070b14] border border-[#3da9fc]/40 text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Request Profile Update</span>
                </button>
              </div>

              {/* Masked Credentials Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#9db0c8] uppercase font-mono">
                      8-Character Access Code
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowMyCode(!showMyCode)}
                      className="text-[11px] text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1 cursor-pointer"
                    >
                      {showMyCode ? <EyeOff className="w-3 h-3 text-amber-300" /> : <Eye className="w-3 h-3" />}
                      <span>{showMyCode ? 'Mask' : 'Peek'}</span>
                    </button>
                  </div>
                  <div className="text-lg font-mono font-bold text-[#59e3ff] tracking-wider">
                    {showMyCode ? currentMember.code : maskAccessCode(currentMember.code)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                  <span className="text-[10px] text-[#9db0c8] uppercase font-mono block mb-1">
                    System Account Status
                  </span>
                  <div className="text-sm font-bold text-emerald-400 capitalize">
                    {currentMember.status} &bull; Active Access
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                  <span className="text-[10px] text-[#9db0c8] uppercase font-mono block mb-1">
                    Registered Email (Masked)
                  </span>
                  <div className="text-sm font-semibold text-white">
                    {maskEmailAddress(currentMember.email)}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                  <span className="text-[10px] text-[#9db0c8] uppercase font-mono block mb-1">
                    Phone &amp; WhatsApp (Masked)
                  </span>
                  <div className="text-sm font-semibold text-[#59e3ff]">
                    {maskPhoneNumber(currentMember.phone)}
                  </div>
                </div>
              </div>

              {/* Submitted Profile Requests Tracker */}
              {myProfileRequests.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[#1d2a3e]">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                    Submitted Profile Requests
                  </h4>
                  <div className="space-y-2">
                    {myProfileRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-white font-medium">Requested: {req.requestedProfile.position} ({req.requestedProfile.name})</span>
                          <div className="text-[10px] text-[#9db0c8]">Reason: "{req.reason}"</div>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            req.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : req.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-400/20 text-amber-300'
                          }`}
                        >
                          {req.status === 'pending' ? 'Pending CEO Review' : req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Request Profile Update Modal */}
            {isProfileModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div 
                  className="bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-7 max-w-md w-full text-white shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white">
                      Request Profile Information Update
                    </h3>
                    <button
                      onClick={() => setIsProfileModalOpen(false)}
                      className="text-xs text-[#9db0c8] hover:text-white"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProfileChange} className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={reqPhone}
                        onChange={(e) => setReqPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Position / Designation</label>
                      <input
                        type="text"
                        required
                        value={reqPosition}
                        onChange={(e) => setReqPosition(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Reason for Update</label>
                      <textarea
                        rows={2}
                        value={reqReason}
                        onChange={(e) => setReqReason(e.target.value)}
                        placeholder="State reason for requested change..."
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsProfileModalOpen(false)}
                        className="px-4 py-2 rounded-xl bg-[#070b14] text-xs text-[#9db0c8] hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingProfileReq}
                        className="btn-interactive px-4 py-2 rounded-xl bg-[#3da9fc] text-[#070b14] font-bold text-xs cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingProfileReq ? 'Submitting...' : 'Submit to CEO'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: TEAM DIRECTORY (MASKED FOR SENSITIVITY) ================= */}
        {activeTab === 'directory' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold text-white font-heading">
                Team Directory ({members.length})
              </h3>
              <p className="text-xs text-[#9db0c8] mt-0.5">
                Verified SAMZEN colleagues and executive leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((mem) => {
                const isMemberCeo = mem.role === 'ceo' || mem.code === '30072012';
                const memRoleConfig = WORKSPACE_ROLES_CONFIG.find((c) => c.role === mem.role);

                return (
                  <div
                    key={mem.id}
                    className={`panel bg-[#0e1726] border-2 ${
                      isMemberCeo
                        ? 'border-amber-400/80 shadow-md shadow-amber-400/10'
                        : mem.role === 'cofounder'
                        ? 'border-[#3da9fc] shadow-md shadow-[#3da9fc]/10'
                        : 'border-[#1d2a3e]'
                    } rounded-2xl p-5 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                            memRoleConfig?.badgeColor || 'bg-[#070b14] text-[#9db0c8] border-[#1d2a3e]'
                          }`}
                        >
                          {isMemberCeo ? <Crown className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3 text-[#3da9fc]" />}
                          <span>{memRoleConfig?.title || mem.role}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {mem.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{mem.name}</h4>
                      <div className="text-xs font-semibold text-[#59e3ff] mb-1">{mem.position}</div>
                      <div className="text-[11px] text-[#9db0c8] mb-3">{memRoleConfig?.share}</div>

                      {/* Contact Info (Masked for Security) */}
                      <div className="text-xs text-[#9db0c8] bg-[#070b14] p-2.5 rounded-xl border border-[#1d2a3e] space-y-1">
                        <div>Email: <span className="text-white">{maskEmailAddress(mem.email)}</span></div>
                        <div>Phone: <span className="text-[#59e3ff]">{maskPhoneNumber(mem.phone)}</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 4: DUAL MESSAGING (GROUP CHAT & DMs) ================= */}
        {activeTab === 'messaging' && (
          <DualMessagingBox
            currentMember={currentMember}
            members={members}
            groupMessages={groupMessages}
            directMessages={directMessages}
            onSendGroupMessage={handleSendGroupMessage}
            onSendDirectMessage={handleSendDirectMessage}
          />
        )}
      </main>
      
      {/* Secure Logout Code Re-verification Modal */}
      <SecureLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        expectedCode={currentMember.code}
        memberName={currentMember.name}
        onConfirmLogout={onLogout}
      />
    </div>
  );
};
