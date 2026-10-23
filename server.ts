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
const ENQUIRIES_FILE = path.join(DATA_DIR, 'website_enquiries.json');

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
      directWhatsappUrl
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

// 8. Create Website Enquiry & Plan Selection Endpoint (WhatsApp + Gmail backend dispatch)
app.post('/api/website-enquiry', async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      businessName,
      mobileNumber,
      email,
      websiteType,
      otherWebsiteType,
      preferredPlan,
      planPrice,
      requiredFeatures,
      additionalRequirements,
      preferredContactMethod,
      _hp
    } = req.body;

    // Spam protection honeypot
    if (_hp) {
      return res.status(400).json({ success: false, message: 'Invalid submission detected.' });
    }

    // Required fields validation
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!businessName || !businessName.trim()) {
      return res.status(400).json({ success: false, message: 'Business name is required.' });
    }
    if (!mobileNumber || !mobileNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Mobile number is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!websiteType || !websiteType.trim()) {
      return res.status(400).json({ success: false, message: 'Website category is required.' });
    }

    // Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Please enter a valid mobile number with at least 10 digits.' });
    }

    const effectiveWebsiteType = websiteType === 'Other' && otherWebsiteType?.trim()
      ? `Other (${otherWebsiteType.trim()})`
      : websiteType;

    const featuresList: string[] = Array.isArray(requiredFeatures) ? requiredFeatures : [];
    const enquiryId = 'enq_' + Date.now() + '_' + crypto.randomInt(100, 999);

    const newEnquiry = {
      id: enquiryId,
      fullName: fullName.trim(),
      businessName: businessName.trim(),
      mobileNumber: mobileNumber.trim(),
      email: email.trim().toLowerCase(),
      websiteType: effectiveWebsiteType,
      preferredPlan: preferredPlan || 'Plan 2 — Professional Business Website',
      planPrice: planPrice || '₹3,000 – ₹5,000',
      requiredFeatures: featuresList,
      additionalRequirements: (additionalRequirements || '').trim(),
      preferredContactMethod: preferredContactMethod || 'Both',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Store in data/website_enquiries.json
    const enquiries = readJsonFile<any[]>(ENQUIRIES_FILE, []);
    enquiries.unshift(newEnquiry);
    writeJsonFile(ENQUIRIES_FILE, enquiries);

    // Format pre-filled WhatsApp message for +91 8605042855
    const featuresBullets = featuresList.length > 0 
      ? featuresList.map(f => `• ${f}`).join('\n')
      : '• Standard plan features';

    const whatsappText = 
`🚀 *NEW WEBSITE ENQUIRY — SAMZEN Web Development*
━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Client Name:* ${newEnquiry.fullName}
🏢 *Business Name:* ${newEnquiry.businessName}
📱 *Mobile Number:* ${newEnquiry.mobileNumber}
📧 *Email Address:* ${newEnquiry.email}
🌐 *Website Category:* ${newEnquiry.websiteType}
💼 *Selected Plan:* ${newEnquiry.preferredPlan} (${newEnquiry.planPrice})

🛠️ *Required Features:*
${featuresBullets}

📝 *Additional Requirements / Notes:*
${newEnquiry.additionalRequirements || 'None specified'}

📞 *Preferred Contact Method:* ${newEnquiry.preferredContactMethod}
🆔 *Ref ID:* ${enquiryId}
━━━━━━━━━━━━━━━━━━━━━━━━`;

    const whatsappUrl = `https://wa.me/918605042855?text=${encodeURIComponent(whatsappText)}`;

    // Format Email for Samarth's business Gmail (samarthzende30072012@gmail.com)
    const emailSubject = `Website Inquiry from ${newEnquiry.fullName} - ${newEnquiry.businessName} (${newEnquiry.preferredPlan})`;
    const emailBody = 
`Hello Samarth,

A new website creation enquiry has been submitted through SAMZEN Web Development:

- Client Name: ${newEnquiry.fullName}
- Business Name: ${newEnquiry.businessName}
- Mobile / WhatsApp: ${newEnquiry.mobileNumber}
- Email: ${newEnquiry.email}
- Website Category: ${newEnquiry.websiteType}
- Selected Plan: ${newEnquiry.preferredPlan} (${newEnquiry.planPrice})

Required Features:
${featuresBullets}

Additional Requirements / Notes:
${newEnquiry.additionalRequirements || 'None'}

Preferred Contact Method: ${newEnquiry.preferredContactMethod}
Enquiry ID: ${enquiryId}
Submitted At: ${newEnquiry.createdAt}

Reply on WhatsApp: ${whatsappUrl}
`;

    const directGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=samarthzende30072012@gmail.com&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Attempt real backend email delivery via nodemailer
    let emailSent = false;
    let emailError: string | null = null;

    if (mailTransporter) {
      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || '"SAMZEN Enquiries" <samarthzende30072012@gmail.com>',
          to: 'samarthzende30072012@gmail.com',
          replyTo: newEnquiry.email,
          subject: `[New Website Lead] ${newEnquiry.fullName} - ${newEnquiry.businessName} (${newEnquiry.preferredPlan})`,
          text: emailBody,
          html: `
            <div style="font-family: Arial, sans-serif; background: #070b14; color: #eef3fa; padding: 24px; border-radius: 12px; border: 1px solid #1d2a3e;">
              <div style="border-bottom: 1px solid #1d2a3e; padding-bottom: 14px; margin-bottom: 18px;">
                <h2 style="color: #3da9fc; margin: 0; font-size: 22px;">SAMZEN Web Development</h2>
                <p style="color: #59e3ff; font-size: 13px; margin: 4px 0 0;">New Website Order &amp; Consultation Request</p>
              </div>

              <div style="background: #0e1726; border: 1px solid #1d2a3e; border-radius: 8px; padding: 16px; margin-bottom: 14px;">
                <h3 style="color: #ffffff; margin-top: 0; font-size: 15px;">Client Information</h3>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Full Name:</strong> ${newEnquiry.fullName}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Business Name:</strong> ${newEnquiry.businessName}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Mobile:</strong> <a href="tel:${newEnquiry.mobileNumber}" style="color: #59e3ff;">${newEnquiry.mobileNumber}</a></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${newEnquiry.email}" style="color: #59e3ff;">${newEnquiry.email}</a></p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Preferred Contact:</strong> ${newEnquiry.preferredContactMethod}</p>
              </div>

              <div style="background: #0e1726; border: 1px solid #1d2a3e; border-radius: 8px; padding: 16px; margin-bottom: 14px;">
                <h3 style="color: #ffffff; margin-top: 0; font-size: 15px;">Project Requirements</h3>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Category:</strong> ${newEnquiry.websiteType}</p>
                <p style="margin: 6px 0; font-size: 14px;"><strong>Selected Plan:</strong> <span style="color: #3da9fc; font-weight: bold;">${newEnquiry.preferredPlan}</span> (${newEnquiry.planPrice})</p>
                <div style="margin: 10px 0 6px;">
                  <strong>Requested Features:</strong>
                  <ul style="margin: 6px 0 0 18px; padding: 0; color: #c9d3dc; font-size: 13px;">
                    ${featuresList.map(f => `<li>${f}</li>`).join('')}
                  </ul>
                </div>
                ${newEnquiry.additionalRequirements ? `<p style="margin: 10px 0 4px;"><strong>Additional Notes:</strong></p><p style="background: #070b14; padding: 10px; border-radius: 6px; color: #9db0c8; font-size: 13px; margin: 0;">${newEnquiry.additionalRequirements}</p>` : ''}
              </div>

              <div style="margin-top: 18px; padding-top: 14px; border-top: 1px solid #1d2a3e; text-align: center;">
                <a href="${whatsappUrl}" style="background: #25D366; color: #000000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 13px; display: inline-block;">Reply to Client on WhatsApp</a>
              </div>
            </div>
          `,
        });
        emailSent = true;
        console.log(`[ENQUIRY EMAIL] Successfully dispatched enquiry to samarthzende30072012@gmail.com from ${newEnquiry.email}`);
      } catch (err: any) {
        emailError = err.message || 'SMTP transmission error';
        console.warn('[ENQUIRY EMAIL WARNING] Could not send via SMTP:', emailError);
      }
    }

    return res.json({
      success: true,
      message: 'Website enquiry registered successfully!',
      enquiry: newEnquiry,
      whatsappUrl,
      directGmailUrl,
      emailSent,
      emailError,
      smtpConfigured: Boolean(mailTransporter),
    });
  } catch (error: any) {
    console.error('Website enquiry error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error processing website enquiry' });
  }
});

