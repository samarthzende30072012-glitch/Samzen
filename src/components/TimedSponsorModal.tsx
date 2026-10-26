import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, TrendingUp, ArrowUpRight, X, Clock, RefreshCw, BarChart2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TimedSponsorModalProps {
  /** Force open for testing or preview */
  isOpen?: boolean;
  onClose?: () => void;
}

export const TimedSponsorModal: React.FC<TimedSponsorModalProps> = ({ isOpen: externalOpen, onClose: externalClose }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(10); // 10 seconds required viewing countdown
  const [canClose, setCanClose] = useState(false);
  const [manualFlipped, setManualFlipped] = useState(false);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [hasTriggeredOnce, setHasTriggeredOnce] = useState(false);

  // 5 Minutes (300,000 ms) timer reference
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isModalVisible = externalOpen !== undefined ? externalOpen : internalOpen;

  // Initialize the 5-Minute automated timer
  useEffect(() => {
    const alreadySeen = sessionStorage.getItem('samzen_5min_ad_seen');
    if (alreadySeen === 'true') {
      return;
    }

    timerRef.current = setTimeout(() => {
      setInternalOpen(true);
      setHasTriggeredOnce(true);
      sessionStorage.setItem('samzen_5min_ad_seen', 'true');
    }, FIVE_MINUTES_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [FIVE_MINUTES_MS]);

  // When modal opens, start the reactive 10-second countdown (10s... 9s... 8s...)
  useEffect(() => {
    if (isModalVisible) {
      setTimeRemainingSeconds(10);
      setCanClose(false);

      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }

      countdownIntervalRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
            }
            setCanClose(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isModalVisible]);

  const handleClose = () => {
    if (!canClose) return;
    setInternalOpen(false);
    if (externalClose) {
      externalClose();
    }
  };

  if (!isModalVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#070b14]/85 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Container with 3D Perspective */}
      <div className="relative w-full max-w-xl perspective-1200">
        
        {/* Ad Container with smooth circular flipping animation (rotateY flip effect) */}
        <div
          className={`relative w-full transition-all duration-700 transform-style-3d ${
            isAutoFlipping && !manualFlipped ? 'animate-rotate-y-cycle' : ''
          } ${manualFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* ======================================================== */}
          {/* FRONT FACE (Main Pro Trading Course Spotlight) */}
          {/* ======================================================== */}
          <div className="w-full panel bg-[#0e1726] border-2 border-[#59e3ff] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#59e3ff]/20 relative overflow-hidden backface-hidden">
            
            {/* Top Glow Ambient */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#59e3ff]/15 rounded-full blur-3xl pointer-events-none -z-0" />
            
            {/* Top Bar: Badge & Timer Countdown */}
            <div className="flex items-center justify-between gap-3 mb-5 relative z-10 border-b border-[#1d2a3e] pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#59e3ff]/20 to-[#3da9fc]/20 text-[#59e3ff] text-xs font-bold border border-[#59e3ff]/50 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#59e3ff] animate-spin" />
                <span>Sponsored Partner Spotlight</span>
              </div>

              {/* Countdown / Close Button */}
              <div className="flex items-center gap-2">
                {!canClose ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#070b14] border border-[#3da9fc]/50 text-[#59e3ff] text-xs font-mono font-bold shadow-inner">
                    <Clock className="w-3.5 h-3.5 text-[#3da9fc] animate-pulse" />
                    <span>Ad closes in {timeRemainingSeconds}s</span>
                  </div>
                ) : (
                  <button
                    onClick={handleClose}
                    className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-600 text-white text-xs font-black shadow-lg shadow-rose-600/30 border border-rose-400 cursor-pointer animate-pulse transition active:scale-95"
                  >
                    <span>Close Ad (X)</span>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Main Course Content */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#59e3ff]/20 to-[#3da9fc]/20 border border-[#59e3ff]/50 flex items-center justify-center text-[#59e3ff] flex-shrink-0 shadow-lg shadow-[#59e3ff]/10">
                  <BarChart2 className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black font-heading text-white tracking-tight">
                      Pro Trading Course
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      LIVE
                    </span>
                  </div>
                  <p className="text-xs text-[#59e3ff] font-medium">
                    Official Featured Partner on SAMZEN (https://samzen.ai.studio)
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#eef3fa] leading-relaxed">
                Learn professional trading from scratch across the <strong>Indian Stock Market</strong>, <strong>Forex</strong>, and <strong>Crypto markets</strong>. Master advanced price action, risk management, and winning strategies with the Pro Trading Course!
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Indian Stock Market', 'Forex Trading', 'Crypto Markets', 'Price Action', 'Risk Management'].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-[#59e3ff] bg-[#070b14] border border-[#1d2a3e]"
                  >
                    &bull; {tag}
                  </span>
                ))}
              </div>

              {/* Flip & Visit Action Bar */}
              <div className="pt-4 border-t border-[#1d2a3e] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoFlipping(false);
                    setManualFlipped(!manualFlipped);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#9db0c8] hover:text-[#59e3ff] transition cursor-pointer self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flip to View Curriculum Preview ↺</span>
                </button>

                <a
                  href="https://protradingcourse.ai.studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer-visible btn-glow-pulse btn-interactive w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#59e3ff] to-[#3da9fc] hover:from-[#3da9fc] hover:to-[#59e3ff] text-[#070b14] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-[#59e3ff]/30 cursor-pointer"
                >
                  <span>Explore Pro Trading Course</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Bottom notification indicator */}
            <div className="mt-3 text-[10px] text-center text-[#9db0c8]/70">
              Auto-flipping 3D sponsor preview &bull; 5-minute timed SAMZEN network showcase
            </div>

          </div>

          {/* ======================================================== */}
          {/* BACK FACE (Course Curriculum & Highlights Flip Side) */}
          {/* ======================================================== */}
          <div className="absolute inset-0 w-full h-full panel bg-[#0b1220] border-2 border-[#3da9fc] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-[#3da9fc]/20 flex flex-col justify-between backface-hidden rotate-y-180">
            
            {/* Top Bar on Back Face */}
            <div className="flex items-center justify-between gap-3 border-b border-[#1d2a3e] pb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3da9fc]/20 text-[#59e3ff] text-xs font-bold border border-[#3da9fc]/40">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Curriculum &amp; Masterclass Modules</span>
              </div>

              {/* Countdown / Close Button */}
              <div>
                {!canClose ? (
                  <span className="text-xs font-mono font-bold text-[#59e3ff] bg-[#070b14] px-3 py-1.5 rounded-xl border border-[#3da9fc]/50 shadow-inner">
                    Ad closes in {timeRemainingSeconds}s
                  </span>
                ) : (
                  <button
                    onClick={handleClose}
                    className="btn-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-600 text-white text-xs font-black shadow-lg shadow-rose-600/30 border border-rose-400 cursor-pointer animate-pulse transition active:scale-95"
                  >
                    <span>Close Ad (X)</span>
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Back Face Body */}
            <div className="space-y-3 my-auto py-2">
              <div className="text-sm font-bold text-white font-heading">
                Why Thousands Choose Pro Trading Course:
              </div>

              <div className="space-y-2 text-xs text-[#eef3fa]">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59e3ff] flex-shrink-0 mt-0.5" />
                  <span>Master Bank Nifty, Nifty 50, and Indian bluechip equity price action.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59e3ff] flex-shrink-0 mt-0.5" />
                  <span>24/7 Global Forex &amp; Crypto liquidity strategies with disciplined 1:3+ risk-reward.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#59e3ff] flex-shrink-0 mt-0.5" />
                  <span>Verified trading setups, live webinar breakdowns, and lifetime community access.</span>
                </div>
              </div>
            </div>

            {/* Back Face Action */}
            <div className="pt-3 border-t border-[#1d2a3e] flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsAutoFlipping(false);
                  setManualFlipped(false);
                }}
                className="text-xs text-[#9db0c8] hover:text-[#59e3ff] flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Flip back to Overview ↺</span>
              </button>

              <a
                href="https://protradingcourse.ai.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-shimmer-visible btn-glow-pulse btn-interactive w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#3da9fc]/30 cursor-pointer"
              >
                <span>Visit https://protradingcourse.ai.studio</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
