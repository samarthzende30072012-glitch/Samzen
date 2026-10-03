import React, { useState, useEffect } from 'react';
import { User, ServiceRequest } from '../types';
import { submitServiceRequest, getServiceRequests } from '../services/api';
import { SAMZEN_BRAND } from '../assets/samzenBranding';
import { X, ShieldCheck, Wrench, Clock, CheckCircle2, AlertCircle, Plus, RefreshCw, MessageSquare, Mail } from 'lucide-react';

interface AccountDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const AccountDashboard: React.FC<AccountDashboardProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'requests' | 'new_request'>('profile');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // New Request Form
  const [businessName, setBusinessName] = useState('');
  const [projectPlan, setProjectPlan] = useState('Plan 2 - Professional Business Website');
  const [requestType, setRequestType] = useState<'free_support' | 'paid_service'>('free_support');
  const [details, setDetails] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isOpen && currentUser) {
      loadRequests();
    }
  }, [isOpen, currentUser]);

  const loadRequests = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const res = await getServiceRequests(currentUser.id, currentUser.email);
      if (res.success) {
        setRequests(res.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setFormError('');
    setFormSuccess('');

    if (!details.trim()) {
      return setFormError('Please describe the website bug, update, or requirement.');
    }

    setIsLoading(true);
    try {
      const res = await submitServiceRequest({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        userPhone: currentUser.phone,
        businessName: businessName || `${currentUser.name}'s Business`,
        projectPlan,
        requestType,
        fee: requestType === 'free_support' ? 0 : 199,
        details,
      });

      if (res.success) {
        setFormSuccess(res.message);
        setDetails('');
        setBusinessName('');
        await loadRequests();
        setTimeout(() => setActiveTab('requests'), 1500);
      } else {
        setFormError(res.message || 'Failed to submit request.');
      }
    } catch (err: any) {
      setFormError(err.message || 'Error sending request.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1d2a3e]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#59e3ff]">
              Client Portal
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
              {currentUser.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9db0c8] hover:text-white rounded-lg hover:bg-[#1d2a3e] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 my-5 p-1 bg-[#070b14] rounded-lg border border-[#1d2a3e]">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'profile' ? 'bg-[#1d2a3e] text-white shadow-sm' : 'text-[#9db0c8] hover:text-white'
            }`}
          >
            Account &amp; Support
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'requests' ? 'bg-[#1d2a3e] text-white shadow-sm' : 'text-[#9db0c8] hover:text-white'
            }`}
          >
            Service History ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('new_request')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              activeTab === 'new_request' ? 'bg-[#3da9fc] text-[#070b14]' : 'text-[#59e3ff] hover:text-white'
            }`}
          >
            + Request Support
          </button>
        </div>

        {/* TAB 1: Profile & Support Window */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#9db0c8]">Verified Account</div>
                <div className="text-sm font-bold text-white">{currentUser.email}</div>
                {currentUser.phone && (
                  <div className="text-xs text-[#9db0c8]">{currentUser.phone}</div>
                )}
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Client</span>
              </span>
            </div>

            {/* Active Plan & Support Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e]">
                <div className="text-xs text-[#9db0c8] mb-1">Active Plan</div>
                <div className="text-sm font-bold text-[#59e3ff]">
                  {currentUser.activePlan || 'Plan 2 - Professional Business Website'}
                </div>
                <div className="text-[11px] text-[#9db0c8] mt-2">
                  Includes full responsive site, WhatsApp integration, and business modules.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070b14] border border-[#3da9fc]/30">
                <div className="text-xs text-[#9db0c8] mb-1">Post-Delivery Free Support</div>
                <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Active Guarantee</span>
                </div>
                <div className="text-[11px] text-[#9db0c8] mt-2">
                  Bugs and minor tweaks are covered free under your plan window. Once finished, service is ₹199 per request.
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('new_request')}
                className="py-2 px-4 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs transition"
              >
                Submit New Support Request
              </button>
              <a
                href={SAMZEN_BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 text-emerald-300 font-medium text-xs flex items-center gap-1.5 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Samarth on WhatsApp</span>
              </a>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-2 px-4 rounded-lg bg-[#070b14] border border-red-500/20 text-red-400 hover:bg-red-500/10 font-medium text-xs ml-auto transition"
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Service History */}
        {activeTab === 'requests' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#9db0c8] flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-[#3da9fc]" />
                <span>Loading your service records...</span>
              </div>
            ) : requests.length === 0 ? (
              <div className="py-12 text-center bg-[#070b14] rounded-xl border border-[#1d2a3e] p-6">
                <Wrench className="w-8 h-8 text-[#9db0c8] mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-white mb-1">No service requests yet</h4>
                <p className="text-xs text-[#9db0c8] max-w-sm mx-auto mb-4">
                  Need any modifications, bug fixes, or new features added to your website?
                </p>
                <button
                  onClick={() => setActiveTab('new_request')}
                  className="px-4 py-2 rounded-lg bg-[#3da9fc] text-[#070b14] text-xs font-bold"
                >
                  Create Your First Request
                </button>
              </div>
            ) : (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-sm">{req.businessName}</span>
                      <span className="px-2 py-0.5 rounded bg-[#1d2a3e] text-[#59e3ff] text-[10px]">
                        {req.projectPlan}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        req.requestType === 'free_support' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-[#3da9fc]'
                      }`}>
                        {req.requestType === 'free_support' ? 'Free Support' : `₹${req.fee} Maintenance`}
                      </span>
                    </div>
                    <p className="text-[#9db0c8] text-xs">{req.details}</p>
                    <div className="text-[10px] text-[#9db0c8] mt-1">
                      Submitted on: {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-[11px] font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{req.status === 'pending' ? 'Reviewing' : req.status}</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: New Service Request */}
        {activeTab === 'new_request' && (
          <form onSubmit={handleCreateRequest} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {formSuccess}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Business / Project Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Royal Unisex Salon & Spa"
                className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Associated Website Plan</label>
                <select
                  value={projectPlan}
                  onChange={(e) => setProjectPlan(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white focus:outline-none focus:border-[#3da9fc]"
                >
                  <option value="Plan 1 - Basic Business Website">Plan 1 - Basic (₹1,000–₹3,000)</option>
                  <option value="Plan 2 - Professional Business Website">Plan 2 - Professional (₹3,000–₹5,000)</option>
                  <option value="Plan 3 - Advanced Business Website">Plan 3 - Advanced (₹5,000–₹8,000)</option>
                  <option value="Custom Website Project">Custom Website Project</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#c9d3dc] mb-1">Support Tier &amp; Rate</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white focus:outline-none focus:border-[#3da9fc]"
                >
                  <option value="free_support">Free Service Support Window (₹0)</option>
                  <option value="paid_service">Post-Free Window Service Request (₹199 per service)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#c9d3dc] mb-1">
                Details of Issue, Update, or Feature Requested
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain the changes you need, e.g. update salon price list, add new photo gallery, fix contact button..."
                className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-xs text-white placeholder-[#9db0c8] focus:outline-none focus:border-[#3da9fc]"
              />
            </div>

            <div className="p-3 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[11px] text-[#9db0c8]">
              Per SAMZEN Service Policy, minor fixes and issues are resolved free within the plan window. After the free support window ends, standard service requests are ₹199 per request.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span>Submit Service Request</span>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
