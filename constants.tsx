
import { Candidate, VoterProfile } from './types';

export const MOCK_CANDIDATES: Candidate[] = [
  { id: '1', name: 'Arjun Sharma', party: 'Progressive Alliance', symbol: '🔆' },
  { id: '2', name: 'Priya Verma', party: 'Unity Congress', symbol: '🤝' },
  { id: '3', name: 'Dr. Ramesh Kumar', party: 'National Front', symbol: '🏰' },
  { id: '4', name: 'Sarah Joseph', party: 'Green Party', symbol: '🌿' },
];

export const INITIAL_VOTER: VoterProfile = {
  aadhaar: '',
  name: '',
  faceImage: null,
  isRegistered: false,
  isFrozen: true,
  hasVoted: false,
  state: 'Tamil Nadu'
};
