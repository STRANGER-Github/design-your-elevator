import { DimensionConfig, EntranceType } from '../types/elevator';

export interface DimensionPreset {
  id: string;
  name: string;
  tagline: string;
  category: 'residential' | 'commercial' | 'hospital' | 'freight';
  widthMm: number;
  depthMm: number;
  heightMm: number;
  capacityKg: number;
  persons: number;
  en81_70: boolean;
  description: string;
}

export const DIMENSION_PRESETS: DimensionPreset[] = [
  {
    id: 'preset_residential_compact',
    name: 'Compact Residential (450 kg)',
    tagline: 'Ideal for private residences & boutique apartments',
    category: 'residential',
    widthMm: 1000,
    depthMm: 1250,
    heightMm: 2200,
    capacityKg: 450,
    persons: 6,
    en81_70: false,
    description: 'Space-saving cabin geometry engineered for existing shafts and urban multi-family homes.',
  },
  {
    id: 'preset_commercial_standard',
    name: 'Commercial Standard (630 kg)',
    tagline: 'Standard passenger elevator for mid-rise offices & hotels',
    category: 'commercial',
    widthMm: 1100,
    depthMm: 1400,
    heightMm: 2300,
    capacityKg: 630,
    persons: 8,
    en81_70: true,
    description: 'Complies with EN 81-70 wheelchair accessibility standards. Optimized passenger circulation.',
  },
  {
    id: 'preset_hospital_stretcher',
    name: 'Stretcher & Healthcare (1000 kg)',
    tagline: 'Bed, gurney, & wheelchair through-circulation',
    category: 'hospital',
    widthMm: 1100,
    depthMm: 2100,
    heightMm: 2350,
    capacityKg: 1000,
    persons: 13,
    en81_70: true,
    description: 'Elongated deep cabin supporting standard medical beds, medical attendants, and dual entrances.',
  },
  {
    id: 'preset_freight_heavy',
    name: 'Heavy Duty Freight & Service (1600 kg)',
    tagline: 'Industrial goods, pallet trucks, & logistics',
    category: 'freight',
    widthMm: 1400,
    depthMm: 2400,
    heightMm: 2500,
    capacityKg: 1600,
    persons: 21,
    en81_70: true,
    description: 'Reinforced floor and perimeter bumper protection for heavy trolley impact loads.',
  },
];

export interface EntranceConfigOption {
  type: EntranceType;
  title: string;
  tagline: string;
  iconName: string;
  description: string;
}

export const ENTRANCE_CONFIGURATIONS: EntranceConfigOption[] = [
  {
    type: 'single',
    title: 'Single Entrance (Front Only)',
    tagline: 'Standard 1-side landing access',
    iconName: 'DoorClosed',
    description: 'Primary entrance at the front of the cabin. Maximizes usable rear wall area for mirrors and art.',
  },
  {
    type: 'through_180',
    title: 'Through Entrance (180° Opposite)',
    tagline: 'Front and rear pass-through',
    iconName: 'Repeat',
    description: 'Doors on both front and rear walls. Ideal for split-level landings, parking basements, and through-flow.',
  },
  {
    type: 'adjacent_90',
    title: 'Adjacent Entrance (90° Corner)',
    tagline: 'Front and side right landing',
    iconName: 'CornerUpRight',
    description: 'Doors positioned at a right angle for complex architectural layouts and staggered floor plans.',
  },
];

export const DEFAULT_DIMENSIONS: DimensionConfig = {
  presetId: 'preset_commercial_standard',
  widthMm: 1100,
  depthMm: 1400,
  heightMm: 2300,
  capacityKg: 630,
  persons: 8,
  entranceType: 'single',
  en81_70_compliant: true,
};
