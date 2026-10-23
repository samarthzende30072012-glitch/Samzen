import React, { useState } from 'react';
import { WORK_ROLES } from '../data/samzenData';
import { 
  Briefcase, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  DollarSign, 
  AlertCircle, 
  MessageSquare, 
  Mail, 
  Copy, 
  Check,
  Inbox
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { submitTeamJoiningApplication } from '../services/workspaceApi';

export const WorkWithSamzen: React.FC = () => {
  const { language } = useLanguage();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [selectedRole, setSelectedRole] = useState('Co-Founder [10%–20% Share]');
  const [reference, setReference] = useState('');
  const [experienceNote, setExperienceNote] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccessMessage, setSubmissionSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const roleDropdownOptions = [
    'Co-Founder [10%–20% Share]',
    'Executive Head / Manager [10%–15% Share]',
    'Contractor [3%–10% Share]',
    'Home Servicer [Field & Publishing]',
    'Caller & Helper [1%–3% Share]'
  ];

  const handleSelectRoleCard = (roleTitle: string) => {
    if (roleTitle.includes('Co-Founder')) {
      setSelectedRole('Co-Founder [10%–20% Share]');
    } else if (roleTitle.includes('Executive Head')) {
      setSelectedRole('Executive Head / Manager [10%–15% Share]');
    } else if (roleTitle.includes('Contractor')) {
      setSelectedRole('Contractor [3%–10% Share]');
    } else if (roleTitle.includes('Home Servicer')) {
      setSelectedRole('Home Servicer [Field & Publishing]');
    } else if (roleTitle.includes('Caller')) {
      setSelectedRole('Caller & Helper [1%–3% Share]');
    }
    const formElement = document.getElementById('apply-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const generateApplicationSummary = () => {
    return `*SAMZEN CAREERS & PARTNERSHIP APPLICATION*
---------------------------------------
👤 *Applicant Name:* ${fullName.trim()}
📱 *Mobile / WhatsApp:* ${mobileNumber.trim()}
💼 *Current Occupation / Work:* ${currentOccupation.trim()}
🎯 *Applied Role:* ${selectedRole}
🤝 *Referred By / Reference:* ${reference.trim()}
${experienceNote.trim() ? `📝 *Experience / Short Note:* ${experienceNote.trim()}` : ''}
---------------------------------------
Sent via SAMZEN Web Development Careers Portal (https://samzen.ai.studio)`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!mobileNumber.trim() || mobileNumber.trim().length < 8) {
      setErrorMsg('Please enter a valid mobile or WhatsApp number.');
      return;
    }
    if (!currentOccupation.trim()) {
      setErrorMsg('Please describe what you currently do (student, job, freelancer, etc.).');
      return;
    }
    if (!selectedRole) {
      setErrorMsg('Please select the role you want to apply for.');
      return;
    }
    if (!reference.trim()) {
      setErrorMsg('Please state who referred you or where you heard about SAMZEN.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitTeamJoiningApplication({
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        currentOccupation: currentOccupation.trim(),
        selectedRole: selectedRole.trim(),
        reference: reference.trim(),
        experienceNote: experienceNote.trim(),
      });

      if (res.success) {
        setSubmissionSuccessMessage(res.message);
        setFormSubmitted(true);
      } else {
        setErrorMsg(res.message || 'Error submitting application.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application to CEO Mailbox.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMailSubmit = () => {
    const summary = generateApplicationSummary();
    const subject = encodeURIComponent(`Job Application: ${selectedRole} - ${fullName}`);
    const body = encodeURIComponent(summary);
    window.location.href = `mailto:samarthzende@30072012?subject=${subject}&body=${body}`;
  };

  const copyApplication = () => {
    const summary = generateApplicationSummary();
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section id="careers" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#0b1220]/60 relative overflow-hidden scroll-mt-20">
      {/* Anchor targets for smooth glide navigation */}
      <span id="join-us" className="absolute -top-24 pointer-events-none" />
      <span id="work" className="absolute -top-24 pointer-events-none" />
      {/* Background glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-gradient-to-l from-[#3da9fc]/10 to-transparent blur-3xl pointer-events-none -z-10 gpu-layer" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <Briefcase className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Careers &amp; Partnerships</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Work With SAMZEN &mdash; Choose Your Role &amp; Earn
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            {language === 'mr'
              ? 'समर्थ झेंडे हे एकमेव संस्थापक आहेत. तुम्ही सह-संस्थापक (Co-Founder), कॉन्ट्रॅक्टर किंवा टीम सदस्य म्हणून सहभागी होऊन प्रत्येक प्रोजेक्टवर आकर्षक कमिशन कमवू शकता.'
              : language === 'hi'
              ? 'समर्थ झेंडे एकमात्र संस्थापक हैं। उच्च योग्यता वाले आवेदक को-फाउंडर, कांट्रेक्टर या रिमोट वर्कर के रूप में जुड़कर प्रति प्रोजेक्ट सीधा कमीशन कमा सकते हैं।'
              : 'Samarth Zende is the sole Founder & CEO. Top-level applicants can apply to join as a Co-Founder, contractor, or team member with clear project payouts.'}
          </p>
        </div>

        {/* Roles Grid using .plan styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {WORK_ROLES.map((role) => {
            const isCofounder = role.id === 'role-cofounder';

            return (
              <div
                key={role.id}
                className={`plan ${isCofounder ? 'feat' : ''} relative rounded-2xl flex flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                  isCofounder
                    ? 'bg-[#0e1726] border-2 border-[#3da9fc] shadow-xl shadow-[#3da9fc]/15'
                    : 'bg-[#0e1726] border border-[#1d2a3e] hover:border-[#3da9fc]/70'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#59e3ff] bg-[#3da9fc]/15 px-2.5 py-0.5 rounded-full border border-[#3da9fc]/30">
                      {role.badge}
                    </span>
                    {isCofounder && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Sparkles className="w-3 h-3" />
                        <span>High Share</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-heading text-white mb-2 leading-snug">
                    {role.title}
                  </h3>

                  {/* Payout Tag */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#070b14] border border-[#3da9fc]/40 text-[#59e3ff] text-xs font-bold font-mono my-2">
                    <DollarSign className="w-3.5 h-3.5 text-[#3da9fc]" />
                    <span>Payout: {role.payout}</span>
                  </div>

                  <p className="text-xs text-[#9db0c8] mt-2 mb-4 leading-relaxed">
                    {role.description}
                  </p>

                  {/* Responsibilities list */}
                  <div className="space-y-2 pt-3 border-t border-[#1d2a3e] text-xs text-[#c9d3dc]">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-[#9db0c8] mb-1">
                      Key Responsibilities:
                    </div>
                    {role.responsibilities.map((resp, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#3da9fc] flex-shrink-0 mt-0.5" />
                        <span className="leading-tight">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-[#1d2a3e]">
                  <button
                    onClick={() => handleSelectRoleCard(role.title)}
                    className="btn-interactive w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 bg-[#1d2a3e] hover:bg-[#3da9fc] text-white hover:text-[#070b14] transition cursor-pointer"
                  >
                    <span>Apply for this Role</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Application Form Container (.banner / .panel) */}
        <div id="apply-form-container" className="banner max-w-3xl mx-auto rounded-2xl p-6 sm:p-9 shadow-2xl relative border-2 border-[#3da9fc]">
          
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#1d2a3e]">
            <div className="w-10 h-10 rounded-xl bg-[#3da9fc]/20 border border-[#3da9fc]/40 flex items-center justify-center text-[#59e3ff] flex-shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Submit Your Application
              </h3>
              <p className="text-xs text-[#9db0c8]">
                Join SAMZEN Web Development. Applications are reviewed directly by Founder &amp; CEO Samarth Zende.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {formSubmitted ? (
            <div className="py-8 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white font-heading flex items-center justify-center gap-2">
                <Inbox className="w-5 h-5 text-[#59e3ff]" />
                <span>Delivered to CEO Samarth Zende's Mailbox!</span>
              </h4>
              <p className="text-xs sm:text-sm text-[#9db0c8] max-w-md mx-auto leading-relaxed">
                Your application for <strong>{selectedRole}</strong> has been received directly inside the CEO Executive Mailbox. You can also send a direct WhatsApp follow-up or copy your application details below.
              </p>

              <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-left text-xs text-[#c9d3dc] font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                {generateApplicationSummary()}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/918605042855?text=${encodeURIComponent(generateApplicationSummary())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-interactive btn-shimmer-visible px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleMailSubmit}
                  className="btn-interactive px-4 py-2.5 rounded-xl bg-[#0e1726] border border-[#3da9fc]/40 hover:border-[#3da9fc] text-white text-xs font-semibold flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#59e3ff]" />
                  <span>Send via Email</span>
                </button>

                <button
                  type="button"
                  onClick={copyApplication}
                  className="btn-interactive px-4 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#c9d3dc] hover:text-white text-xs font-semibold flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs text-[#59e3ff] hover:underline"
                >
                  Submit another application or edit details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                    1. Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs placeholder-[#9db0c8]/40 transition"
                  />
                </div>

                {/* 2. Mobile / WhatsApp Number */}
                <div>
                  <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                    2. Mobile / WhatsApp Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs placeholder-[#9db0c8]/40 transition"
                  />
                </div>
              </div>

              {/* 3. What Do You Currently Do? */}
              <div>
                <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                  3. What Do You Currently Do? <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={currentOccupation}
                  onChange={(e) => setCurrentOccupation(e.target.value)}
                  placeholder="e.g. College Student (BCA/Engg) / Full-Time Freelancer / Working Professional / Shopkeeper"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs placeholder-[#9db0c8]/40 transition"
                />
              </div>

              {/* 4. Select Role You Want to Apply For */}
              <div>
                <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                  4. Select Role You Want to Apply For <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs transition cursor-pointer"
                >
                  {roleDropdownOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-[#0e1726] text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* 5. Referred By / Reference */}
              <div>
                <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                  5. Referred By / Reference <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. Samarth Zende / Instagram / Friend Name / Google / WhatsApp Group"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs placeholder-[#9db0c8]/40 transition"
                />
              </div>

              {/* 6. Short Note / Experience */}
              <div>
                <label className="block text-xs font-semibold text-[#c9d3dc] mb-1.5">
                  6. Short Note / Experience <span className="text-[#9db0c8] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={experienceNote}
                  onChange={(e) => setExperienceNote(e.target.value)}
                  placeholder="Tell us about your coding skills, past client connections, or why you want to work with SAMZEN..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-white text-xs placeholder-[#9db0c8]/40 transition resize-none"
                />
              </div>

              {/* 7. Glowing blue/cyan submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-shimmer-visible btn-glow-pulse btn-interactive w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] hover:from-[#59e3ff] hover:to-[#3da9fc] text-[#070b14] font-extrabold text-sm shadow-xl shadow-[#3da9fc]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4 text-[#070b14]" />
                  <span>{isSubmitting ? 'Delivering to CEO Mailbox...' : 'Submit Application to CEO Mailbox'}</span>
                </button>
                <p className="text-[11px] text-[#9db0c8] text-center mt-2.5">
                  Direct submission lands instantly in CEO Samarth Zende's Executive Mailbox with instant review.
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
};
