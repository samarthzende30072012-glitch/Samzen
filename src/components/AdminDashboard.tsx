import React, { useState, useEffect } from 'react';
import {
  Shield,
  Crown,
  Key,
  Users,
  Briefcase,
  UserPlus,
  Edit3,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowLeft,
  LogOut,
  Send,
  MessageSquare,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MapPin,
  Tag,
  DollarSign,
  ChevronRight,
  Filter
} from 'lucide-react';
import { SamzenLogo } from './SamzenLogo';
import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  MemberCreationRequest,
  ProfileChangeRequest,
  WorkspaceMessage
} from '../types';
import {
  getWorkspaceMembers,
  generateMemberCode,
  requestMemberCreation,
  getMemberCreationRequests,
  reviewMemberCreationRequest,
  updateMemberProfileMaster,
  getProfileChangeRequests,
  reviewProfileChangeRequest,
  getWorkspaceProjects,
  postWorkspaceProject,
  getWorkspaceApplications,
  updateApplicationStatus,
  getWorkspaceMessages,
  sendWorkspaceMessage,
  workspaceStorage
} from '../services/workspaceApi';

interface AdminDashboardProps {
  currentMember: WorkspaceMember;
  onBackToPublic: () => void;
  onOpenMembersPage: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentMember,
  onBackToPublic,
  onOpenMembersPage,
  onLogout,
}) => {
  const isCeo = currentMember.code === '30072012' || currentMember.role === 'ceo';
  const isCofounder = currentMember.role === 'cofounder';

  // Navigation tab inside Admin Dashboard
  const [activeTab, setActiveTab] = useState<
    'members' | 'generate_code' | 'approvals' | 'projects' | 'applications' | 'chat'
  >('projects');

  // Data states
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [applications, setApplications] = useState<WorkspaceApplication[]>([]);
  const [memberRequests, setMemberRequests] = useState<MemberCreationRequest[]>([]);
  const [profileRequests, setProfileRequests] = useState<ProfileChangeRequest[]>([]);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form states: Member Code Generation (CEO)
  const [genName, setGenName] = useState('');
  const [genEmail, setGenEmail] = useState('');
  const [genPhone, setGenPhone] = useState('');
  const [genPosition, setGenPosition] = useState('');
  const [genRole, setGenRole] = useState<'member' | 'cofounder'>('member');
  const [generatedResult, setGeneratedResult] = useState<{ member: WorkspaceMember; code: string } | null>(null);
  const [isSubmittingGen, setIsSubmittingGen] = useState(false);

  // Form states: Master Profile Edit (CEO only)
  const [editingMember, setEditingMember] = useState<WorkspaceMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPosition, setEditPosition] = useState('');

  // Form states: Post New Project
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjReqs, setNewProjReqs] = useState('');
  const [newProjLoc, setNewProjLoc] = useState('');
  const [newProjBudget, setNewProjBudget] = useState('');
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);

  // Form states: Team Chat
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Load all admin data
  const loadData = async () => {
    try {
      const [mems, projs, apps, mReqs, pReqs, msgs] = await Promise.all([
        getWorkspaceMembers(),
        getWorkspaceProjects(),
        getWorkspaceApplications(),
        getMemberCreationRequests(),
        getProfileChangeRequests(),
        getWorkspaceMessages(),
      ]);
      setMembers(mems);
      setProjects(projs);
      setApplications(apps);
      setMemberRequests(mReqs);
      setProfileRequests(pReqs);
      setMessages(msgs);
    } catch (e) {
      console.error('Error loading admin workspace data', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 6000); // Poll every 6s for fresh team activity
    return () => clearInterval(interval);
  }, []);

  const notify = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Handler: Generate Member Code (CEO ONLY)
  const handleGenerateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCeo) {
      notify('Exclusive permission: Only CEO Samarth Zende (30072012) can generate member codes.', 'error');
      return;
    }
    if (!genName.trim() || !genEmail.trim() || !genPhone.trim() || !genPosition.trim()) {
      notify('Please fill out all member details.', 'error');
      return;
    }

    setIsSubmittingGen(true);
    try {
      const res = await generateMemberCode({
        ceoCode: currentMember.code,
        name: genName,
        email: genEmail,
        phone: genPhone,
        position: genPosition,
        role: genRole,
      });

      if (res.success && res.member && res.code) {
        setGeneratedResult({ member: res.member, code: res.code });
        notify(`8-digit access code ${res.code} created for ${res.member.name}!`, 'success');
        setGenName('');
        setGenEmail('');
        setGenPhone('');
        setGenPosition('');
        loadData();
      } else {
        notify(res.message || 'Failed to generate code.', 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Server error generating code.', 'error');
    } finally {
      setIsSubmittingGen(false);
    }
  };

  // Handler: Request Member Creation (Co-Founder)
  const handleRequestMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genName.trim() || !genEmail.trim() || !genPhone.trim() || !genPosition.trim()) {
      notify('Please fill out all member details.', 'error');
      return;
    }

    setIsSubmittingGen(true);
    try {
      const res = await requestMemberCreation({
        requesterCode: currentMember.code,
        name: genName,
        email: genEmail,
        phone: genPhone,
        position: genPosition,
      });

      if (res.success) {
        notify('Member request submitted for CEO Samarth Zende review!', 'success');
        setGenName('');
        setGenEmail('');
        setGenPhone('');
        setGenPosition('');
        loadData();
      } else {
        notify(res.message || 'Failed to submit request.', 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Server error submitting request.', 'error');
    } finally {
      setIsSubmittingGen(false);
    }
  };

  // Handler: Review Member Request (CEO Only)
  const handleReviewMemberReq = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await reviewMemberCreationRequest(id, {
        ceoCode: currentMember.code,
        action,
      });
      if (res.success) {
        notify(res.message, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error processing request.', 'error');
    }
  };

  // Handler: Review Profile Change Request (CEO Only)
  const handleReviewProfileReq = async (id: string, action: 'approve' | 'reject') => {
    try {
      const res = await reviewProfileChangeRequest(id, {
        ceoCode: currentMember.code,
        action,
      });
      if (res.success) {
        notify(res.message, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error processing profile request.', 'error');
    }
  };

  // Handler: Master Edit Member Profile (CEO Only)
  const handleStartEditMember = (m: WorkspaceMember) => {
    if (!isCeo) {
      notify('Only CEO Samarth Zende has master access to edit member profiles.', 'error');
      return;
    }
    setEditingMember(m);
    setEditName(m.name);
    setEditEmail(m.email);
    setEditPhone(m.phone);
    setEditPosition(m.position);
  };

  const handleSaveMasterProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const res = await updateMemberProfileMaster(editingMember.id, {
        ceoCode: currentMember.code,
        name: editName,
        email: editEmail,
        phone: editPhone,
        position: editPosition,
      });
      if (res.success) {
        notify('Profile updated by CEO Master Control.', 'success');
        setEditingMember(null);
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Failed to update profile.', 'error');
    }
  };

  // Handler: Post New Project
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim() || !newProjLoc.trim()) {
      notify('Title, description, and location are required.', 'error');
      return;
    }

    setIsSubmittingProj(true);
    try {
      const reqList = newProjReqs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await postWorkspaceProject({
        authorCode: currentMember.code,
        title: newProjTitle,
        description: newProjDesc,
        requirements: reqList,
        location: newProjLoc,
        budget: newProjBudget || 'To be discussed',
      });

      if (res.success) {
        notify('Project posted live across all member screens!', 'success');
        setNewProjTitle('');
        setNewProjDesc('');
        setNewProjReqs('');
        setNewProjLoc('');
        setNewProjBudget('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Failed to post project.', 'error');
    } finally {
      setIsSubmittingProj(false);
    }
  };

  // Handler: Update Application Status
  const handleUpdateAppStatus = async (
    id: string,
    status: 'pending' | 'shortlisted' | 'accepted' | 'rejected'
  ) => {
    try {
      const res = await updateApplicationStatus(id, {
        reviewerCode: currentMember.code,
        status,
      });
      if (res.success) {
        notify(`Application marked as ${status}.`, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Failed to update application.', 'error');
    }
  };

  // Handler: Send Internal Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setIsSendingMsg(true);
    try {
      const res = await sendWorkspaceMessage({
        senderCode: currentMember.code,
        content: chatInput,
        channel: 'general',
      });
      if (res.success && res.newMessage) {
        setMessages((prev) => [...prev, res.newMessage!]);
        setChatInput('');
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Failed to send message.', 'error');
    } finally {
      setIsSendingMsg(false);
    }
  };

  const pendingApprovalsCount =
    memberRequests.filter((r) => r.status === 'pending').length +
    profileRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
      {/* Top Admin Control Header */}
      <header className="sticky top-0 z-40 bg-[#0e1726]/95 backdrop-blur-md border-b border-[#1d2a3e] px-4 sm:px-8 py-3.5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand Logo & Navigation Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToPublic}
              className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Site</span>
            </button>
            <div className="h-5 w-[1px] bg-[#1d2a3e] hidden sm:block" />
            <div className="flex items-center gap-2">
              <SamzenLogo size="sm" showSubtitle={false} />
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono uppercase bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40">
                Admin Suite
              </span>
            </div>
          </div>

          {/* Right: Current Administrator Info & Action Chips */}
          <div className="flex items-center gap-2.5">
            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
              {isCeo ? (
                <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30 flex-shrink-0" />
              ) : (
                <Shield className="w-4 h-4 text-[#3da9fc] flex-shrink-0" />
              )}
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{currentMember.name}</span>
                  {isCeo && (
                    <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-400/20 px-1.5 py-0.2 rounded">
                      CEO Master
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#9db0c8]">
                  Code: <span className="font-mono text-[#59e3ff]">{currentMember.code}</span> &bull; {currentMember.position}
                </div>
              </div>
            </div>

            {/* Switch to Members View */}
            <button
              onClick={onOpenMembersPage}
              className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] border border-[#3da9fc]/40 text-[#59e3ff] text-xs font-semibold transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Members Portal</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout"
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

      {/* Admin Navigation Tabs */}
      <div className="border-b border-[#1d2a3e] bg-[#0b1220] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5">
          <button
            onClick={() => setActiveTab('projects')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Live Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Applicant Reviews ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generate_code')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'generate_code'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isCeo ? 'Generate 8-Digit Code' : 'Request Member Code'}</span>
            {isCeo && <Crown className="w-3 h-3 text-amber-300" />}
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-[#070b14] font-mono text-[10px] font-bold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'members'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Master Profile Access ({members.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Team Chat ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {/* ================= TAB 1: LIVE PROJECTS ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Post Project Section */}
            <div className="bg-[#0e1726] border-2 border-[#3da9fc]/60 rounded-2xl p-5 sm:p-7 shadow-xl shadow-[#3da9fc]/10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#3da9fc]" />
                  <h3 className="text-lg font-bold text-white font-heading">
                    Post New Project Listing
                  </h3>
                </div>
                <span className="text-xs text-[#59e3ff] font-semibold bg-[#070b14] px-2.5 py-1 rounded-md border border-[#1d2a3e]">
                  Authorized Leaders &bull; Visible Live to All Members
                </span>
              </div>

              <form onSubmit={handlePostProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="e.g. Modern Full-Stack Restaurant Portal with WhatsApp Orders"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                        Location / Mode *
                      </label>
                      <input
                        type="text"
                        required
                        value={newProjLoc}
                        onChange={(e) => setNewProjLoc(e.target.value)}
                        placeholder="Remote / Pune / Mumbai"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                        Budget / Payout
                      </label>
                      <input
                        type="text"
                        value={newProjBudget}
                        onChange={(e) => setNewProjBudget(e.target.value)}
                        placeholder="e.g. ₹15,000 - ₹20,000"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Project Requirements / Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProjReqs}
                    onChange={(e) => setNewProjReqs(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, Razorpay API, Fast Turnaround"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Description &amp; Deliverables *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    placeholder="Detail the project goals, client requirements, expected delivery timeline, and responsibilities..."
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingProj}
                    className="btn-interactive inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/25 cursor-pointer disabled:opacity-50"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{isSubmittingProj ? 'Publishing...' : 'Publish Project Live'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Live Posted Projects List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-heading">
                  Active Published Projects ({projects.length})
                </h3>
                <span className="text-xs text-[#9db0c8]">
                  Team members can click "Apply Here" on any of these projects
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="panel bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {proj.status}
                        </span>
                        <span className="text-[11px] font-mono text-[#59e3ff] bg-[#070b14] px-2 py-0.5 rounded border border-[#1d2a3e]">
                          {proj.budget}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                        {proj.title}
                      </h4>

                      <p className="text-xs text-[#9db0c8] mb-3 line-clamp-3 leading-relaxed">
                        {proj.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
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

                    <div className="pt-3 border-t border-[#1d2a3e] text-[11px] text-[#9db0c8] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#59e3ff]">
                        <MapPin className="w-3 h-3" />
                        <span>{proj.location}</span>
                      </div>
                      <div className="font-semibold text-white">
                        {proj.applicantCount || 0} Applicants
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: APPLICANT REVIEWS ================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Project Applications Queue ({applications.length})
                </h3>
                <p className="text-xs text-[#9db0c8] mt-0.5">
                  Review applications submitted by team members clicking "Apply Here" on projects.
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="p-12 text-center bg-[#0e1726] border border-[#1d2a3e] rounded-2xl">
                <Users className="w-10 h-10 text-[#59e3ff] mx-auto mb-3 opacity-60" />
                <h4 className="text-sm font-bold text-white">No applications yet</h4>
                <p className="text-xs text-[#9db0c8] mt-1 max-w-sm mx-auto">
                  When team members browse the live projects board and click "Apply Here", their applications will route directly here for review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-5 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/50 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-sm font-bold text-white">{app.memberName}</span>
                        <span className="text-[11px] font-semibold text-[#59e3ff] bg-[#070b14] px-2 py-0.5 rounded border border-[#1d2a3e]">
                          {app.memberPosition}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            app.status === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : app.status === 'shortlisted'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : app.status === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-[#3da9fc]/10 text-[#59e3ff] border border-[#3da9fc]/30'
                          }`}
                        >
                          Status: {app.status}
                        </span>
                      </div>

                      <div className="text-xs text-white font-medium mb-1">
                        Target Project: <strong className="text-[#3da9fc]">{app.projectTitle}</strong>
                      </div>

                      <p className="text-xs text-[#9db0c8] bg-[#070b14] p-2.5 rounded-lg border border-[#1d2a3e] mt-2 italic">
                        "{app.coverNote || 'Ready to start immediately.'}"
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#9db0c8] mt-2">
                        <span>Email: <span className="text-white">{app.memberEmail}</span></span>
                        <span>Phone: <span className="text-white">{app.memberPhone}</span></span>
                        <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                        {app.reviewedBy && (
                          <span className="text-[#59e3ff]">Reviewed by: {app.reviewedBy}</span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'accepted')}
                        className="btn-interactive px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'shortlisted')}
                        className="btn-interactive px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition cursor-pointer"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                        className="btn-interactive px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: GENERATE CODE (CEO EXCLUSIVE) ================= */}
        {activeTab === 'generate_code' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#3da9fc]/15 relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-2">
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400/30" />
                <h3 className="text-xl font-bold text-white font-heading">
                  {isCeo ? 'CEO Exclusive: Generate 8-Digit Member Code' : 'Request Member Code (CEO Approval Required)'}
                </h3>
              </div>
              <p className="text-xs text-[#9db0c8] mb-6">
                {isCeo
                  ? 'Only you (Master CEO Account 30072012) can generate new unique 8-digit access codes by entering member credentials.'
                  : 'As a co-founder, you can submit member credentials for CEO Samarth Zende to review and generate an 8-digit code.'}
              </p>

              <form onSubmit={isCeo ? handleGenerateCode : handleRequestMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={genName}
                    onChange={(e) => setGenName(e.target.value)}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Gmail / Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={genEmail}
                      onChange={(e) => setGenEmail(e.target.value)}
                      placeholder="vikram.dev@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={genPhone}
                      onChange={(e) => setGenPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Designation / Position *
                    </label>
                    <input
                      type="text"
                      required
                      value={genPosition}
                      onChange={(e) => setGenPosition(e.target.value)}
                      placeholder="e.g. Senior Frontend Specialist"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
                  </div>

                  {isCeo && (
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                        System Role
                      </label>
                      <select
                        value={genRole}
                        onChange={(e) => setGenRole(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="member">Regular Team Member</option>
                        <option value="cofounder">Co-Founder &amp; Helper</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingGen}
                    className="btn-interactive w-full py-3 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-lg shadow-[#3da9fc]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-4 h-4" />
                    <span>
                      {isSubmittingGen
                        ? 'Processing...'
                        : isCeo
                        ? 'Generate 8-Digit Access Code'
                        : 'Submit Request to CEO Samarth Zende'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Generated Result Card */}
              {generatedResult && (
                <div className="mt-6 p-5 rounded-xl bg-[#070b14] border-2 border-emerald-500/50 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Access Code Successfully Generated!</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e1726] border border-[#1d2a3e] my-3">
                    <div>
                      <div className="text-[10px] text-[#9db0c8] uppercase font-mono">Member Access Code</div>
                      <div className="text-2xl font-mono font-bold text-[#59e3ff] tracking-widest">
                        {generatedResult.code}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(generatedResult.code)}
                      className="btn-interactive px-3 py-1.5 rounded-lg bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === generatedResult.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-[#9db0c8] space-y-1">
                    <div><strong>Member:</strong> {generatedResult.member.name} ({generatedResult.member.position})</div>
                    <div><strong>Email:</strong> {generatedResult.member.email} | <strong>Phone:</strong> {generatedResult.member.phone}</div>
                  </div>

                  {/* Share on WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hello ${generatedResult.member.name}! Welcome to the SAMZEN team. Here is your official 8-digit internal workspace access code: ${generatedResult.code}\n\nLog in at: https://samzen.ai.studio`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive mt-3 w-full py-2.5 rounded-lg bg-[#25D366] text-black text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Share Access Code via WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PENDING APPROVALS QUEUE ================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Member Creation Requests Queue */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Co-Founder Member Creation Requests ({memberRequests.length})
                </h3>
                <span className="text-xs text-[#9db0c8]">
                  {isCeo ? 'Approve to automatically generate an 8-digit code' : 'Pending CEO Samarth Zende approval'}
                </span>
              </div>

              {memberRequests.length === 0 ? (
                <div className="p-8 text-center bg-[#0e1726] border border-[#1d2a3e] rounded-xl text-xs text-[#9db0c8]">
                  No pending member creation requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {memberRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{req.name}</span>
                          <span className="text-xs text-[#59e3ff] font-semibold">{req.position}</span>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              req.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : req.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-400/20 text-amber-300'
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#9db0c8]">
                          Email: {req.email} &bull; Phone: {req.phone} &bull; Submitted by: {req.requestedBy.name}
                        </div>
                        {req.generatedCode && (
                          <div className="mt-1 text-xs text-emerald-400 font-mono">
                            Generated Code: <strong>{req.generatedCode}</strong>
                          </div>
                        )}
                      </div>

                      {isCeo && req.status === 'pending' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleReviewMemberReq(req.id, 'approve')}
                            className="btn-interactive px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer"
                          >
                            Approve &amp; Generate Code
                          </button>
                          <button
                            onClick={() => handleReviewMemberReq(req.id, 'reject')}
                            className="btn-interactive px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Profile Change Requests Queue */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Member Profile Change Requests ({profileRequests.length})
                </h3>
                <span className="text-xs text-[#9db0c8]">
                  Strict Profile Policy: Core details can only be changed upon CEO approval
                </span>
              </div>

              {profileRequests.length === 0 ? (
                <div className="p-8 text-center bg-[#0e1726] border border-[#1d2a3e] rounded-xl text-xs text-[#9db0c8]">
                  No pending profile change requests.
                </div>
              ) : (
                <div className="space-y-3">
                  {profileRequests.map((preq) => (
                    <div
                      key={preq.id}
                      className="p-5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-white">
                            Change Request from Member
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              preq.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : preq.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-400/20 text-amber-300'
                            }`}
                          >
                            {preq.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#070b14] p-3 rounded-xl border border-[#1d2a3e]">
                          <div>
                            <div className="text-[10px] text-[#9db0c8] font-bold uppercase mb-1">
                              Current Profile
                            </div>
                            <div className="text-white">Name: {preq.currentProfile.name}</div>
                            <div className="text-[#9db0c8]">Email: {preq.currentProfile.email}</div>
                            <div className="text-[#9db0c8]">Phone: {preq.currentProfile.phone}</div>
                            <div className="text-[#9db0c8]">Role: {preq.currentProfile.position}</div>
                          </div>

                          <div className="border-t sm:border-t-0 sm:border-l border-[#1d2a3e] pt-2 sm:pt-0 sm:pl-3">
                            <div className="text-[10px] text-[#59e3ff] font-bold uppercase mb-1">
                              Requested Updates
                            </div>
                            <div className="text-emerald-400 font-semibold">Name: {preq.requestedProfile.name}</div>
                            <div className="text-emerald-400 font-semibold">Email: {preq.requestedProfile.email}</div>
                            <div className="text-emerald-400 font-semibold">Phone: {preq.requestedProfile.phone}</div>
                            <div className="text-emerald-400 font-semibold">Role: {preq.requestedProfile.position}</div>
                          </div>
                        </div>

                        <div className="text-xs text-[#9db0c8] mt-2 italic">
                          Reason: "{preq.reason}"
                        </div>
                      </div>

                      {isCeo && preq.status === 'pending' && (
                        <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                          <button
                            onClick={() => handleReviewProfileReq(preq.id, 'approve')}
                            className="btn-interactive px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer"
                          >
                            Approve Changes
                          </button>
                          <button
                            onClick={() => handleReviewProfileReq(preq.id, 'reject')}
                            className="btn-interactive px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: MASTER PROFILE ACCESS & DIRECTORY ================= */}
        {activeTab === 'members' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Team Directory &amp; Master Profile Access
                </h3>
                <p className="text-xs text-[#9db0c8] mt-0.5">
                  {isCeo
                    ? 'Strict Master Control: As CEO, you have full exclusive master access to edit, update, or change user profile details directly.'
                    : 'Co-founders have read-only view. Edits must be submitted to CEO Samarth Zende.'}
                </p>
              </div>
            </div>

            {/* Editing Modal (CEO Only) */}
            {editingMember && isCeo && (
              <div className="p-5 rounded-2xl bg-[#0e1726] border-2 border-[#3da9fc] shadow-2xl mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#3da9fc]" />
                    <h4 className="text-sm font-bold text-white">
                      CEO Master Profile Editor: {editingMember.name}
                    </h4>
                  </div>
                  <button
                    onClick={() => setEditingMember(null)}
                    className="text-xs text-[#9db0c8] hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveMasterProfile} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#9db0c8] mb-1">Position / Role</label>
                      <input
                        type="text"
                        required
                        value={editPosition}
                        onChange={(e) => setEditPosition(e.target.value)}
                        className="w-full px-3 py-2 bg-[#070b14] border border-[#1d2a3e] rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-3 py-1.5 rounded-lg bg-[#070b14] text-xs text-[#9db0c8]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-interactive px-4 py-1.5 rounded-lg bg-[#3da9fc] text-[#070b14] text-xs font-bold cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((mem) => {
                const isMemberCeo = mem.role === 'ceo' || mem.code === '30072012';
                return (
                  <div
                    key={mem.id}
                    className={`panel bg-[#0e1726] border-2 ${
                      isMemberCeo
                        ? 'border-amber-400/80 shadow-lg shadow-amber-400/10'
                        : mem.role === 'cofounder'
                        ? 'border-[#3da9fc] shadow-lg shadow-[#3da9fc]/10'
                        : 'border-[#1d2a3e]'
                    } rounded-2xl p-5 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                          {isMemberCeo ? (
                            <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30" />
                          ) : (
                            <Shield className="w-4 h-4 text-[#3da9fc]" />
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              isMemberCeo
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                                : mem.role === 'cofounder'
                                ? 'bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40'
                                : 'bg-[#070b14] text-[#9db0c8] border border-[#1d2a3e]'
                            }`}
                          >
                            {isMemberCeo ? 'Founder & CEO (100% Owner)' : mem.role === 'cofounder' ? 'Co-Founder' : 'Member'}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {mem.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white mb-0.5">{mem.name}</h4>
                      <div className="text-xs font-semibold text-[#59e3ff] mb-3">{mem.position}</div>

                      <div className="space-y-1.5 text-xs text-[#9db0c8] bg-[#070b14] p-3 rounded-xl border border-[#1d2a3e]">
                        <div>Email: <span className="text-white">{mem.email}</span></div>
                        <div>Phone: <span className="text-white">{mem.phone}</span></div>
                        <div className="flex items-center justify-between">
                          <span>Access Code:</span>
                          <span className="font-mono text-[#59e3ff] font-bold">
                            {isCeo ? (mem.code || '30072012') : '••••••••'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isCeo && (
                      <div className="pt-3 mt-4 border-t border-[#1d2a3e] flex justify-end">
                        <button
                          onClick={() => handleStartEditMember(mem)}
                          className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-[#3da9fc] text-[#59e3ff] hover:text-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-xs font-semibold transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Master Edit</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= TAB 6: INTERNAL TEAM CHAT ================= */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto bg-[#0e1726] border border-[#1d2a3e] rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl animate-fade-in">
            {/* Chat Header */}
            <div className="p-4 bg-[#0b1220] border-b border-[#1d2a3e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3da9fc]" />
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    SAMZEN Team Collaboration Channel
                  </h3>
                  <div className="text-[10px] text-[#9db0c8]">
                    Strictly for authenticated team members &bull; Verified real identities displayed
                  </div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                Live &bull; {messages.length} messages
              </span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070b14]/70">
              {messages.map((msg) => {
                const isMe = msg.senderCode === currentMember.code;
                const isMsgCeo = msg.senderRole === 'ceo' || msg.senderCode === '30072012';
                const isMsgCofounder = msg.senderRole === 'cofounder';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-white">{msg.senderName}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                          isMsgCeo
                            ? 'bg-amber-400/20 text-amber-300'
                            : isMsgCofounder
                            ? 'bg-[#3da9fc]/20 text-[#59e3ff]'
                            : 'bg-[#1d2a3e] text-[#9db0c8]'
                        }`}
                      >
                        {msg.senderPosition || (isMsgCeo ? 'Founder & CEO' : 'Member')}
                      </span>
                      <span className="text-[10px] text-[#50637a]">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#3da9fc] text-[#070b14] font-medium rounded-br-none shadow-md'
                          : 'bg-[#0e1726] border border-[#1d2a3e] text-white rounded-bl-none shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#0b1220] border-t border-[#1d2a3e] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={`Type a professional message as ${currentMember.name}...`}
                className="flex-1 px-4 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !chatInput.trim()}
                className="btn-interactive p-2.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
