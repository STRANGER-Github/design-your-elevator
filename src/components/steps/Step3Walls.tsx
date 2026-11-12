import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';
import { ElevatorConfiguration, MaterialCategory } from '../../types/elevator';
import { WALL_FINISHES } from '../../data/materials';
import { SwatchCard } from '../common/SwatchCard';

interface Step3WallsProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Walls: React.FC<Step3WallsProps> = ({
  config,
  onUpdateConfig,
  onNext,
  onPrev,
}) => {
  const { walls } = config;
  const [activeTab, setActiveTab] = useState<'all' | 'left' | 'rear' | 'right'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MaterialCategory>('all');

  const filteredFinishes = WALL_FINISHES.filter(
    (f) => categoryFilter === 'all' || f.category === categoryFilter
  );

  const handleAllSameToggle = () => {
    const nextSame = !walls.allSame;
    onUpdateConfig({
      walls: {
        ...walls,
        allSame: nextSame,
        rear: nextSame ? walls.left : walls.rear,
        right: nextSame ? walls.left : walls.right,
      },
    });
    if (nextSame) {
      setActiveTab('all');
    }
  };

  const handleSelectFinish = (finishId: string) => {
    if (walls.allSame || activeTab === 'all') {
      onUpdateConfig({
        walls: {
          ...walls,
          left: finishId,
          rear: finishId,
          right: finishId,
        },
      });
    } else {
      onUpdateConfig({
        walls: {
          ...walls,
          [activeTab]: finishId,
        },
      });
    }
  };

  const currentActiveFinishId =
    walls.allSame || activeTab === 'all'
      ? walls.left
      : activeTab === 'left'
      ? walls.left
      : activeTab === 'rear'
      ? walls.rear
      : walls.right;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-barlow font-medium tracking-wider uppercase mb-2 border border-stone-200/80">
          <span>03 / 06 · Wall Surfaces</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-sans">
          Cabin Wall Cladding & Paneling
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
          Select from architectural stainless steels, FSC-certified natural hardwood veneers, mineral acoustic slates, and safety glass panels.
        </p>
      </div>

      {/* Synchronize All Walls vs Individual Walls Toggle */}
      <div className="bg-stone-50/80 border border-stone-200/90 rounded-xl p-4 flex items-center justify-between">
        <div>
          <h4 className="text-xs font-semibold text-stone-800 font-sans">
            Uniform Cabin Cladding (All Walls Synchronized)
          </h4>
          <p className="text-[11px] font-barlow text-stone-500 mt-0.5">
            {walls.allSame
              ? 'Matching architectural finish applied to Left, Rear, and Right walls.'
              : 'Independent wall paneling active. Select individual walls below.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAllSameToggle}
          className="text-stone-800 hover:text-stone-950 transition ml-3"
          title={walls.allSame ? 'Switch to individual walls' : 'Synchronize all walls'}
        >
          {walls.allSame ? (
            <ToggleRight className="w-8 h-8 text-stone-900" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-stone-400" />
          )}
        </button>
      </div>

      {/* Individual Wall Tabs (Visible when allSame is false) */}
      {!walls.allSame && (
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
          {[
            { id: 'left', label: 'Left Wall' },
            { id: 'rear', label: 'Rear Wall' },
            { id: 'right', label: 'Right Wall' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-barlow tracking-wide transition ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {[
          { id: 'all', label: 'All Materials' },
          { id: 'metal', label: 'Architectural Metals' },
          { id: 'wood', label: 'Hardwood Veneers' },
          { id: 'glass', label: 'Smoked Glass' },
          { id: 'stone', label: 'Mineral Slate' },
          { id: 'laminate', label: 'HPL Laminates' },
        ].map((cat) => {
          const isFilterActive = categoryFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1 rounded-md text-xs font-barlow font-medium tracking-wide transition ${
                isFilterActive
                  ? 'bg-stone-900 text-white border border-stone-900'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Swatches Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
        {filteredFinishes.map((finish) => {
          const isSelected = currentActiveFinishId === finish.id;
          return (
            <SwatchCard
              key={finish.id}
              id={finish.id}
              name={finish.name}
              subtitle={finish.category.toUpperCase()}
              colorHex={finish.hex}
              isSelected={isSelected}
              onSelect={() => handleSelectFinish(finish.id)}
              badge={finish.premium ? 'PVD Titanium' : undefined}
              description={finish.description}
            />
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="pt-4 flex items-center justify-between border-t border-stone-200">
        <button
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-sm font-medium transition font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dimensions</span>
        </button>

        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm shadow-sm transition active:scale-95 font-sans"
        >
          <span>Continue to Flooring & Lighting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
