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
  SendHorizontal,
  Lock,
  UserMinus,
  Mail,
  Inbox,
  Archive,
  CheckCheck,
  FileText,
  Phone,
  ExternalLink,
  Filter,
  Edit3
} from 'lucide-react';
import { SamzenLogo } from './SamzenLogo';
import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  MemberCreationRequest,
  WorkspaceMessage,
  DirectMessage,
  WorkspaceRole,
  WORKSPACE_ROLES_CONFIG,
  MailboxItem
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
  deleteWorkspaceProject,
  assignMemberToProject,
  unassignMemberFromProject,
  getWorkspaceApplications,
  updateApplicationStatus,
  getWorkspaceMessages,
  sendWorkspaceMessage,
  getWorkspaceDirectMessages,
  sendWorkspaceDirectMessage,
  checkMemberSession,
  workspaceStorage,
  changeMemberAccessCode,
  getWorkspaceMailbox,
  actionMailboxItem,
  updateMemberProfileMaster,
  deleteMailboxItemDirect,
  clearWorkspaceMailbox,
  cleanupWorkspaceProjects
} from '../services/workspaceApi';
import { SecureLogoutModal } from './SecureLogoutModal';
import { DualMessagingBox } from './DualMessagingBox';
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

  // Streamlined Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    'directory' | 'mailbox' | 'assign_code' | 'approvals' | 'projects' | 'messaging'
  >(isCeo ? 'directory' : 'projects');

  // Data collections
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [memberRequests, setMemberRequests] = useState<MemberCreationRequest[]>([]);
  const [projects, setProjects] = useState<WorkspaceProject[]>([]);
  const [applications, setApplications] = useState<WorkspaceApplication[]>([]);
  const [mailboxItems, setMailboxItems] = useState<MailboxItem[]>([]);
  const [groupMessages, setGroupMessages] = useState<WorkspaceMessage[]>([]);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mailbox Filtering & Modal State
  const [mailboxFilter, setMailboxFilter] = useState<
    'all' | 'website_inquiry' | 'service_request' | 'team_application' | 'member_request' | 'project_application' | 'general_inquiry'
  >('all');
  const [mailboxStatusFilter, setMailboxStatusFilter] = useState<'all' | 'unread' | 'approved' | 'rejected' | 'archived'>('all');
  const [mailboxSearch, setMailboxSearch] = useState('');
  const [selectedMailDetail, setSelectedMailDetail] = useState<MailboxItem | null>(null);
  const [approveModalMail, setApproveModalMail] = useState<MailboxItem | null>(null);
  const [approveCustomCode, setApproveCustomCode] = useState('');
  const [isApprovingMail, setIsApprovingMail] = useState(false);

  // Project Filtering & Cleanup State
  const [projectStatusFilter, setProjectStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');
  const [projectSearch, setProjectSearch] = useState('');

  // Password / Code Change Modal State
  const [memberForPasswordChange, setMemberForPasswordChange] = useState<WorkspaceMember | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Master Founder Profile & Credential Editing State (STRICTLY CEO ONLY)
  const [editingMember, setEditingMember] = useState<WorkspaceMember | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editRole, setEditRole] = useState<WorkspaceRole>('contractor');
  const [editCommissionShare, setEditCommissionShare] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [showEditCode, setShowEditCode] = useState(false);
  const [isSavingMemberEdit, setIsSavingMemberEdit] = useState(false);

  // Notification and UI toggles
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [revealedCodeIds, setRevealedCodeIds] = useState<Set<string>>(new Set());
  const [showCustomCode, setShowCustomCode] = useState(false);
  const [revealedRecent, setRevealedRecent] = useState(false);

  // Form: CEO Assign / Generate Code
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [role, setRole] = useState<WorkspaceRole>('contractor');
  const [customCode, setCustomCode] = useState('');
  const [isSubmittingGen, setIsSubmittingGen] = useState(false);
  const [recentAssigned, setRecentAssigned] = useState<{ member: WorkspaceMember; code: string } | null>(null);

  // Form: Co-Founder Request Member
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqPosition, setReqPosition] = useState('');
  const [reqRole, setReqRole] = useState<WorkspaceRole>('contractor');
  const [isSubmittingMemberReq, setIsSubmittingMemberReq] = useState(false);

  // Form: Post Project
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projReqs, setProjReqs] = useState('');
  const [projLoc, setProjLoc] = useState('');
  const [projBudget, setProjBudget] = useState('');
  const [isSubmittingProj, setIsSubmittingProj] = useState(false);

  // Project Member Assignment State
  const [selectedAssignMemberId, setSelectedAssignMemberId] = useState<{ [projectId: string]: string }>({});

  const toggleRevealCode = (id: string) => {
    setRevealedCodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Load all workspace collections
  const loadData = async () => {
    try {
      // 1. Session verification
      const sessionRes = await checkMemberSession(currentMember.code);
      if (!sessionRes.valid) {
        notify('Your workspace access has been revoked by CEO Samarth Zende.', 'error');
        setTimeout(() => {
          workspaceStorage.clearMember();
          onLogout();
        }, 1200);
        return;
      }

      // 2. Load collections
      const ceoQuery = isCeo ? currentMember.code : undefined;
      const [mems, reqs, projs, apps, msgs, dms, mItems] = await Promise.all([
        getWorkspaceMembers(ceoQuery),
        getMemberCreationRequests(),
        getWorkspaceProjects(),
        getWorkspaceApplications(currentMember.code),
        getWorkspaceMessages(),
        getWorkspaceDirectMessages(currentMember.code),
        getWorkspaceMailbox(currentMember.code),
      ]);
      setMembers(mems || []);
      setMemberRequests(reqs || []);
      setProjects(projs || []);
      setApplications(apps || []);
      setGroupMessages(msgs || []);
      setDirectMessages(dms || []);
      setMailboxItems(mItems || []);
    } catch (e) {
      console.warn('Workspace sync notice:', e);
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

  // 1. Generate / Assign Code (CEO Only)
  const handleAssignCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCeo) {
      notify('Only CEO Samarth Zende has permission to generate or assign access codes.', 'error');
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
        notify(`Access code assigned to ${res.member.name} successfully.`, 'success');
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
      notify(err.message || 'Error assigning code.', 'error');
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
        role: reqRole,
      });

      if (res.success) {
        notify('Member creation request submitted for CEO review.', 'success');
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

  // 4. Live Member Removal Sync (Instant Database Deletion)
  const handleRemoveMember = async (targetMember: WorkspaceMember) => {
    if (targetMember.role === 'ceo' || targetMember.code === '30072012') {
      notify('Cannot remove the master CEO account.', 'error');
      return;
    }

    const confirmed = window.confirm(
      `Remove "${targetMember.name}"?\n\nThis will permanently delete them from the database, revoking their access code and clearing active sessions immediately.`
    );
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const res = await deleteMemberByCeo(targetMember.id, currentMember.code);
      if (res.success) {
        notify(`Member "${targetMember.name}" removed from database.`, 'success');
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

  // 5. Post New Project
  const handlePostProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim() || !projLoc.trim()) {
      notify('Please enter project title, deliverables, and location.', 'error');
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

  // 6. Delete Existing Project (Founder CEO Absolute Administrative Authority)
  const handleDeleteProject = async (projectId: string, projectTitle?: string) => {
    // Instant optimistic update: removes project immediately from view
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    try {
      const res = await deleteWorkspaceProject(projectId, currentMember.code);
      if (res.success) {
        notify(res.message || `Project "${projectTitle || ''}" permanently deleted.`, 'success');
      } else {
        notify(res.message || 'Error deleting project.', 'error');
        loadData();
      }
    } catch (err: any) {
      notify(err.message || 'Error deleting project.', 'error');
      loadData();
    }
  };

  // 6b. Complete Project Cleanup & Bulk Deletion (Founder CEO Authority)
  const handleCleanupProjects = async (filterType: 'completed' | 'outdated' | 'all') => {
    try {
      if (filterType === 'completed') {
        setProjects((prev) => prev.filter((p) => p.status !== 'completed'));
      } else if (filterType === 'all') {
        setProjects([]);
      }
      const res = await cleanupWorkspaceProjects({
        authorCode: currentMember.code,
        filterType,
      });
      if (res.success) {
        notify(res.message, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
        loadData();
      }
    } catch (err: any) {
      notify(err.message || 'Error executing project cleanup.', 'error');
      loadData();
    }
  };

  // Instant Single-Click Delete Mailbox Item (Mobile & Desktop Founder Admin)
  const handleInstantDeleteMail = async (id: string, senderName?: string) => {
    // Optimistic instant removal: immediately vanishes from view with zero delay on personal phones
    setMailboxItems((prev) => prev.filter((m) => m.id !== id));
    if (selectedMailDetail?.id === id) {
      setSelectedMailDetail(null);
    }
    try {
      const res = await deleteMailboxItemDirect(id, currentMember.code);
      if (res.success) {
        notify(`Deleted request from "${senderName || 'Sender'}" instantly.`, 'success');
      } else {
        notify(res.message || 'Error deleting mail item.', 'error');
        loadData();
      }
    } catch (err: any) {
      notify(err.message || 'Network error deleting mail item.', 'error');
      loadData();
    }
  };

  // Bulk Mailbox Cleanup
  const handleClearMailbox = async (filterType?: string) => {
    try {
      if (filterType === 'unread') {
        setMailboxItems((prev) => prev.filter((m) => m.status !== 'unread'));
      } else if (filterType === 'read') {
        setMailboxItems((prev) => prev.filter((m) => m.status === 'unread'));
      } else {
        setMailboxItems([]);
      }
      const res = await clearWorkspaceMailbox({
        ceoCode: currentMember.code,
        status: filterType,
      });
      if (res.success) {
        notify(res.message, 'success');
        loadData();
      } else {
        notify(res.message, 'error');
        loadData();
      }
    } catch (err: any) {
      notify(err.message || 'Error clearing mailbox.', 'error');
      loadData();
    }
  };

  // 7. Assign Person to Project
  const handleAssignPerson = async (projectId: string) => {
    const memberIdToAssign = selectedAssignMemberId[projectId];
    if (!memberIdToAssign) {
      notify('Please select a team member to assign.', 'error');
      return;
    }

    try {
      const res = await assignMemberToProject(projectId, {
        authorCode: currentMember.code,
        memberId: memberIdToAssign,
      });

      if (res.success) {
        notify('Member assigned to project!', 'success');
        setSelectedAssignMemberId((prev) => ({ ...prev, [projectId]: '' }));
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error assigning member.', 'error');
    }
  };

  // 8. Unassign Person from Project
  const handleUnassignPerson = async (projectId: string, memberId: string) => {
    try {
      const res = await unassignMemberFromProject(projectId, {
        authorCode: currentMember.code,
        memberId,
      });

      if (res.success) {
        notify('Member unassigned from project.', 'success');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error unassigning member.', 'error');
    }
  };

  // 9. Candidate Application Status Review
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

  // 10. Dual Messaging Handlers
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

  // Open Password Change Dialog
  const handleOpenPasswordModal = (member: WorkspaceMember) => {
    setMemberForPasswordChange(member);
    setNewPasswordInput('');
    setShowNewPassword(false);
  };

  // Submit Password Change (CEO Only)
  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberForPasswordChange) return;
    const clean = newPasswordInput.trim();
    if (clean.length !== 8 && [...clean].length !== 8) {
      notify('New password / access code must be exactly 8 characters.', 'error');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeMemberAccessCode(memberForPasswordChange.id, {
        ceoCode: currentMember.code,
        newCode: clean,
      });

      if (res.success && res.member) {
        notify(`Password updated for ${memberForPasswordChange.name}! New code: ${clean}`, 'success');
        setMembers((prev) =>
          prev.map((m) => (m.id === memberForPasswordChange.id ? { ...m, code: clean } : m))
        );
        setMemberForPasswordChange(null);
        setNewPasswordInput('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error updating password code.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Auto-generate random 8-digit password
  const handleAutoGenerateNewPassword = () => {
    const chars = '0123456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setNewPasswordInput(res);
  };

  const insertPasswordSymbol = (sym: string) => {
    if (newPasswordInput.length < 8) {
      setNewPasswordInput((prev) => (prev + sym).slice(0, 8));
    }
  };

  // Open Master Profile & Credential Edit Dialog (CEO Only)
  const handleOpenEditMember = (member: WorkspaceMember) => {
    setEditingMember(member);
    setEditName(member.name);
    setEditEmail(member.email);
    setEditPhone(member.phone);
    setEditPosition(member.position);
    setEditRole(member.role);
    setEditCommissionShare(member.commissionShare || '');
    setEditCode(member.code || '');
    setEditStatus(member.status || 'active');
    setShowEditCode(false);
  };

  // Submit Master Profile & Credential Update (CEO Only)
  const handleSaveMemberEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (!editName.trim() || !editEmail.trim() || !editPhone.trim() || !editPosition.trim()) {
      notify('Please fill in Name, Email, Phone, and Designation.', 'error');
      return;
    }

    if (editCode.trim()) {
      const clean = editCode.trim();
      if (clean.length !== 8 && [...clean].length !== 8) {
        notify('Access code must be exactly 8 characters.', 'error');
        return;
      }
    }

    setIsSavingMemberEdit(true);
    try {
      const res = await updateMemberProfileMaster(editingMember.id, {
        ceoCode: currentMember.code,
        name: editName.trim(),
        email: editEmail.trim().toLowerCase(),
        phone: editPhone.trim(),
        position: editPosition.trim(),
        role: editRole,
        commissionShare: editCommissionShare.trim(),
        code: editCode.trim() || undefined,
        status: editStatus,
      });

      if (res.success && res.member) {
        notify(`Profile & credentials updated for "${res.member.name}"!`, 'success');
        setEditingMember(null);
        loadData();
      } else {
        notify(res.message || 'Error updating member details.', 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Network error updating member details.', 'error');
    } finally {
      setIsSavingMemberEdit(false);
    }
  };

  const handleAutoGenerateEditCode = () => {
    const chars = '0123456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars[Math.floor(Math.random() * chars.length)];
    }
    setEditCode(res);
  };

  const insertEditCodeSymbol = (sym: string) => {
    if (editCode.length < 8) {
      setEditCode((prev) => (prev + sym).slice(0, 8));
    }
  };

  // Mailbox Item Action Handler
  const handleMailboxItemAction = async (
    id: string,
    action: 'mark_read' | 'mark_unread' | 'approve' | 'reject' | 'archive' | 'delete',
    customCode?: string,
    notes?: string
  ) => {
    try {
      const res = await actionMailboxItem(id, {
        ceoCode: currentMember.code,
        action,
        customCode,
        notes,
      });

      if (res.success) {
        notify(res.message, 'success');
        setApproveModalMail(null);
        setApproveCustomCode('');
        loadData();
      } else {
        notify(res.message, 'error');
      }
    } catch (err: any) {
      notify(err.message || 'Error updating mailbox item.', 'error');
    }
  };

  const unreadMailCount = mailboxItems.filter((m) => m.status === 'unread').length;
  const pendingRequestsCount = memberRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#070b14] text-[#eef3fa] flex flex-col font-sans selection:bg-[#3da9fc]/30 selection:text-[#59e3ff]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0e1726]/95 backdrop-blur-md border-b border-[#1d2a3e] px-3 sm:px-6 py-3 shadow-xl shadow-black/40">
        <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Back Navigation */}
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
                {isCeo ? 'Founder & CEO Master' : 'Co-Founder Suite'}
              </span>
            </div>
          </div>

          {/* Member Chip & Logout */}
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
      <div className="border-b border-[#1d2a3e] bg-[#0b1220] px-3 sm:px-6">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          {/* Tab 1: Directory (CEO Only) */}
          {isCeo && (
            <button
              onClick={() => setActiveTab('directory')}
              className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === 'directory'
                  ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                  : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>See Generated Numbers &amp; Members ({members.length})</span>
            </button>
          )}

          {/* Tab: Executive Mailbox & Requests */}
          <button
            onClick={() => setActiveTab('mailbox')}
            className={`btn-interactive flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'mailbox'
                ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Executive Mailbox ({mailboxItems.length})</span>
            {unreadMailCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-extrabold animate-pulse">
                {unreadMailCount} new
              </span>
            )}
          </button>

          {/* Tab 2: Assign Code (CEO Only) */}
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

          {/* Tab 3: Member Requests & Approvals */}
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

          {/* Tab 4: Enhanced Project Management */}
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

          {/* Tab 5: Dual Messaging (Group Chat & DMs) */}
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
        
        {/* ================= TAB 1: DIRECTORY & GENERATED CODES ================= */}
        {activeTab === 'directory' && isCeo && (
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

            {/* Clean Table without serial tags or survey numbers */}
            <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1220] border-b border-[#1d2a3e] text-[#9db0c8] uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">8-Character Access Code</th>
                      <th className="py-3 px-4">Role &amp; Share</th>
                      <th className="py-3 px-4">Contact (Masked)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d2a3e]">
                    {members.map((mem) => {
                      const isTargetCeo = mem.role === 'ceo' || mem.code === '30072012';
                      const roleConfig = WORKSPACE_ROLES_CONFIG.find((c) => c.role === mem.role);

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

                          {/* 8-Character Access Code (Strictly protected for Master) */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {isTargetCeo ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-xs font-mono">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>Master Access</span>
                              </span>
                            ) : (
                              <div className="inline-flex items-center gap-2 bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc]/40 px-3 py-1 rounded-lg">
                                <span className="font-mono text-sm font-bold text-[#59e3ff] tracking-wider">
                                  {revealedCodeIds.has(mem.id)
                                    ? mem.code
                                    : maskAccessCode(mem.code)}
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
                                  onClick={() => copyToClipboard(mem.code)}
                                  title="Copy code"
                                  className="text-[#9db0c8] hover:text-white transition p-0.5 cursor-pointer"
                                >
                                  {copiedCode === mem.code ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                            )}
                          </td>

                          {/* Role & Share */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-semibold text-white">{mem.position}</div>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 border ${
                                roleConfig?.badgeColor || 'bg-[#1d2a3e] text-[#9db0c8] border-[#1d2a3e]'
                              }`}
                            >
                              {roleConfig?.title || mem.role} &bull; {mem.commissionShare || roleConfig?.share || ''}
                            </span>
                          </td>

                          {/* Contact Details (Masked) */}
                          <td className="py-3.5 px-4 text-[#9db0c8] whitespace-nowrap">
                            <div className="font-mono text-xs text-white">{maskEmailAddress(mem.email)}</div>
                            <div className="text-[11px] font-mono text-[#59e3ff]">{maskPhoneNumber(mem.phone)}</div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              mem.status === 'suspended'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {mem.status === 'suspended' ? 'Suspended' : 'Active'}
                            </span>
                          </td>

                          {/* Action (Master Edit & Live Removal Sync) */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {isTargetCeo ? (
                              <span className="text-[11px] text-amber-300 font-bold bg-amber-400/15 px-3 py-1 rounded-lg border border-amber-400/30 inline-flex items-center gap-1.5 shadow-sm">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                <span>Master Founder</span>
                              </span>
                            ) : (
                              <div className="flex items-center justify-end gap-1.5">
                                {isCeo && (
                                  <button
                                    onClick={() => handleOpenEditMember(mem)}
                                    className="btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 text-xs font-bold transition cursor-pointer"
                                    title="Edit member details, role, commission share and code"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Details</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleOpenPasswordModal(mem)}
                                  className="btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#3da9fc]/15 hover:bg-[#3da9fc] text-[#59e3ff] hover:text-[#070b14] border border-[#3da9fc]/40 text-xs font-bold transition cursor-pointer"
                                  title="Change access code / password"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                  <span>Password</span>
                                </button>
                                <button
                                  onClick={() => handleRemoveMember(mem)}
                                  disabled={isLoading}
                                  className="btn-interactive inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                                  title="Remove member permanently from database"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Remove</span>
                                </button>
                              </div>
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

        {/* ================= TAB: EXECUTIVE MAILBOX & INCOMING REQUESTS ================= */}
        {activeTab === 'mailbox' && (
          <div className="space-y-6 animate-fade-in">
            {/* Header banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#070b14] border border-[#3da9fc]/60 text-[#59e3ff] shadow-md shadow-[#3da9fc]/10">
                  <Inbox className="w-6 h-6" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-1">
                    <Crown className="w-3 h-3" />
                    <span>Executive Mailbox &bull; Direct Joining Channel</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
                    Incoming Requests &amp; Team Applications
                  </h3>
                  <p className="text-xs text-[#9db0c8]">
                    Public "Work With SAMZEN" applications, co-founder member recommendations, and project submissions routed directly here.
                  </p>
                </div>
              </div>

              {/* Counter Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs">
                  <span className="text-[#9db0c8]">Total Mails: </span>
                  <strong className="text-white font-mono">{mailboxItems.length}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs">
                  <span className="text-rose-300">Unread: </span>
                  <strong className="text-white font-mono">{unreadMailCount}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-[#3da9fc]/15 border border-[#3da9fc]/40 text-xs">
                  <span className="text-[#59e3ff]">Team Joining: </span>
                  <strong className="text-white font-mono">
                    {mailboxItems.filter((m) => m.type === 'team_application').length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Filter Pills and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Type Category Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: 'all', label: 'All Mails', count: mailboxItems.length },
                  { id: 'website_inquiry', label: 'Website Orders', count: mailboxItems.filter(m => m.type === 'website_inquiry').length },
                  { id: 'service_request', label: 'Client Requests', count: mailboxItems.filter(m => m.type === 'service_request').length },
                  { id: 'team_application', label: 'Team Applications', count: mailboxItems.filter(m => m.type === 'team_application').length },
                  { id: 'member_request', label: 'Member Requests', count: mailboxItems.filter(m => m.type === 'member_request').length },
                  { id: 'project_application', label: 'Project Applications', count: mailboxItems.filter(m => m.type === 'project_application').length },
                  { id: 'general_inquiry', label: 'General', count: mailboxItems.filter(m => m.type === 'general_inquiry').length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMailboxFilter(cat.id as any)}
                    className={`btn-interactive px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      mailboxFilter === cat.id
                        ? 'bg-[#3da9fc] text-[#070b14] shadow-md shadow-[#3da9fc]/20'
                        : 'bg-[#0e1726] text-[#9db0c8] hover:text-white border border-[#1d2a3e]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className="ml-1.5 text-[11px] opacity-80 font-mono">({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Status and Search + Founder Bulk Mailbox Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <select
                  value={mailboxStatusFilter}
                  onChange={(e) => setMailboxStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-[#0e1726] border border-[#1d2a3e] text-xs text-white cursor-pointer focus:outline-none focus:border-[#3da9fc]"
                >
                  <option value="all">All Statuses</option>
                  <option value="unread">Unread Only</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Declined</option>
                  <option value="archived">Archived</option>
                </select>

                <input
                  type="text"
                  placeholder="Search applicant, phone, or role..."
                  value={mailboxSearch}
                  onChange={(e) => setMailboxSearch(e.target.value)}
                  className="w-full sm:w-52 px-3.5 py-2 bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                />

                {isCeo && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleClearMailbox('read')}
                      className="btn-interactive px-2.5 py-2 rounded-xl bg-[#0e1726] hover:bg-[#15233a] border border-[#1d2a3e] text-[11px] font-semibold text-[#9db0c8] hover:text-white whitespace-nowrap"
                      title="Clear all read mailbox items"
                    >
                      Clear Read
                    </button>
                    <button
                      onClick={() => handleClearMailbox('all')}
                      className="btn-interactive px-2.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-[11px] font-bold whitespace-nowrap"
                      title="Clear all messages in mailbox"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mail Items Listing */}
            {mailboxItems.filter((m) => {
              if (mailboxFilter !== 'all' && m.type !== mailboxFilter) return false;
              if (mailboxStatusFilter !== 'all' && m.status !== mailboxStatusFilter) return false;
              if (mailboxSearch.trim()) {
                const q = mailboxSearch.toLowerCase();
                const matchName = m.senderName.toLowerCase().includes(q);
                const matchRole = (m.roleApplied || '').toLowerCase().includes(q);
                const matchPhone = (m.senderPhone || '').toLowerCase().includes(q);
                const matchContent = m.content.toLowerCase().includes(q);
                const matchTitle = m.title.toLowerCase().includes(q);
                return matchName || matchRole || matchPhone || matchContent || matchTitle;
              }
              return true;
            }).length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
                <Mail className="w-10 h-10 text-[#50637a] mx-auto mb-3" />
                <h4 className="text-base font-bold text-white mb-1">No Messages in Selected Filter</h4>
                <p className="text-xs text-[#9db0c8]">
                  Website inquiries, client support requests, and candidate applications will automatically route here for Founder review.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mailboxItems
                  .filter((m) => {
                    if (mailboxFilter !== 'all' && m.type !== mailboxFilter) return false;
                    if (mailboxStatusFilter !== 'all' && m.status !== mailboxStatusFilter) return false;
                    if (mailboxSearch.trim()) {
                      const q = mailboxSearch.toLowerCase();
                      const matchName = m.senderName.toLowerCase().includes(q);
                      const matchRole = (m.roleApplied || '').toLowerCase().includes(q);
                      const matchPhone = (m.senderPhone || '').toLowerCase().includes(q);
                      const matchContent = m.content.toLowerCase().includes(q);
                      const matchTitle = m.title.toLowerCase().includes(q);
                      return matchName || matchRole || matchPhone || matchContent || matchTitle;
                    }
                    return true;
                  })
                  .map((mail) => {
                    const isUnread = mail.status === 'unread';
                    const isApproved = mail.status === 'approved';
                    const isRejected = mail.status === 'rejected';
                    const isArchived = mail.status === 'archived';

                    return (
                      <div
                        key={mail.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                          isUnread
                            ? 'bg-[#0e1726] border-[#3da9fc] shadow-lg shadow-[#3da9fc]/10'
                            : isApproved
                            ? 'bg-[#0b1424] border-emerald-500/40'
                            : 'bg-[#0e1726]/80 border-[#1d2a3e]'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          {/* Left Column: Mail Details */}
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Type Badge */}
                              <span
                                className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                                  mail.type === 'website_inquiry'
                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                                    : mail.type === 'service_request'
                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                    : mail.type === 'team_application'
                                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                    : mail.type === 'member_request'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                    : mail.type === 'project_application'
                                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                    : 'bg-[#1d2a3e] text-[#9db0c8] border-[#1d2a3e]'
                                }`}
                              >
                                {mail.type === 'website_inquiry'
                                  ? 'Website Order Inquiry'
                                  : mail.type === 'service_request'
                                  ? 'Client Support Request'
                                  : mail.type === 'team_application'
                                  ? 'Team Joining Application'
                                  : mail.type === 'member_request'
                                  ? 'Member Recommendation'
                                  : mail.type === 'project_application'
                                  ? 'Project Application'
                                  : 'General Message'}
                              </span>

                              {/* Status Badge */}
                              {isUnread && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                                  <span>NEW / UNREAD</span>
                                </span>
                              )}
                              {isApproved && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                  APPROVED &bull; CODE: {mail.generatedCode ? maskAccessCode(mail.generatedCode) : 'ASSIGNED'}
                                </span>
                              )}
                              {isRejected && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                                  DECLINED
                                </span>
                              )}
                              {isArchived && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#1d2a3e] text-[#9db0c8]">
                                  ARCHIVED
                                </span>
                              )}

                              <span className="text-[11px] text-[#50637a] font-mono ml-auto md:ml-0">
                                {new Date(mail.createdAt).toLocaleDateString()} {new Date(mail.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Title & Sender */}
                            <div>
                              <h4 className="text-sm sm:text-base font-bold text-white">
                                {mail.title}
                              </h4>
                              <div className="flex items-center gap-3 text-xs text-[#9db0c8] mt-1 flex-wrap">
                                <span className="font-semibold text-white">
                                  👤 {mail.senderName}
                                </span>
                                {mail.senderPhone && (
                                  <span className="font-mono text-[#59e3ff]">
                                    📞 {mail.senderPhone}
                                  </span>
                                )}
                                {mail.senderEmail && (
                                  <span className="text-[#9db0c8]">
                                    ✉️ {mail.senderEmail}
                                  </span>
                                )}
                                {mail.roleApplied && (
                                  <span className="px-2 py-0.5 rounded-md bg-[#070b14] border border-[#1d2a3e] text-amber-300 font-semibold text-[11px]">
                                    {mail.roleApplied}
                                  </span>
                                )}
                                {mail.occupation && (
                                  <span className="text-[11px] text-[#9db0c8]">
                                    Org: {mail.occupation}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Content Body Preview */}
                            <p className="text-xs text-[#c9d3dc] leading-relaxed bg-[#070b14] p-3 rounded-xl border border-[#1d2a3e]/80">
                              {mail.content}
                            </p>

                            {/* Reference / Notes if present */}
                            {mail.reference && (
                              <div className="text-[11px] text-[#9db0c8]">
                                <strong>Reference / Route:</strong> {mail.reference}
                              </div>
                            )}
                          </div>

                          {/* Right Column: Actions (Fully optimized for Mobile Touch & Desktop) */}
                          <div className="flex md:flex-col items-stretch md:items-end gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-[#1d2a3e] flex-wrap md:flex-nowrap">
                            {/* View Details Button */}
                            <button
                              onClick={() => setSelectedMailDetail(mail)}
                              className="btn-interactive inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3da9fc]/15 hover:bg-[#3da9fc] text-[#59e3ff] hover:text-[#070b14] border border-[#3da9fc]/40 text-xs font-bold transition cursor-pointer min-h-[36px]"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>

                            {/* Approve & Generate Code Button for Joining Applications */}
                            {(mail.type === 'team_application' || mail.type === 'member_request') && !isApproved && (
                              <button
                                onClick={() => {
                                  setApproveModalMail(mail);
                                  setApproveCustomCode('');
                                }}
                                className="btn-interactive inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer min-h-[36px]"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve &amp; Code</span>
                              </button>
                            )}

                            {/* WhatsApp Direct Call/Chat */}
                            {mail.senderPhone && (
                              <a
                                href={`https://wa.me/${mail.senderPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(mail.senderName)}%2C%20this%20is%20Samarth%20Zende%20(Founder%20%26%20CEO%20at%20SAMZEN).%20I%20reviewed%20your%20request!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-interactive inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold min-h-[36px]"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            )}

                            {/* Mark Read/Unread */}
                            <button
                              onClick={() => handleMailboxItemAction(mail.id, isUnread ? 'mark_read' : 'mark_unread')}
                              className="btn-interactive px-3 py-1.5 rounded-xl bg-[#070b14] hover:bg-[#111c2e] border border-[#1d2a3e] text-[#9db0c8] hover:text-white text-xs font-semibold cursor-pointer min-h-[36px]"
                            >
                              {isUnread ? 'Mark Read' : 'Mark Unread'}
                            </button>

                            {/* Decline / Reject if not rejected */}
                            {!isRejected && !isApproved && (
                              <button
                                onClick={() => handleMailboxItemAction(mail.id, 'reject')}
                                className="btn-interactive px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold cursor-pointer min-h-[36px]"
                              >
                                Decline
                              </button>
                            )}

                            {/* Instant 1-Click Delete Button (Founder Absolute Authority) */}
                            {isCeo && (
                              <button
                                onClick={() => handleInstantDeleteMail(mail.id, mail.senderName)}
                                className="btn-interactive inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer min-h-[36px] active:scale-95 shadow-sm"
                                title="Instantly delete email or request permanently from mailbox"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Instant Delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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
                Fill in member credentials and assign an updated role. You can type a custom 8-character code (supporting symbols like #, ₹, +, ×, ÷, @, %, =, / and letters/numbers) or leave blank to auto-generate.
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
                    placeholder="e.g. Rahul Sharma"
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
                      Role &amp; Commission Share *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as WorkspaceRole)}
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                    >
                      <option value="cofounder">Co-Founder (10% to 20% share)</option>
                      <option value="executive_head">Executive Head / Manager (10% to 15% share)</option>
                      <option value="contractor">Contractor (3% to 10% share)</option>
                      <option value="home_servicer">Home Servicer (Field &amp; Publishing)</option>
                      <option value="caller_helper">Caller &amp; Helper (1% to 3% share)</option>
                      <option value="member">Regular Member</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                      Designation / Position Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="e.g. Senior Client Acquisition Lead"
                      className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                    />
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
            {/* If Co-Founder, show request submission form */}
            {isCofounder && (
              <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 sm:p-7 shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <UserPlus className="w-5 h-5 text-[#3da9fc]" />
                  <h3 className="text-base font-bold text-white font-heading">
                    Submit Member Creation Request (Requires CEO Approval)
                  </h3>
                </div>
                <p className="text-xs text-[#9db0c8] mb-4">
                  As Co-Founder, you can propose new candidates. CEO Samarth Zende reviews and issues their official 8-character access code.
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

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Proposed Role *</label>
                      <select
                        value={reqRole}
                        onChange={(e) => setReqRole(e.target.value as WorkspaceRole)}
                        className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                      >
                        <option value="executive_head">Executive Head / Manager (10% to 15%)</option>
                        <option value="contractor">Contractor (3% to 10%)</option>
                        <option value="home_servicer">Home Servicer</option>
                        <option value="caller_helper">Caller &amp; Helper (1% to 3%)</option>
                        <option value="member">Regular Member</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#9db0c8] mb-1">Proposed Position *</label>
                      <input
                        type="text"
                        required
                        value={reqPosition}
                        onChange={(e) => setReqPosition(e.target.value)}
                        placeholder="e.g. Sales Specialist"
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

        {/* ================= TAB 4: ENHANCED PROJECT MANAGEMENT (ADD, DELETE, ASSIGN PEOPLE) ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Add New Project Form */}
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
                    Requirements &amp; Tech Stack (comma-separated)
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

            {/* 1b. Complete Project Cleanup Controls (Founder Exclusive) */}
            {isCeo && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0b1220] border border-amber-400/40 shadow-xl shadow-amber-400/5">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm">
                    <Crown className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-1">
                      <span>Founder Administrative Control &bull; Master Cleanup</span>
                    </div>
                    <h4 className="text-base font-bold text-white font-heading">
                      Complete Project Cleanup &amp; Purge Authority
                    </h4>
                    <p className="text-xs text-[#9db0c8]">
                      Absolute administrative authority to clear out and delete any project from the system—including old, outdated, rejected, or unwanted projects—permanently and instantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleCleanupProjects('completed')}
                    className="btn-interactive inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 text-xs font-bold transition cursor-pointer"
                    title="Clean out all finished or completed projects from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Completed ({projects.filter((p) => p.status === 'completed').length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCleanupProjects('outdated')}
                    className="btn-interactive inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer"
                    title="Purge projects older than 7 days"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Outdated</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to purge all projects from the system?')) {
                        handleCleanupProjects('all');
                      }
                    }}
                    className="btn-interactive inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/30 transition cursor-pointer"
                    title="Clear out all projects permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge All</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Active Projects with Delete and Assign Controls */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-heading">
                    Active Projects &amp; Assigned Teams ({projects.length})
                  </h3>
                  <span className="text-xs text-[#59e3ff] font-mono">
                    [{projects.filter((p) => p.status === 'open').length} Open]
                  </span>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1 bg-[#0e1726] border border-[#1d2a3e] p-1 rounded-xl text-xs">
                    {(['all', 'open', 'in_progress', 'completed'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setProjectStatusFilter(st)}
                        className={`px-2.5 py-1 rounded-lg font-bold capitalize transition ${
                          projectStatusFilter === st
                            ? 'bg-[#3da9fc] text-[#070b14]'
                            : 'text-[#9db0c8] hover:text-white'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full sm:w-44 px-3 py-1.5 bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none"
                  />
                </div>
              </div>

              {projects
                .filter((p) => {
                  if (projectStatusFilter !== 'all' && p.status !== projectStatusFilter) return false;
                  if (projectSearch.trim()) {
                    const q = projectSearch.toLowerCase();
                    return (
                      p.title.toLowerCase().includes(q) ||
                      p.description.toLowerCase().includes(q) ||
                      p.location.toLowerCase().includes(q)
                    );
                  }
                  return true;
                }).length === 0 ? (
                <div className="p-10 text-center rounded-2xl bg-[#0e1726] border border-[#1d2a3e]">
                  <Briefcase className="w-8 h-8 text-[#50637a] mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">No projects found in this filter.</p>
                  <p className="text-xs text-[#9db0c8] mt-1">Use "Post New Project" above to create one.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects
                    .filter((p) => {
                      if (projectStatusFilter !== 'all' && p.status !== projectStatusFilter) return false;
                      if (projectSearch.trim()) {
                        const q = projectSearch.toLowerCase();
                        return (
                          p.title.toLowerCase().includes(q) ||
                          p.description.toLowerCase().includes(q) ||
                          p.location.toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((proj) => (
                    <div
                      key={proj.id}
                      className="p-5 rounded-2xl bg-[#0e1726] border border-[#1d2a3e] flex flex-col justify-between space-y-4 shadow-lg hover:border-[#3da9fc]/40 transition"
                    >
                      <div>
                        {/* Top Badges & Instant Delete Button */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {proj.status}
                            </span>
                            <span className="text-xs font-mono text-[#59e3ff] font-bold">
                              {proj.budget}
                            </span>
                          </div>

                          {/* Founder 1-Click Instant Permanent Project Deletion */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                            title="Founder Instant Delete: Permanently wipe this project from database"
                            className="btn-interactive inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer min-h-[34px] active:scale-95"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Instant</span>
                          </button>
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1.5">{proj.title}</h4>
                        <p className="text-xs text-[#9db0c8] mb-3 leading-relaxed">{proj.description}</p>

                      {/* Stack Badges */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {proj.requirements.map((r, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e] text-[#59e3ff]">
                            {r}
                          </span>
                        ))}
                      </div>

                      {/* Assigned People Section */}
                      <div className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#9db0c8]">
                          <span className="font-semibold text-white">Assigned Team Members:</span>
                          <span className="text-[#59e3ff]">{proj.assignedMembers?.length || 0} assigned</span>
                        </div>

                        {proj.assignedMembers && proj.assignedMembers.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {proj.assignedMembers.map((am) => (
                              <div
                                key={am.id}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e1726] border border-[#3da9fc]/30 text-xs text-white"
                              >
                                <span className="font-medium">{am.name}</span>
                                <span className="text-[9px] text-[#59e3ff]">({am.position})</span>
                                <button
                                  type="button"
                                  onClick={() => handleUnassignPerson(proj.id, am.id)}
                                  title="Unassign member"
                                  className="text-[#9db0c8] hover:text-rose-400 ml-1 cursor-pointer"
                                >
                                  &times;
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-[#50637a] italic">
                            No members assigned yet. Use the selector below to assign someone.
                          </div>
                        )}

                        {/* Assign Member Control */}
                        <div className="pt-2 flex items-center gap-2">
                          <select
                            value={selectedAssignMemberId[proj.id] || ''}
                            onChange={(e) =>
                              setSelectedAssignMemberId((prev) => ({
                                ...prev,
                                [proj.id]: e.target.value,
                              }))
                            }
                            className="flex-1 px-2.5 py-1.5 bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-lg text-xs text-white focus:outline-none"
                          >
                            <option value="">Select team member to assign...</option>
                            {members.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name} ({m.position} - {m.role})
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleAssignPerson(proj.id)}
                            className="btn-interactive px-3 py-1.5 rounded-lg bg-[#3da9fc] text-[#070b14] text-xs font-bold whitespace-nowrap cursor-pointer"
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1d2a3e] text-[11px] text-[#9db0c8] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#59e3ff]">
                        <MapPin className="w-3 h-3" />
                        <span>{proj.location}</span>
                      </div>
                      <div className="font-semibold text-white">{proj.applicantCount || 0} Applied</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>

            {/* 3. Candidate Applications Review Queue (Confidential to CEO & Co-Founders) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Member Candidate Applications ({applications.length})
                </h3>
                <span className="text-[10px] text-amber-300 uppercase font-mono px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30">
                  Strictly Confidential: CEO &amp; Co-Founders Only
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

        {/* ================= TAB 5: DUAL MESSAGING SYSTEM (GROUP CHAT & DMs) ================= */}
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

      {/* Modal: Change Member Password / Access Code */}
      {memberForPasswordChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0e1726] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-7 shadow-2xl text-[#eef3fa]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1d2a3e]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-[#3da9fc] text-[#59e3ff]">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Change Member Password / Code
                  </h3>
                  <p className="text-xs text-[#9db0c8]">
                    {memberForPasswordChange.name} ({memberForPasswordChange.position})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMemberForPasswordChange(null)}
                className="p-1 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitPasswordChange} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                  New 8-Character Password / Access Code *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    maxLength={8}
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value.slice(0, 8))}
                    placeholder="e.g. #78@90*₹"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-sm font-mono text-white tracking-widest focus:outline-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9db0c8] hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#9db0c8]">
                  <span>Supports symbols (#, ₹, +, ×, ÷, @, %, =, /), digits &amp; letters</span>
                  <span className="font-mono">{newPasswordInput.length}/8 chars</span>
                </div>
              </div>

              {/* Symbol shortcut bar */}
              <div>
                <span className="text-[10px] text-[#9db0c8] uppercase font-bold tracking-wider mb-1 block">
                  Quick Symbol Shortcuts:
                </span>
                <div className="flex flex-wrap gap-1">
                  {['#', '₹', '+', '×', '÷', '@', '%', '=', '/'].map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => insertPasswordSymbol(sym)}
                      className="px-2 py-1 rounded bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-xs font-mono text-[#59e3ff] hover:bg-[#111c2e]"
                    >
                      {sym}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={handleAutoGenerateNewPassword}
                    className="px-2 py-1 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 hover:bg-amber-400/30 text-xs font-bold ml-auto"
                  >
                    Random 8-Digit
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMemberForPasswordChange(null)}
                  className="px-4 py-2 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword || newPasswordInput.trim().length !== 8}
                  className="btn-interactive px-5 py-2 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] text-xs font-extrabold shadow-lg shadow-[#3da9fc]/30 disabled:opacity-50 cursor-pointer"
                >
                  {isChangingPassword ? 'Saving...' : 'Update Password / Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Approve Mailbox Candidate & Assign Code */}
      {approveModalMail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0e1726] border-2 border-emerald-500 rounded-2xl p-6 sm:p-7 shadow-2xl text-[#eef3fa]">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1d2a3e]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#070b14] border border-emerald-500 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    Approve &amp; Onboard Candidate
                  </h3>
                  <p className="text-xs text-emerald-300">
                    {approveModalMail.senderName} &bull; {approveModalMail.roleApplied}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApproveModalMail(null)}
                className="p-1 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs space-y-1">
                <div><strong>Candidate:</strong> {approveModalMail.senderName}</div>
                <div><strong>Phone:</strong> {approveModalMail.senderPhone || 'Not specified'}</div>
                <div><strong>Role Assigned:</strong> {approveModalMail.roleApplied}</div>
                {approveModalMail.occupation && <div><strong>Current:</strong> {approveModalMail.occupation}</div>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                  Assign 8-Character Access Code (Optional &mdash; leave blank to auto-generate)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  value={approveCustomCode}
                  onChange={(e) => setApproveCustomCode(e.target.value.slice(0, 8))}
                  placeholder="Leave empty for auto-generated 8-digit code"
                  className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-emerald-500 rounded-xl text-sm font-mono text-white tracking-widest focus:outline-none"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-[#9db0c8]">
                  <span>Supports symbols (#, ₹, +, ×, ÷, @, %, =, /), digits &amp; letters</span>
                  <span className="font-mono">{approveCustomCode.length}/8 chars</span>
                </div>
              </div>

              {/* Symbol shortcut bar */}
              <div className="flex flex-wrap gap-1">
                {['#', '₹', '+', '×', '÷', '@', '%', '=', '/'].map((sym) => (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => {
                      if (approveCustomCode.length < 8) {
                        setApproveCustomCode((prev) => (prev + sym).slice(0, 8));
                      }
                    }}
                    className="px-2 py-1 rounded bg-[#070b14] border border-[#1d2a3e] hover:border-emerald-500 text-xs font-mono text-emerald-300 hover:bg-[#111c2e]"
                  >
                    {sym}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApproveModalMail(null)}
                  className="px-4 py-2 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleMailboxItemAction(
                      approveModalMail.id,
                      'approve',
                      approveCustomCode.trim() || undefined
                    )
                  }
                  className="btn-interactive px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-extrabold shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Confirm Approval &amp; Onboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Master Modal: Edit Member Profile, Role, Commission Share & Credentials (STRICTLY CEO ONLY) */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-[#eef3fa] my-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1d2a3e]">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white font-heading flex items-center gap-2">
                    <span>Edit Member Profile &amp; Credentials</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      Master Control
                    </span>
                  </h3>
                  <p className="text-xs text-[#9db0c8]">
                    Founder &amp; CEO authority to modify credentials, contact info, and payouts directly.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingMember(null)}
                className="p-1 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveMemberEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Email / Gmail Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Mobile / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    System Role &amp; Permissions
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as WorkspaceRole)}
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="cofounder">Co-Founder (10% to 20% Share)</option>
                    <option value="executive_head">Executive Head / Manager (10% to 15%)</option>
                    <option value="contractor">Contractor (3% to 10% Share)</option>
                    <option value="home_servicer">Home Servicer (Field &amp; Publishing)</option>
                    <option value="caller_helper">Caller &amp; Helper (1% to 3% Share)</option>
                    <option value="member">Regular Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                    Commission Share / Rate
                  </label>
                  <input
                    type="text"
                    value={editCommissionShare}
                    onChange={(e) => setEditCommissionShare(e.target.value)}
                    placeholder="e.g. 25% Share, 15%, ₹5,000 per deal"
                    className="w-full px-3.5 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* 8-Character Access Credentials */}
              <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#9db0c8]">
                    8-Character Access Code / Password
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoGenerateEditCode}
                    className="px-2 py-0.5 rounded bg-[#3da9fc]/20 border border-[#3da9fc]/40 text-[#59e3ff] hover:bg-[#3da9fc]/30 text-[11px] font-bold cursor-pointer"
                  >
                    Auto-Generate Random
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showEditCode ? 'text' : 'password'}
                    maxLength={8}
                    required
                    value={editCode}
                    onChange={(e) => setEditCode(e.target.value.slice(0, 8))}
                    placeholder="8-character code"
                    className="w-full px-3.5 py-2.5 pr-10 bg-[#0e1726] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-sm font-mono text-white tracking-widest focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditCode(!showEditCode)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9db0c8] hover:text-[#59e3ff] p-1 cursor-pointer"
                  >
                    {showEditCode ? <EyeOff className="w-4 h-4 text-amber-300" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Symbols bar */}
                <div className="flex items-center justify-between gap-1 flex-wrap pt-1">
                  <span className="text-[10px] text-[#9db0c8]">Insert symbols:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {['#', '₹', '+', '×', '÷', '@', '%', '=', '/'].map((sym) => (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => insertEditCodeSymbol(sym)}
                        className="px-2 py-0.5 rounded bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc] text-xs font-mono text-[#59e3ff] hover:bg-[#111c2e] cursor-pointer"
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#9db0c8] mb-1">
                  Account Status
                </label>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editStatus === 'active'}
                      onChange={() => setEditStatus('active')}
                      className="text-[#3da9fc] focus:ring-0"
                    />
                    <span className="text-xs text-emerald-400 font-semibold">Active (Full Access)</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="editStatus"
                      checked={editStatus === 'suspended'}
                      onChange={() => setEditStatus('suspended')}
                      className="text-rose-500 focus:ring-0"
                    />
                    <span className="text-xs text-rose-400 font-semibold">Suspended (Access Revoked)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#1d2a3e]">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingMemberEdit}
                  className="btn-interactive px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-[#3da9fc] text-[#070b14] text-xs font-black shadow-lg shadow-amber-400/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSavingMemberEdit ? 'Saving Updates...' : 'Save Member Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mailbox Item Detail Modal (Mobile & Desktop Touch Optimized) */}
      {selectedMailDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-5 sm:p-7 shadow-2xl text-[#eef3fa] my-6 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#1d2a3e]">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      selectedMailDetail.type === 'website_inquiry'
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : selectedMailDetail.type === 'service_request'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : selectedMailDetail.type === 'team_application'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : selectedMailDetail.type === 'member_request'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : selectedMailDetail.type === 'project_application'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-[#1d2a3e] text-[#9db0c8] border-[#1d2a3e]'
                    }`}
                  >
                    {selectedMailDetail.type === 'website_inquiry'
                      ? 'Website Order Inquiry'
                      : selectedMailDetail.type === 'service_request'
                      ? 'Client Support Request'
                      : selectedMailDetail.type === 'team_application'
                      ? 'Team Joining Application'
                      : selectedMailDetail.type === 'member_request'
                      ? 'Member Recommendation'
                      : selectedMailDetail.type === 'project_application'
                      ? 'Project Application'
                      : 'General Message'}
                  </span>

                  {selectedMailDetail.status === 'unread' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>NEW / UNREAD</span>
                    </span>
                  )}
                  {selectedMailDetail.status === 'approved' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      APPROVED {selectedMailDetail.generatedCode ? `• CODE: ${maskAccessCode(selectedMailDetail.generatedCode)}` : ''}
                    </span>
                  )}
                  <span className="text-[11px] text-[#50637a] font-mono">
                    {new Date(selectedMailDetail.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-heading">
                  {selectedMailDetail.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMailDetail(null)}
                className="p-1 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] text-lg font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto py-4 space-y-4 pr-1 text-xs">
              {/* Sender Info Card */}
              <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-2">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#59e3ff]">
                  Client / Candidate Contact Details
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#9db0c8]">Name:</span>{' '}
                    <span className="font-semibold text-white">{selectedMailDetail.senderName}</span>
                  </div>
                  {selectedMailDetail.senderPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-[#9db0c8]">Phone:</span>{' '}
                      <a
                        href={`tel:${selectedMailDetail.senderPhone}`}
                        className="font-mono text-[#59e3ff] hover:underline"
                      >
                        {selectedMailDetail.senderPhone}
                      </a>
                    </div>
                  )}
                  {selectedMailDetail.senderEmail && (
                    <div>
                      <span className="text-[#9db0c8]">Email:</span>{' '}
                      <a
                        href={`mailto:${selectedMailDetail.senderEmail}`}
                        className="text-white hover:underline"
                      >
                        {selectedMailDetail.senderEmail}
                      </a>
                    </div>
                  )}
                  {selectedMailDetail.roleApplied && (
                    <div>
                      <span className="text-[#9db0c8]">Role / Position:</span>{' '}
                      <span className="text-amber-300 font-semibold">{selectedMailDetail.roleApplied}</span>
                    </div>
                  )}
                  {selectedMailDetail.occupation && (
                    <div>
                      <span className="text-[#9db0c8]">Organization / Work:</span>{' '}
                      <span className="text-white">{selectedMailDetail.occupation}</span>
                    </div>
                  )}
                  {selectedMailDetail.reference && (
                    <div className="sm:col-span-2">
                      <span className="text-[#9db0c8]">Routing &amp; Reference:</span>{' '}
                      <span className="font-mono text-emerald-300">{selectedMailDetail.reference}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Extended Details if present (e.g. Website Order details, features, plan) */}
              {selectedMailDetail.details && Object.keys(selectedMailDetail.details).length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-2">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-amber-300">
                    Project &amp; Requirement Specifications
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedMailDetail.details.plan && (
                      <div className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                        <span className="text-[11px] text-[#9db0c8] block">Selected Package:</span>
                        <span className="font-bold text-white text-xs">{String(selectedMailDetail.details.plan)}</span>
                      </div>
                    )}
                    {selectedMailDetail.details.budget && (
                      <div className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                        <span className="text-[11px] text-[#9db0c8] block">Budget:</span>
                        <span className="font-bold text-emerald-400 text-xs">{String(selectedMailDetail.details.budget)}</span>
                      </div>
                    )}
                    {selectedMailDetail.details.timeline && (
                      <div className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                        <span className="text-[11px] text-[#9db0c8] block">Desired Timeline:</span>
                        <span className="font-bold text-white text-xs">{String(selectedMailDetail.details.timeline)}</span>
                      </div>
                    )}
                    {selectedMailDetail.details.service && (
                      <div className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                        <span className="text-[11px] text-[#9db0c8] block">Service Requested:</span>
                        <span className="font-bold text-white text-xs">{String(selectedMailDetail.details.service)}</span>
                      </div>
                    )}
                  </div>

                  {Array.isArray(selectedMailDetail.details.features) && selectedMailDetail.details.features.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] text-[#9db0c8] block mb-1">Features Requested:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedMailDetail.details.features.map((f: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-[#1d2a3e] text-[#59e3ff] text-[11px] font-medium"
                          >
                            ✓ {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedMailDetail.details.whatsappUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedMailDetail.details.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-bold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open WhatsApp Chat with Order Payload</span>
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Message Content */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#9db0c8] mb-1.5">
                  Message / Inquired Specifications
                </label>
                <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs text-[#c9d3dc] leading-relaxed whitespace-pre-wrap select-text">
                  {selectedMailDetail.content}
                </div>
              </div>
            </div>

            {/* Modal Actions Footer (Touch-optimized for mobile single-tap) */}
            <div className="pt-3 border-t border-[#1d2a3e] flex flex-wrap items-center justify-between gap-2">
              {/* Founder Single-Click Instant Delete */}
              <button
                type="button"
                onClick={async () => {
                  const idToDelete = selectedMailDetail.id;
                  setSelectedMailDetail(null);
                  await handleInstantDeleteMail(idToDelete);
                }}
                className="btn-interactive inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition cursor-pointer min-h-[44px]"
                title="Permanently remove from mailbox with single click"
              >
                <Trash2 className="w-4 h-4 text-rose-400 group-hover:text-white" />
                <span>Delete Instantly</span>
              </button>

              <div className="flex items-center gap-2 flex-wrap ml-auto">
                {/* WhatsApp button */}
                {selectedMailDetail.senderPhone && (
                  <a
                    href={`https://wa.me/${selectedMailDetail.senderPhone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedMailDetail.senderName)}%2C%20this%20is%20Samarth%20Zende%20(Founder%20%26%20CEO%20at%20SAMZEN).%20I%20reviewed%20your%20request!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-interactive inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-[#25D366] text-xs font-bold min-h-[44px]"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {/* Direct Phone Call */}
                {selectedMailDetail.senderPhone && (
                  <a
                    href={`tel:${selectedMailDetail.senderPhone}`}
                    className="btn-interactive inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#3da9fc]/20 hover:bg-[#3da9fc]/30 border border-[#3da9fc]/40 text-[#59e3ff] text-xs font-bold min-h-[44px]"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </a>
                )}

                {/* Approve Button if application */}
                {(selectedMailDetail.type === 'team_application' || selectedMailDetail.type === 'member_request') &&
                  selectedMailDetail.status !== 'approved' && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetMail = selectedMailDetail;
                        setSelectedMailDetail(null);
                        setApproveModalMail(targetMail);
                        setApproveCustomCode('');
                      }}
                      className="btn-interactive inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-extrabold shadow-md shadow-emerald-500/20 cursor-pointer min-h-[44px]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve &amp; Code</span>
                    </button>
                  )}

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedMailDetail(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white cursor-pointer min-h-[44px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
