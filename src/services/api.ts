import { User, OtpRequestResponse, ServiceRequest, WebsiteEnquiryPayload, WebsiteEnquiryResponse } from '../types';

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

/**
 * Resilient JSON fetch helper ensuring no non-JSON / HTML response crashes with a SyntaxError.
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
      console.warn(`[Public API] Expected JSON from ${url} but received ${contentType} (status ${res.status}):`, text.slice(0, 100));
      return fallback;
    }
    const data = (await res.json()) as T;
    return data ?? fallback;
  } catch (err) {
    console.warn(`[Public API] Network error for ${url}:`, err);
    return fallback;
  }
}

export async function requestOtp(target: string, type: 'email' | 'phone', purpose: string = 'verification'): Promise<OtpRequestResponse> {
  return await safeFetchJson<OtpRequestResponse>(
    '/api/otp/request',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, type, purpose }),
    },
    {
      success: false,
      message: 'Server communication error. Please try again.',
      targetType: type,
      targetValue: target,
      expiresInSeconds: 0,
    }
  );
}

export async function verifyOtp(target: string, otp: string): Promise<{ success: boolean; message: string }> {
  return await safeFetchJson<{ success: boolean; message: string }>(
    '/api/otp/verify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, otp }),
    },
    { success: false, message: 'Server communication error. Please try again.' }
  );
}

export async function signupUser(params: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  otpVerified: boolean;
}): Promise<{ success: boolean; message: string; user?: User }> {
  const data = await safeFetchJson<{ success: boolean; message: string; user?: User }>(
    '/api/auth/signup',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error during signup.' }
  );

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
  const data = await safeFetchJson<{ success: boolean; message: string; user?: User }>(
    '/api/auth/login',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error during sign in.' }
  );

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
  return await safeFetchJson<{ success: boolean; message: string }>(
    '/api/auth/reset-password',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    },
    { success: false, message: 'Server communication error during password reset.' }
  );
}

export async function submitServiceRequest(payload: Partial<ServiceRequest>): Promise<{ success: boolean; message: string; request?: ServiceRequest }> {
  return await safeFetchJson<{ success: boolean; message: string; request?: ServiceRequest }>(
    '/api/service-request',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    { success: false, message: 'Server communication error submitting service request.' }
  );
}

export async function getServiceRequests(userId?: string, email?: string): Promise<{ success: boolean; requests: ServiceRequest[] }> {
  const query = new URLSearchParams();
  if (userId) query.append('userId', userId);
  if (email) query.append('email', email);

  return await safeFetchJson<{ success: boolean; requests: ServiceRequest[] }>(
    `/api/service-requests?${query.toString()}`,
    undefined,
    { success: false, requests: [] }
  );
}

export async function sendChatMessage(messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>): Promise<{ success: boolean; reply: string }> {
  return await safeFetchJson<{ success: boolean; reply: string }>(
    '/api/chat',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    },
    { success: false, reply: 'Unable to reach assistant service at this moment.' }
  );
}

export async function submitWebsiteEnquiry(payload: WebsiteEnquiryPayload): Promise<WebsiteEnquiryResponse> {
  return await safeFetchJson<WebsiteEnquiryResponse>(
    '/api/website-enquiry',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    {
      success: false,
      message: 'Server communication error submitting enquiry.',
      whatsappUrl: '',
      directGmailUrl: '',
    }
  );
}
