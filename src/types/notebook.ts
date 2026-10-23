import { RenderStyle, OrbitalVisualizationMode } from './chemistry';

export interface LabNoteSnapshot {
  renderStyle: RenderStyle;
  orbitalMode: OrbitalVisualizationMode;
  temperatureK: number;
  activeVibrationalModeName?: string;
  vibrationalFrequencyCm1?: number;
  measurementDistance?: number;
  measurementAngle?: number;
  dipoleDebye?: number;
  isSnapToOrbit?: boolean;
  orbitalColorScheme?: string;
}

export interface LabNoteEntry {
  id: string;
  moleculeFormula: string;
  moleculeName: string;
  timestamp: number;
  title: string;
  content: string;
  tag: 'Observation' | 'VSEPR Analysis' | 'Spectroscopy' | 'Reaction Mechanism' | 'Lab Report';
  snapshot: LabNoteSnapshot;
}
