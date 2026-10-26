import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ArrowLeft,
  DollarSign,
  Send,
  CheckCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  PhoneCall,
  Laptop,
  Flame,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Scale
} from 'lucide-react';
import { submitTeamJoiningApplication, getWorkspaceProjects } from '../services/workspaceApi';
import { WorkPolicyModal } from './WorkPolicyModal';

export interface WorkProject {
  id: string;
  name: string;
  clientName: string;
  budgetINR: number;
  status: string;
  assignedMembers: string[];
  deadline: string;
  deliverables: string[];
}

const DEFAULT_PROJECTS: WorkProject[] = [
  {
    id: 'proj-1',
    name: 'OmniTrade FinTech Dashboard',
    clientName: 'Apex Wealth Advisory',
    budgetINR: 125000,
    status: 'in-progress',
    assignedMembers: ['Samarth Zende (CEO)', 'DevLead'],
    deadline: '2025-06-30',
    deliverables: ['Real-time charting', 'Trading engine UI', 'Auth & KYC pipeline']
  },
  {
    id: 'proj-2',
    name: 'HyperScale Logistics Portal',
    clientName: 'SwiftRelay Freight',
    budgetINR: 85000,
    status: 'planning',
    assignedMembers: ['Samarth Zende (CEO)'],
    deadline: '2025-07-15',
    deliverables: ['Fleet GPS Tracking', 'Billing & Invoicing', 'Driver SMS dispatcher']
  },
  {
    id: 'proj-3',
    name: 'NextGen Brand Storefront & CMS',
    clientName: 'Aura Lifestyle',
    budgetINR: 65000,
    status: 'planning',
    assignedMembers: [],
    deadline: '2025-08-01',
    deliverables: ['Custom headless ecommerce', 'Razorpay checkout', 'Inventory admin']
  }
];

interface WorkPageProps {
  onBackToPublic: () => void;
  onOpenWorkspaceAuth: () => void;
}

