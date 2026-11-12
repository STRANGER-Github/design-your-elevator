export type EntranceType = 'single' | 'through_180' | 'adjacent_90';

export type WallLocation = 'left' | 'rear' | 'right' | 'front';

export type MaterialCategory = 'metal' | 'wood' | 'glass' | 'laminate' | 'stone' | 'rubber';

export interface FinishOption {
  id: string;
  name: string;
  category: MaterialCategory;
  hex: string;
  roughness: number;
  metalness: number;
  texturePattern?: 'brushed' | 'grain' | 'solid' | 'tile' | 'terrazzo';
  description: string;
  premium?: boolean;
}

export interface FloorOption {
  id: string;
  name: string;
  category: 'stone' | 'rubber' | 'wood' | 'vinyl';
  hex: string;
  roughness: number;
  metalness: number;
  pattern: 'checker' | 'terrazzo' | 'parquet' | 'slab' | 'plain' | 'tile';
  description: string;
}


export interface CeilingOption {
  id: string;
  name: string;
  lightingType: 'spots' | 'perimeter_halo' | 'full_luminous' | 'linear_slit';
  finishHex: string;
  lightTempK: number;
  lightIntensity: number;
  description: string;
}

export interface DoorOption {
  id: string;
  name: string;
  type: 'center_2panel' | 'telescopic_2panel';
  finishHex: string;
  metalness: number;
  roughness: number;
  frameWidth: 'standard' | 'wide';
  hasGlassVisionPanels: boolean;
  description: string;
}

export interface MirrorOption {
  id: string;
  name: string;
  position: 'rear' | 'left' | 'right' | 'none';
  coverage: 'half_height' | 'full_height_narrow' | 'full_height_wide' | 'none';
  tint: 'clear' | 'smoked_obsidian' | 'bronze';
  description: string;
}

export interface HandrailOption {
  id: string;
  name: string;
  position: 'rear_only' | 'three_sides' | 'none';
  shape: 'cylindrical' | 'flat_blade' | 'ergonomic_dual';
  finishHex: string;
  metalness: number;
  roughness: number;
  description: string;
}

export interface ControlPanelOption {
  id: string;
  name: string;
  columnHeight: 'full_height' | 'half_height';
  displayType: 'tft_color' | 'dot_matrix' | 'seven_segment';
  finishHex: string;
  illuminatedHalo: string;
  brailleKeypads: boolean;
  description: string;
}

export interface SkirtingOption {
  id: string;
  name: string;
  heightMm: number;
  finishHex: string;
  metalness: number;
  roughness: number;
  hasBumperProtection: boolean;
  bumperMaterial?: 'pvc_black' | 'natural_hardwood' | 'stainless_steel';
}

export interface DimensionConfig {
  presetId: string;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  capacityKg: number;
  persons: number;
  entranceType: EntranceType;
  en81_70_compliant: boolean;
}

export interface StylePreset {
  id: string;
  name: string;
  tagline: string;
  description: string;
  accentColor: string;
  previewColor: string;
  walls: {
    allSame: boolean;
    left: string;
    rear: string;
    right: string;
  };
  floor: string;
  ceiling: string;
  door: string;
  mirror: string;
  handrail: string;
  controlPanel: string;
  skirting: string;
}

export interface ElevatorConfiguration {
  configId: string;
  lastUpdated: string;
  presetId: string;
  dimensions: DimensionConfig;
  walls: {
    allSame: boolean;
    left: string;
    rear: string;
    right: string;
  };
  floor: string;
  ceiling: string;
  door: string;
  mirror: string;
  handrail: string;
  controlPanel: string;
  skirting: string;
  lightingTempMode: 'warm_3000k' | 'neutral_4000k' | 'cool_5000k';
  doorsOpen: boolean;
}

export interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  projectCity: string;
  buildingType: 'residential' | 'commercial' | 'hospital' | 'industrial' | 'hotel';
  estimatedTimeline: 'immediate' | '3_6_months' | '6_12_months' | 'planning_only';
  notes: string;
  privacyConsent: boolean;
  marketingOptIn: boolean;
}
