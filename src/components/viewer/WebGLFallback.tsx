import React from 'react';
import { AlertCircle, RotateCcw, Box } from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';

interface WebGLFallbackProps {
  config: ElevatorConfiguration;
  onRetry?: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ config, onRetry }) => {
  return (
    <div className="w-full h-full min-h-[420px] bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-8 rounded-2xl relative overflow-hidden">
      {/* Schematic grid background */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 max-w-md text-center flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
          <Box className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
          Interactive 3D Preview (Fallback Mode)
        </h3>

        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Hardware WebGL acceleration is currently inactive or restricted in this environment. Your configuration is fully active and updating in real-time.
        </p>

        {/* Technical Specification Box */}
        <div className="w-full bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4 text-left mb-6 space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-700/60 pb-1.5">
            <span className="text-slate-400">Cabin Dimensions:</span>
            <span className="font-mono text-slate-200">
              {config.dimensions.widthMm}W × {config.dimensions.depthMm}D × {config.dimensions.heightMm}H mm
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/60 pb-1.5">
            <span className="text-slate-400">Rated Load:</span>
            <span className="font-mono text-slate-200">
              {config.dimensions.capacityKg} kg ({config.dimensions.persons} Persons)
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-700/60 pb-1.5">
            <span className="text-slate-400">Entrance Layout:</span>
            <span className="font-mono text-amber-300">
              {config.dimensions.entranceType.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Door Status:</span>
            <span className="font-mono text-emerald-400">
              {config.doorsOpen ? 'OPEN (Simulated)' : 'CLOSED'}
            </span>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-sm transition shadow-md shadow-amber-500/20 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            Retry 3D Initialization
          </button>
        )}
      </div>

      <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
        <span>Concept Prototyping Engine</span>
        <span>EN 81-20 / EN 81-70 Architectural Sizing</span>
      </div>
    </div>
  );
};
