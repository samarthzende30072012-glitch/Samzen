import React, { useState, useEffect } from 'react';
import {
  Crown,
  Key,
  Users,
  Briefcase,
  UserPlus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LogOut,
  Send,
  MessageSquare,
  Sparkles,
  MapPin,
  RefreshCw,
  PlusCircle,
  Clock,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  SendHorizontal
} from 'lucide-react';
import { SamzenLogo } from './SamzenLogo';
import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  MemberCreationRequest,
  WorkspaceMessage
} from '../types';
import {
  getWorkspaceMembers,
  generateMemberCode,
  deleteMemberByCeo,
  requestMemberCreation,
  getMemberCreationRequests,
  reviewMemberCreationRequest,
  getWorkspaceProjects,
  postWorkspaceProject,
  getWorkspaceApplications,
  updateApplicationStatus,
  getWorkspaceMessages,
  sendWorkspaceMessage,
  checkMemberSession,
  workspaceStorage
} from '../services/workspaceApi';
import { SecureLogoutModal } from './SecureLogoutModal';
import { maskAccessCode, maskPhoneNumber, maskEmailAddress } from '../utils/securityMask';

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

  // Streamlined Tabs
  const [activeTab, setActiveTab] = useState<
    'generated_numbers' | 'assign_code' | 'approvals' | 'projects' | 'chat'
  >(isCeo ? 'generated_numbers' : 'projects');

  // Data states
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [memberRequests, setMemberRequests] = useState<MemberCreationRequest[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [applications, setApplications] = useState<WorkspaceApplication[]>([]);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Notifications & UI states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [revealedCodeIds, setRevealedCodeIds] = useState<Set<string>>(new Set());
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [revealedRecent, setRevealedRecent] = useState(false);

  const toggleRevealCode = (id: string) => {
    setRevealedCodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Form states: Member Code Generation & Manual Assignment (CEO Only)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState<'member' | 'cofounder'>('member');
  const [customCode, setCustomCode] = useState('');
  const [isSubmittingGen, setIsSubmittingGen] = useState(false);
  const [recentAssigned, setRecentAssigned] = useState<{ member: WorkspaceMember; code: string } | null>(null);

  // Form states: Co-Founder Request Member
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqPosition, setReqPosition] = useState('');
  const [isSubmittingMemberReq, setIsSubmittingMemberReq] = useState(false);

  // Form states: Post Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projReqs, setProjReqs] = useState('');
  const [projLoc, setProjLoc] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);

  // Form states: Team Chat
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Load all workspace data
  const loadData = async () => {
    try {
      // 1. Session check
      const sessionRes = await checkMemberSession(currentMember.code);
      if (!sessionRes.valid) {
        notify('Your workspace access has been revoked by CEO Samarth Zende.', 'error');
        setTimeout(() => {
          workspaceStorage.clearMember();
          onLogout();
        }, 1200);
        return;
      }

      // 2. Fetch data (CEO query allows CEO to retrieve unmasked codes)
      const ceoQuery = isCeo ? currentMember.code : undefined;
      const [mems, reqs, projs, apps, msgs] = await Promise.all([
        getWorkspaceMembers(ceoQuery),
        getMemberCreationRequests(),
        getWorkspaceProjects(),
        getWorkspaceApplications(),
        getWorkspaceMessages(),
      ]);
      setMembers(mems);
      setMemberRequests(reqs);
      setProjects(projs);
      setApplications(apps);
      setMessages(msgs);
    } catch (e) {
      console.error('Failed to load workspace data', e);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5s poll for real-time live sync
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

  const insertSymbolInCustomCode = (sym: string) => {
    if (customCode.length < 8) {
      setCustomCode((prev) => (prev + sym).slice(0, 8));
    }
  };

  // 1. Generate or Manually Assign 8-Character Access Code (Strictly CEO)
  const handleAssignCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCeo) {
      notify('Access Denied: Only CEO Samarth Zende can generate or assign access codes.', 'error');
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim() || !position.trim()) {
      notify('Please fill in Member Name, Email, Phone, and Designation.', 'error');
      return;
    }
    if (customCode.trim()) {
      const cleanCustom = customCode.trim();
      if (cleanCustom.length !== 8 && [...cleanCustom].length !== 8) {
        notify('Custom access code must be exactly 8 characters in length.', 'error');
        return;
      }
    }

    setIsSubmittingGen(true);
    try {
      const res = await generateMemberCode({
        ceoCode: currentMember.code,
        name,
        email,
        phone,
        position,
        role,
        customCode: customCode.trim() || undefined,
      });

      if (res.success && res.member && res.code) {
        setRecentAssigned({ member: res.member, code: res.code });
        notify(`Success: Access code assigned to ${res.member.name}.`, 'success');
        setName('');
        setEmail('');
        setPhone('');
        setPosition('');
        setCustomCode('');
        loadData();
      } else {
        notify(res.message || 'Failed to assign code.', 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Server error assigning code.', 'error');
    } finally {
      setIsSubmittingGen(false);
    }
  };

  // 2. Co-Founder Member Request Submission
  const handleRequestMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim() || !reqPhone.trim() || !reqPosition.trim()) {
      notify('Please fill in all member details.', 'error');
      return;
    }

    setIsSubmittingMemberReq(true);
    try {
      const res = await requestMemberCreation({
        requesterCode: currentMember.code,
        name: reqName,
        email: reqEmail,
        phone: reqPhone,
        position: reqPosition,
      });

      if (res.success) {
        notify('Member request submitted for CEO Samarth Zende approval.', 'success');
        setReqName('');
        setReqEmail('');
        setReqPhone('');
        setReqPosition('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error submitting request.', 'error');
    } finally {
      setIsSubmittingMemberReq(false);
    }
  };

  // 3. Review Member Request (CEO Only)
  const handleReviewRequest = async (id: string, action: 'approve' | 'reject') => {
    if (!isCeo) return;
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
      notify(err.message || 'Error reviewing request.', 'error');
    }
  };

  // 4. Live Member Removal Sync (Instant database deletion)
  const handleRemoveMember = async (targetMember: WorkspaceMember) => {
    if (targetMember.role === 'ceo' || targetMember.code === '30072012') {
      notify('Cannot remove the master CEO account.', 'error');
      return;
    }

    const confirmed = window.confirm(
      `Remove "${targetMember.name}"?\n\nThis will instantly delete them from the database, revoking their access code and terminating their active session immediately.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await deleteMemberByCeo(targetMember.id, currentMember.code);
      if (res.success) {
        notify(`Member "${targetMember.name}" permanently removed from database.`, 'success');
        setMembers((prev) => prev.filter((m) => m.id !== targetMember.id));
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error removing member from database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Post Clean Project Listing
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim() || !projLoc.trim()) {
      notify('Please enter project title, description, and location.', 'error');
      return;
    }

    setIsSubmittingProj(true);
    try {
      const reqList = projReqs
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await postWorkspaceProject({
        authorCode: currentMember.code,
        title: projTitle,
        description: projDesc,
        requirements: reqList,
        location: projLoc,
        budget: projBudget || 'Negotiable',
      });

      if (res.success) {
        notify('Project posted live for team members.', 'success');
        setProjTitle('');
        setProjDesc('');
        setProjReqs('');
        setProjLoc('');
        setProjBudget('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error posting project.', 'error');
    } finally {
      setIsSubmittingProj(false);
    }
  };

  // 6. Update Application Status
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
        notify(`Application status updated to ${status}.`, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error updating status.', 'error');
    }
  };

  // 7. Send Internal Chat Message
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

  const pendingRequestsCount = memberRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e1726]/95 backdrop-blur-md border-b border-[#1d2a3e] px-4 sm:px-8 py-3.5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand Logo & Navigation */}
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
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                {isCeo ? 'CEO Master Suite' : 'Co-Founder Suite'}
              </span>
            </div>
          </div>

          {/* Right: Authenticated User Chip & Actions */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  {isCeo && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/30" />}
                  <span>{currentMember.name}</span>
                </div>
                <div className="text-[10px] text-[#9db0c8]">
                  Code: <span className="font-mono text-[#59e3ff]">{maskAccessCode(currentMember.code)}</span> &bull; {currentMember.position}
                </div>
              </div>
            </div>

            <button
              onClick={onOpenMembersPage}
              className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#070b14] hover:bg-[#1d2a3e] border border-[#1d2a3e] text-xs font-semibold text-[#59e3ff] hover:text-white transition cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Member View</span>
            </button>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              title="Secure Logout"
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

      {/* Clean Navigation Bar */}
      <div className="border-b border-[#1d2a3e] bg-[#0b1220] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          {/* Tab 1: See Your Generated Numbers & Members (CEO Only) */}
          {isCeo && (
            <button
              onClick={() => setActiveTab('generated_numbers')}
              className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'generated_numbers'
                  ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                  : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>See Your Generated Numbers &amp; Members ({members.length})</span>
            </button>
          )}

          {/* Tab 2: Assign / Generate Code (CEO Only) */}
          {isCeo && (
            <button
              onClick={() => setActiveTab('assign_code')}
              className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'assign_code'
                  ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                  : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Assign / Generate Code</span>
            </button>
          )}

          {/* Tab 3: Member Approvals & Requests */}
          <button
            onClick={() => setActiveTab('approvals')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'approvals'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Member Requests</span>
            {pendingRequestsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-extrabold">
                {pendingRequestsCount}
              </span>
            )}
          </button>

          {/* Tab 4: Projects & Applications (Strictly CEO & Co-Founders) */}
          <button
            onClick={() => setActiveTab('projects')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects &amp; Candidate Applications ({applications.length})</span>
          </button>

          {/* Tab 5: Team Chat */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Team Messenger ({messages.length})</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        
        {/* ================= TAB 1: SEE YOUR GENERATED NUMBERS & MEMBERS ================= */}
        {activeTab === 'generated_numbers' && isCeo && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-white font-heading">
                  Generated Access Codes &amp; Member Directory
                </h3>
                <p className="text-xs text-[#9db0c8] mt-0.5">
                  Exclusive CEO tracking table. Monitor all generated 8-character codes, manage member privileges, or remove access in real time.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('assign_code')}
                className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-md shadow-[#3da9fc]/20 cursor-pointer self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign New Member Code</span>
              </button>
            </div>

            {/* Clean Table (Zero serial tags or survey numbers) */}
            <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1220] border-b border-[#1d2a3e] text-[#9db0c8] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">8-Character Access Code</th>
                      <th className="py-3 px-4">Designation &amp; Role</th>
                      <th className="py-3 px-4">Contact (Masked)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d2a3e]">
                    {members.map((mem) => {
                      const isTargetCeo = mem.role === 'ceo' || mem.code === '30072012';

                      return (
                        <tr key={mem.id} className="hover:bg-[#111c2e] transition">
                          {/* Member Name */}
                          <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {isTargetCeo ? (
                                <Crown className="w-4 h-4 text-amber-400 fill-amber-400/30 flex-shrink-0" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-[#3da9fc]" />
                              )}
                              <span>{mem.name}</span>
                            </div>
                          </td>

                          {/* 8-Character Access Code (Masked by default with peek toggle & copy) */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="inline-flex items-center gap-2 bg-[#070b14] border border-[#3da9fc]/40 px-3 py-1 rounded-lg">
                              <span className="font-mono text-sm font-bold text-[#59e3ff] tracking-wider">
                                {revealedCodeIds.has(mem.id)
                                  ? (mem.code || '30072012')
                                  : maskAccessCode(mem.code || '30072012')}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleRevealCode(mem.id)}
                                title={revealedCodeIds.has(mem.id) ? "Mask code on screen" : "Peek code"}
                                className="text-[#9db0c8] hover:text-[#59e3ff] transition p-0.5 cursor-pointer"
                              >
                                {revealedCodeIds.has(mem.id) ? (
                                  <EyeOff className="w-3.5 h-3.5 text-amber-300" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => copyToClipboard(mem.code || '30072012')}
                                title="Copy code"
                                className="text-[#9db0c8] hover:text-white transition p-0.5 cursor-pointer"
                              >
                                {copiedCode === (mem.code || '30072012') ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Role / Designation */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-semibold text-white">{mem.position}</div>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.2 rounded-full inline-block mt-0.5 ${
                                isTargetCeo
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : mem.role === 'cofounder'
                                  ? 'bg-[#3da9fc]/20 text-[#59e3ff]'
                                  : 'bg-[#1d2a3e] text-[#9db0c8]'
                              }`}
                            >
                              {isTargetCeo ? 'Founder & CEO (100% Owner)' : mem.role === 'cofounder' ? 'Co-Founder' : 'Member'}
                            </span>
                          </td>

                          {/* Contact Details (Masked for Security) */}
                          <td className="py-3.5 px-4 text-[#9db0c8] whitespace-nowrap">
                            <div className="font-mono text-xs text-white">{maskEmailAddress(mem.email)}</div>
                            <div className="text-[11px] font-mono text-[#59e3ff]">{maskPhoneNumber(mem.phone)}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          </td>

                          {/* Action (Live Removal Sync) */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {isTargetCeo ? (
                              <span className="text-[10px] text-amber-300/80 italic">CEO Master</span>
                            ) : (
                              <button
                                onClick={() => handleRemoveMember(mem)}
                                disabled={isLoading}
                                className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0e1726] border border-[#1d2a3e] text-xs text-[#9db0c8] flex items-center justify-between">
              <span>
                💡 <strong>Live Removal Sync:</strong> Removing a member immediately revokes their code and terminates active sessions across all devices.
              </span>
              <span className="text-[#59e3ff] font-mono text-[11px]">Database: Real-Time</span>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ASSIGN / GENERATE CODE (CEO ONLY) ================= */}
        {activeTab === 'assign_code' && isCeo && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-2">
                <Crown className="w-6 h-6 text-amber-400 fill-amber-400/30" />
                <h3 className="text-xl font-bold text-white font-heading">
                  Generate &amp; Assign 8-Character Code
                </h3>
              </div>
              <p className="text-xs text-[#9db0c8] mb-6">
                Fill in member credentials. You can type a custom 8-character code (supporting symbols like #, ₹, +, ×, ÷, @, %, =, / and letters/numbers) or leave blank to auto-generate.
              </p>

              <form onSubmit={handleAssignCode} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sharven Shinde"
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. member@gmail.com"
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
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 8605042855"
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
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Co-Founder, Frontend Helper, Sales Lead"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Role Privilege
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="member">Regular Team Member</option>
                      <option value="cofounder">Co-Founder</option>
                    </select>
                  </div>
                </div>

                {/* Custom 8-Character Code with Symbol Support */}
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#59e3ff]">
                      Custom 8-Character Code (Optional - Digits, Letters &amp; Symbols)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomCode(!showCustomCode)}
                      className="text-[11px] text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1 cursor-pointer"
                    >
                      {showCustomCode ? <EyeOff className="w-3 h-3 text-amber-300" /> : <Eye className="w-3 h-3" />}
                      <span>{showCustomCode ? 'Mask Code' : 'Peek Code'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-[#9db0c8] mb-2">
                    Enter any 8 characters, or leave blank to auto-generate:
                  </p>
                  <input
                    type={showCustomCode ? 'text' : 'password'}
                    maxLength={8}
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.slice(0, 8))}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white font-mono tracking-wider focus:outline-none"
                  />

                  {/* Symbols Palette */}
                  <div className="mt-2 pt-2 border-t border-[#1d2a3e] flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-[10px] text-[#9db0c8]">Insert symbol:</span>
                    <div className="flex items-center gap-1">
                      {['#', '₹', '+', '×', '÷', '@', '%', '=', '/'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => insertSymbolInCustomCode(sym)}
                          className="px-2 py-0.5 rounded bg-[#0e1726] hover:bg-[#3da9fc] hover:text-black border border-[#1d2a3e] text-xs font-mono text-[#59e3ff] transition cursor-pointer"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingGen}
                    className="btn-interactive w-full py-3 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-bold text-xs shadow-lg shadow-[#3da9fc]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-4 h-4" />
                    <span>{isSubmittingGen ? 'Assigning...' : 'Assign 8-Character Access Code'}</span>
                  </button>
                </div>
              </form>

              {/* Success Result Display */}
              {recentAssigned && (
                <div className="mt-6 p-4 rounded-xl bg-[#070b14] border border-emerald-500/40 animate-fade-in">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Code Successfully Created &amp; Saved!</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#0e1726] border border-[#1d2a3e] my-2">
                    <div>
                      <div className="text-[10px] text-[#9db0c8] uppercase font-mono">Assigned Code (Masked)</div>
                      <div className="text-xl font-mono font-bold text-[#59e3ff] tracking-widest flex items-center gap-2">
                        <span>{revealedRecent ? recentAssigned.code : maskAccessCode(recentAssigned.code)}</span>
                        <button
                          type="button"
                          onClick={() => setRevealedRecent(!revealedRecent)}
                          title={revealedRecent ? "Mask code" : "Peek code"}
                          className="text-[#9db0c8] hover:text-[#59e3ff] p-0.5 cursor-pointer"
                        >
                          {revealedRecent ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(recentAssigned.code)}
                      className="btn-interactive px-3 py-1.5 rounded-lg bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === recentAssigned.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-[#9db0c8]">
                    Member: <strong className="text-white">{recentAssigned.member.name}</strong> ({recentAssigned.member.position})
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Hello ${recentAssigned.member.name}! Here is your official SAMZEN workspace access code: ${recentAssigned.code}\n\nLog in at: https://samzen.ai.studio`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive mt-3 w-full py-2 rounded-lg bg-[#25D366] text-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send Code via WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 3: MEMBER REQUESTS & APPROVALS ================= */}
        {activeTab === 'approvals' && (
          <div className="space-y-6 animate-fade-in">
            {/* If Co-Founder, show submission form */}
            {isCofounder && (
              <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-[#3da9fc]" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Submit Member Creation Request (Requires CEO Approval)
                  </h3>
                </div>
                <p className="text-xs text-[#9db0c8] mb-4">
                  As Co-Founder, you can submit prospective team members. CEO Samarth Zende reviews and issues their official 8-character code.
                </p>

                <form onSubmit={handleRequestMember} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Candidate Name *</label>
                      <input
                        type="text"
                        required
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        placeholder="Candidate full name"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Email *</label>
                      <input
                        type="email"
                        required
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        placeholder="candidate@gmail.com"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={reqPhone}
                        onChange={(e) => setReqPhone(e.target.value)}
                        placeholder="+91 8605042855"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Proposed Position *</label>
                      <input
                        type="text"
                        required
                        value={reqPosition}
                        onChange={(e) => setReqPosition(e.target.value)}
                        placeholder="e.g. Sales Specialist, UI Designer"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={isSubmittingMemberReq}
                      className="btn-interactive px-5 py-2.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs cursor-pointer disabled:opacity-50"
                    >
                      {isSubmittingMemberReq ? 'Submitting...' : 'Submit to CEO for Approval'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Requests List */}
            <div>
              <h3 className="text-base font-bold text-white font-heading mb-3">
                Member Creation Requests ({memberRequests.length})
              </h3>

              {memberRequests.length === 0 ? (
                <div className="p-8 text-center bg-[#0e1726] border border-[#1d2a3e] rounded-xl text-xs text-[#9db0c8]">
                  No member creation requests at this time.
                </div>
              ) : (
                <div className="space-y-3">
                  {memberRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{req.name}</span>
                          <span className="text-xs text-[#59e3ff]">{req.position}</span>
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
                          Requested by: <strong>{req.requestedBy.name}</strong> ({req.requestedBy.role}) &bull; {maskEmailAddress(req.email)} &bull; {maskPhoneNumber(req.phone)}
                        </div>
                        {req.generatedCode && (
                          <div className="mt-1 text-xs text-emerald-400 font-mono">
                            Generated Access Code: <strong>{maskAccessCode(req.generatedCode)}</strong>
                          </div>
                        )}
                      </div>

                      {isCeo && req.status === 'pending' && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleReviewRequest(req.id, 'approve')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer"
                          >
                            Approve &amp; Issue Code
                          </button>
                          <button
                            onClick={() => handleReviewRequest(req.id, 'reject')}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
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

        {/* ================= TAB 4: PROJECTS & CANDIDATE APPLICATIONS (STRICTLY CEO & CO-FOUNDERS) ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            {/* Post Project */}
            <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 sm:p-7 shadow-xl">
              <h3 className="text-base font-bold text-white font-heading mb-4">
                Post New Project for Team Members
              </h3>

              <form onSubmit={handlePostProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. Modern Full-Stack E-Commerce Portal"
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
                        value={projLoc}
                        onChange={(e) => setProjLoc(e.target.value)}
                        placeholder="Remote / Pune"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                        Budget / Payout
                      </label>
                      <input
                        type="text"
                        value={projBudget}
                        onChange={(e) => setProjBudget(e.target.value)}
                        placeholder="e.g. ₹15,000 - ₹20,000"
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Requirements (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projReqs}
                    onChange={(e) => setProjReqs(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, API Integration"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Project Deliverables *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Provide details about the project requirements and expectations..."
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingProj}
                    className="btn-interactive px-5 py-2.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingProj ? 'Publishing...' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </div>

            {/* Active Projects (No serial tags) */}
            <div>
              <h3 className="text-base font-bold text-white font-heading mb-3">
                Active Projects ({projects.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          {proj.status}
                        </span>
                        <span className="text-xs font-mono text-[#59e3ff] font-bold">
                          {proj.budget}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1.5">{proj.title}</h4>
                      <p className="text-xs text-[#9db0c8] mb-3 leading-relaxed">{proj.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#1d2a3e] text-[11px] text-[#9db0c8] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#59e3ff]">
                        <MapPin className="w-3 h-3" />
                        <span>{proj.location}</span>
                      </div>
                      <div className="font-semibold text-white">{proj.applicantCount || 0} Applied</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidate Applications Review Queue (Strictly visible ONLY to CEO & Co-Founders) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Member Candidate Applications ({applications.length})
                </h3>
                <span className="text-[10px] text-amber-300 uppercase font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                  Confidential: CEO &amp; Co-Founders Only
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="p-8 text-center bg-[#0e1726] border border-[#1d2a3e] rounded-xl text-xs text-[#9db0c8]">
                  No member applications yet. When team members apply for open projects, their submissions appear here for review.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-white">{app.memberName}</span>
                          <span className="text-xs text-[#59e3ff]">{app.memberPosition}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#070b14] border border-[#1d2a3e] text-white">
                            Status: {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-white">
                          Target Project: <strong className="text-[#3da9fc]">{app.projectTitle}</strong>
                        </div>
                        <p className="text-xs text-[#9db0c8] mt-1 italic">"{app.coverNote}"</p>
                        <div className="text-[10px] text-[#50637a] mt-1">
                          Contact: {maskEmailAddress(app.memberEmail)} &bull; {maskPhoneNumber(app.memberPhone)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'accepted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold cursor-pointer"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'shortlisted')}
                          className="px-3 py-1.5 rounded-lg bg-[#3da9fc]/20 hover:bg-[#3da9fc]/30 text-[#59e3ff] border border-[#3da9fc]/40 text-xs font-bold cursor-pointer"
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 5: TEAM MESSENGER & CHAT ================= */}
        {activeTab === 'chat' && (
          <div className="max-w-3xl mx-auto bg-[#0e1726] border border-[#1d2a3e] rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl animate-fade-in">
            <div className="p-4 bg-[#0b1220] border-b border-[#1d2a3e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3da9fc]" />
                <h3 className="text-sm font-bold text-white font-heading">
                  SAMZEN Internal Team Messenger
                </h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">Live</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#070b14]/70">
              {messages.map((msg) => {
                const isMe = msg.senderCode === currentMember.code;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                      <span className="font-bold text-white">{msg.senderName}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1d2a3e] text-[#9db0c8]">
                        {msg.senderPosition}
                      </span>
                    </div>
                    <div
                      className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? 'bg-[#3da9fc] text-[#070b14] font-medium rounded-br-none'
                          : 'bg-[#0e1726] border border-[#1d2a3e] text-white rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-[#0b1220] border-t border-[#1d2a3e] flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type a message to the team..."
                className="flex-1 px-4 py-2 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSendingMsg || !chatInput.trim()}
                className="btn-interactive p-2.5 rounded-xl bg-[#3da9fc] text-[#070b14] cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Secure Logout Verification Modal */}
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
