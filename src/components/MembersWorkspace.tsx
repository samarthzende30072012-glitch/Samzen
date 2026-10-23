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
  SendHorizontal
} from 'lucide-react';
import { SamzenLogo } from './SamzenLogo';
import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  ProfileChangeRequest,
  WorkspaceMessage
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
  checkMemberSession,
  workspaceStorage
} from '../services/workspaceApi';
import { SecureLogoutModal } from './SecureLogoutModal';
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

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'directory' | 'chat'>('projects');

  // Data states
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [myApplications, setMyApplications] = useState<WorkspaceApplication[]>([]);
  const [myProfileRequests, setMyProfileRequests] = useState<ProfileChangeRequest[]>([]);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
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

  // Team Chat state
  const [chatInput, setChatInput] = useState('');
  const [isSendingMsg, setIsSendingMsg] = useState(false);

  // Load all workspace data and perform live session validity check
  const loadData = async () => {
    try {
      // 1. Live Session Check (instantly log out if removed by CEO)
      const sessionCheck = await checkMemberSession(currentMember.code);
      if (!sessionCheck.valid) {
        notify('Your workspace access code has been revoked by CEO Samarth Zende.', 'error');
        setTimeout(() => {
          workspaceStorage.clearMember();
          onLogout();
        }, 1200);
        return;
      }

      // 2. Load workspace collections
      const [projs, mems, apps, pReqs, msgs] = await Promise.all([
        getWorkspaceProjects(),
        getWorkspaceMembers(),
        getWorkspaceApplications(),
        getProfileChangeRequests(),
        getWorkspaceMessages(),
      ]);
      setProjects(projs);
      setMembers(mems);
      // Strictly show ONLY this member's own applications (candidate reviews hidden from regular members)
      setMyApplications(apps.filter((a) => a.memberId === currentMember.id));
      setMyProfileRequests(pReqs.filter((r) => r.memberId === currentMember.id));
      setMessages(msgs);
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

  // Handler: Submit Profile Change Request to CEO
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
        notify('Profile change request submitted for CEO Samarth Zende review!', 'success');
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

  // Handler: Send Chat Message
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

  const isApplied = (projectId: string) => {
    return myApplications.some((a) => a.projectId === projectId);
  };

  const getApplicationStatus = (projectId: string) => {
    const app = myApplications.find((a) => a.projectId === projectId);
    return app?.status;
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e1726]/95 backdrop-blur-md border-b border-[#1d2a3e] px-4 sm:px-8 py-3.5 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Brand & Public back button */}
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
                Team Portal
              </span>
            </div>
          </div>

          {/* Right: Member Info Chip & Secure Logout */}
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
      <div className="border-b border-[#1d2a3e] bg-[#0b1220] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          <button
            onClick={() => setActiveTab('projects')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open Projects ({projects.length})</span>
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
        
        {/* ================= TAB 1: OPEN PROJECTS & APPLY ================= */}
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

            {/* Clean Projects Grid (Zero serial numbers or survey tags) */}
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
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40">
                      {currentMember.role === 'ceo' ? 'CEO Master' : currentMember.role === 'cofounder' ? 'Co-Founder' : 'Verified Member'}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-[#59e3ff]">
                    {currentMember.position}
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
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isMemberCeo
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : mem.role === 'cofounder'
                              ? 'bg-[#3da9fc]/20 text-[#59e3ff] border border-[#3da9fc]/40'
                              : 'bg-[#070b14] text-[#9db0c8] border border-[#1d2a3e]'
                          }`}
                        >
                          {isMemberCeo ? <Crown className="w-3 h-3 text-amber-400" /> : <Shield className="w-3 h-3 text-[#3da9fc]" />}
                          <span>{isMemberCeo ? 'Founder & CEO (100% Owner)' : mem.role === 'cofounder' ? 'Co-Founder' : 'Team Member'}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {mem.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{mem.name}</h4>
                      <div className="text-xs font-semibold text-[#59e3ff] mb-3">{mem.position}</div>

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

        {/* ================= TAB 4: TEAM MESSENGER & CHAT ================= */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto bg-[#0e1726] border border-[#1d2a3e] rounded-2xl overflow-hidden flex flex-col h-[650px] shadow-2xl animate-fade-in">
            {/* Chat Header */}
            <div className="p-4 bg-[#0b1220] border-b border-[#1d2a3e] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#3da9fc]" />
                <div>
                  <h3 className="text-sm font-bold text-white font-heading">
                    SAMZEN Team Collaboration Messenger
                  </h3>
                  <div className="text-[10px] text-[#9db0c8]">
                    Active: <strong>{currentMember.name}</strong> ({currentMember.position})
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
                placeholder={`Type a message as ${currentMember.name}...`}
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
