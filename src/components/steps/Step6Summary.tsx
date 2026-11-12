import React from 'react';
import {
  Download,
  Send,
  Edit2,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';
import { WALL_FINISHES, FLOOR_FINISHES, CEILING_OPTIONS, DOOR_OPTIONS } from '../../data/materials';
import {
  MIRROR_OPTIONS,
  HANDRAIL_OPTIONS,
  CONTROL_PANEL_OPTIONS,
  SKIRTING_OPTIONS,
} from '../../data/accessories';
import { STYLE_PRESETS } from '../../data/presets';

interface Step6SummaryProps {
  config: ElevatorConfiguration;
  onGoToStep: (step: number) => void;
  onDownloadPdf: () => void;
  onOpenQuote: () => void;
  onPrev: () => void;
}

export const Step6Summary: React.FC<Step6SummaryProps> = ({
  config,
  onGoToStep,
  onDownloadPdf,
  onOpenQuote,
  onPrev,
}) => {
  const currentPreset = STYLE_PRESETS.find(p => p.id === config.presetId) || STYLE_PRESETS[0];
  const leftWall = WALL_FINISHES.find(f => f.id === config.walls.left)?.name || config.walls.left;
  const rearWall = config.walls.allSame ? leftWall : (WALL_FINISHES.find(f => f.id === config.walls.rear)?.name || config.walls.rear);
  const rightWall = config.walls.allSame ? leftWall : (WALL_FINISHES.find(f => f.id === config.walls.right)?.name || config.walls.right);
  const floorName = FLOOR_FINISHES.find(f => f.id === config.floor)?.name || config.floor;
  const ceilingName = CEILING_OPTIONS.find(c => c.id === config.ceiling)?.name || config.ceiling;
  const doorName = DOOR_OPTIONS.find(d => d.id === config.door)?.name || config.door;
  const mirrorName = MIRROR_OPTIONS.find(m => m.id === config.mirror)?.name || config.mirror;
  const handrailName = HANDRAIL_OPTIONS.find(h => h.id === config.handrail)?.name || config.handrail;
  const copName = CONTROL_PANEL_OPTIONS.find(c => c.id === config.controlPanel)?.name || config.controlPanel;
  const skirtingName = SKIRTING_OPTIONS.find(s => s.id === config.skirting)?.name || config.skirting;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-barlow font-medium tracking-wider uppercase mb-2 border border-stone-200/80">
          <span>06 / 06 · Specification & Quote</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Cabin Specification & Tender Summary
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Review the complete architectural schedule of finishes, clear dimensions, and fixtures. Export an architectural tender PDF or submit for formal manufacturer quotation.
        </p>
      </div>

      {/* Main Action Callout Bar */}
      <div className="bg-stone-900 text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-barlow font-semibold text-stone-300 tracking-wider">
              SPEC REF: {config.configId}
            </span>
            <span className="text-[11px] font-barlow px-2 py-0.5 rounded bg-white/10 text-stone-300">
              Style: {currentPreset.name}
            </span>
          </div>
          <h3 className="text-base font-semibold font-sans">Elevator Design Specification Complete</h3>
          <p className="text-xs text-stone-400 mt-0.5 font-sans">
            Export vector specification PDF or send direct inquiry to manufacturing engineering.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onDownloadPdf}
            className="px-4 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition border border-white/15 flex items-center gap-2 active:scale-95 font-sans"
          >
            <Download className="w-4 h-4 text-stone-300" />
            <span>Download Spec PDF</span>
          </button>

          <button
            onClick={onOpenQuote}
            className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs transition shadow-sm flex items-center gap-2 active:scale-95 font-sans"
          >
            <Send className="w-4 h-4" />
            <span>Request Quotation</span>
          </button>
        </div>
      </div>

      {/* Structured Bill of Materials Breakdown */}
      <div className="space-y-3.5">
        {/* Section 1: Dimensions */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <h4 className="text-xs font-barlow font-semibold text-stone-800 uppercase tracking-wider">
                1. Dimensions & Shaft Layout
              </h4>
            </div>
            <button
              onClick={() => onGoToStep(2)}
              className="text-xs text-stone-600 hover:text-stone-900 font-barlow font-medium flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Clear Car Dimensions</span>
              <span className="font-barlow font-semibold text-stone-900">
                {config.dimensions.widthMm}W × {config.dimensions.depthMm}D × {config.dimensions.heightMm}H mm
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Rated Capacity</span>
              <span className="font-barlow font-semibold text-stone-900">
                {config.dimensions.capacityKg} kg ({config.dimensions.persons} Persons)
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Landing Entrance</span>
              <span className="font-barlow font-medium text-stone-800">
                {config.dimensions.entranceType.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Standard Rating</span>
              <span className="font-barlow font-medium text-emerald-700 flex items-center gap-1">
                {config.dimensions.en81_70_compliant ? 'EN 81-70 Wheelchair' : 'EN 81-20 Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Finishes */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <h4 className="text-xs font-barlow font-semibold text-stone-800 uppercase tracking-wider">
                2. Wall, Floor & Ceiling Finishes
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onGoToStep(3)}
                className="text-xs text-stone-600 hover:text-stone-900 font-barlow font-medium flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Walls
              </button>
              <button
                onClick={() => onGoToStep(4)}
                className="text-xs text-stone-600 hover:text-stone-900 font-barlow font-medium flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" /> Edit Floors/Light
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Wall Paneling</span>
              <span className="font-sans font-medium text-stone-900">
                {config.walls.allSame ? `${leftWall} (All Walls)` : `L: ${leftWall} | Rear: ${rearWall} | R: ${rightWall}`}
              </span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Flooring Substrate</span>
              <span className="font-sans font-medium text-stone-900">{floorName}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Ceiling System</span>
              <span className="font-sans font-medium text-stone-900">{ceilingName}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Color Temperature (CCT)</span>
              <span className="font-barlow font-medium text-stone-900">
                {config.lightingTempMode.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Fittings & COP */}
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <h4 className="text-xs font-barlow font-semibold text-stone-800 uppercase tracking-wider">
                3. Fittings, Doors & Operating Interface
              </h4>
            </div>
            <button
              onClick={() => onGoToStep(5)}
              className="text-xs text-stone-600 hover:text-stone-900 font-barlow font-medium flex items-center gap-1"
            >
              <Edit2 className="w-3 h-3" /> Edit Fittings
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Door Leaves</span>
              <span className="font-sans font-medium text-stone-900">{doorName}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Safety Mirror</span>
              <span className="font-sans font-medium text-stone-900">{mirrorName}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Handrail Profile</span>
              <span className="font-sans font-medium text-stone-900">{handrailName}</span>
            </div>
            <div>
              <span className="text-stone-400 text-[11px] font-barlow uppercase tracking-wider block">Operating Panel (COP)</span>
              <span className="font-sans font-medium text-stone-900">{copName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Disclaimer */}
      <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 flex items-start gap-3 text-xs text-stone-700">
        <AlertCircle className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
        <div className="leading-relaxed font-sans">
          <span className="font-semibold text-stone-900">Architectural Preliminary Study:</span> This configuration represents a non-binding conceptual study. Structural shaft tolerances, pit depths, machine room / MRL overheads, and local regulatory standards (EN 81-20/50, ASME A17.1) must be verified and certified by a certified elevator engineering consultant prior to production order release.
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="pt-2 flex justify-start">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Fittings</span>
        </button>
      </div>
    </div>
  );
};
