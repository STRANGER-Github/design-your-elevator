import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';
import { DOOR_OPTIONS } from '../../data/materials';
import {
  MIRROR_OPTIONS,
  HANDRAIL_OPTIONS,
  CONTROL_PANEL_OPTIONS,
  SKIRTING_OPTIONS,
} from '../../data/accessories';
import { SwatchCard } from '../common/SwatchCard';

interface Step5FittingsProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step5Fittings: React.FC<Step5FittingsProps> = ({
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
          <span>05 / 06 · Hardware & Fixtures</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Doors, Handrails & Car Operating Panel
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Configure car door leaves, accessibility safety mirrors, tactile EN 81-70 handrails, and the Car Operating Panel (COP) interface.
        </p>
      </div>

      {/* Car & Landing Doors */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Elevator Landing & Car Door Leaves
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DOOR_OPTIONS.map((d) => {
            const isSelected = config.door === d.id;
            return (
              <SwatchCard
                key={d.id}
                id={d.id}
                name={d.name}
                subtitle={d.type.replace('_', ' ').toUpperCase()}
                colorHex={d.finishHex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ door: d.id })}
                description={d.description}
              />
            );
          })}
        </div>
      </div>

      {/* Mirrors */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Cabin Mirror Configurations
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {MIRROR_OPTIONS.map((m) => {
            const isSelected = config.mirror === m.id;
            return (
              <SwatchCard
                key={m.id}
                id={m.id}
                name={m.name}
                subtitle={m.coverage.replace(/_/g, ' ').toUpperCase()}
                colorHex={m.tint === 'bronze' ? '#cfb584' : '#e2e8f0'}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ mirror: m.id })}
                description={m.description}
              />
            );
          })}
        </div>
      </div>

      {/* Handrails */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Ergonomic Handrails (EN 81-70 Accessibility)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {HANDRAIL_OPTIONS.map((h) => {
            const isSelected = config.handrail === h.id;
            return (
              <SwatchCard
                key={h.id}
                id={h.id}
                name={h.name}
                subtitle={h.shape.replace('_', ' ').toUpperCase()}
                colorHex={h.finishHex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ handrail: h.id })}
                description={h.description}
              />
            );
          })}
        </div>
      </div>

      {/* Car Operating Panel (COP) */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Car Operating Panel (COP) Interface Column
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTROL_PANEL_OPTIONS.map((c) => {
            const isSelected = config.controlPanel === c.id;
            return (
              <SwatchCard
                key={c.id}
                id={c.id}
                name={c.name}
                subtitle={`${c.columnHeight.replace('_', ' ').toUpperCase()} · ${c.displayType.replace('_', ' ').toUpperCase()}`}
                colorHex={c.finishHex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ controlPanel: c.id })}
                description={c.description}
                badge={c.brailleKeypads ? 'Braille tactile' : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Skirting & Protection */}
      <div>
        <label className="block text-xs font-barlow font-semibold text-stone-700 uppercase tracking-wider mb-2.5">
          Base Skirting & Wall Protections
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKIRTING_OPTIONS.map((s) => {
            const isSelected = config.skirting === s.id;
            return (
              <SwatchCard
                key={s.id}
                id={s.id}
                name={s.name}
                subtitle={`${s.heightMm}mm Profile`}
                colorHex={s.finishHex}
                isSelected={isSelected}
                onSelect={() => onUpdateConfig({ skirting: s.id })}
                description={
                  s.hasBumperProtection
                    ? 'Includes integrated impact bumper protection rail for service longevity.'
                    : 'Architectural flush skirting with clean recessed shadow line.'
                }
              />
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
          <span>Back to Flooring & Lighting</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-sm transition active:scale-95 font-sans"
        >
          <span>Review Specification & Summary</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
