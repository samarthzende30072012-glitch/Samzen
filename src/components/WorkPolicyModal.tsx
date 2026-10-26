import React from 'react';
import { Scale, ShieldAlert, Award, X, FileText, CheckCircle2 } from 'lucide-react';

interface WorkPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgreeAndClose?: () => void;
}

export const WorkPolicyModal: React.FC<WorkPolicyModalProps> = ({
  isOpen,
  onClose,
  onAgreeAndClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0e1726] border-2 border-amber-400/60 rounded-2xl p-6 sm:p-8 shadow-2xl text-[#eef3fa] my-6 max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Formal Legal Document Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#1d2a3e] relative">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-inner flex-shrink-0">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
                  Official Corporate Court Decree
                </span>
                <span className="text-[10px] text-[#9db0c8] font-mono">
                  Ref: SZ/IND-CONTRACT/1872
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-heading text-white tracking-tight mt-1">
                SAMZEN WORK WITH US &amp; OPERATIONAL POLICY
              </h2>
              <p className="text-[11px] text-[#9db0c8]">
                Governed under Indian Contract Act, 1872 &amp; Information Technology Act, 2000
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9db0c8] hover:text-white hover:bg-[#1d2a3e] text-lg font-bold cursor-pointer transition"
            aria-label="Close legal modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Formal Articles Body */}
        <div className="overflow-y-auto py-5 pr-2 space-y-4 text-xs leading-relaxed text-[#c9d3dc]">
          
          {/* Executive Seal Box */}
          <div className="p-3.5 rounded-xl bg-[#070b14] border border-amber-400/30 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-300 font-mono block">
                ISSUING EXECUTIVE AUTHORITY
              </span>
              <span className="text-xs font-bold text-white block">
                Mr. Samarth Zende &bull; 100% Sole Owner, Founder &amp; CEO
              </span>
              <span className="text-[11px] text-[#9db0c8] block">
                SAMZEN Web Development (samzen.ai.studio)
              </span>
            </div>
            <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 text-center flex-shrink-0">
              <Award className="w-5 h-5 mx-auto text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-wider block mt-0.5">Sole Owner</span>
            </div>
          </div>

          {/* ARTICLE I */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px]">ARTICLE I</span>
              <span>100% SOLE OWNERSHIP &amp; ZERO EQUITY</span>
            </h3>
            <p className="text-xs text-[#eef3fa] font-medium leading-relaxed">
              Mr. Samarth Zende is the absolute, 100% Sole Owner, Founder, and Chief Executive Officer of SAMZEN Web Development. <strong>Zero percent (0%) equity, company shares, corporate ownership, or board voting rights</strong> are granted, promised, or implied to any joining personnel, including Co-Founders, Executive Heads, Contractors, Home Servicers, Callers, or Helpers. All designated titles are strictly functional employee and contractor roles.
            </p>
          </div>

          {/* ARTICLE II */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#59e3ff] flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#3da9fc]/20 text-[#59e3ff] font-mono text-[10px]">ARTICLE II</span>
              <span>STRICT &ldquo;NO WORK, NO PAY&rdquo; COMPENSATION</span>
            </h3>
            <p className="text-xs text-[#eef3fa] font-medium leading-relaxed">
              All personnel compensation and commission disbursements are 100% performance and deliverable-based. <strong>Active, verified completion of billable work equals payment; zero work executed strictly equals ₹0 payout.</strong> Holding an executive title or designation (including Co-Founder) without generating verified client contracts or executing authorized technical deliverables yields absolutely no remuneration.
            </p>
          </div>

          {/* ARTICLE III */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">ARTICLE III</span>
              <span>CLIENT PAYMENT CONTINGENCY &amp; DISBURSEMENT</span>
            </h3>
            <p className="text-xs text-[#eef3fa] font-medium leading-relaxed">
              All payouts, contractor percentages, and Co-Founder shares are disbursed <strong>strictly and exclusively after SAMZEN receives cleared, non-disputed funds</strong> in its bank account from the paying client. If a client cancels, declines to purchase, defaults, or receives a refund, zero payment or commission is owed to any worker, contractor, or Co-Founder.
            </p>
          </div>

          {/* ARTICLE IV */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-[#1d2a3e] space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">ARTICLE IV</span>
              <span>DATA PROTECTION, PORTAL SECURITY &amp; NON-DISCLOSURE</span>
            </h3>
            <p className="text-xs text-[#eef3fa] font-medium leading-relaxed">
              Unauthorized copying, disclosure, or public leaking of internal 8-character access credentials, client contact leads, proprietary codebases, or portal data is strictly prohibited. All intellectual property, client websites, and software architectures created under SAMZEN remain the exclusive property of SAMZEN and Founder Samarth Zende.
            </p>
          </div>

          {/* ARTICLE V */}
          <div className="p-4 rounded-xl bg-[#070b14] border border-rose-500/40 space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">ARTICLE V</span>
              <span>LEGAL CONSEQUENCES &amp; LOCAL COURT JURISDICTION</span>
            </h3>
            <p className="text-xs text-[#eef3fa] font-medium leading-relaxed">
              This policy is legally binding and governed in accordance with the <strong>Indian Contract Act, 1872</strong> and the <strong>Information Technology Act, 2000</strong>. Any breach of terms, corporate misrepresentation, fraud, unauthorized credential sharing, or false claim of equity/unearned funds will result in immediate termination, forfeiture of pending dues, and strict civil and criminal proceedings under the exclusive jurisdiction of the competent courts of law in Maharashtra, India.
            </p>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="pt-3 border-t border-[#1d2a3e] flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[11px] text-[#9db0c8] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Binding on all Applicants, Workers, Contractors &amp; Co-Founders</span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#070b14] border border-[#1d2a3e] text-xs font-semibold text-[#9db0c8] hover:text-white cursor-pointer transition"
            >
              Close
            </button>
            {onAgreeAndClose && (
              <button
                type="button"
                onClick={onAgreeAndClose}
                className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-[#3da9fc] text-[#070b14] text-xs font-black shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-[#070b14]" />
                <span>I Agree to All Articles</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
