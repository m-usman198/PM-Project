
export interface ProjectData {
  name: string;
  description: string;
  timeline: string;
  budget: string;
  initialRequirements: string;
  constraints: string;
}

export interface AnalysisResult {
  scopePlan: string;
  requirementsMatrix: string;
  advisoryWarnings: string;
  gapAnalysis: string;
}

export enum ViewState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}
