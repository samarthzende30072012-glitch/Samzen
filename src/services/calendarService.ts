import { getAccessToken } from './googleDriveAuth';

export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
  location?: string;
}

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

/**
 * List upcoming calendar events
 */
export const listCalendarEvents = async (maxResults = 10): Promise<CalendarEventItem[]> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Google Calendar authentication required.');

  const now = new Date().toISOString();
  const url = `${CALENDAR_API_BASE}/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=${maxResults}&singleEvents=true&orderBy=startTime`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to fetch calendar events (${res.status})`);
  }

  const data = await res.json();
  return data.items || [];
};

/**
 * Schedule a consultation or delivery milestone event with Samarth Zende
 */
export const createConsultationEvent = async (params: {
  summary: string;
  description: string;
  startTime: string; // ISO string
  durationMinutes?: number;
}): Promise<CalendarEventItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Google Calendar authentication required.');

  const startDate = new Date(params.startTime);
  const duration = params.durationMinutes || 45;
  const endDate = new Date(startDate.getTime() + duration * 60000);

  const eventPayload = {
    summary: params.summary,
    description: `${params.description}\n\nOrganized via SAMZEN Web Development (Founder & CEO Samarth Zende)\nWhatsApp: +91 8605042855\nEmail: samarthzende30072012@gmail.com`,
    start: {
      dateTime: startDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    },
    attendees: [
      { email: 'samarthzende30072012@gmail.com', displayName: 'Samarth Zende (SAMZEN)' }
    ],
    reminders: {
      useDefault: true,
    },
  };

  const res = await fetch(`${CALENDAR_API_BASE}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventPayload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create calendar event.');
  }

  return await res.json();
};
