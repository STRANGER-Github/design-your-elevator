import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Weight,
  DoorClosed,
  Repeat,
  CornerUpRight,
  ShieldCheck,
} from 'lucide-react';
import { ElevatorConfiguration, EntranceType } from '../../types/elevator';
import { DIMENSION_PRESETS, ENTRANCE_CONFIGURATIONS } from '../../data/dimensions';

interface Step2DimensionsProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2Dimensions: React.FC<Step2DimensionsProps> = ({
  config,
  onUpdateConfig,
  onNext,
  onPrev,
}) => {
  const { dimensions } = config;

  // Handle Preset selection
  const handleSelectPreset = (presetId: string) => {
    const preset = DIMENSION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    onUpdateConfig({
      dimensions: {
        ...dimensions,
        presetId: preset.id,
        widthMm: preset.widthMm,
        depthMm: preset.depthMm,
        heightMm: preset.heightMm,
        capacityKg: preset.capacityKg,
        persons: preset.persons,
        en81_70_compliant: preset.en81_70,
      },
    });
  };

  // Handle custom dimension sliders with automatic capacity estimation
  const handleSliderChange = (key: 'widthMm' | 'depthMm' | 'heightMm', val: number) => {
    const updated = { ...dimensions, [key]: val };
    const areaM2 = (updated.widthMm / 1000) * (updated.depthMm / 1000);
    const estimatedKg = Math.round(areaM2 * 450);
    const estimatedPersons = Math.max(4, Math.round(estimatedKg / 75));
    const isEn81 = updated.widthMm >= 1100 && updated.depthMm >= 1400;

    onUpdateConfig({
      dimensions: {
        ...updated,
        presetId: 'custom',
        capacityKg: estimatedKg,
        persons: estimatedPersons,
        en81_70_compliant: isEn81,
      },
    });
  };

  const handleEntranceChange = (type: EntranceType) => {
    onUpdateConfig({
      dimensions: {
        ...dimensions,
        entranceType: type,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-barlow font-medium tracking-wider uppercase mb-2 border border-stone-200/80">
          <span>02 / 06 · Car Dimensions</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Cabin Proportions & Landing Entrances
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Specify clear internal car dimensions, passenger duty ratings according to EN 81-20, and entrance access orientations. The 3D viewport scales interactively in real time.
        </p>
      </div>

      {/* Preset Standard Capacity Cards */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Standard Architectural Capacity Formats
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DIMENSION_PRESETS.map((preset) => {
            const isSelected = dimensions.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'bg-stone-50 border-stone-900 ring-1 ring-stone-900 shadow-sm'
                    : 'bg-white hover:bg-stone-50/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-semibold text-stone-900 font-sans">{preset.name}</h4>
                  <span className="text-[10px] font-barlow font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-200/60">
                    {preset.persons} Persons
                  </span>
                </div>
                <p className="text-[11px] font-barlow text-stone-500 mb-2">{preset.tagline}</p>
                <div className="flex items-center gap-2.5 text-[11px] text-stone-600 font-barlow font-medium">
                  <span>{preset.widthMm}W × {preset.depthMm}D mm</span>
                  <span className="text-stone-300">•</span>
                  <span>{preset.capacityKg} kg</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fine-Tuning Dimensional Sliders */}
      <div className="bg-stone-50/80 border border-stone-200/90 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-barlow font-semibold text-stone-800 uppercase tracking-wider">
            Clear Internal Car Proportions
          </h4>
          <span className="text-[11px] font-barlow text-stone-500">
            EN 81-20 Compliant Bounds
          </span>
        </div>

        {/* Width Slider */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-600 font-sans">Cabin Width:</span>
            <span className="font-barlow font-semibold text-stone-900">{dimensions.widthMm} mm</span>
          </div>
          <input
            type="range"
            min="900"
            max="1600"
            step="50"
            value={dimensions.widthMm}
            onChange={(e) => handleSliderChange('widthMm', parseInt(e.target.value, 10))}
            className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-barlow text-stone-400 mt-1">
            <span>900 mm</span>
            <span>1600 mm</span>
          </div>
        </div>

        {/* Depth Slider */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-600 font-sans">Cabin Depth:</span>
            <span className="font-barlow font-semibold text-stone-900">{dimensions.depthMm} mm</span>
          </div>
          <input
            type="range"
            min="1100"
            max="2400"
            step="50"
            value={dimensions.depthMm}
            onChange={(e) => handleSliderChange('depthMm', parseInt(e.target.value, 10))}
            className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-barlow text-stone-400 mt-1">
            <span>1100 mm</span>
            <span>2400 mm</span>
          </div>
        </div>

        {/* Height Slider */}
        <div>
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-stone-600 font-sans">Clear Ceiling Height:</span>
            <span className="font-barlow font-semibold text-stone-900">{dimensions.heightMm} mm</span>
          </div>
          <input
            type="range"
            min="2100"
            max="2600"
            step="50"
            value={dimensions.heightMm}
            onChange={(e) => handleSliderChange('heightMm', parseInt(e.target.value, 10))}
            className="w-full accent-stone-900 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-barlow text-stone-400 mt-1">
            <span>2100 mm</span>
            <span>2600 mm</span>
          </div>
        </div>

        {/* Derived Capacity Metrics Badge */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="bg-white p-2.5 rounded-lg border border-stone-200/90 flex items-center gap-2.5">
            <Weight className="w-4 h-4 text-stone-700 shrink-0" />
            <div>
              <p className="text-[10px] font-barlow text-stone-400 uppercase tracking-wider">Rated Capacity</p>
              <p className="text-xs font-semibold text-stone-900 font-barlow">{dimensions.capacityKg} kg</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200/90 flex items-center gap-2.5">
            <Users className="w-4 h-4 text-stone-700 shrink-0" />
            <div>
              <p className="text-[10px] font-barlow text-stone-400 uppercase tracking-wider">Max Occupancy</p>
              <p className="text-xs font-semibold text-stone-900 font-barlow">{dimensions.persons} Persons</p>
            </div>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-stone-200/90 col-span-2 sm:col-span-1 flex items-center gap-2.5">
            <ShieldCheck className={`w-4 h-4 ${dimensions.en81_70_compliant ? 'text-emerald-600' : 'text-stone-400'} shrink-0`} />
            <div>
              <p className="text-[10px] font-barlow text-stone-400 uppercase tracking-wider">EN 81-70 Access</p>
              <p className="text-xs font-semibold text-stone-900 font-barlow">
                {dimensions.en81_70_compliant ? 'Compliant' : 'Non-compliant'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Entrance Orientation Configuration */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Entrance Portal & Landing Access
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ENTRANCE_CONFIGURATIONS.map((entrance) => {
            const isSelected = dimensions.entranceType === entrance.type;
            const IconComponent =
              entrance.type === 'single'
                ? DoorClosed
                : entrance.type === 'through_180'
                ? Repeat
                : CornerUpRight;

            return (
              <button
                key={entrance.type}
                type="button"
                onClick={() => handleEntranceChange(entrance.type)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-150 ${
                  isSelected
                    ? 'bg-stone-50 border-stone-900 ring-1 ring-stone-900 shadow-sm'
                    : 'bg-white hover:bg-stone-50/70 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800 mb-2 border border-stone-200/70">
                  <IconComponent className="w-4 h-4 text-stone-800" />
                </div>
                <h4 className="text-xs font-semibold text-stone-900 mb-0.5 font-sans">{entrance.title}</h4>
                <p className="text-[11px] font-barlow text-stone-500">{entrance.tagline}</p>
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
          <span>Back to Presets</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-sm transition active:scale-95 font-sans"
        >
          <span>Continue to Wall Surfaces</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