export const WorkPage: React.FC<WorkPageProps> = ({ onBackToPublic, onOpenWorkspaceAuth }) => {
  const [activeTab, setActiveTab] = useState<'open-roles' | 'projects' | 'apply' | 'lead-logger'>('projects');
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  // Application form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [roleCategory, setRoleCategory] = useState<'Co-Founder' | 'Executive Head' | 'Contractor' | 'Home Servicer' | 'Caller' | 'Helper'>('Contractor');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Project apply modal
  const [selectedProject, setSelectedProject] = useState<WorkProject | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantContact, setApplicantContact] = useState('');
  const [applicantRole, setApplicantRole] = useState('Contractor');
  const [applicantPitch, setApplicantPitch] = useState('');
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [projectSuccessMsg, setProjectSuccessMsg] = useState('');
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [projectLegalAgreed, setProjectLegalAgreed] = useState(false);

  // Lead logger state (for callers / contractors logging work on the spot)
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadService, setLeadService] = useState('Full-Stack Web App');
  const [leadNotes, setLeadNotes] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [leadLoggedSuccess, setLeadLoggedSuccess] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await getWorkspaceProjects();
      if (Array.isArray(res) && res.length > 0) {
        const mapped: WorkProject[] = res.map((p) => ({
          id: p.id,
          name: p.title,
          clientName: p.location || 'Direct Client / SAMZEN Ecosystem',
          budgetINR: parseInt(p.budget?.replace(/[^0-9]/g, '') || '50000', 10),
          status: p.status,
          assignedMembers: (p.assignedMembers || []).map((m) => m.name),
          deadline: 'Active Window',
          deliverables: p.requirements && p.requirements.length > 0 ? p.requirements : ['Full-Stack Implementation', 'Quality Assurance']
        }));
        setProjects(mapped);
      } else {
        setProjects(DEFAULT_PROJECTS);
      }
    } catch {
      setProjects(DEFAULT_PROJECTS);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide your name and WhatsApp/phone number.');
      return;
    }
    setSubmitting(true);
    setSubmittedStatus(null);
    try {
      const res = await submitTeamJoiningApplication({
        fullName: name.trim(),
        mobileNumber: phone.trim(),
        currentOccupation: email.trim() || 'Direct Work Portal Submission',
        selectedRole: roleCategory,
        reference: 'Work Page Portal (25% Commission Hub)',
        experienceNote: notes.trim() || 'Candidate submitted via WorkPage direct joining form.'
      });
      if (res.success) {
        setSubmittedStatus(res.message || 'Your application was dispatched directly to CEO Samarth Zende’s Executive Mailbox.');
        setName('');
        setPhone('');
        setEmail('');
        setNotes('');
      } else {
        alert(res.message || 'Submission failed');
      }
    } catch {
      alert('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProjectApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !applicantName.trim() || !applicantContact.trim()) {
      alert('Please enter your name and phone/WhatsApp number.');
      return;
    }
    setProjectSubmitting(true);
    setProjectSuccessMsg('');
    try {
      const res = await submitTeamJoiningApplication({
        fullName: applicantName.trim(),
        mobileNumber: applicantContact.trim(),
        currentOccupation: applicantRole,
        selectedRole: `Project Applicant: ${selectedProject.name}`,
        reference: `Project ID: ${selectedProject.id}`,
        experienceNote: applicantPitch.trim() || `Applied for client project: ${selectedProject.name} (Budget: ₹${selectedProject.budgetINR})`
      });
      if (res.success) {
        setProjectSuccessMsg('Application logged directly into CEO Samarth Zende’s Executive Mailbox! He will contact you on WhatsApp.');
        setTimeout(() => {
          setSelectedProject(null);
          setApplicantName('');
          setApplicantContact('');
          setApplicantPitch('');
          setProjectSuccessMsg('');
        }, 2200);
      } else {
        alert(res.message || 'Failed to submit application');
      }
    } catch {
      alert('Failed to connect to workspace server.');
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workerName.trim() || !leadName.trim() || !leadPhone.trim()) {
      alert('Please fill in your name, the client name and client contact.');
      return;
    }
    // Also dispatch to CEO mailbox
    submitTeamJoiningApplication({
      fullName: `[CLIENT LEAD from ${workerName}]: ${leadName}`,
      mobileNumber: leadPhone,
      currentOccupation: `Referred by: ${workerName}`,
      selectedRole: 'Contractor / Lead Generation',
      reference: `Service: ${leadService}`,
      experienceNote: `Client: ${leadName}. Service: ${leadService}. Notes: ${leadNotes}. Brought by team member ${workerName} for 25% commission payout.`
    });
    setLeadLoggedSuccess(true);
    setTimeout(() => {
      setLeadName('');
      setLeadPhone('');
      setLeadNotes('');
      setLeadLoggedSuccess(false);
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Work Bar - Distraction Free */}
      <header className="sticky top-0 z-40 bg-[#0b1120]/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToPublic}
            className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Main Website</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              SAMZEN WORK HUB
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Production
            </span>
          </div>
        </div>

        {/* Existing Member Portal Login CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-400">Already on team?</div>
            <div className="text-[11px] text-slate-500 font-mono">Use your 8-digit access code</div>
          </div>
          <button
            onClick={onOpenWorkspaceAuth}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-3.5 py-2 rounded-lg shadow-md hover:shadow-emerald-900/40 transition active:scale-95 border border-emerald-500/30"
          >
            <KeyRound className="w-4 h-4" />
            <span>Team Portal Sign-In</span>
          </button>
        </div>
      </header>

      {/* Hero Work Banner */}
      <section className="bg-gradient-to-b from-[#0f172a] to-[#070b14] border-b border-slate-800/80 px-4 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/90 text-cyan-400 text-xs font-semibold border border-slate-700 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Dedicated Full-Screen Workspace — Zero Distractions
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Work, Deliver & Earn With SAMZEN
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
                Every rupee earned is split transparently per project contract. Join as a Co-Founder, Executive Head, Contractor, Home Servicer, or Caller.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 w-full lg:w-auto">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">Co-Founder Share</div>
                <div className="text-lg sm:text-xl font-black text-emerald-400">10% – 20%</div>
                <div className="text-[10px] text-slate-500">Per Client Deal</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">Contractor Cut</div>
                <div className="text-lg sm:text-xl font-black text-cyan-400">3% – 10%</div>
                <div className="text-[10px] text-slate-500">Fast Milestone Pay</div>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-400">Caller / Helper</div>
                <div className="text-lg sm:text-xl font-black text-amber-400">1% – 3%</div>
                <div className="text-[10px] text-slate-500">Immediate per Lead</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 mt-8 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'projects'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Active Client Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('open-roles')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'open-roles'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Roles & Commission Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('apply')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'apply'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Join SAMZEN (CEO Mailbox)</span>
            </button>

            <button
              onClick={() => setActiveTab('lead-logger')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition ${
                activeTab === 'lead-logger'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Client Lead & Caller Logger</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Full-Screen Work Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8">
        {/* TAB 1: ACTIVE PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-cyan-400" />
                  Live Projects Available For Work
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Click &quot;Apply Here&quot; on any project to claim a deliverable module. CEO Samarth Zende assigns tasks via WhatsApp.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('apply')}
                className="text-xs font-bold text-cyan-400 bg-cyan-950/50 hover:bg-cyan-900/70 border border-cyan-800/80 px-3.5 py-2 rounded-lg transition"
              >
                + Want custom role? Apply to CEO
              </button>
            </div>

            {loadingProjects ? (
              <div className="text-center py-16 text-slate-400 text-sm">
                Loading available work tasks...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
                <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <div className="text-slate-300 font-bold">No active project slots right now</div>
                <div className="text-slate-500 text-xs mt-1">Submit your team application to get on the priority shortlist!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-slate-900/80 hover:bg-slate-900 rounded-xl border border-slate-800 p-5 flex flex-col justify-between transition group shadow-sm hover:border-slate-700"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {proj.status.toUpperCase()}
                        </span>
                        <div className="text-right">
                          <span className="text-xs text-slate-400 block">Total Budget</span>
                          <span className="text-base font-extrabold text-emerald-400">₹{proj.budgetINR.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">Client: {proj.clientName}</p>

                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block mb-2">
                          Key Deliverables:
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {proj.deliverables.map((item: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="line-clamp-1">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {proj.assignedMembers && proj.assignedMembers.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-800/60">
                          <span className="text-[11px] text-slate-500 block mb-1">Assigned leads:</span>
                          <div className="flex flex-wrap gap-1">
                            {proj.assignedMembers.map((m: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Due {proj.deadline}
                      </span>

                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="flex items-center gap-1 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white px-3.5 py-1.5 rounded-lg transition active:scale-95 shadow-sm"
                      >
                        <span>Apply Here</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ROLES & MATRIX */}
        {activeTab === 'open-roles' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                SAMZEN Transparent Commission & Equity Matrix
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Zero gatekeeping. The contract profit is distributed immediately upon milestone delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role 1: Co-Founder */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Co-Founder (Partner)</h3>
                      <p className="text-xs text-slate-400">Strategy, Tech Architecture & Leadership</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cut</span>
                    <span className="text-lg font-black text-emerald-400">10% – 20%</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                  <p>• Strategic voting rights on major network directions.</p>
                  <p>• Direct executive approval access in the Team Portal.</p>
                  <p>• 8-digit master login credential created by CEO Samarth Zende.</p>
                </div>
                <button
                  onClick={() => {
                    setRoleCategory('Co-Founder');
                    setActiveTab('apply');
                  }}
                  className="mt-4 w-full text-center text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 py-2 rounded-lg transition"
                >
                  Apply For Co-Founder Slot →
                </button>
              </div>

              {/* Role 2: Executive Head */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Executive Head</h3>
                      <p className="text-xs text-slate-400">Tech Lead, Design Lead, Growth Lead</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cut</span>
                    <span className="text-lg font-black text-cyan-400">10% – 15%</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                  <p>• Lead dedicated sprints and supervise contractors.</p>
                  <p>• Review merge requests and client milestone verification.</p>
                  <p>• Direct WhatsApp coordination with CEO & Co-Founders.</p>
                </div>
                <button
                  onClick={() => {
                    setRoleCategory('Executive Head');
                    setActiveTab('apply');
                  }}
                  className="mt-4 w-full text-center text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-800/50 py-2 rounded-lg transition"
                >
                  Apply For Executive Head →
                </button>
              </div>

              {/* Role 3: Contractor */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Contractor / Developer</h3>
                      <p className="text-xs text-slate-400">Feature coder, UI designer, backend dev</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cut</span>
                    <span className="text-lg font-black text-indigo-400">3% – 10%</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                  <p>• Pick tasks from live projects and get paid instantly upon sign-off.</p>
                  <p>• Full remote flexibility — work on your own schedule.</p>
                  <p>• Access to SAMZEN component library and code boilerplate.</p>
                </div>
                <button
                  onClick={() => {
                    setRoleCategory('Contractor');
                    setActiveTab('apply');
                  }}
                  className="mt-4 w-full text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-800/50 py-2 rounded-lg transition"
                >
                  Apply As Contractor →
                </button>
              </div>

              {/* Role 4: Home Servicer, Caller & Helper */}
              <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">Home Servicer, Caller & Helper</h3>
                      <p className="text-xs text-slate-400">Work from home: Calls, Lead Gen & QA</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cut</span>
                    <span className="text-lg font-black text-amber-400">1% – 3%</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-slate-300 space-y-2 border-t border-slate-800/80 pt-3">
                  <p>• Zero prior coding needed. Call businesses or test apps from home.</p>
                  <p>• Immediate commission per lead converted or bug logged.</p>
                  <p>• Script templates and verified lead contacts provided.</p>
                </div>
                <button
                  onClick={() => {
                    setRoleCategory('Caller');
                    setActiveTab('apply');
                  }}
                  className="mt-4 w-full text-center text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/50 py-2 rounded-lg transition"
                >
                  Apply For Home Work →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATION DIRECT TO CEO MAILBOX */}
        {activeTab === 'apply' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Direct Application to CEO Mailbox</h2>
                  <p className="text-xs text-slate-400">
                    Your request lands straight inside CEO Samarth Zende&apos;s personal executive mailbox.
                  </p>
                </div>
              </div>

              {submittedStatus ? (
                <div className="bg-emerald-950/50 border border-emerald-700/60 p-5 rounded-xl text-center space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Application Dispatched!</h3>
                  <p className="text-xs text-emerald-200">{submittedStatus}</p>
                  <p className="text-xs text-slate-400">
                    Samarth Zende will review your request, approve your role, and issue your 8-digit access code via WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmittedStatus(null)}
                    className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rohan Deshmukh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone / WhatsApp <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role You Want to Fill <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={roleCategory}
                      onChange={(e) => setRoleCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    >
                      <option value="Co-Founder">Co-Founder (10%–20% Equity/Cut)</option>
                      <option value="Executive Head">Executive Head (10%–15% Cut)</option>
                      <option value="Contractor">Contractor / Developer (3%–10% Cut)</option>
                      <option value="Home Servicer">Home Servicer (Work from Home, 1%–3%)</option>
                      <option value="Caller">Caller & Lead Generator (1%–3%)</option>
                      <option value="Helper">Helper / Assistant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Experience, Skills or What You Bring
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. 2 years in React/Node, or ready to do 40 client calls a day, or looking to invest tech strategy."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>
                      After review, CEO Samarth Zende sets up your member record and issues a confidential 8-digit access code for the Team Portal.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Dispatching to CEO Mailbox...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Application Directly to CEO Mailbox</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CLIENT LEAD & CALLER LOGGER */}
        {activeTab === 'lead-logger' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Client Lead & Caller Logger</h2>
                  <p className="text-xs text-slate-400">
                    For callers, contractors & helpers. Log client leads to guarantee your 1%–3% commission cut.
                  </p>
                </div>
              </div>

              {leadLoggedSuccess ? (
                <div className="bg-amber-950/40 border border-amber-600/50 p-5 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Lead Successfully Logged!</h3>
                  <p className="text-xs text-amber-200">
                    Dispatched to CEO Samarth Zende&apos;s Executive Mailbox. Once the contract is signed, your commission is credited.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Your Name (Worker / Caller) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your name so you get credited"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Client / Business Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Apex Textiles or Dr. Sharma"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Client Phone / WhatsApp <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 99887 76655"
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Required Service
                    </label>
                    <select
                      value={leadService}
                      onChange={(e) => setLeadService(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    >
                      <option value="Full-Stack Web App">Full-Stack Web App (₹50k – ₹2.5L)</option>
                      <option value="Mobile App (Android/iOS)">Mobile App (₹80k – ₹3L)</option>
                      <option value="E-Commerce & Storefront">E-Commerce & Storefront (₹40k – ₹1.2L)</option>
                      <option value="Corporate Website">Corporate Website (₹25k – ₹60k)</option>
                      <option value="AI / Automation Tool">AI / Automation Tool (₹60k – ₹2L)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Client Requirements / Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="What does the client need? When do they want to start?"
                      value={leadNotes}
                      onChange={(e) => setLeadNotes(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Log Client Lead to CEO Mailbox</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: APPLY TO SPECIFIC PROJECT */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Laptop className="w-4 h-4" />
              <span>Project Application</span>
            </div>

            <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>
            <p className="text-xs text-slate-400 mt-1">Client: {selectedProject.clientName} | Budget: ₹{selectedProject.budgetINR.toLocaleString('en-IN')}</p>

            {projectSuccessMsg ? (
              <div className="mt-6 bg-emerald-950/60 border border-emerald-700/60 p-4 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-white">{projectSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleProjectApply} className="mt-5 space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amit Kumar"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91..."
                      value={applicantContact}
                      onChange={(e) => setApplicantContact(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Role to claim
                    </label>
                    <select
                      value={applicantRole}
                      onChange={(e) => setApplicantRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Lead Developer">Lead Developer</option>
                      <option value="Frontend Engineer">Frontend Engineer</option>
                      <option value="Backend Engineer">Backend Engineer</option>
                      <option value="QA / Tester">QA / Tester</option>
                      <option value="Contractor">General Contractor</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Which deliverable can you handle?
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. I can build the real-time charting deliverable in 3 days."
                    value={applicantPitch}
                    onChange={(e) => setApplicantPitch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={projectSubmitting}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold py-2.5 rounded-lg transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {projectSubmitting ? 'Sending...' : 'Submit to CEO Mailbox'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer minimal info */}
      <footer className="border-t border-slate-800/80 px-4 py-4 text-center text-xs text-slate-500 bg-[#070b14]">
        SAMZEN Workspace • Executive Direction by Samarth Zende (CEO) • All applications logged directly to secure mailbox.
      </footer>
    </div>
  );
};
