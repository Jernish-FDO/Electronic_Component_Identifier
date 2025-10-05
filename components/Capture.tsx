import React, { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { CameraIcon, UploadIcon, HistoryIcon, RetakeIcon, CheckIcon } from './icons/AppIcons';

interface CaptureProps {
  onIdentify: (imageBase64: string) => void;
  errorMessage: string;
}

const CameraView: React.FC<{ onCapture: (dataUrl: string) => void; onExit: () => void; }> = ({ onCapture, onExit }) => {
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
          <button onClick={onExit} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-lg">Back</button>
        </div>
      ) : (
        <>
          {capturedImage ? (
            <img src={capturedImage} alt="Captured component" className="max-w-full max-h-full object-contain" />
          ) : (
            <video ref={videoRef} autoPlay playsInline className="absolute top-0 left-0 w-full h-full object-cover"></video>
          )}
          <canvas ref={canvasRef} className="hidden"></canvas>
          
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black bg-opacity-50 flex justify-center items-center gap-12">
            {capturedImage ? (
              <>
                <button onClick={handleRetake} className="flex flex-col items-center text-white"><RetakeIcon /><span className="text-sm mt-1">Retake</span></button>
                <button onClick={handleIdentify} className="flex flex-col items-center text-green-400"><CheckIcon /><span className="text-sm mt-1">Identify</span></button>
              </>
            ) : (
              <button onClick={handleCapture} className="p-4 bg-white rounded-full"><div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-white"></div></button>
            )}
          </div>
          <button onClick={onExit} className="absolute top-4 right-4 text-white text-3xl font-light">&times;</button>
        </>
      )}
    </div>
  );
};

const Capture: React.FC<CaptureProps> = ({ onIdentify, errorMessage }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onIdentify(base64);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

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
    return <CameraView onCapture={onIdentify} onExit={() => setIsCameraOpen(false)} />;
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-content-100">Identify a Component</h1>
        <p className="mt-2 text-content-200">Use your camera or upload an image.</p>
      </div>

      {errorMessage && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          <p>{errorMessage}</p>
        </div>
      )}

      <div
        onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
        className={`mt-8 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ${isDragging ? 'scale-105' : ''}`}
      >
        <button
          onClick={() => setIsCameraOpen(true)}
          className="group flex flex-col items-center justify-center w-full h-48 bg-base-200 rounded-lg shadow-lg hover:bg-brand-primary transition-all duration-300 transform hover:-translate-y-1"
        >
          <CameraIcon />
          <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-white">Use Camera</span>
        </button>
        <div
            onClick={handleUploadClick}
            className={`group flex flex-col items-center justify-center w-full h-48 bg-base-200 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer
            ${isDragging ? 'bg-blue-500 border-4 border-dashed border-white' : 'hover:bg-brand-secondary'}`}
        >
          <UploadIcon />
          <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-white">
            {isDragging ? 'Drop Image Here' : 'Upload Image'}
          </span>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      </div>
    </div>
  );
};

export default Capture;