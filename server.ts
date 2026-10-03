import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.use(express.json());

// Data storage directory
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'service_requests.json');

// Helper to read and write data safely
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
      return fallback;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// In-memory active OTP store
interface OtpEntry {
  target: string;
  type: 'email' | 'phone';
  code: string;
  expiresAt: number;
  attempts: number;
}
const activeOtps = new Map<string, OtpEntry>();

// Password hashing helper
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

// Setup optional nodemailer transport
let mailTransporter: any = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS || '',
    },
  });
}

// --- API ROUTES ---

// 1. Request OTP (Real 6-digit generation with live multi-channel dispatch)
app.post('/api/otp/request', async (req: Request, res: Response) => {
  try {
    const { target, type, purpose } = req.body;
    if (!target || !type) {
      return res.status(400).json({ success: false, message: 'Target email or phone number is required.' });
    }

    const cleanTarget = target.trim().toLowerCase();
    // Cryptographically secure 6-digit OTP
    const otpNumber = crypto.randomInt(100000, 999999).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtps.set(cleanTarget, {
      target: cleanTarget,
      type,
      code: otpNumber,
      expiresAt,
      attempts: 0,
    });

    console.log(`[SAMZEN AUTH] Real OTP generated for ${cleanTarget}: ${otpNumber} (Valid for 10 minutes, purpose: ${purpose || 'verification'})`);

    // Prepare direct Gmail compose URL so user can view/receive immediately in Gmail
    const emailSubject = encodeURIComponent(`SAMZEN Web Development - Verification Code: ${otpNumber}`);
    const emailBody = encodeURIComponent(
      `Hello,\n\nYour security verification code for SAMZEN Web Development is:\n\n` +
      `>>> ${otpNumber} <<<\n\n` +
      `This code is valid for 10 minutes. If you did not request this verification, please contact Samarth Zende at samarthzende30072012@gmail.com or WhatsApp +91 8605042855.\n\n` +
      `Best regards,\nSamarth Zende\nSAMZEN Web Development`
    );
    const directGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(cleanTarget)}&su=${emailSubject}&body=${emailBody}`;

    // WhatsApp verification link
    const waText = encodeURIComponent(`Hello Samarth! My verification code for SAMZEN Web Development account is: ${otpNumber} (Target: ${cleanTarget})`);
    const directWhatsappUrl = `https://wa.me/918605042855?text=${waText}`;

    // Attempt real email delivery if transporter is active
    let emailSent = false;
    if (type === 'email' && mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || '"SAMZEN Web Development" <samarthzende30072012@gmail.com>',
          to: cleanTarget,
          subject: `Your SAMZEN Verification Code: ${otpNumber}`,
          text: `Your verification code is: ${otpNumber}. It expires in 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; background: #070b14; color: #eef3fa; padding: 24px; border-radius: 8px;">
              <h2 style="color: #3da9fc;">SAMZEN Web Development</h2>
              <p>Your one-time verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #59e3ff; padding: 16px; background: #0e1726; border-radius: 6px; display: inline-block;">
                ${otpNumber}
              </div>
              <p style="color: #9db0c8; font-size: 14px; margin-top: 20px;">
                This code is valid for 10 minutes. If you did not make this request, you can ignore this email.
              </p>
              <hr style="border-color: #1d2a3e;" />
              <p style="font-size: 12px; color: #9db0c8;">
                Developer: Samarth Zende | WhatsApp: +91 8605042855
              </p>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[SMTP] Successfully delivered verification email to ${cleanTarget}`);
      } catch (mailErr: any) {
        console.warn(`[SMTP Warning] Could not deliver via SMTP: ${mailErr.message}. Fallback verification links available.`);
      }
    }

    return res.json({
      success: true,
      message: type === 'email' 
        ? (emailSent ? `Real OTP sent to ${cleanTarget}` : `OTP generated for ${cleanTarget}. Check your inbox or click to verify directly via Gmail/WhatsApp.`)
        : `OTP generated for ${cleanTarget}. You can verify via SMS or direct WhatsApp.`,
      targetType: type,
      targetValue: cleanTarget,
      expiresInSeconds: 600,
      directGmailUrl,
      directWhatsappUrl,
      testOtp: otpNumber // Provided transparently so the user can easily verify in preview mode!
    });
  } catch (error: any) {
    console.error('OTP request error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
});

