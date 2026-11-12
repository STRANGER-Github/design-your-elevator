import React from 'react';
import { ArrowRight, ArrowLeft, Sun } from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';
import { FLOOR_FINISHES, CEILING_OPTIONS } from '../../data/materials';
import { SwatchCard } from '../common/SwatchCard';

interface Step4FloorsCeilingProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4FloorsCeiling: React.FC<Step4FloorsCeilingProps> = ({
  config,
  onUpdateConfig,
  onNext,
  onPrev,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-barlow font-medium tracking-wider uppercase mb-2 border border-stone-200/80">
          <span>04 / 06 · Flooring & Lighting</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Cabin Flooring & Suspended Ceiling Lighting
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Specify heavy-wear floor substrates paired with indirect ceiling fixtures designed to shape cabin ambiance and glare-free illumination.
        </p>
      </div>

      {/* Flooring Section */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Cabin Floor Substrate
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FLOOR_FINISHES.map((floor) => {
            const isSelected = config.floor === floor.id;
            return (
              <SwatchCard
                key={floor.id}
                id={floor.id}
                name={floor.name}
                subtitle={floor.category.toUpperCase()}
                colorHex={floor.hex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ floor: floor.id })}
                description={floor.description}
              />
            );
          })}
        </div>
      </div>

      {/* Ceiling & Lighting Section */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Suspended Ceiling & Lighting System
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CEILING_OPTIONS.map((ceiling) => {
            const isSelected = config.ceiling === ceiling.id;
            return (
              <SwatchCard
                key={ceiling.id}
                id={ceiling.id}
                name={ceiling.name}
                subtitle={`${ceiling.lightingType.replace('_', ' ').toUpperCase()}`}
                colorHex={ceiling.finishHex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ ceiling: ceiling.id })}
                description={ceiling.description}
              />
            );
          })}
        </div>
      </div>

      {/* Lighting Color Temperature Control */}
      <div className="bg-stone-50/80 border border-stone-200/90 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-stone-700" />
            <h4 className="text-xs font-barlow font-semibold text-stone-800 uppercase tracking-wider">
              Correlated Color Temperature (CCT)
            </h4>
          </div>
          <span className="text-[11px] font-barlow text-stone-500 font-medium">
            {config.lightingTempMode === 'warm_3000k'
              ? '3000K · Warm Atmosphere'
              : config.lightingTempMode === 'cool_5000k'
              ? '5000K · Clinical Daylight'
              : '4000K · Neutral Commercial'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'warm_3000k', label: '3000K Warm', desc: 'Residential & Hospitality' },
            { id: 'neutral_4000k', label: '4000K Neutral', desc: 'Commercial Architectural' },
            { id: 'cool_5000k', label: '5000K Daylight', desc: 'Healthcare & Transit' },
          ].map((mode) => {
            const isSelected = config.lightingTempMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onUpdateConfig({ lightingTempMode: mode.id as any })}
                className={`p-2.5 rounded-lg border text-left transition-all duration-150 ${
                  isSelected
                    ? 'bg-stone-50 border-stone-900 ring-1 ring-stone-900 font-semibold'
                    : 'bg-white hover:bg-stone-100/60 border-stone-200 text-stone-700'
                }`}
              >
                <div className="text-xs font-semibold text-stone-900 font-barlow">{mode.label}</div>
                <div className="text-[10px] text-stone-500 mt-0.5 font-barlow">{mode.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wall Surfaces</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-sm transition active:scale-95 font-sans"
        >
          <span>Continue to Hardware & Fixtures</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
