import React from 'react';
import { Check } from 'lucide-react';

interface SwatchCardProps {
  id: string;
  name: string;
  subtitle?: string;
  colorHex?: string;
  isSelected: boolean;
  onSelect: () => void;
  badge?: string;
  description?: string;
  pattern?: 'brushed' | 'grain' | 'solid' | 'tile' | 'terrazzo' | 'checker' | 'parquet';
}

export const SwatchCard: React.FC<SwatchCardProps> = ({
  name,
  subtitle,
  colorHex = '#94a3b8',
  isSelected,
  onSelect,
  badge,
  description,
}) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3.5 ${
        isSelected
          ? 'bg-stone-50 border-stone-900 ring-1 ring-stone-900 shadow-sm'
          : 'bg-white hover:bg-stone-50/70 border-stone-200 hover:border-stone-300'
      }`}
    >
      {/* Architectural Material Swatch Sample */}
      <div className="relative shrink-0 mt-0.5">
        <div
          className="w-10 h-10 rounded-lg border border-stone-300/80 shadow-inner flex items-center justify-center transition-transform group-hover:scale-105"
          style={{ backgroundColor: colorHex }}
        >
          {isSelected && (
            <div className="w-5 h-5 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center shadow">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 font-sans">
        <div className="flex items-center justify-between gap-1.5 mb-0.5">
          <h4 className="text-xs font-semibold text-stone-900 truncate tracking-tight">{name}</h4>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded font-barlow font-medium tracking-wide uppercase bg-stone-100 text-stone-700 border border-stone-200">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-[11px] font-barlow font-medium text-stone-500 uppercase tracking-wider mb-1">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-[11px] text-stone-500 leading-snug line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </button>
  );
};
