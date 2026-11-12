import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';
import { STYLE_PRESETS } from '../../data/presets';

interface Step1PresetsProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  onNext: () => void;
}

export const Step1Presets: React.FC<Step1PresetsProps> = ({
  config,
  onUpdateConfig,
  onNext,
}) => {
  const handleSelectPreset = (presetId: string) => {
    const preset = STYLE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    onUpdateConfig({
      presetId: preset.id,
      walls: {
        allSame: preset.walls.allSame,
        left: preset.walls.left,
        rear: preset.walls.rear,
        right: preset.walls.right,
      },
      floor: preset.floor,
      ceiling: preset.ceiling,
      door: preset.door,
      mirror: preset.mirror,
      handrail: preset.handrail,
      controlPanel: preset.controlPanel,
      skirting: preset.skirting,
    });
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-barlow font-medium tracking-wider uppercase mb-2 border border-stone-200/80">
          <span>01 / 06 · Design Concept</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Curated Architectural Aesthetics
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Select an architectural concept baseline. Each theme harmonizes wall cladding, flooring, suspended ceiling lighting, and operating fixtures. Every finish remains fully editable across subsequent steps.
        </p>
      </div>

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {STYLE_PRESETS.map((preset) => {
          const isSelected = config.presetId === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleSelectPreset(preset.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-150 relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-stone-50 border-stone-900 ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white hover:bg-stone-50/70 border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                {/* Visual Palette Preview Header */}
                <div
                  className="w-full h-16 rounded-lg mb-3.5 flex items-center justify-between p-3 border border-black/10 shadow-inner"
                  style={{
                    backgroundColor: preset.previewColor,
                    backgroundImage: `linear-gradient(135deg, ${preset.previewColor} 0%, #1f242d 100%)`,
                  }}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/80 shadow-sm"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  {isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-barlow font-semibold px-2 py-0.5 rounded bg-stone-900 text-stone-100 tracking-wide">
                      <Check className="w-3 h-3 stroke-[2.5]" /> Selected
                    </span>
                  ) : (
                    <span className="text-[11px] font-barlow text-white/80 group-hover:text-white transition">
                      Apply Theme
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <h3 className="font-semibold text-stone-900 text-sm group-hover:text-stone-950 transition font-sans">
                  {preset.name}
                </h3>
                <p className="text-xs font-barlow font-medium text-stone-500 mt-0.5 tracking-wide">{preset.tagline}</p>
                <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-barlow">
                <span className="tracking-wider uppercase">Integrated Palette</span>
                <span className="text-stone-800 font-medium group-hover:underline">Configure →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Step Action Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-sm transition active:scale-95 font-sans"
        >
          <span>Continue to Car Dimensions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