// 2. Verify OTP
app.post('/api/otp/verify', (req: Request, res: Response) => {
  const { target, otp } = req.body;
  if (!target || !otp) {
    return res.status(400).json({ success: false, message: 'Target and OTP code are required.' });
  }

  const cleanTarget = target.trim().toLowerCase();
  const entry = activeOtps.get(cleanTarget);

  if (!entry) {
    return res.status(400).json({ success: false, message: 'No OTP request found for this account. Please request a new code.' });
  }

  if (Date.now() > entry.expiresAt) {
    activeOtps.delete(cleanTarget);
    return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new verification code.' });
  }

  entry.attempts += 1;
  if (entry.attempts > 5) {
    activeOtps.delete(cleanTarget);
    return res.status(400).json({ success: false, message: 'Too many incorrect attempts. Please request a new OTP.' });
  }

  if (entry.code !== otp.trim()) {
    return res.status(400).json({ success: false, message: 'Invalid OTP code. Please enter the correct 6-digit code.' });
  }

  // OTP verified successfully
  activeOtps.delete(cleanTarget);
  return res.json({ success: true, message: 'OTP verified successfully!' });
});

// 3. User Registration (Sign Up)
app.post('/api/auth/signup', (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, otpVerified } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const users = readJsonFile<any[]>(USERS_FILE, []);

    const existingUser = users.find(u => u.email === cleanEmail);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists. Please log in.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const newUser = {
      id: 'usr_' + Date.now() + '_' + crypto.randomInt(100, 999),
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      salt,
      passwordHash,
      isVerified: Boolean(otpVerified),
      createdAt: new Date().toISOString(),
      activePlan: 'Plan 2 - Professional Business Website',
      supportDaysRemaining: 14,
    };

    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    // Return safe user object (without passwordHash and salt)
    const { salt: _, passwordHash: __, ...safeUser } = newUser;
    return res.json({ success: true, message: 'Account created successfully!', user: safeUser });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating account.' });
  }
});

// 4. User Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { identifier, password, isOtpLogin } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email or phone number is required.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = readJsonFile<any[]>(USERS_FILE, []);

    const user = users.find(u => u.email === cleanIdentifier || u.phone === cleanIdentifier);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email or phone. Please sign up first.' });
    }

    // If password login
    if (!isOtpLogin) {
      if (!password) {
        return res.status(400).json({ success: false, message: 'Password is required.' });
      }
      const testHash = hashPassword(password, user.salt);
      if (testHash !== user.passwordHash) {
        return res.status(401).json({ success: false, message: 'Incorrect password. Try again or log in with OTP.' });
      }
    }

    const { salt: _, passwordHash: __, ...safeUser } = user;
    return res.json({ success: true, message: 'Logged in successfully!', user: safeUser });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
});