// 9. AI Customer Support Chatbot Endpoint
const SAMZEN_SYSTEM_INSTRUCTION = `You are the official AI Customer Support Assistant for SAMZEN Web Development.
Your role is to assist clients, business owners, and website visitors with accurate, professional, and friendly information about SAMZEN Web Development.

### OFFICIAL COMPANY & EXECUTIVE OWNERSHIP INFORMATION:
- Company Name: SAMZEN Web Development
- Brand Short Name: SAMZEN
- Sole Company Owner (100%): Mr. Samarth Zende
- Founder & Chief Executive Officer (CEO): Mr. Samarth Zende
- Company Authority: Mr. Samarth Zende holds 100% sole ownership, equity, and supreme executive power.
- Co-Founder & Helper: Mr. Sharvin Shinde (Mr. Sharven Shinde). IMPORTANT: He is NOT an executive partner. He serves strictly as an operational helper and support worker assisting the company owner Mr. Samarth Zende with routine fieldwork, errands, and support tasks.
- Official WhatsApp / Mobile: +91 8605042855
- Official Gmail / Email: samarthzende30072012@gmail.com
- Total Network Valuation: ₹1,15,237
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

// --- INTERNAL WORKSPACE & PROJECT COLLABORATION SUITE ---
const WORKSPACE_MEMBERS_FILE = path.join(DATA_DIR, 'workspace_members.json');
const WORKSPACE_PROJECTS_FILE = path.join(DATA_DIR, 'workspace_projects.json');
const WORKSPACE_APPLICATIONS_FILE = path.join(DATA_DIR, 'workspace_applications.json');
const WORKSPACE_MEMBER_REQUESTS_FILE = path.join(DATA_DIR, 'workspace_member_requests.json');
const WORKSPACE_PROFILE_REQUESTS_FILE = path.join(DATA_DIR, 'workspace_profile_requests.json');
const WORKSPACE_MESSAGES_FILE = path.join(DATA_DIR, 'workspace_messages.json');
const WORKSPACE_DIRECT_MESSAGES_FILE = path.join(DATA_DIR, 'workspace_direct_messages.json');
const WORKSPACE_MAILBOX_FILE = path.join(DATA_DIR, 'workspace_mailbox.json');

// Initialize seed data for workspace: CEO Samarth Zende is the sole pre-authorized master account
function initializeWorkspaceData() {
  const defaultMembers = [
    {
      id: 'ceo_samarth_zende',
      code: '30072012',
      name: 'Mr. Samarth Zende',
      email: 'archanazende1710@gmail.com',
      phone: '+91 8605042855',
      position: 'Founder, CEO & 100% Owner',
      role: 'ceo',
      status: 'active',
      createdAt: '2024-01-01T00:00:00.000Z',
    }
  ];

  const defaultProjects = [
    {
      id: 'proj_ecommerce_01',
      title: 'Full-Stack Modern Grocery & E-Commerce Web App',
      description: 'Custom multi-vendor storefront with Razorpay instant checkout, WhatsApp invoice delivery, inventory sync, and rapid rider delivery dashboard.',
      requirements: ['React 18', 'TypeScript', 'Tailwind CSS', 'Razorpay API', 'Mobile-First UI'],
      location: 'Remote / Pune / Satara',
      budget: '₹18,000 - ₹25,000',
      status: 'open',
      postedBy: {
        id: 'ceo_samarth_zende',
        name: 'Mr. Samarth Zende',
        role: 'ceo',
        position: 'Founder, CEO & 100% Owner',
      },
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      applicantCount: 0,
    },
    {
      id: 'proj_realestate_02',
      title: 'Luxury Real Estate Property Showcase & Virtual Tour Portal',
      description: 'Interactive property visualizer, high-resolution photo gallery, verified amenities showcase, and 1-tap WhatsApp consultation scheduling.',
      requirements: ['Responsive UI', 'Sub-second Load Time', 'SEO Schema Metadata', 'Contact Form'],
      location: 'Remote / Maharashtra',
      budget: '₹12,000 - ₹16,000',
      status: 'open',
      postedBy: {
        id: 'ceo_samarth_zende',
        name: 'Mr. Samarth Zende',
        role: 'ceo',
        position: 'Founder, CEO & 100% Owner',
      },
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      applicantCount: 0,
    }
  ];

  const defaultMessages = [
    {
      id: 'msg_01',
      senderId: 'ceo_samarth_zende',
      senderCode: '30072012',
      senderName: 'Mr. Samarth Zende',
      senderRole: 'ceo',
      senderPosition: 'Founder, CEO & 100% Owner',
      content: 'Welcome to the official SAMZEN internal workspace. All projects and authorized team members are managed here under CEO master access.',
      channel: 'general',
      timestamp: new Date().toISOString(),
    }
  ];

  let existingMembers = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
  // Purge any dummy test codes (e.g. 12345678, 84920153) to guarantee no default codes exist for other members
  existingMembers = existingMembers.filter(m => m.code !== '12345678' && m.code !== '84920153');

  // Ensure CEO account code is always 30072012
  const ceoIndex = existingMembers.findIndex(m => m.code === '30072012' || m.id === 'ceo_samarth_zende' || m.role === 'ceo');
  if (ceoIndex === -1) {
    existingMembers.unshift(defaultMembers[0]);
  } else {
    existingMembers[ceoIndex].code = '30072012';
    existingMembers[ceoIndex].role = 'ceo';
    existingMembers[ceoIndex].name = 'Mr. Samarth Zende';
  }
  writeJsonFile(WORKSPACE_MEMBERS_FILE, existingMembers);

  const existingProjects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
  if (existingProjects.length === 0) {
    writeJsonFile(WORKSPACE_PROJECTS_FILE, defaultProjects);
  }

  const existingMessages = readJsonFile<any[]>(WORKSPACE_MESSAGES_FILE, []);
  if (existingMessages.length === 0) {
    writeJsonFile(WORKSPACE_MESSAGES_FILE, defaultMessages);
  }
}
initializeWorkspaceData();

// Helper to generate a unique 8-digit numeric access code
function generateUnique8DigitCode(existingCodes: Set<string>): string {
  let attempts = 0;
  while (attempts < 1000) {
    attempts++;
    const code = crypto.randomInt(10000000, 99999999).toString();
    if (code !== '30072012' && !existingCodes.has(code)) {
      return code;
    }
  }
  return '9' + Date.now().toString().slice(-7);
}

// 1. Workspace Authentication via 8-Digit Access Code
app.post('/api/workspace/auth', (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ success: false, message: '8-digit access code is required.' });
    }

    const cleanCode = code.trim();
    // Allow 8-character access codes with custom symbols (#, ₹, +, ×, ÷, @, %, =, /) and letters/digits
    if (cleanCode.length !== 8 && [...cleanCode].length !== 8) {
      return res.status(400).json({ success: false, message: 'Access code must be exactly 8 characters in length.' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    
    // Explicit Master CEO check
    if (cleanCode === '30072012') {
      let ceo = members.find(m => m.code === '30072012');
      if (!ceo) {
        ceo = {
          id: 'ceo_samarth_zende',
          code: '30072012',
          name: 'Mr. Samarth Zende',
          email: 'archanazende1710@gmail.com',
          phone: '+91 8605042855',
          position: 'Founder, CEO & 100% Owner',
          role: 'ceo',
          status: 'active',
          createdAt: '2024-01-01T00:00:00.000Z',
        };
        members.unshift(ceo);
        writeJsonFile(WORKSPACE_MEMBERS_FILE, members);
      }
      return res.json({
        success: true,
        message: 'Welcome Mr. Samarth Zende! CEO Master Access verified.',
        member: ceo,
      });
    }

    // Regular member or co-founder check
    const member = members.find(m => m.code === cleanCode);
    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Invalid 8-digit access code. Please verify your invitation code or contact CEO Samarth Zende.',
      });
    }

    if (member.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'This access code is currently suspended. Please contact CEO Samarth Zende.',
      });
    }

    return res.json({
      success: true,
      message: `Welcome back, ${member.name}! Access granted.`,
      member,
    });
  } catch (err: any) {
    console.error('Workspace auth error:', err);
    return res.status(500).json({ success: false, message: 'Authentication server error.' });
  }
});

// 2. Get Workspace Members List (Unmasked for CEO so CEO can track all generated numbers)
app.get('/api/workspace/members', (req: Request, res: Response) => {
  try {
    const ceoCode = (req.query.ceoCode as string || '').trim();
    const isCeo = ceoCode === '30072012';

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const sanitized = members.map(m => ({
      ...m,
      // If CEO is requesting, reveal the full 8-digit code so CEO can track and copy it!
      code: isCeo ? m.code : (m.role === 'ceo' ? '30072012' : '••••••••'),
      codeMasked: isCeo ? m.code : (m.role === 'ceo' ? '30072012 (CEO Master)' : '••••••••'),
    }));
    return res.json({ success: true, members: sanitized });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch members.' });
  }
});

// 2b. Live Session Verification (Real-time sync to revoke removed members immediately)
app.get('/api/workspace/check-session', (req: Request, res: Response) => {
  try {
    const code = (req.query.code as string || '').trim();
    if (!code) {
      return res.status(400).json({ valid: false, message: 'Access code is required.' });
    }

    if (code === '30072012') {
      return res.json({ valid: true, role: 'ceo' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const member = members.find(m => m.code === code);
    if (!member || member.status === 'suspended') {
      return res.json({
        valid: false,
        message: 'Your access code has been revoked by CEO Samarth Zende. Active session terminated.',
      });
    }

    return res.json({ valid: true, role: member.role });
  } catch (err: any) {
    return res.status(500).json({ valid: false, message: 'Server error checking session.' });
  }
});

// 3. Generate or Manually Assign 8-Digit Member Code (STRICTLY CEO ONLY: "30072012")
app.post('/api/workspace/generate-code', (req: Request, res: Response) => {
  try {
    const { ceoCode, name, email, phone, position, role, customCode } = req.body;

    // Strict Master CEO authorization
    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only CEO Samarth Zende (Master Code 30072012) has exclusive permission to generate or assign 8-digit member codes.',
      });
    }

    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name, Gmail/Email, Phone Number, and Position are required.',
      });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const existingCodes = new Set<string>(members.map(m => m.code));

    let finalCode = '';
    // Allow CEO to either manually specify their chosen 8-digit code OR auto-generate
    if (customCode && typeof customCode === 'string' && customCode.trim()) {
      const trimmedCustom = customCode.trim();
      if (trimmedCustom.length !== 8 && [...trimmedCustom].length !== 8) {
        return res.status(400).json({
          success: false,
          message: 'Custom code must be exactly 8 characters (supporting digits, letters, and symbols: #, ₹, +, ×, ÷, @, %, =, /).',
        });
      }
      if (trimmedCustom === '30072012') {
        return res.status(400).json({
          success: false,
          message: 'Code 30072012 is reserved exclusively for CEO Samarth Zende.',
        });
      }
      if (existingCodes.has(trimmedCustom)) {
        return res.status(400).json({
          success: false,
          message: `The 8-character code "${trimmedCustom}" is already assigned to another member. Please choose a different code.`,
        });
      }
      finalCode = trimmedCustom;
    } else {
      finalCode = generateUnique8DigitCode(existingCodes);
    }

    const newMember = {
      id: 'mem_' + Date.now() + '_' + crypto.randomInt(100, 999),
      code: finalCode,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      position: position.trim(),
      role: ['ceo', 'cofounder', 'executive_head', 'contractor', 'home_servicer', 'caller_helper', 'member'].includes(role) ? role : 'member',
      status: 'active',
      createdAt: new Date().toISOString(),
      createdById: 'ceo_samarth_zende',
    };

    members.push(newMember);
    writeJsonFile(WORKSPACE_MEMBERS_FILE, members);

    return res.json({
      success: true,
      message: `8-digit access code ${finalCode} assigned to ${newMember.name} successfully!`,
      code: finalCode,
      member: newMember,
    });
  } catch (err: any) {
    console.error('Generate code error:', err);
    return res.status(500).json({ success: false, message: 'Error generating member code.' });
  }
});

// 3b. Live Member Removal Sync (STRICTLY CEO ONLY: "30072012")
// Completely removes member from database, revokes access code, and purges all records
app.delete('/api/workspace/members/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Strict Security: Only CEO Samarth Zende (30072012) can remove members from the system database.',
      });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const memberIndex = members.findIndex(m => m.id === id || m.code === id);

    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found in database.' });
    }

    const targetMember = members[memberIndex];
    if (targetMember.role === 'ceo' || targetMember.code === '30072012') {
      return res.status(400).json({ success: false, message: 'Cannot delete the master CEO account.' });
    }

    // 1. Remove from members list
    members.splice(memberIndex, 1);
    writeJsonFile(WORKSPACE_MEMBERS_FILE, members);

    // 2. Remove applications submitted by this member
    const applications = readJsonFile<any[]>(WORKSPACE_APPLICATIONS_FILE, []);
    const filteredApps = applications.filter(a => a.memberId !== targetMember.id);
    writeJsonFile(WORKSPACE_APPLICATIONS_FILE, filteredApps);

    // 3. Remove pending profile requests
    const profileRequests = readJsonFile<any[]>(WORKSPACE_PROFILE_REQUESTS_FILE, []);
    const filteredPReqs = profileRequests.filter(r => r.memberId !== targetMember.id);
    writeJsonFile(WORKSPACE_PROFILE_REQUESTS_FILE, filteredPReqs);

    console.log(`[WORKSPACE SYNC] Member ${targetMember.name} (${targetMember.code}) was completely removed by CEO Samarth Zende.`);

    return res.json({
      success: true,
      message: `Member "${targetMember.name}" and access code ${targetMember.code} have been completely removed from the system database.`,
      removedMemberId: targetMember.id,
    });
  } catch (err: any) {
    console.error('Member deletion error:', err);
    return res.status(500).json({ success: false, message: 'Error removing member from database.' });
  }
});

// 4. Request New Member (Submitted by Co-Founders for CEO Review & Approval)
app.post('/api/workspace/request-member', (req: Request, res: Response) => {
  try {
    const { requesterCode, name, email, phone, position, role } = req.body;
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const requester = members.find(m => m.code === requesterCode);

    if (!requester || (requester.role !== 'cofounder' && requester.role !== 'ceo')) {
      return res.status(403).json({
        success: false,
        message: 'Only co-founders or leaders can submit new member creation requests.',
      });
    }

    if (!name || !email || !phone || !position) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and position are required.',
      });
    }

    const requests = readJsonFile<any[]>(WORKSPACE_MEMBER_REQUESTS_FILE, []);
    const newReq = {
      id: 'mreq_' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      position: position.trim(),
      role: ['cofounder', 'executive_head', 'contractor', 'home_servicer', 'caller_helper', 'member'].includes(role) ? role : 'member',
      requestedBy: {
        id: requester.id,
        name: requester.name,
        role: requester.role,
      },
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };

    requests.unshift(newReq);
    writeJsonFile(WORKSPACE_MEMBER_REQUESTS_FILE, requests);

    // Also push to executive Mailbox
    const mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    mailbox.unshift({
      id: 'mail_req_' + newReq.id,
      type: 'member_request',
      title: `Member Code Recommendation: ${newReq.name} (${newReq.position})`,
      senderName: requester.name,
      senderPhone: phone.trim(),
      senderEmail: email.trim(),
      roleApplied: newReq.position,
      content: `Co-Founder ${requester.name} recommended adding ${newReq.name} as ${newReq.position} with role ${newReq.role}. Phone: ${phone.trim()}, Email: ${email.trim()}.`,
      details: { requestId: newReq.id, name: newReq.name, email: newReq.email, phone: newReq.phone, role: newReq.role },
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

    return res.json({
      success: true,
      message: `Member request submitted for CEO Samarth Zende's review and approval.`,
      request: newReq,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to submit member request.' });
  }
});

