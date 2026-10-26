import {
  WorkspaceMember,
  WorkspaceRole,
  WorkspaceProject,
  WorkspaceApplication,
  MemberCreationRequest,
  ProfileChangeRequest,
  WorkspaceMessage,
  DirectMessage,
  MailboxItem
} from '../types';

const WORKSPACE_STORAGE_KEY = 'samzen_workspace_member';

export const workspaceStorage = {
  getMember(): WorkspaceMember | null {
    try {
      const data = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setMember(member: WorkspaceMember): void {
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(member));
    } catch (e) {
      console.error('Failed to save workspace session', e);
    }
  },
  clearMember(): void {
    try {
      localStorage.removeItem(WORKSPACE_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear workspace session', e);
    }
  }
};

/**
 * Robust JSON fetch helper that verifies content-type and safely handles HTML/error fallbacks.
 * Prevents "Unexpected token '<', <html>..." JSON parse crashes.
 */
async function safeFetchJson<T>(
  url: string,
  options?: RequestInit,
  fallback: T = {} as T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await res.text();
      console.warn(`[Workspace API] Expected JSON from ${url} but received ${contentType} (status ${res.status}):`, text.slice(0, 100));
      return fallback;
    }
    const data = (await res.json()) as T;
    return data ?? fallback;
  } catch (err) {
    console.warn(`[Workspace API] Network error for ${url}:`, err);
    return fallback;
  }
}

export async function loginWithAccessCode(code: string): Promise<{ success: boolean; message: string; member?: WorkspaceMember }> {
  const data = await safeFetchJson<{ success: boolean; message: string; member?: WorkspaceMember }>(
    '/api/workspace/auth',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    },
    { success: false, message: 'Server did not respond with JSON. Please try again.' }
  );

  if (data.success && data.member) {
    workspaceStorage.setMember(data.member);
  }
  return data;
}

export async function getWorkspaceMembers(ceoCode?: string): Promise<WorkspaceMember[]> {
  const url = ceoCode ? `/api/workspace/members?ceoCode=${encodeURIComponent(ceoCode)}` : '/api/workspace/members';
  const data = await safeFetchJson<{ success?: boolean; members?: WorkspaceMember[] }>(
    url,
    undefined,
    { members: [] }
  );
  return data.members || [];
}

export async function checkMemberSession(code: string): Promise<{ valid: boolean; message?: string; role?: string }> {
  return await safeFetchJson<{ valid: boolean; message?: string; role?: string }>(
    `/api/workspace/check-session?code=${encodeURIComponent(code)}`,
    undefined,
    { valid: true }
  );
}

