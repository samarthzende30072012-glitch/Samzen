import { getAccessToken } from './googleDriveAuth';

const GMAIL_API_BASE = 'https://gmail.googleapis.com/gmail/v1/users/me';

/**
 * Send an email directly via Gmail API on behalf of the authenticated client
 */
export const sendGmailMessage = async (params: {
  to: string;
  subject: string;
  body: string;
  cc?: string;
}): Promise<{ id: string; threadId: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Gmail authentication required.');

  // Create standard MIME message
  const lines: string[] = [
    `To: ${params.to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    params.body,
  ];

  if (params.cc) {
    lines.splice(1, 0, `Cc: ${params.cc}`);
  }

  const rawMessage = lines.join('\r\n');
  const encodedMessage = btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch(`${GMAIL_API_BASE}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to send email via Gmail.');
  }

  return await res.json();
};