// 5. Get Pending Member Requests (Admin View)
app.get('/api/workspace/member-requests', (_req: Request, res: Response) => {
  try {
    const requests = readJsonFile<any[]>(WORKSPACE_MEMBER_REQUESTS_FILE, []);
    return res.json({ success: true, requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch member requests.' });
  }
});

// 6. Review Member Request (CEO Only: Approve -> Generate Code, or Reject)
app.post('/api/workspace/member-request/:id/review', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode, action } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Only CEO Samarth Zende (30072012) can approve member requests.',
      });
    }

    const requests = readJsonFile<any[]>(WORKSPACE_MEMBER_REQUESTS_FILE, []);
    const reqIndex = requests.findIndex(r => r.id === id);
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const targetReq = requests[reqIndex];
    if (action === 'approve') {
      const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
      const existingCodes = new Set<string>(members.map(m => m.code));
      const newCode = generateUnique8DigitCode(existingCodes);

      const newMember = {
        id: 'mem_' + Date.now() + '_' + crypto.randomInt(100, 999),
        code: newCode,
        name: targetReq.name,
        email: targetReq.email,
        phone: targetReq.phone,
        position: targetReq.position,
        role: targetReq.role || 'member',
        status: 'active',
        createdAt: new Date().toISOString(),
        createdById: 'ceo_samarth_zende',
      };

      members.push(newMember);
      writeJsonFile(WORKSPACE_MEMBERS_FILE, members);

      targetReq.status = 'approved';
      targetReq.generatedCode = newCode;
      targetReq.reviewedAt = new Date().toISOString();
      writeJsonFile(WORKSPACE_MEMBER_REQUESTS_FILE, requests);

      return res.json({
        success: true,
        message: `Member request approved! Generated 8-digit code: ${newCode}`,
        generatedCode: newCode,
      });
    } else {
      targetReq.status = 'rejected';
      targetReq.reviewedAt = new Date().toISOString();
      writeJsonFile(WORKSPACE_MEMBER_REQUESTS_FILE, requests);
      return res.json({ success: true, message: 'Member request was declined.' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error reviewing request.' });
  }
});