export async function generateMemberCode(params: {
  ceoCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role?: WorkspaceRole;
  customCode?: string;
}): Promise<{ success: boolean; message: string; member?: WorkspaceMember; code?: string }> {
  return await safeFetchJson<{ success: boolean; message: string; member?: WorkspaceMember; code?: string }>(
    '/api/workspace/generate-code',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function deleteMemberByCeo(id: string, ceoCode: string): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    `/api/workspace/members/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ceoCode }),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function requestMemberCreation(params: {
  requesterCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role?: WorkspaceRole;
}): Promise<{ success: boolean; message: string; request?: MemberCreationRequest }> {
  return await safeFetchJson<{ success: boolean; message: string; request?: MemberCreationRequest }>(
    '/api/workspace/request-member',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getMemberCreationRequests(): Promise<MemberCreationRequest[]> {
  const data = await safeFetchJson<{ success?: boolean; requests?: MemberCreationRequest[] }>(
    '/api/workspace/member-requests',
    undefined,
    { requests: [] }
  );
  return data.requests || [];
}

export async function reviewMemberCreationRequest(id: string, params: {
  ceoCode: string;
  action: 'approve' | 'reject';
}): Promise<{ success: boolean; message: string; generatedCode?: string }> {
  return await safeFetchJson<{ success: boolean; message: string; generatedCode?: string }>(
    `/api/workspace/member-request/${id}/review`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function updateMemberProfileMaster(id: string, params: {
  ceoCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role?: WorkspaceRole;
  commissionShare?: string;
  code?: string;
  status?: 'active' | 'suspended';
}): Promise<{ success: boolean; message: string; member?: WorkspaceMember }> {
  return await safeFetchJson<{ success: boolean; message: string; member?: WorkspaceMember }>(
    `/api/workspace/members/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function submitProfileChangeRequest(params: {
  memberId: string;
  requestedProfile: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  reason: string;
}): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    '/api/workspace/profile-change-request',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getProfileChangeRequests(): Promise<ProfileChangeRequest[]> {
  const data = await safeFetchJson<{ success?: boolean; requests?: ProfileChangeRequest[] }>(
    '/api/workspace/profile-change-requests',
    undefined,
    { requests: [] }
  );
  return data.requests || [];
}

export async function reviewProfileChangeRequest(id: string, params: {
  ceoCode: string;
  action: 'approve' | 'reject';
}): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    `/api/workspace/profile-change-request/${id}/review`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getWorkspaceProjects(): Promise<WorkspaceProject[]> {
  const data = await safeFetchJson<{ success?: boolean; projects?: WorkspaceProject[] }>(
    '/api/workspace/projects',
    undefined,
    { projects: [] }
  );
  return data.projects || [];
}

export async function postWorkspaceProject(params: {
  authorCode: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  budget: string;
}): Promise<{ success: boolean; message: string; project?: WorkspaceProject }> {
  return await safeFetchJson<{ success: boolean; message: string; project?: WorkspaceProject }>(
    '/api/workspace/projects',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function applyForProject(projectId: string, params: {
  memberId: string;
  memberCode: string;
  coverNote?: string;
}): Promise<{ success: boolean; message: string; application?: WorkspaceApplication }> {
  return await safeFetchJson<{ success: boolean; message: string; application?: WorkspaceApplication }>(
    `/api/workspace/projects/${projectId}/apply`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getWorkspaceApplications(callerCode?: string): Promise<WorkspaceApplication[]> {
  const url = callerCode ? `/api/workspace/applications?callerCode=${encodeURIComponent(callerCode)}` : '/api/workspace/applications';
  const data = await safeFetchJson<{ success?: boolean; applications?: WorkspaceApplication[] }>(
    url,
    undefined,
    { applications: [] }
  );
  return data.applications || [];
}

export async function updateApplicationStatus(id: string, params: {
  reviewerCode: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
}): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    `/api/workspace/applications/${id}/status`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function deleteWorkspaceProject(id: string, authorCode: string): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    `/api/workspace/projects/${id}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorCode }),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function assignMemberToProject(projectId: string, params: {
  authorCode: string;
  memberId: string;
}): Promise<{ success: boolean; message: string; project?: WorkspaceProject }> {
  return await safeFetchJson<{ success: boolean; message: string; project?: WorkspaceProject }>(
    `/api/workspace/projects/${projectId}/assign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function unassignMemberFromProject(projectId: string, params: {
  authorCode: string;
  memberId: string;
}): Promise<{ success: boolean; message: string; project?: WorkspaceProject }> {
  return await safeFetchJson<{ success: boolean; message: string; project?: WorkspaceProject }>(
    `/api/workspace/projects/${projectId}/unassign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getWorkspaceMessages(): Promise<WorkspaceMessage[]> {
  const data = await safeFetchJson<{ success?: boolean; messages?: WorkspaceMessage[] }>(
    '/api/workspace/messages',
    undefined,
    { messages: [] }
  );
  return data.messages || [];
}

export async function sendWorkspaceMessage(params: {
  senderCode: string;
  content: string;
  channel?: string;
}): Promise<{ success: boolean; message: string; newMessage?: WorkspaceMessage }> {
  return await safeFetchJson<{ success: boolean; message: string; newMessage?: WorkspaceMessage }>(
    '/api/workspace/messages',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getWorkspaceDirectMessages(memberCode: string): Promise<DirectMessage[]> {
  const data = await safeFetchJson<{ success?: boolean; directMessages?: DirectMessage[] }>(
    `/api/workspace/direct-messages?memberCode=${encodeURIComponent(memberCode)}`,
    undefined,
    { directMessages: [] }
  );
  return data.directMessages || [];
}

export async function sendWorkspaceDirectMessage(params: {
  senderCode: string;
  recipientId: string;
  content: string;
}): Promise<{ success: boolean; message: string; directMessage?: DirectMessage }> {
  return await safeFetchJson<{ success: boolean; message: string; directMessage?: DirectMessage }>(
    '/api/workspace/direct-messages',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function changeMemberAccessCode(
  memberId: string,
  params: { ceoCode: string; newCode: string }
): Promise<{ success: boolean; message: string; member?: WorkspaceMember }> {
  return await safeFetchJson<{ success: boolean; message: string; member?: WorkspaceMember }>(
    `/api/workspace/members/${encodeURIComponent(memberId)}/code`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function submitTeamJoiningApplication(data: {
  fullName: string;
  mobileNumber: string;
  currentOccupation: string;
  selectedRole: string;
  reference: string;
  experienceNote: string;
}): Promise<{ success: boolean; message: string; mailId?: string }> {
  return await safeFetchJson<{ success: boolean; message: string; mailId?: string }>(
    '/api/workspace/mailbox/join-team',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function getWorkspaceMailbox(ceoCode: string): Promise<MailboxItem[]> {
  const data = await safeFetchJson<{ success?: boolean; items?: MailboxItem[] }>(
    `/api/workspace/mailbox?ceoCode=${encodeURIComponent(ceoCode)}`,
    undefined,
    { items: [] }
  );
  return data.items || [];
}

export async function actionMailboxItem(
  id: string,
  params: {
    ceoCode: string;
    action: 'mark_read' | 'mark_unread' | 'approve' | 'reject' | 'archive' | 'delete';
    customCode?: string;
    notes?: string;
  }
): Promise<{ success: boolean; message: string; generatedCode?: string; member?: WorkspaceMember }> {
  return await safeFetchJson<{ success: boolean; message: string; generatedCode?: string; member?: WorkspaceMember }>(
    `/api/workspace/mailbox/${encodeURIComponent(id)}/action`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function deleteMailboxItemDirect(id: string, ceoCode: string): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    `/api/workspace/mailbox/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ceoCode }),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function clearWorkspaceMailbox(params: {
  ceoCode: string;
  type?: string;
  status?: string;
}): Promise<{ success: boolean; message: string; remainingCount?: number }> {
  return await safeFetchJson<{ success: boolean; message: string; remainingCount?: number }>(
    '/api/workspace/mailbox/clear',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}

export async function cleanupWorkspaceProjects(params: {
  authorCode: string;
  filterType?: 'completed' | 'outdated' | 'all';
  projectIds?: string[];
}): Promise<{ success: boolean; message: string; remainingCount?: number; deletedIds?: string[] }> {
  return await safeFetchJson<{ success: boolean; message: string; remainingCount?: number; deletedIds?: string[] }>(
    '/api/workspace/projects/cleanup',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error.' }
  );
}
