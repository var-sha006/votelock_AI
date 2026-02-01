
import React from 'react';
import { Lock, Unlock, User, MapPin, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';
import { VoterProfile } from '../types';

interface DashboardProps {
  voter: VoterProfile;
  onToggleFreeze: () => void;
  onGoToBooth: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ voter, onToggleFreeze, onGoToBooth }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
            <User className="text-blue-600 w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">{voter.name}</h2>
            <div className="flex items-center text-slate-500 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {voter.constituency}
            </div>
          </div>
          <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center">
             <CheckCircle className="w-3 h-3 mr-1" /> Verified
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-50">
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Voter ID</p>
            <p className="font-mono text-slate-700">{voter.voterId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Status</p>
            <p className={`font-semibold ${voter.hasVoted ? 'text-green-600' : 'text-blue-600'}`}>
              {voter.hasVoted ? 'Vote Casted' : 'Eligible'}
            </p>
          </div>
        </div>
      </div>

      {/* Freeze/Unfreeze Section */}
      <div className={`rounded-3xl p-8 text-center transition-all duration-500 ${
        voter.isUnfrozen ? 'bg-orange-50 border-2 border-orange-200 shadow-orange-100 shadow-xl' : 'bg-blue-600 text-white shadow-xl'
      }`}>
        <div className="flex justify-center mb-4">
          <div className={`p-4 rounded-full ${voter.isUnfrozen ? 'bg-orange-100' : 'bg-white/20'}`}>
            {voter.isUnfrozen ? (
              <Unlock className={`w-12 h-12 text-orange-600 ${voter.hasVoted ? 'opacity-50' : 'animate-pulse'}`} />
            ) : (
              <Lock className="w-12 h-12" />
            )}
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold mb-2 ${voter.isUnfrozen ? 'text-orange-800' : 'text-white'}`}>
          Vote Status: {voter.isUnfrozen ? 'UNFROZEN' : 'FROZEN'}
        </h3>
        <p className={`mb-8 max-w-sm mx-auto ${voter.isUnfrozen ? 'text-orange-700' : 'text-blue-100'}`}>
          {voter.isUnfrozen 
            ? "Your vote is now active. Proceed to your assigned polling booth within 30 minutes."
            : "To prevent identity theft and fraudulent voting, your vote is frozen. Unfreeze only at the booth."}
        </p>

        {!voter.hasVoted && (
          <button
            onClick={onToggleFreeze}
            className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
              voter.isUnfrozen 
                ? 'bg-orange-600 text-white hover:bg-orange-700' 
                : 'bg-white text-blue-600 hover:bg-slate-100'
            }`}
          >
            {voter.isUnfrozen ? 'Freeze Vote' : 'Unfreeze to Vote'}
          </button>
        )}
        
        {voter.hasVoted && (
          <div className="flex items-center justify-center space-x-2 text-white/80 py-4 font-medium">
            <CheckCircle className="w-6 h-6" />
            <span>Voting completed successfully</span>
          </div>
        )}
      </div>

      {/* Action Area */}
      {voter.isUnfrozen && !voter.hasVoted && (
        <div className="bg-white p-6 rounded-3xl border border-blue-100 animate-bounce-subtle">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <ShieldAlert className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800">Assigned Polling Booth #104</h4>
              <p className="text-slate-500 text-sm">Security personnel are waiting for your facial verification.</p>
              <button
                onClick={onGoToBooth}
                className="mt-4 w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
              >
                Start Verification at Booth
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cross-State Info */}
      <div className="bg-slate-100 p-4 rounded-2xl flex items-center space-x-3">
        <AlertCircle className="text-slate-400 w-5 h-5 flex-shrink-0" />
        <p className="text-slate-500 text-xs leading-relaxed">
          SecureVote AI uses blockchain-backed ledger. Once a vote is cast, it is instantly synchronized across all national and state databases. Duplicate voting attempts are automatically flagged.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
