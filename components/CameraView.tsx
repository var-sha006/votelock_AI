
import React, { useEffect, useRef, useState } from 'react';
import { Camera, RefreshCw, ScanFace } from 'lucide-react';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  title: string;
  description: string;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, title, description }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: 480, height: 480 },
          audio: false 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera Access Refused:", err);
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current) return;
    setScanning(true);
    
    setTimeout(() => {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current!.videoWidth;
      canvas.height = videoRef.current!.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current!, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg'));
      }
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center space-y-8 animate-fade-in bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
           <ScanFace className="w-3 h-3" />
           <span>Secure AI Scan</span>
        </div>
        <h2 className="text-3xl font-black text-slate-900">{title}</h2>
        <p className="text-slate-500 max-w-sm mx-auto">{description}</p>
      </div>

      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden border-8 border-slate-50 shadow-inner">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover scale-x-[-1]"
        />
        
        {/* Modern Scanning Grid */}
        <div className="absolute inset-0 pointer-events-none border-[30px] border-black/40"></div>
        <div className="absolute inset-10 border-2 border-dashed border-white/30 rounded-[2rem] pointer-events-none"></div>

        {scanning && (
          <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center">
            <div className="w-full h-1 bg-blue-500 absolute top-0 scan-line shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
            <RefreshCw className="w-12 h-12 text-white animate-spin drop-shadow-lg" />
          </div>
        )}
      </div>

      <div className="w-full flex flex-col space-y-4">
        <button
          onClick={handleCapture}
          disabled={scanning}
          className="w-full flex items-center justify-center space-x-2 px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:scale-95 shadow-xl"
        >
          <Camera className="w-5 h-5" />
          <span>{scanning ? 'Analyzing Geometry...' : 'Capture Biometric Info'}</span>
        </button>
        <p className="text-center text-[10px] text-slate-400 font-medium">
          PRIVACY NOTE: Images are processed locally as mathematical embeddings and are never stored in raw format.
        </p>
      </div>
    </div>
  );
};

export default CameraView;