// 7. Strict Master Profile Update (STRICTLY CEO ONLY: "30072012")
app.put('/api/workspace/members/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode, name, email, phone, position, status } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Strict Master Control: Only CEO Samarth Zende (30072012) has master access to edit member profiles directly.',
      });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const memberIndex = members.findIndex(m => m.id === id);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    if (name) members[memberIndex].name = name.trim();
    if (email) members[memberIndex].email = email.trim().toLowerCase();
    if (phone) members[memberIndex].phone = phone.trim();
    if (position) members[memberIndex].position = position.trim();
    if (status) members[memberIndex].status = status;

    writeJsonFile(WORKSPACE_MEMBERS_FILE, members);
    return res.json({
      success: true,
      message: 'Member profile updated successfully by CEO.',
      member: members[memberIndex],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error updating profile.' });
  }
});

// 8. Submit Profile Change Request (For Regular Members & Co-Founders)
app.post('/api/workspace/profile-change-request', (req: Request, res: Response) => {
  try {
    const { memberId, requestedProfile, reason } = req.body;
    if (!memberId || !requestedProfile) {
      return res.status(400).json({ success: false, message: 'Member ID and requested updates are required.' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const member = members.find(m => m.id === memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member account not found.' });
    }

    const requests = readJsonFile<any[]>(WORKSPACE_PROFILE_REQUESTS_FILE, []);
    const newReq = {
      id: 'preq_' + Date.now(),
      memberId,
      currentProfile: {
        name: member.name,
        email: member.email,
        phone: member.phone,
        position: member.position,
      },
      requestedProfile: {
        name: requestedProfile.name || member.name,
        email: requestedProfile.email || member.email,
        phone: requestedProfile.phone || member.phone,
        position: requestedProfile.position || member.position,
      },
      reason: reason || 'Profile information update',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    requests.unshift(newReq);
    writeJsonFile(WORKSPACE_PROFILE_REQUESTS_FILE, requests);

    // Also push to executive Mailbox
    const mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    mailbox.unshift({
      id: 'mail_prof_' + newReq.id,
      type: 'profile_change',
      title: `Profile Update Request: ${member.name}`,
      senderName: member.name,
      senderPhone: member.phone,
      senderEmail: member.email,
      roleApplied: member.position,
      content: `Member ${member.name} requested profile updates. Reason: "${newReq.reason}"`,
      details: { requestId: newReq.id, memberId: member.id, requestedProfile },
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

    return res.json({
      success: true,
      message: 'Profile change request submitted! It will be reviewed by CEO Samarth Zende.',
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error submitting request.' });
  }
});

// 9. Get Profile Change Requests (CEO View)
app.get('/api/workspace/profile-change-requests', (_req: Request, res: Response) => {
  try {
    const requests = readJsonFile<any[]>(WORKSPACE_PROFILE_REQUESTS_FILE, []);
    return res.json({ success: true, requests });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch requests.' });
  }
});

// 10. Review Profile Change Request (CEO Only)
app.post('/api/workspace/profile-change-request/:id/review', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode, action } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Only CEO Samarth Zende can approve profile change requests.',
      });
    }

    const requests = readJsonFile<any[]>(WORKSPACE_PROFILE_REQUESTS_FILE, []);
    const reqIndex = requests.findIndex(r => r.id === id);
    if (reqIndex === -1) {
      return res.status(404).json({ success: false, message: 'Request not found.' });
    }

    const targetReq = requests[reqIndex];
    if (action === 'approve') {
      const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
      const memberIndex = members.findIndex(m => m.id === targetReq.memberId);
      if (memberIndex !== -1) {
        members[memberIndex].name = targetReq.requestedProfile.name;
        members[memberIndex].email = targetReq.requestedProfile.email;
        members[memberIndex].phone = targetReq.requestedProfile.phone;
        members[memberIndex].position = targetReq.requestedProfile.position;
        writeJsonFile(WORKSPACE_MEMBERS_FILE, members);
      }

      targetReq.status = 'approved';
      targetReq.reviewedAt = new Date().toISOString();
      writeJsonFile(WORKSPACE_PROFILE_REQUESTS_FILE, requests);

      return res.json({ success: true, message: 'Profile changes approved and applied successfully!' });
    } else {
      targetReq.status = 'rejected';
      targetReq.reviewedAt = new Date().toISOString();
      writeJsonFile(WORKSPACE_PROFILE_REQUESTS_FILE, requests);
      return res.json({ success: true, message: 'Profile change request rejected.' });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error reviewing request.' });
  }
});

// 11. Projects Board (Live across all member screens)
app.get('/api/workspace/projects', (_req: Request, res: Response) => {
  try {
    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    return res.json({ success: true, projects });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
});

// 12. Post New Project (Authorized Leaders: CEO & Co-Founders)
app.post('/api/workspace/projects', (req: Request, res: Response) => {
  try {
    const { authorCode, title, description, requirements, location, budget } = req.body;
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const author = members.find(m => m.code === authorCode);

    if (!author || (author.role !== 'ceo' && author.role !== 'cofounder')) {
      return res.status(403).json({
        success: false,
        message: 'Only CEO Samarth Zende or authorized co-founders can post new projects.',
      });
    }

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Project title, description, and location are required.',
      });
    }

    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    const reqArray = Array.isArray(requirements)
      ? requirements
      : (typeof requirements === 'string' ? requirements.split(',').map((s: string) => s.trim()) : []);

    const newProject = {
      id: 'proj_' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      requirements: reqArray,
      location: location.trim(),
      budget: (budget || 'To be discussed').trim(),
      status: 'open',
      postedBy: {
        id: author.id,
        name: author.name,
        role: author.role,
        position: author.position,
      },
      createdAt: new Date().toISOString(),
      applicantCount: 0,
    };

    projects.unshift(newProject);
    writeJsonFile(WORKSPACE_PROJECTS_FILE, projects);

    return res.json({
      success: true,
      message: 'Project posted live successfully! It is now visible to all members.',
      project: newProject,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error posting project.' });
  }
});

// 12b. Delete Project (CEO and Authorized Co-Founders)
app.delete('/api/workspace/projects/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorCode } = req.body;
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const author = members.find(m => m.code === authorCode);
    if (!author || (author.role !== 'ceo' && author.role !== 'cofounder')) {
      return res.status(403).json({ success: false, message: 'Only CEO Samarth Zende or authorized co-founders can delete projects.' });
    }

    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    const projIndex = projects.findIndex(p => p.id === id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const deleted = projects.splice(projIndex, 1)[0];
    writeJsonFile(WORKSPACE_PROJECTS_FILE, projects);

    // Clean up applications for this deleted project
    const applications = readJsonFile<any[]>(WORKSPACE_APPLICATIONS_FILE, []);
    const remainingApps = applications.filter(a => a.projectId !== id);
    writeJsonFile(WORKSPACE_APPLICATIONS_FILE, remainingApps);

    return res.json({
      success: true,
      message: `Project "${deleted.title}" deleted successfully.`,
      deletedId: id,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error deleting project.' });
  }
});

// 12c. Assign/Add Person to Project (CEO and Co-Founders)
app.post('/api/workspace/projects/:id/assign', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorCode, memberId } = req.body;
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const author = members.find(m => m.code === authorCode);
    if (!author || (author.role !== 'ceo' && author.role !== 'cofounder')) {
      return res.status(403).json({ success: false, message: 'Only leaders can assign members to projects.' });
    }

    const targetMember = members.find(m => m.id === memberId || m.code === memberId);
    if (!targetMember) {
      return res.status(404).json({ success: false, message: 'Member to assign not found.' });
    }

    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    const projIndex = projects.findIndex(p => p.id === id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (!Array.isArray(projects[projIndex].assignedMembers)) {
      projects[projIndex].assignedMembers = [];
    }

    const alreadyAssigned = projects[projIndex].assignedMembers.some((m: any) => m.id === targetMember.id);
    if (alreadyAssigned) {
      return res.status(400).json({ success: false, message: `${targetMember.name} is already assigned to this project.` });
    }

    projects[projIndex].assignedMembers.push({
      id: targetMember.id,
      name: targetMember.name,
      role: targetMember.role,
      position: targetMember.position,
      assignedAt: new Date().toISOString(),
      assignedBy: author.name,
    });

    writeJsonFile(WORKSPACE_PROJECTS_FILE, projects);

    return res.json({
      success: true,
      message: `${targetMember.name} has been assigned to project "${projects[projIndex].title}"!`,
      project: projects[projIndex],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error assigning member to project.' });
  }
});

// 12d. Unassign Person from Project (CEO and Co-Founders)
app.post('/api/workspace/projects/:id/unassign', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { authorCode, memberId } = req.body;
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const author = members.find(m => m.code === authorCode);
    if (!author || (author.role !== 'ceo' && author.role !== 'cofounder')) {
      return res.status(403).json({ success: false, message: 'Only leaders can unassign members from projects.' });
    }

    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    const projIndex = projects.findIndex(p => p.id === id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    if (Array.isArray(projects[projIndex].assignedMembers)) {
      projects[projIndex].assignedMembers = projects[projIndex].assignedMembers.filter((m: any) => m.id !== memberId);
      writeJsonFile(WORKSPACE_PROJECTS_FILE, projects);
    }

    return res.json({
      success: true,
      message: 'Member unassigned from project.',
      project: projects[projIndex],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error unassigning member.' });
  }
});

// 13. Apply for Project ("Apply Here" from Members)
app.post('/api/workspace/projects/:id/apply', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { memberId, memberCode, coverNote } = req.body;

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const member = members.find(m => m.id === memberId || m.code === memberCode);
    if (!member) {
      return res.status(401).json({ success: false, message: 'Invalid member credentials.' });
    }

    const projects = readJsonFile<any[]>(WORKSPACE_PROJECTS_FILE, []);
    const projIndex = projects.findIndex(p => p.id === id);
    if (projIndex === -1) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    const applications = readJsonFile<any[]>(WORKSPACE_APPLICATIONS_FILE, []);
    const existing = applications.find(a => a.projectId === id && a.memberId === member.id);
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied for this project.' });
    }

    const newApp = {
      id: 'app_' + Date.now() + '_' + crypto.randomInt(100, 999),
      projectId: id,
      projectTitle: projects[projIndex].title,
      memberId: member.id,
      memberName: member.name,
      memberEmail: member.email,
      memberPhone: member.phone,
      memberPosition: member.position,
      coverNote: (coverNote || 'Ready to start immediately.').trim(),
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };

    applications.unshift(newApp);
    writeJsonFile(WORKSPACE_APPLICATIONS_FILE, applications);

    projects[projIndex].applicantCount = (projects[projIndex].applicantCount || 0) + 1;
    writeJsonFile(WORKSPACE_PROJECTS_FILE, projects);

    // Also push to executive Mailbox
    const mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    mailbox.unshift({
      id: 'mail_papp_' + newApp.id,
      type: 'project_application',
      title: `Project Application: ${projects[projIndex].title}`,
      senderName: member.name,
      senderPhone: member.phone,
      senderEmail: member.email,
      roleApplied: member.position,
      content: `Team member ${member.name} (${member.position}) applied for project "${projects[projIndex].title}". Cover Note: "${newApp.coverNote}"`,
      details: { applicationId: newApp.id, projectId: id, projectTitle: projects[projIndex].title, memberId: member.id },
      status: 'unread',
      createdAt: new Date().toISOString(),
    });
    writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

    return res.json({
      success: true,
      message: 'Application submitted successfully! Management will review your submission.',
      application: newApp,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error applying for project.' });
  }
});

// 14. Get Applications (Admin Review View)
app.get('/api/workspace/applications', (_req: Request, res: Response) => {
  try {
    const applications = readJsonFile<any[]>(WORKSPACE_APPLICATIONS_FILE, []);
    return res.json({ success: true, applications });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications.' });
  }
});

// 15. Review Application (Select, Shortlist, Reject)
app.post('/api/workspace/applications/:id/status', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reviewerCode, status } = req.body;

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const reviewer = members.find(m => m.code === reviewerCode);
    if (!reviewer || (reviewer.role !== 'ceo' && reviewer.role !== 'cofounder')) {
      return res.status(403).json({ success: false, message: 'Only leaders can review applications.' });
    }

    const applications = readJsonFile<any[]>(WORKSPACE_APPLICATIONS_FILE, []);
    const appIndex = applications.findIndex(a => a.id === id);
    if (appIndex === -1) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    applications[appIndex].status = status;
    applications[appIndex].reviewedBy = reviewer.name;
    applications[appIndex].reviewedAt = new Date().toISOString();
    writeJsonFile(WORKSPACE_APPLICATIONS_FILE, applications);

    return res.json({ success: true, message: `Application status updated to ${status}.` });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
});

// 16. Internal Team Chat Messages
app.get('/api/workspace/messages', (_req: Request, res: Response) => {
  try {
    const messages = readJsonFile<any[]>(WORKSPACE_MESSAGES_FILE, []);
    return res.json({ success: true, messages });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
});

// 17. Send Internal Team Chat Message
app.post('/api/workspace/messages', (req: Request, res: Response) => {
  try {
    const { senderCode, content, channel } = req.body;
    if (!senderCode || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Sender code and message content are required.' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const member = members.find(m => m.code === senderCode.trim());
    if (!member) {
      return res.status(401).json({ success: false, message: 'Sender not authorized in workspace.' });
    }

    const messages = readJsonFile<any[]>(WORKSPACE_MESSAGES_FILE, []);
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderId: member.id,
      senderCode: member.code,
      senderName: member.name,
      senderRole: member.role,
      senderPosition: member.position,
      content: content.trim(),
      channel: channel || 'general',
      timestamp: new Date().toISOString(),
    };

    messages.push(newMsg);
    // Keep last 300 messages
    if (messages.length > 300) {
      messages.splice(0, messages.length - 300);
    }
    writeJsonFile(WORKSPACE_MESSAGES_FILE, messages);

    return res.json({ success: true, message: 'Message sent.', newMessage: newMsg });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error sending message.' });
  }
});

// 18. Personal Direct Messaging (DM) System
app.get('/api/workspace/direct-messages', (req: Request, res: Response) => {
  try {
    const memberCode = (req.query.memberCode as string || '').trim();
    if (!memberCode) {
      return res.status(400).json({ success: false, message: 'Member code is required.' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const currentMember = members.find(m => m.code === memberCode);
    if (!currentMember) {
      return res.status(401).json({ success: false, message: 'Member not authorized.' });
    }

    const directMessages = readJsonFile<any[]>(WORKSPACE_DIRECT_MESSAGES_FILE, []);
    // Only return DMs where the active member is either sender or recipient
    const memberDms = directMessages.filter(
      (m: any) => m.senderId === currentMember.id || m.recipientId === currentMember.id
    );

    return res.json({ success: true, directMessages: memberDms });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error fetching direct messages.' });
  }
});

app.post('/api/workspace/direct-messages', (req: Request, res: Response) => {
  try {
    const { senderCode, recipientId, content } = req.body;
    if (!senderCode || !recipientId || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Sender code, recipient ID, and content are required.' });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const sender = members.find(m => m.code === senderCode.trim());
    if (!sender) {
      return res.status(401).json({ success: false, message: 'Sender not authorized.' });
    }

    const recipient = members.find(m => m.id === recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'Recipient not found in team directory.' });
    }

    const directMessages = readJsonFile<any[]>(WORKSPACE_DIRECT_MESSAGES_FILE, []);
    const newDm = {
      id: 'dm_' + Date.now() + '_' + crypto.randomInt(100, 999),
      senderId: sender.id,
      senderCode: sender.code,
      senderName: sender.name,
      senderRole: sender.role,
      senderPosition: sender.position,
      recipientId: recipient.id,
      recipientName: recipient.name,
      recipientRole: recipient.role,
      recipientPosition: recipient.position,
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    directMessages.push(newDm);
    // Keep last 1000 DMs
    if (directMessages.length > 1000) {
      directMessages.splice(0, directMessages.length - 1000);
    }
    writeJsonFile(WORKSPACE_DIRECT_MESSAGES_FILE, directMessages);

    return res.json({ success: true, message: 'Direct message sent!', directMessage: newDm });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: 'Error sending direct message.' });
  }
});

// 18. Change Member Access Code / Password (STRICTLY CEO ONLY: "30072012")
app.put('/api/workspace/members/:id/code', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode, newCode } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({
        success: false,
        message: 'Strict Master Control: Only CEO Samarth Zende (30072012) has master access to change member passwords and access codes.',
      });
    }

    if (!newCode || typeof newCode !== 'string') {
      return res.status(400).json({ success: false, message: 'New 8-character access code / password is required.' });
    }

    const cleanCode = newCode.trim();
    if (cleanCode.length !== 8 && [...cleanCode].length !== 8) {
      return res.status(400).json({
        success: false,
        message: 'Access code must be exactly 8 characters (supports digits, letters, and symbols: #, ₹, +, ×, ÷, @, %, =, /).',
      });
    }

    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const memberIndex = members.findIndex(m => m.id === id);
    if (memberIndex === -1) {
      return res.status(404).json({ success: false, message: 'Member account not found.' });
    }

    const targetMember = members[memberIndex];
    if (targetMember.role === 'ceo' || targetMember.code === '30072012') {
      if (cleanCode !== '30072012') {
        return res.status(400).json({
          success: false,
          message: 'The CEO Master Access Code is strictly locked to 30072012 for Samarth Zende.',
        });
      }
    }

    const codeConflict = members.find(m => m.id !== id && m.code === cleanCode);
    if (codeConflict) {
      return res.status(400).json({
        success: false,
        message: `The access code "${cleanCode}" is already assigned to member "${codeConflict.name}". Please choose a different unique code.`,
      });
    }

    targetMember.code = cleanCode;
    targetMember.updatedAt = new Date().toISOString();
    writeJsonFile(WORKSPACE_MEMBERS_FILE, members);

    // Log update to executive mailbox for transparency
    const mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    mailbox.unshift({
      id: 'mail_' + Date.now(),
      type: 'profile_change',
      title: `Access Code / Password Changed for ${targetMember.name}`,
      senderName: 'CEO System Security',
      content: `CEO Samarth Zende updated the 8-character access code for ${targetMember.name} (${targetMember.position}). New password/code applied immediately.`,
      status: 'read',
      createdAt: new Date().toISOString(),
      details: { memberId: targetMember.id, memberName: targetMember.name, newCode: cleanCode }
    });
    writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

    return res.json({
      success: true,
      message: `Access code/password for ${targetMember.name} successfully updated to "${cleanCode}"!`,
      member: targetMember,
    });
  } catch (err: any) {
    console.error('Error updating member password/code:', err);
    return res.status(500).json({ success: false, message: 'Server error updating member code.' });
  }
});

