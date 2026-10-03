import { User, OtpRequestResponse, ServiceRequest } from '../types';

const USER_STORAGE_KEY = 'samzen_current_user';

export const authStorage = {
  getUser(): User | null {
    try {
      const data = localStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser(user: User): void {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to save user session', e);
    }
  },
  clearUser(): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear user session', e);
    }
  }
};

export async function requestOtp(target: string, type: 'email' | 'phone', purpose: string = 'verification'): Promise<OtpRequestResponse> {
  const res = await fetch('/api/otp/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target, type, purpose }),
  });
  return res.json();
}

export async function verifyOtp(target: string, otp: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target, otp }),
  });
  return res.json();
}

export async function signupUser(params: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  otpVerified: boolean;
}): Promise<{ success: boolean; message: string; user?: User }> {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (data.success && data.user) {
    authStorage.setUser(data.user);
  }
  return data;
}

export async function loginUser(params: {
  identifier: string;
  password?: string;
  isOtpLogin?: boolean;
}): Promise<{ success: boolean; message: string; user?: User }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (data.success && data.user) {
    authStorage.setUser(data.user);
  }
  return data;
}

export async function resetPassword(params: {
  identifier: string;
  newPassword: string;
  otpVerified: boolean;
}): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function submitServiceRequest(payload: Partial<ServiceRequest>): Promise<{ success: boolean; message: string; request?: ServiceRequest }> {
  const res = await fetch('/api/service-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function getServiceRequests(userId?: string, email?: string): Promise<{ success: boolean; requests: ServiceRequest[] }> {
  const query = new URLSearchParams();
  if (userId) query.append('userId', userId);
  if (email) query.append('email', email);

  const res = await fetch(`/api/service-requests?${query.toString()}`);
  return res.json();
}

export async function sendChatMessage(messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>): Promise<{ success: boolean; reply: string }> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  return res.json();
}

