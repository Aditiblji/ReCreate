export interface SustainabilityScore {
  co2Saved: number;
  wasteDiverted: number;
  waterSaved: number;
  friendlyNote: string;
}

export interface ProjectIdea {
  id: string;
  title: string;
  visualDescription: string;
  materials: string[];
  extraMaterials?: string[];
  estimatedTime: string;
  estimatedCost: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Expert';
  videoUrl?: string;
  sustainabilityScore: SustainabilityScore;
}

export interface ProjectStep {
  stepNumber: number;
  instruction: string;
  tips?: string;
  safetyNotes?: string;
}

export interface DetailedProject extends ProjectIdea {
  steps: ProjectStep[];
  extraMaterialsSources?: string;
}

export interface WasteAnalysis {
  materials: string[];
  usability: 'broken' | 'partially_usable' | 'fully_usable';
  estimatedWeight?: string;
  description: string;
}
