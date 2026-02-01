
import React, { useState } from 'react';
import { Fingerprint, CheckCircle2 } from 'lucide-react';

interface FingerprintScanProps {
  onVerified: () => void;
}

const FingerprintScan: React.FC<FingerprintScanProps> = ({ onVerified }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [complete, setComplete] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setComplete(true);
      setTimeout(onVerified, 1000);
    }, 2500);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-10">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800">Biometric Verification</h2>
        <p className="text-slate-500 mt-2">Place your thumb on the sensor area below</p>
      </div>

      <div className="relative group">
        <button
          onClick={startScan}
          disabled={isScanning || complete}
          className={`relative w-48 h-48 rounded-3xl flex items-center justify-center transition-all duration-500 
            ${complete ? 'bg-green-100' : 'bg-slate-100 hover:bg-slate-200'} 
            ${isScanning ? 'ring-4 ring-blue-400 ring-offset-4' : ''}`}
        >
          {complete ? (
            <CheckCircle2 className="w-24 h-24 text-green-600 animate-bounce" />
          ) : (
            <Fingerprint className={`w-24 h-24 transition-colors ${isScanning ? 'text-blue-600' : 'text-slate-400'}`} />
          )}

          {isScanning && (
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              <div className="w-full h-1 bg-blue-500 scan-line absolute top-0 shadow-[0_0_15px_rgba(59,130,246,1)]"></div>
            </div>
          )}
        </button>
        
        {!isScanning && !complete && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
            Touch to Scan
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isScanning ? 'bg-blue-500 scale-125' : complete ? 'bg-green-500' : 'bg-slate-300'
            }`}
            style={{ transitionDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default FingerprintScan;