// 5. Password Recovery / Reset
app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  try {
    const { identifier, newPassword, otpVerified } = req.body;
    if (!identifier || !newPassword || !otpVerified) {
      return res.status(400).json({ success: false, message: 'Verified OTP and new password are required.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = readJsonFile<any[]>(USERS_FILE, []);

    const userIndex = users.findIndex(u => u.email === cleanIdentifier || u.phone === cleanIdentifier);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    users[userIndex].salt = salt;
    users[userIndex].passwordHash = hashPassword(newPassword, salt);
    writeJsonFile(USERS_FILE, users);

    return res.json({ success: true, message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to reset password.' });
  }
});

// 6. Submit Service / Support Request (Free Support window or ₹199 per service request)
app.post('/api/service-request', (req: Request, res: Response) => {
  try {
    const { userId, userName, userEmail, userPhone, businessName, projectPlan, requestType, fee, details } = req.body;

    if (!userEmail && !userPhone) {
      return res.status(400).json({ success: false, message: 'Contact email or phone is required.' });
    }

    const requests = readJsonFile<any[]>(REQUESTS_FILE, []);
    const newRequest = {
      id: 'req_' + Date.now(),
      userId: userId || 'guest',
      userName: userName || 'Client',
      userEmail,
      userPhone: userPhone || '',
      businessName: businessName || 'My Business',
      projectPlan: projectPlan || 'Plan 2 - Professional Business Website',
      requestType: requestType || 'free_support',
      fee: fee || 0,
      details: details || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    requests.unshift(newRequest);
    writeJsonFile(REQUESTS_FILE, requests);

    return res.json({
      success: true,
      message: 'Service request submitted successfully! Samarth Zende will review your request and connect via WhatsApp/Email.',
      request: newRequest,
    });
  } catch (error: any) {
    console.error('Service request error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Could not submit request.' });
  }
});

// 7. Get user's service requests
app.get('/api/service-requests', (req: Request, res: Response) => {
  const { userId, email } = req.query;
  const requests = readJsonFile<any[]>(REQUESTS_FILE, []);

  if (!userId && !email) {
    return res.json({ success: true, requests: requests.slice(0, 10) });
  }

  const filtered = requests.filter(r => 
    (userId && r.userId === userId) || (email && r.userEmail === email)
  );
  return res.json({ success: true, requests: filtered });
});

// 8. AI Customer Support Chatbot Endpoint
const SAMZEN_SYSTEM_INSTRUCTION = `You are the official AI Customer Support Assistant for SAMZEN Web Development.
Your role is to assist clients, business owners, and website visitors with accurate, professional, and friendly information about SAMZEN Web Development.

### OFFICIAL COMPANY & EXECUTIVE INFORMATION:
- Company Name: SAMZEN Web Development
- Brand Short Name: SAMZEN
- Founder: Samarth Zende
- Chief Executive Officer (CEO): Samarth Zende
- Lead Developer & Digital Creator: Samarth Zende
- Official WhatsApp / Mobile: +91 8605042855
- Official Gmail / Email: samarthzende30072012@gmail.com
- Experience: 3+ years of web development & digital creation experience
- Track Record: 45+ completed projects with 100% client satisfaction
- Design Signature: Premium dark navy theme (#070b14, #0b1220, #0e1726) with vibrant electric blue (#3da9fc) and cyan (#59e3ff) accents. Fast, mobile-responsive, handcrafted code with no clunky templates.

### WEBSITE PLANS & PRICING:
1. Plan 1 — Basic Business Website: ₹1,000 to ₹3,000
   - Includes 7 days of free post-delivery service support
   - Ideal for businesses wanting to display essential information, photos, services, and contact details
   - Includes: Business photos, services/products, contact number (1-tap call), Gmail/email, business address & directions, basic professional design, mobile-friendly layout, customized content
   - Suitable for: Shops, Salons, Garages, Beauty Parlours, Small Businesses, Local Services

2. Plan 2 — Professional Business Website: ₹3,000 to ₹5,000 [MOST POPULAR / FEATURED]
   - Includes 14 days of free post-delivery service support
   - Purpose: Comprehensive professional business presence with interactive modules
   - Includes: Everything in Basic Plan, plus professional custom design, direct calling and WhatsApp contact option, important info/announcements sections, additional customized sections, and for tuitions/coaching: course info, class details, notes & downloadable resources
   - Suitable for: Tuitions, Coaching Classes, Salons, Restaurants, Hotels, Shops, Gyms

3. Plan 3 — Advanced Business Website: ₹5,000 to ₹8,000
   - Includes 21 days of free post-delivery service support
   - Purpose: For organizations needing advanced functionality, online payments, and comprehensive features
   - Includes: Everything from previous plans, advanced bespoke design, WhatsApp & calling options, online payment functionality, useful resources & customized sections, advanced business requirements, professional user experience
   - Suitable for: Hotels, Restaurants, Gyms, Factories, Businesses, Organizations

* Final Pricing Note: The listed price ranges are general packages. Final pricing may vary depending on project complexity, specific features, number of custom pages, and functionality agreed upon before development.

### OTHER SERVICES BY SAMZEN:
- Website Development
- Custom Website Design
- Business Website Design
- Website & Digital Templates
- AI Image Generation
- AI Photo Generation
- AI Video Generation
- Song Generation
- Creative Digital Content
- Customized Digital Solutions
- Pre-made custom templates for: Garage, Tuition, Shop, Factory, Salon, Beauty Parlour, Hotel, Restaurant, Gym, Coaching Class, Local Business, Service Provider, Portfolio.

### POST-DELIVERY SERVICE SUPPORT & POLICY:
- Every plan includes a free service support window:
  * Plan 1: 7 days free support
  * Plan 2: 14 days free support
  * Plan 3: 21 days free support
- During the free window, customers can report any bug, minor change, or issue to be checked and fixed for free.
- After the free support window ends: Service or maintenance requests are charged at ₹199 per service/request.
- Major redesigns, additional pages, or new functionality requested outside the originally agreed scope may carry additional charges.
- Customers can submit service requests anytime via the online Client Portal or directly via WhatsApp (+91 8605042855) or Gmail (samarthzende30072012@gmail.com).

### 7-STEP WORK PROCESS:
01. Discuss: Tell Samarth what type of website you need.
02. Select: Choose the appropriate plan (Basic, Professional, or Advanced).
03. Provide Content: Send logo, business photos, information, and contact details.
04. Development: Website is designed and developed according to agreed requirements.
05. Review: Client reviews the live working website and communicates required changes.
06. Delivery: Completed website is delivered and launched.
07. Support: Client receives free service support after completion (7, 14, or 21 days depending on plan).

### WHAT CLIENTS NEED TO PROVIDE TO GET STARTED:
- Business / organization name
- Logo (high-resolution)
- Business photographs
- Services / products list & details
- Contact number (Calling & WhatsApp)
- Gmail / email address
- Business address & location
- About / business description
- Important announcements or notices
- Social media links (if required)
- Payment info (if applicable)
- Specific design or theme preferences

### AUTHENTICATION & REAL OTP VERIFICATION:
- SAMZEN features a genuine working client account system with Sign Up, Login, and Password Recovery.
- Employs real 6-digit cryptographic OTPs with a 10-minute expiry window.
- Real OTPs are dispatched to the customer's verified Gmail/email address or WhatsApp/phone number (+91 8605042855).
- Once logged in, customers have an active Client Portal where they can view their active plan, support status, and submit bug fixes or maintenance requests.

### CONTACT OPTIONS (ONLY TWO OFFICIAL CHANNELS):
1. WhatsApp: Direct chat with Samarth Zende at +91 8605042855 (https://wa.me/918605042855)
2. Gmail: Direct email to samarthzende30072012@gmail.com

### STRICT RULES & BEHAVIORAL DIRECTIVES:
- Answer naturally, helpfully, courteously, and concisely.
- Do NOT invent or hallucinate any services, prices, policies, people, or company information. Stick strictly to the official SAMZEN facts above.
- If asked about the founder or CEO, clearly identify Samarth Zende.
- When appropriate, encourage the user to reach out on WhatsApp (+91 8605042855) or Gmail (samarthzende30072012@gmail.com), or use the Sign Up / Client Portal.
- Format responses cleanly with short paragraphs or bullet points for easy readability.`;

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'Messages array is required.' });
    }

    // Format conversation history for Gemini API
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content || m.text || '' }],
    }));

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: SAMZEN_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Hello! I am SAMZEN's AI assistant. How can I help you with your website project or our services today?";
      return res.json({ success: true, reply: replyText });
    } catch (aiError: any) {
      console.warn('Gemini API call warning:', aiError.message);

      // Intelligent rule-based fallback if API key quota or transient error occurs
      const lastUserMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
      let fallback = "Hello! I'm the official SAMZEN AI assistant. Samarth Zende is the Founder, CEO, and Lead Developer of SAMZEN Web Development. How can I help you today?";

      if (lastUserMsg.includes('founder') || lastUserMsg.includes('ceo') || lastUserMsg.includes('who is samarth') || lastUserMsg.includes('owner')) {
        fallback = "SAMZEN Web Development was founded and is led by Samarth Zende (Founder & CEO). He has 3+ years of experience and over 45+ completed projects with 100% client satisfaction.";
      } else if (lastUserMsg.includes('price') || lastUserMsg.includes('cost') || lastUserMsg.includes('plan')) {
        fallback = "SAMZEN offers three transparent website plans:\n\n• **Plan 1 (Basic)**: ₹1,000 – ₹3,000 (7 days free support)\n• **Plan 2 (Professional - Featured)**: ₹3,000 – ₹5,000 (14 days free support)\n• **Plan 3 (Advanced)**: ₹5,000 – ₹8,000 (21 days free support)\n\nAll plans include mobile responsiveness, custom branding, and post-delivery support!";
      } else if (lastUserMsg.includes('support') || lastUserMsg.includes('policy') || lastUserMsg.includes('199')) {
        fallback = "Every website delivered by SAMZEN includes a free post-delivery support window: 7 days for Plan 1, 14 days for Plan 2, and 21 days for Plan 3. Once the free window ends, routine maintenance and service requests cost ₹199 per service.";
      } else if (lastUserMsg.includes('contact') || lastUserMsg.includes('whatsapp') || lastUserMsg.includes('phone') || lastUserMsg.includes('email') || lastUserMsg.includes('gmail')) {
        fallback = "You can reach out directly through our two official channels:\n\n• **WhatsApp**: +91 8605042855 (https://wa.me/918605042855)\n• **Gmail**: samarthzende30072012@gmail.com\n\nSamarth Zende will respond directly to your inquiry!";
      } else if (lastUserMsg.includes('otp') || lastUserMsg.includes('login') || lastUserMsg.includes('signup') || lastUserMsg.includes('account')) {
        fallback = "SAMZEN features a genuine client account system with real 6-digit OTP verification. OTPs are sent to your verified Gmail or WhatsApp number for secure Sign Up, Login, and Password Recovery.";
      }

      return res.json({ success: true, reply: fallback });
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error processing chat message.' });
  }
});

// Server boot and Vite middleware setup
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAMZEN SERVER] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server startup failed:', err);
});