// 19. Submit Team Joining Application (Public "Work With SAMZEN" / Join Us -> CEO Mailbox)
app.post('/api/workspace/mailbox/join-team', (req: Request, res: Response) => {
  try {
    const { fullName, mobileNumber, currentOccupation, selectedRole, reference, experienceNote } = req.body;
    if (!fullName || !mobileNumber || !selectedRole) {
      return res.status(400).json({ success: false, message: 'Full name, mobile number, and role selection are required.' });
    }

    const mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    const newMail = {
      id: 'app_' + Date.now() + '_' + crypto.randomInt(100, 999),
      type: 'team_application',
      title: `New Team Joining Application: ${selectedRole}`,
      senderName: fullName.trim(),
      senderPhone: mobileNumber.trim(),
      roleApplied: selectedRole.trim(),
      occupation: (currentOccupation || '').trim(),
      reference: (reference || '').trim(),
      content: experienceNote ? experienceNote.trim() : `Applied for ${selectedRole}. Current occupation: ${currentOccupation}. Reference: ${reference}.`,
      details: {
        fullName: fullName.trim(),
        phone: mobileNumber.trim(),
        occupation: (currentOccupation || '').trim(),
        role: selectedRole.trim(),
        reference: (reference || '').trim(),
        experience: (experienceNote || '').trim(),
      },
      status: 'unread',
      createdAt: new Date().toISOString(),
    };

    mailbox.unshift(newMail);
    writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

    return res.json({
      success: true,
      message: `Application submitted successfully! It has been received in CEO Samarth Zende's Executive Mailbox.`,
      mailId: newMail.id,
    });
  } catch (err: any) {
    console.error('Error submitting team joining application:', err);
    return res.status(500).json({ success: false, message: 'Server error saving application.' });
  }
});

