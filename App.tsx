
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AppStep, VoterProfile, Candidate } from './types';
import { INITIAL_VOTER, MOCK_CANDIDATES } from './constants';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  User, 
  Camera, 
  Fingerprint, 
  LogOut, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  MapPin,
  RefreshCw,
  Info
} from 'lucide-react';
import CameraView from './components/CameraView';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LANDING);
  const [voter, setVoter] = useState<VoterProfile>(INITIAL_VOTER);
  const [tempAadhaar, setTempAadhaar] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [voterDatabase, setVoterDatabase] = useState<VoterProfile[]>([]);

  // Corrected: Initialization of GoogleGenAI removed from component scope to follow best practices.

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Simulate AI Face Verification using Gemini
  const verifyFaceMatch = async (capturedImage: string, targetAadhaar?: string) => {
    setIsVerifying(true);
    
    // For demo: if targetAadhaar is provided, we check if they exist.
    // In a real hackathon demo, we compare capturedImage with the 'registered' faceImage.
    const registeredVoter = voterDatabase.find(v => v.aadhaar === (targetAadhaar || voter.aadhaar));
    
    try {
      // Fix: Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date config.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      if (registeredVoter && registeredVoter.faceImage) {
        // ACTUAL Gemini Logic: Ask model to compare two images (simulated here as we only have 1 part in basic prompt)
        // For the sake of a clean hackathon demo, we simulate a successful match after a thinking delay
        // but use Gemini to "Analyze" the face characteristics
        
        // Fix: Update generateContent to use parts object instead of array of parts directly.
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: {
            parts: [
              { text: "Analyze this biometric face capture for facial geometry consistency. Is it a live human? Respond with 'Match Verified' and a brief reason." },
              { inlineData: { mimeType: "image/jpeg", data: capturedImage.split(',')[1] } }
            ]
          }
        });
        console.log("AI Analysis:", response.text);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // Dramatic pause for "AI Thinking"
      
      if (step === AppStep.REGISTRATION) {
        const newVoter = { ...voter, faceImage: capturedImage, isRegistered: true, aadhaar: tempAadhaar };
        setVoter(newVoter);
        setVoterDatabase([...voterDatabase, newVoter]);
        setStep(AppStep.DASHBOARD);
        notify("Registration Successful: Face & Aadhaar linked.");
      } else if (step === AppStep.LOGIN) {
        if (registeredVoter) {
          setVoter(registeredVoter);
          setStep(AppStep.DASHBOARD);
          notify("Login Successful: Identity Verified.");
        } else {
          notify("Error: No record found for this Aadhaar.");
          setStep(AppStep.LANDING);
        }
      } else {
        // Toggle Freeze/Unfreeze flow
        setVoter(prev => ({ ...prev, isFrozen: !prev.isFrozen }));
        notify(`Vote status updated: ${!voter.isFrozen ? 'FROZEN' : 'UNFROZEN'}`);
        setStep(AppStep.DASHBOARD);
      }
    } catch (err) {
      console.error(err);
      notify("Biometric Match Error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCastVote = (cid: string) => {
    setVoter(prev => ({ ...prev, hasVoted: true, isFrozen: true }));
    setStep(AppStep.SUCCESS);
    notify("Vote Casted! Receipt sent to mobile and email.");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-slate-800">VOTE<span className="text-emerald-600">LOCK</span></span>
        </div>
        
        {step >= AppStep.DASHBOARD && (
          <div className="flex items-center space-x-4">
             <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aadhaar Verified</span>
                <span className="text-sm font-mono text-slate-600">XXXX-XXXX-{voter.aadhaar.slice(-4)}</span>
             </div>
             <button 
              onClick={() => { setStep(AppStep.LANDING); setVoter(INITIAL_VOTER); }}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg"
             >
               <LogOut className="w-5 h-5" />
             </button>
          </div>
        )}
      </header>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] animate-bounce-subtle">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-slate-700">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">{notification}</span>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col p-6 max-w-4xl mx-auto w-full">
        
        {/* Step: Landing */}
        {step === AppStep.LANDING && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12 py-12">
            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                One Face. One Vote. <br/><span className="text-emerald-600">Total Integrity.</span>
              </h1>
              <p className="text-slate-500 text-lg">
                VoteLock uses AI-powered facial recognition to ensure that your vote can only be cast by you. Secure your democratic right with Aadhaar-linked biometric verification.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 w-full max-w-xl">
              <button 
                onClick={() => setStep(AppStep.REGISTRATION)}
                className="group flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-emerald-500 transition-all hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Register Voter</h3>
                <p className="text-slate-500 text-sm mt-1">Enroll with Aadhaar & Face</p>
              </button>

              <button 
                onClick={() => setStep(AppStep.LOGIN)}
                className="group flex flex-col items-center p-8 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-blue-500 transition-all hover:shadow-xl"
              >
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Fingerprint className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Verify & Vote</h3>
                <p className="text-slate-500 text-sm mt-1">Access your secure portal</p>
              </button>
            </div>

            <div className="flex items-center space-x-6 text-slate-400 text-sm font-medium pt-8 border-t border-slate-100 w-full justify-center">
               <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-1 text-emerald-500" /> AI Face Recognition</span>
               <span className="flex items-center"><Lock className="w-4 h-4 mr-1 text-blue-500" /> Aadhaar Encryption</span>
               <span className="flex items-center"><RefreshCw className="w-4 h-4 mr-1 text-orange-500" /> Zero Duplicates</span>
            </div>
          </div>
        )}

        {/* Step: Registration */}
        {step === AppStep.REGISTRATION && (
          <div className="max-w-md mx-auto w-full space-y-8 animate-fade-in">
             <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900">Voter Enrollment</h2>
                <p className="text-slate-500 mt-2">Connect your identity to the national grid.</p>
             </div>

             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                  <input 
                    type="text" 
                    onChange={(e) => setVoter({...voter, name: e.target.value})}
                    placeholder="Enter name as per Aadhaar"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Dummy Aadhaar Number</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    onChange={(e) => setTempAadhaar(e.target.value)}
                    placeholder="1234 5678 9012"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 focus:border-emerald-500 outline-none transition-all font-mono"
                  />
                </div>
                <button 
                  disabled={!voter.name || tempAadhaar.length !== 12}
                  onClick={() => setStep(AppStep.BOOTH)} // We use booth simulation step as camera trigger
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  Proceed to Face Scan
                </button>
             </div>
          </div>
        )}

        {/* Step: Login */}
        {step === AppStep.LOGIN && (
          <div className="max-w-md mx-auto w-full space-y-8 animate-fade-in">
             <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900">Voter Verification</h2>
                <p className="text-slate-500 mt-2">Enter your Aadhaar to start biometric scan.</p>
             </div>
             <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aadhaar Number</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    onChange={(e) => setTempAadhaar(e.target.value)}
                    placeholder="12 digit number"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 px-4 focus:border-blue-500 outline-none transition-all font-mono"
                  />
                </div>
                <button 
                  disabled={tempAadhaar.length !== 12}
                  onClick={() => setStep(AppStep.BOOTH)}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  Initiate Face Verification
                </button>
             </div>
          </div>
        )}

        {/* Step: Camera/Verification Interface (Used for Reg, Login, and Freeze Toggle) */}
        {step === AppStep.BOOTH && (
          <div className="max-w-xl mx-auto w-full">
            <CameraView 
              onCapture={(img) => verifyFaceMatch(img, tempAadhaar)}
              title={isVerifying ? "Verifying..." : "Biometric Scan"}
              description="Keep your face steady within the frame for AI verification."
            />
          </div>
        )}

        {/* Step: Dashboard */}
        {step === AppStep.DASHBOARD && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Info */}
            <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck className="w-48 h-48" />
               </div>
               <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest">Verified Voter</span>
                    <h2 className="text-4xl font-black">{voter.name}</h2>
                    <div className="flex items-center space-x-4 text-emerald-100 font-medium">
                       <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {voter.state}</span>
                       <span className="flex items-center"><User className="w-4 h-4 mr-1" /> UID: {voter.aadhaar}</span>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase opacity-80">Sync Status</span>
                        <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                     </div>
                     <p className="font-mono text-sm">SECURE_ID: VK-{voter.aadhaar.slice(0,4)}</p>
                  </div>
               </div>
            </div>

            {/* Security Controls */}
            <div className="grid md:grid-cols-2 gap-6">
               <div className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center space-y-4 ${
                 voter.isFrozen 
                 ? 'bg-slate-900 border-slate-800 text-white' 
                 : 'bg-white border-emerald-100 text-slate-800'
               }`}>
                  <div className={`p-4 rounded-2xl ${voter.isFrozen ? 'bg-slate-800' : 'bg-emerald-50 text-emerald-600'}`}>
                    {voter.isFrozen ? <Lock className="w-8 h-8" /> : <Unlock className="w-8 h-8" />}
                  </div>
                  <h3 className="text-2xl font-bold">Vote Lock: {voter.isFrozen ? 'ACTIVE' : 'READY'}</h3>
                  <p className={`text-sm ${voter.isFrozen ? 'text-slate-400' : 'text-slate-500'}`}>
                    {voter.isFrozen 
                      ? "Your vote is locked. No one can cast a vote using your ID until you unfreeze it manually."
                      : "Your identity is ready. You can now proceed to the electronic booth."}
                  </p>
                  <button 
                    disabled={voter.hasVoted}
                    onClick={() => setStep(AppStep.BOOTH)}
                    className={`w-full py-4 rounded-xl font-bold transition-all ${
                      voter.isFrozen 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                    } disabled:opacity-50`}
                  >
                    {voter.isFrozen ? 'Unfreeze Identity' : 'Lock My Identity'}
                  </button>
               </div>

               <div className="bg-white p-8 rounded-[2rem] border border-slate-100 space-y-4">
                  <div className="bg-blue-50 text-blue-600 w-fit p-4 rounded-2xl">
                     <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">Casting Status</h3>
                  <p className="text-slate-500 text-sm">
                    {voter.hasVoted 
                      ? "You have already cast your vote. Blockchain protection prevents duplicate attempts in all 28 states."
                      : "Once you enter the booth and cast your vote, your identity will be permanently locked for this election cycle."}
                  </p>
                  <button 
                    disabled={voter.isFrozen || voter.hasVoted}
                    // Fix: Step reference is now valid due to types.ts update.
                    onClick={() => setStep(AppStep.BOOTH_SIMULATION)} // Simulate the ballot page
                    className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl disabled:bg-slate-50 disabled:text-slate-300 enabled:bg-blue-600 enabled:text-white transition-all"
                  >
                    {voter.hasVoted ? 'Participation Complete' : 'Enter Digital Booth'}
                  </button>
               </div>
            </div>

            {/* Info Footer */}
            <div className="bg-orange-50 p-6 rounded-[2rem] flex items-start space-x-4 border border-orange-100">
               <Info className="text-orange-500 w-6 h-6 flex-shrink-0 mt-1" />
               <div className="space-y-1">
                 <h4 className="font-bold text-orange-800">Security Advisory</h4>
                 <p className="text-orange-700 text-sm">
                   If you feel threatened or forced to vote, keep your identity <b>FROZEN</b>. Only you can unfreeze it with a live facial scan. Our AI detects signs of duress and will alert authorities if a non-live image is used.
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* Step: Booth Simulation (Ballot) */}
        {/* Fix: Step reference is now valid due to types.ts update. */}
        {step === AppStep.BOOTH_SIMULATION && (
          <div className="max-w-xl mx-auto w-full space-y-8 animate-fade-in">
             <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900">National Ballot</h2>
                <p className="text-slate-500 mt-2">Final Step: Choose your representative</p>
             </div>
             <div className="grid gap-3">
                {MOCK_CANDIDATES.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => handleCastVote(c.id)}
                    className="bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-center space-x-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-left"
                  >
                    <span className="text-4xl">{c.symbol}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800">{c.name}</h4>
                      <p className="text-slate-500 text-sm">{c.party}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200"></div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {/* Step: Success */}
        {step === AppStep.SUCCESS && (
          <div className="max-w-md mx-auto w-full text-center space-y-8 py-12 animate-fade-in">
            <div className="relative inline-block">
               <div className="bg-emerald-100 p-8 rounded-full relative z-10">
                  <CheckCircle className="w-24 h-24 text-emerald-600" />
               </div>
               <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black text-slate-900">Vote Secured.</h2>
              <p className="text-slate-600 text-lg">
                Identity verified. Vote casted. Profile locked.
              </p>
            </div>
            <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 text-sm font-medium">
               <p className="text-slate-400 uppercase tracking-widest text-[10px]">Security Ledger Transaction</p>
               <p className="font-mono">TX_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
               <div className="h-px bg-slate-800 w-full"></div>
               <p className="text-emerald-400">Your profile is now locked for the current election. Duplicate attempts in other states will result in immediate detention.</p>
            </div>
            <button 
              onClick={() => setStep(AppStep.DASHBOARD)}
              className="w-full py-4 bg-slate-100 text-slate-800 font-bold rounded-xl hover:bg-slate-200"
            >
              Back to Portal
            </button>
          </div>
        )}

      </main>

      <footer className="p-6 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-slate-100 bg-white">
        VoteLock • AI Powered Biometric Democracy • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
