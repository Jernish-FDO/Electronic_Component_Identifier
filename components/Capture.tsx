import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedPage from './AnimatedPage';
import { CameraIcon, UploadIcon, RetakeIcon, CheckIcon } from './icons/AppIcons';
import { AnalysisLevel } from '../types';

const CameraView: React.FC<{ onCapture: (dataUrl: string) => void; onExit: () => void; }> = ({ onCapture, onExit }) => {
  // ... (CameraView component remains the same, no changes needed here)
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (capturedImage) return;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 1920, height: 1080 }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access camera. Ensure permissions are granted (HTTPS required).");
      }
    };
    startCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [capturedImage, stream]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleRetake = () => setCapturedImage(null);
  const handleIdentify = () => capturedImage && onCapture(capturedImage);
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {error ? (
        <div className="text-red-400 p-4 text-center">
          <p>{error}</p>
          <button onClick={onExit} className="mt-4 px-4 py-2 bg-brand-primary text-base-300 rounded-lg">Back</button>
        </div>
      ) : (
        <>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured component" className="max-w-full max-h-full object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black bg-opacity-50 flex justify-center items-center gap-12 backdrop-blur-sm">
            {capturedImage ? (
              <>
                <button onClick={handleRetake} className="flex flex-col items-center text-white"><RetakeIcon /><span className="text-sm mt-1">Retake</span></button>
                <button onClick={handleIdentify} className="flex flex-col items-center text-brand-primary"><CheckIcon /><span className="text-sm mt-1">Identify</span></button>
              </>
            ) : (
              <button onClick={handleCapture} className="p-4 bg-white rounded-full transition-transform hover:scale-110"><div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-white"></div></button>
            )}
          </div>
          <button onClick={onExit} className="absolute top-4 right-4 text-white text-3xl font-light opacity-70 hover:opacity-100">&times;</button>
        </>
      )}
    </div>
  );
};


interface CaptureProps {
  onIdentify: (imageBase64: string, level: AnalysisLevel) => void;
  errorMessage: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Capture: React.FC<CaptureProps> = ({ onIdentify, errorMessage }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analysisLevel, setAnalysisLevel] = useState<AnalysisLevel>('basic'); // NEW: State for analysis level

  const handleUploadClick = () => fileInputRef.current?.click();

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onIdentify(base64, analysisLevel); // Pass level
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };
  
  const handleCameraCapture = (imageBase64: string) => {
    onIdentify(imageBase64, analysisLevel); // Pass level
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.stopPropagation(); };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) processFile(files[0]);
  };


  if (isCameraOpen) {
    return <CameraView onCapture={handleCameraCapture} onExit={() => setIsCameraOpen(false)} />;
  }

  return (
    <AnimatedPage>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-content-100">Identify a Component</h1>
          <p className="mt-2 text-content-200">Use your camera or upload an image.</p>
        </motion.div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-destructive/20 border border-destructive text-destructive px-4 py-3 rounded-lg text-center"
          >
            <p>{errorMessage}</p>
          </motion.div>
        )}
        
        {/* --- NEW: Analysis Level Selector --- */}
        <motion.div variants={itemVariants} className="mt-8">
            <label className="block text-center text-content-200 text-sm font-bold mb-2">Analysis Level</label>
            <div className="flex items-center justify-center p-1 rounded-lg glass-card-nested">
                <button onClick={() => setAnalysisLevel('basic')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisLevel === 'basic' ? 'bg-brand-secondary text-base-100' : 'text-content-200 hover:bg-base-100/50'}`}>
                    Quick Scan
                </button>
                <button onClick={() => setAnalysisLevel('advanced')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${analysisLevel === 'advanced' ? 'bg-brand-secondary text-base-100' : 'text-content-200 hover:bg-base-100/50'}`}>
                    Detailed Analysis
                </button>
            </div>
        </motion.div>

        <div
          onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
          className={`mt-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
        >
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCameraOpen(true)}
            className="group glass-card flex flex-col items-center justify-center w-full h-48 rounded-lg hover:border-brand-primary"
          >
            <CameraIcon />
            <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-brand-primary transition-colors">Use Camera</span>
          </motion.button>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUploadClick}
            className={`group glass-card flex flex-col items-center justify-center w-full h-48 rounded-lg cursor-pointer transition-all
            ${isDragging ? 'border-4 border-dashed border-brand-primary bg-brand-primary/10' : 'hover:border-brand-secondary'}`}
          >
            <UploadIcon />
            <span className={`mt-4 text-lg font-semibold text-content-100 transition-colors ${isDragging ? 'text-brand-primary' : 'group-hover:text-brand-secondary'}`}>
              {isDragging ? 'Drop Image Here' : 'Upload Image'}
            </span>
          </motion.div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
      </motion.div>
    </AnimatedPage>
  );
};

export default Capture;