// 20. Get Mailbox Items (CEO & Co-Founders)
app.get('/api/workspace/mailbox', (req: Request, res: Response) => {
  try {
    const ceoCode = (req.query.ceoCode as string || '').trim();
    const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
    const caller = members.find(m => m.code === ceoCode);
    if (!caller || (caller.role !== 'ceo' && caller.role !== 'cofounder')) {
      return res.status(403).json({ success: false, message: 'Access denied: Mailbox is reserved for CEO Samarth Zende & Co-Founders.' });
    }

    let mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    
    // Seed initial message if mailbox is fresh
    if (mailbox.length === 0) {
      mailbox = [
        {
          id: 'mail_welcome_01',
          type: 'general_inquiry',
          title: 'Welcome to SAMZEN Executive Mailbox',
          senderName: 'SAMZEN HQ System',
          senderEmail: 'archanazende1710@gmail.com',
          senderPhone: '+91 8605042855',
          content: 'All incoming public team joining applications, co-founder member requests, project applications, and client enquiries arrive directly in this Mailbox for CEO review.',
          status: 'read',
          createdAt: new Date().toISOString(),
        }
      ];
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
    }

    return res.json({ success: true, items: mailbox });
  } catch (err: any) {
    console.error('Error fetching mailbox:', err);
    return res.status(500).json({ success: false, message: 'Server error loading mailbox.' });
  }
});

