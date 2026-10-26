import React, { useRef, useState, useEffect } from 'react';
import { Scale, CheckCircle2, RotateCcw, ShieldCheck, AlertCircle, Award } from 'lucide-react';
import { WorkspaceMember } from '../types';

interface DigitalContractSignatureModalProps {
  member: WorkspaceMember;
  isOpen: boolean;
  onSigned: (signatureDataUrl: string) => void;
  onCancel: () => void;
}

export const DigitalContractSignatureModal: React.FC<DigitalContractSignatureModalProps> = ({
  member,
  isOpen,
  onSigned,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI canvas dimensions
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setHasDrawn(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: (e as React.MouseEvent).clientX - rect.left,
        y: (e as React.MouseEvent).clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setValidationError(null);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = (e?: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e) e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    setValidationError(null);
  };

  const handleConfirmSignature = () => {
    if (!hasDrawn) {
      setValidationError('Mandatory: Please sign your digital signature on the white paper using your finger or mouse before unlocking the Team Portal.');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');

    // Save signed status in local storage
    try {
      const record = {
        memberId: member.id,
        memberName: member.name,
        role: member.role,
        signedAt: new Date().toISOString(),
        contractVersion: '2026.1_IND_ACT_1872',
      };
      localStorage.setItem(`samzen_signed_contract_${member.id}`, JSON.stringify(record));
    } catch (e) {
      console.warn('Storage warning for signed contract:', e);
    }

    onSigned(signatureDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      {/* Formal White Paper Legal Document */}
      <div 
        className="relative w-full max-w-3xl bg-[#fdfdfd] text-[#0f172a] shadow-2xl rounded-2xl p-6 sm:p-10 border border-slate-300 my-4 max-h-[92vh] flex flex-col font-serif"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Document Header Seal */}
        <div className="border-b-2 border-slate-800 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Scale className="w-6 h-6 text-slate-800" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-800 font-sans">
              REPUBLIC OF INDIA &bull; DIGITAL LEGAL COVENANT
            </span>
            <Scale className="w-6 h-6 text-slate-800" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans uppercase">
            SAMZEN WORKSPACE LEGAL APPOINTMENT &amp; OPERATIONAL CONTRACT
          </h1>
          <p className="text-[11px] text-slate-600 font-sans mt-0.5">
            Governed in accordance with the Indian Contract Act, 1872 and Information Technology Act, 2000
          </p>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-left bg-slate-100 p-2.5 rounded-lg border border-slate-300 text-xs font-sans">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Appointee / Worker:</span>
              <span className="font-bold text-slate-900 truncate block">{member.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Designation:</span>
              <span className="font-bold text-slate-900 block">{member.position}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Assigned Role:</span>
              <span className="font-bold text-slate-900 uppercase block">{member.role}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Date of Execution:</span>
              <span className="font-mono text-slate-900 block">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Legal Articles Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 text-xs leading-relaxed text-slate-800 font-sans">
          
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 text-xs">
            <strong>Mandatory Execution Notice:</strong> This digital legal instrument must be reviewed and executed via digital finger/stylus signature before access to SAMZEN internal systems, client accounts, or project tools is activated.
          </div>

          {/* Article I */}
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">ARTICLE I</span>
              <span>100% SOLE OWNERSHIP &amp; ZERO EQUITY ACKNOWLEDGEMENT</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              I expressly recognize and legally agree that Mr. Samarth Zende is the 100% Sole Owner, Founder, and Chief Executive Officer of SAMZEN Web Development. Zero percent (0%) corporate equity, shares, capital stock, or ownership rights are granted or promised to me in any capacity, including Co-Founder, Executive Head, Contractor, Home Servicer, Caller, or Helper. My title is strictly a functional employee/contractor designation.
            </p>
          </div>

          {/* Article II */}
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">ARTICLE II</span>
              <span>STRICT &ldquo;NO WORK, NO PAY&rdquo; PERFORMANCE OBLIGATION</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              Compensation is 100% performance and deliverable-based. Verified, satisfactory completion of assigned billable projects equals remuneration; failure to produce work or inactive status strictly yields ₹0 remuneration. Merely holding a title or access code without generating billable deliverables entitles me to zero compensation.
            </p>
          </div>

          {/* Article III */}
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">ARTICLE III</span>
              <span>CLIENT CLEARED FUNDS CONTINGENCY</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              All commission payouts and fees are disbursed strictly after SAMZEN receives cleared, non-refundable funds from the end client. In the event of a client dispute, non-payment, cancellation, or chargeback, zero remuneration is owed by SAMZEN.
            </p>
          </div>

          {/* Article IV */}
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[10px]">ARTICLE IV</span>
              <span>STRICT NON-DISCLOSURE &amp; ACCESS CODE PROTECTION</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              I agree to keep my 8-character access credentials, client contact leads, internal workflows, and source codes strictly confidential. Unauthorized sharing, leaking, or commercial misuse is an actionable offense.
            </p>
          </div>

          {/* Article V */}
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-rose-200 text-rose-900 font-mono text-[10px]">ARTICLE V</span>
              <span>ENFORCEMENT UNDER INDIAN LAWS &amp; COURT JURISDICTION</span>
            </h4>
            <p className="text-slate-700 leading-relaxed">
              This contract is governed under the Indian Contract Act, 1872 and the Information Technology Act, 2000. Any breach, fraud, unauthorized data dissemination, or false equity representation shall be subject to immediate summary termination, forfeiture of pending balances, and civil and criminal prosecution under the courts of competent jurisdiction in Maharashtra, India.
            </p>
          </div>

          {/* Digital Signature Pad Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-900 font-sans">
                Sign Below (Touch with Finger on Mobile or Drag Mouse on Desktop):
              </label>
              <button
                type="button"
                onClick={handleClearSignature}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 hover:text-rose-900 px-2 py-0.5 rounded border border-rose-300 hover:bg-rose-50 cursor-pointer font-sans transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear Signature</span>
              </button>
            </div>

            {/* Canvas Sheet */}
            <div className="relative border-2 border-dashed border-slate-400 rounded-xl bg-white p-1 overflow-hidden shadow-inner touch-none">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-36 bg-white cursor-crosshair block"
              />
              
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 text-xs font-sans">
                  <span className="font-serif italic text-sm">Sign your legal name here &bull; Finger or Stylus supported</span>
                  <span className="text-[10px] mt-1 text-slate-400">────────────────────────────────────────────</span>
                </div>
              )}
            </div>

            {validationError && (
              <div className="mt-2 p-2.5 rounded-lg bg-rose-100 border border-rose-400 text-rose-900 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-700" />
                <span>{validationError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t-2 border-slate-800 flex items-center justify-between gap-3 flex-wrap font-sans">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Cancel &amp; Sign Out
          </button>

          <button
            type="button"
            onClick={handleConfirmSignature}
            className="btn-interactive inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-amber-300 hover:text-amber-200 text-xs font-black shadow-xl shadow-black/20 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sign &amp; Accept Legal Contract</span>
          </button>
        </div>

      </div>
    </div>
  );
};
