
export enum AppStep {
  LANDING,
  REGISTRATION,
  LOGIN,
  DASHBOARD,
  BOOTH,
  BOOTH_SIMULATION,
  SUCCESS
}

export interface VoterProfile {
  aadhaar: string;
  name: string;
  faceImage: string | null;
  isRegistered: boolean;
  isFrozen: boolean;
  hasVoted: boolean;
  state: string;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  symbol: string;
}