// 21. Mailbox Item Action (CEO Only: Mark Read/Unread, Approve -> Generate Code, Decline, Archive, Delete)
app.post('/api/workspace/mailbox/:id/action', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { ceoCode, action, customCode, notes } = req.body;

    if (ceoCode !== '30072012') {
      return res.status(403).json({ success: false, message: 'Only CEO Samarth Zende (30072012) can perform actions in the Mailbox.' });
    }

    let mailbox = readJsonFile<any[]>(WORKSPACE_MAILBOX_FILE, []);
    const itemIndex = mailbox.findIndex(m => m.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Mailbox message not found.' });
    }

    const item = mailbox[itemIndex];

    if (action === 'delete') {
      mailbox = mailbox.filter(m => m.id !== id);
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
      return res.json({ success: true, message: 'Mail item deleted from Mailbox.' });
    }

    if (action === 'mark_read') {
      item.status = 'read';
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
      return res.json({ success: true, message: 'Marked as read.' });
    }

    if (action === 'mark_unread') {
      item.status = 'unread';
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
      return res.json({ success: true, message: 'Marked as unread.' });
    }

    if (action === 'archive') {
      item.status = 'archived';
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
      return res.json({ success: true, message: 'Archived.' });
    }

    if (action === 'reject') {
      item.status = 'rejected';
      item.reviewedAt = new Date().toISOString();
      item.reviewedBy = 'CEO Samarth Zende';
      if (notes) item.notes = notes;
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);
      return res.json({ success: true, message: 'Application declined.' });
    }

    if (action === 'approve') {
      // Approve and onboard into team directory!
      const members = readJsonFile<any[]>(WORKSPACE_MEMBERS_FILE, []);
      const existingCodes = new Set<string>(members.map(m => m.code));

      let assignedCode = '';
      if (customCode && typeof customCode === 'string' && customCode.trim()) {
        const cleanCustom = customCode.trim();
        if (cleanCustom.length !== 8 && [...cleanCustom].length !== 8) {
          return res.status(400).json({ success: false, message: 'Custom code must be exactly 8 characters.' });
        }
        if (cleanCustom === '30072012') {
          return res.status(400).json({ success: false, message: 'Code 30072012 is reserved for CEO Samarth Zende.' });
        }
        if (existingCodes.has(cleanCustom)) {
          return res.status(400).json({ success: false, message: `Code "${cleanCustom}" is already assigned to another member.` });
        }
        assignedCode = cleanCustom;
      } else {
        assignedCode = generateUnique8DigitCode(existingCodes);
      }

      // Map applied role to valid WorkspaceRole
      let assignedRole: any = 'member';
      const roleString = (item.roleApplied || item.details?.role || '').toLowerCase();
      if (roleString.includes('co-founder') || roleString.includes('cofounder')) assignedRole = 'cofounder';
      else if (roleString.includes('executive') || roleString.includes('manager')) assignedRole = 'executive_head';
      else if (roleString.includes('contractor')) assignedRole = 'contractor';
      else if (roleString.includes('home servicer') || roleString.includes('home')) assignedRole = 'home_servicer';
      else if (roleString.includes('caller') || roleString.includes('helper')) assignedRole = 'caller_helper';

      const newMember = {
        id: 'mem_' + Date.now() + '_' + crypto.randomInt(100, 999),
        code: assignedCode,
        name: item.senderName,
        email: item.senderEmail || `${item.senderName.toLowerCase().replace(/[^a-z0-9]/g, '')}@samzen.team`,
        phone: item.senderPhone || '',
        position: item.roleApplied || 'Team Member',
        role: assignedRole,
        status: 'active',
        createdAt: new Date().toISOString(),
        createdById: 'ceo_samarth_zende',
      };

      members.push(newMember);
      writeJsonFile(WORKSPACE_MEMBERS_FILE, members);

      item.status = 'approved';
      item.generatedCode = assignedCode;
      item.reviewedAt = new Date().toISOString();
      item.reviewedBy = 'CEO Samarth Zende';
      if (notes) item.notes = notes;
      writeJsonFile(WORKSPACE_MAILBOX_FILE, mailbox);

      return res.json({
        success: true,
        message: `Candidate "${item.senderName}" approved! Onboarded into Team Directory with 8-character access code: ${assignedCode}`,
        generatedCode: assignedCode,
        member: newMember,
      });
    }

    return res.status(400).json({ success: false, message: 'Unknown action.' });
  } catch (err: any) {
    console.error('Error updating mailbox item:', err);
    return res.status(500).json({ success: false, message: 'Server error processing mailbox action.' });
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
