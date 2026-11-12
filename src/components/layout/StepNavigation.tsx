import React from 'react';
import {
  Compass,
  Maximize2,
  Layers,
  SunMedium,
  SlidersHorizontal,
  ClipboardList,
  Check,
} from 'lucide-react';

export interface StepItem {
  id: number;
  numberStr: string;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const CONFIG_STEPS: StepItem[] = [
  { id: 1, numberStr: '01', title: 'Design Concept', shortTitle: 'Concept', icon: Compass },
  { id: 2, numberStr: '02', title: 'Dimensions & Entrances', shortTitle: 'Dimensions', icon: Maximize2 },
  { id: 3, numberStr: '03', title: 'Wall Surfaces', shortTitle: 'Walls', icon: Layers },
  { id: 4, numberStr: '04', title: 'Flooring & Lighting', shortTitle: 'Floors & Light', icon: SunMedium },
  { id: 5, numberStr: '05', title: 'Hardware & Operating Panel', shortTitle: 'Fixtures', icon: SlidersHorizontal },
  { id: 6, numberStr: '06', title: 'Specification & Quote', shortTitle: 'Summary', icon: ClipboardList },
];

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <nav
      aria-label="Configuration Steps"
      className="bg-white border-b border-stone-200/90 px-4 sm:px-8 py-2 overflow-x-auto scrollbar-none"
    >
      <div className="flex items-center min-w-max gap-1.5 sm:gap-2 justify-between sm:justify-start">
        {CONFIG_STEPS.map((step) => {
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;
          const Icon = step.icon;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-2 py-2 px-3 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-stone-900 text-white shadow-sm font-medium'
                  : isPassed
                  ? 'text-stone-700 hover:bg-stone-100 hover:text-stone-950 font-normal'
                  : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600 font-normal'
              }`}
            >
              <span
                className={`font-barlow text-[11px] font-semibold tracking-wider ${
                  isActive
                    ? 'text-amber-400'
                    : isPassed
                    ? 'text-stone-500'
                    : 'text-stone-300'
                }`}
              >
                {isPassed ? <Check className="w-3.5 h-3.5 inline text-emerald-600 stroke-[2.5]" /> : step.numberStr}
              </span>

              <span className="hidden md:inline font-sans text-xs tracking-normal">
                {step.title}
              </span>
              <span className="md:hidden font-sans text-xs">
                {step.shortTitle}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
