import React from 'react';
import { WORK_STEPS } from '../data/samzenData';

export const WorkProcess: React.FC = () => {
  return (
    <section id="process" className="py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2">
            Execution Flow
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            How SAMZEN works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9db0c8]">
            A smooth, transparent 7-step process from our first discussion to post-launch support:
          </p>
        </div>

        {/* Process Steps */}
        <div className="divide-y divide-[#1d2a3e] border-y border-[#1d2a3e]">
          {WORK_STEPS.map((step) => (
            <div
              key={step.number}
              className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 group hover:bg-[#0b1220]/40 transition px-2 sm:px-4 rounded-lg"
            >
              <div className="w-12 text-lg sm:text-xl font-bold font-heading text-[#3da9fc] flex-shrink-0">
                {step.number}
              </div>
              <div className="sm:w-44 flex-shrink-0">
                <h3 className="text-base sm:text-lg font-bold font-heading text-white group-hover:text-[#59e3ff] transition">
                  {step.title}
                </h3>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#9db0c8] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
