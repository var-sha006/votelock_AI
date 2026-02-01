
import React, { useState } from 'react';
import { MOCK_CANDIDATES } from '../constants';
import { Candidate } from '../types';
import CameraView from './CameraView';
import { ShieldCheck, Info } from 'lucide-react';

interface BoothVerificationProps {
  onVoteCast: (candidateId: string) => void;
}

const BoothVerification: React.FC<BoothVerificationProps> = ({ onVoteCast }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  if (!isVerified) {
    return (
      <CameraView 
        title="Booth Facial Recognition" 
        description="Verify your identity one last time before accessing the ballot."
        onCapture={() => setIsVerified(true)}
      />
    );
  }

  const handleCastVote = () => {
    if (selectedCandidate) {
      setConfirming(true);
      setTimeout(() => {
        onVoteCast(selectedCandidate);
      }, 2000);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>Biometrically Authenticated</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Official Ballot</h2>
        <p className="text-slate-500 mt-2">Select your candidate for the General Election 2024</p>
      </div>

      <div className="grid gap-3">
        {MOCK_CANDIDATES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCandidate(c.id)}
            disabled={confirming}
            className={`flex items-center p-4 rounded-2xl border-2 transition-all ${
              selectedCandidate === c.id 
                ? 'border-blue-500 bg-blue-50 shadow-md scale-[1.02]' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-3xl shadow-inner mr-4">
              {c.symbol}
            </div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-slate-800 text-lg">{c.name}</h4>
              <p className="text-slate-500 text-sm font-medium">{c.party}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 transition-colors ${
              selectedCandidate === c.id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
            } flex items-center justify-center`}>
              {selectedCandidate === c.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </button>
        ))}
      </div>

      <div className="pt-6">
        <div className="bg-slate-50 p-4 rounded-2xl flex items-start space-x-3 mb-6">
          <Info className="text-blue-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-slate-500 text-sm italic">
            Your vote is anonymous. The system only records that you have voted to prevent duplicates. Your choice is encrypted and untraceable.
          </p>
        </div>

        <button
          onClick={handleCastVote}
          disabled={!selectedCandidate || confirming}
          className={`w-full py-5 rounded-2xl font-bold text-xl shadow-xl transition-all transform active:scale-[0.98] ${
            !selectedCandidate || confirming
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
          }`}
        >
          {confirming ? 'Casting Secure Vote...' : 'Submit Final Vote'}
        </button>
      </div>
    </div>
  );
};

export default BoothVerification;
