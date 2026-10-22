import {
  WorkspaceMember,
  WorkspaceProject,
  WorkspaceApplication,
  MemberCreationRequest,
  ProfileChangeRequest,
  WorkspaceMessage
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

export async function loginWithAccessCode(code: string): Promise<{ success: boolean; message: string; member?: WorkspaceMember }> {
  const res = await fetch('/api/workspace/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const data = await res.json();
  if (data.success && data.member) {
    workspaceStorage.setMember(data.member);
  }
  return data;
}

export async function getWorkspaceMembers(): Promise<WorkspaceMember[]> {
  const res = await fetch('/api/workspace/members');
  const data = await res.json();
  return data.members || [];
}

export async function generateMemberCode(params: {
  ceoCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  role?: 'member' | 'cofounder';
}): Promise<{ success: boolean; message: string; member?: WorkspaceMember; code?: string }> {
  const res = await fetch('/api/workspace/generate-code', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function requestMemberCreation(params: {
  requesterCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}): Promise<{ success: boolean; message: string; request?: MemberCreationRequest }> {
  const res = await fetch('/api/workspace/request-member', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getMemberCreationRequests(): Promise<MemberCreationRequest[]> {
  const res = await fetch('/api/workspace/member-requests');
  const data = await res.json();
  return data.requests || [];
}

export async function reviewMemberCreationRequest(id: string, params: {
  ceoCode: string;
  action: 'approve' | 'reject';
}): Promise<{ success: boolean; message: string; generatedCode?: string }> {
  const res = await fetch(`/api/workspace/member-request/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function updateMemberProfileMaster(id: string, params: {
  ceoCode: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status?: 'active' | 'suspended';
}): Promise<{ success: boolean; message: string; member?: WorkspaceMember }> {
  const res = await fetch(`/api/workspace/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
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
  const res = await fetch('/api/workspace/profile-change-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getProfileChangeRequests(): Promise<ProfileChangeRequest[]> {
  const res = await fetch('/api/workspace/profile-change-requests');
  const data = await res.json();
  return data.requests || [];
}

export async function reviewProfileChangeRequest(id: string, params: {
  ceoCode: string;
  action: 'approve' | 'reject';
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/workspace/profile-change-request/${id}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getWorkspaceProjects(): Promise<WorkspaceProject[]> {
  const res = await fetch('/api/workspace/projects');
  const data = await res.json();
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
  const res = await fetch('/api/workspace/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function applyForProject(projectId: string, params: {
  memberId: string;
  memberCode: string;
  coverNote?: string;
}): Promise<{ success: boolean; message: string; application?: WorkspaceApplication }> {
  const res = await fetch(`/api/workspace/projects/${projectId}/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getWorkspaceApplications(): Promise<WorkspaceApplication[]> {
  const res = await fetch('/api/workspace/applications');
  const data = await res.json();
  return data.applications || [];
}

export async function updateApplicationStatus(id: string, params: {
  reviewerCode: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/workspace/applications/${id}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function getWorkspaceMessages(): Promise<WorkspaceMessage[]> {
  const res = await fetch('/api/workspace/messages');
  const data = await res.json();
  return data.messages || [];
}

export async function sendWorkspaceMessage(params: {
  senderCode: string;
  content: string;
  channel?: string;
}): Promise<{ success: boolean; message: string; newMessage?: WorkspaceMessage }> {
  const res = await fetch('/api/workspace/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}
