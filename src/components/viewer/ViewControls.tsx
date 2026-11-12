import React from 'react';
import {
  DoorOpen,
  DoorClosed,
  Sun,
  Ruler,
  RotateCcw,
} from 'lucide-react';
import { ElevatorConfiguration } from '../../types/elevator';

export type CameraPreset = 'inside' | 'entrance' | 'cop' | 'ceiling' | 'isometric';

interface ViewControlsProps {
  currentPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  showDimensions: boolean;
  onToggleDimensions: () => void;
  onResetCamera: () => void;
}

export const ViewControls: React.FC<ViewControlsProps> = ({
  currentPreset,
  onSelectPreset,
  config,
  onUpdateConfig,
  showDimensions,
  onToggleDimensions,
  onResetCamera,
}) => {
  const cameraPresets: { id: CameraPreset; label: string }[] = [
    { id: 'isometric', label: '3D Cutaway' },
    { id: 'inside', label: 'Cabin Interior' },
    { id: 'entrance', label: 'Entrance Portal' },
    { id: 'cop', label: 'Control Column' },
    { id: 'ceiling', label: 'Ceiling Lighting' },
  ];

  return (
    <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none font-sans">
      {/* Camera View Switcher */}
      <div className="pointer-events-auto bg-stone-950/85 backdrop-blur-md border border-stone-800 p-1.5 rounded-xl shadow-xl flex items-center gap-1">
        {cameraPresets.map(preset => {
          const isActive = currentPreset === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                isActive
                  ? 'bg-stone-100 text-stone-950 font-semibold shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
              title={`Switch camera view to ${preset.label}`}
            >
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Feature Controls */}
      <div className="pointer-events-auto bg-stone-950/85 backdrop-blur-md border border-stone-800 p-1.5 rounded-xl shadow-xl flex items-center gap-2">
        {/* Toggle Door Open / Close */}
        <button
          onClick={() => onUpdateConfig({ doorsOpen: !config.doorsOpen })}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 font-barlow ${
            config.doorsOpen
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title={config.doorsOpen ? 'Close doors' : 'Open elevator doors'}
        >
          {config.doorsOpen ? (
            <>
              <DoorOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Doors: Open</span>
            </>
          ) : (
            <>
              <DoorClosed className="w-3.5 h-3.5" />
              <span>Doors: Closed</span>
            </>
          )}
        </button>

        {/* Dimension Guide Toggle */}
        <button
          onClick={onToggleDimensions}
          className={`p-1.5 rounded-lg text-xs transition flex items-center justify-center ${
            showDimensions
              ? 'bg-stone-100 text-stone-950'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title="Toggle 3D Dimension Rulers"
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Lighting Temp Cycle */}
        <button
          onClick={() => {
            const nextMode: Record<string, ElevatorConfiguration['lightingTempMode']> = {
              warm_3000k: 'neutral_4000k',
              neutral_4000k: 'cool_5000k',
              cool_5000k: 'warm_3000k',
            };
            onUpdateConfig({ lightingTempMode: nextMode[config.lightingTempMode] });
          }}
          className="px-2.5 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition flex items-center gap-1.5 font-barlow font-medium"
          title={`Lighting: ${config.lightingTempMode.replace('_', ' ').toUpperCase()}`}
        >
          <Sun className="w-3.5 h-3.5 text-stone-300" />
          <span className="hidden sm:inline">
            {config.lightingTempMode === 'warm_3000k'
              ? '3000K'
              : config.lightingTempMode === 'cool_5000k'
              ? '5000K'
              : '4000K'}
          </span>
        </button>

        {/* Reset Camera to Default */}
        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
          title="Reset camera to default view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
