import React, { useState, useRef, useEffect } from 'react';
import { CameraIcon, UploadIcon, HistoryIcon, RetakeIcon, CheckIcon } from './icons/AppIcons'; // Assuming you add the new icons

interface CaptureProps {
  onIdentify: (imageBase64: string) => void;
  onViewHistory: () => void; // New prop to switch to history view
}

// This sub-component now handles the preview logic
const CameraView: React.FC<{ onCapture: (dataUrl: string) => void; onExit: () => void; }> = ({ onCapture, onExit }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  useEffect(() => {
    if (capturedImage) return; // Don't restart camera if we are in preview mode

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
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [capturedImage]);

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
        stream?.getTracks().forEach(track => track.stop()); // Stop stream to freeze frame
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null); // This will trigger the useEffect to restart the camera
  };

  const handleIdentify = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };
  
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
                <button onClick={handleRetake} className="flex flex-col items-center text-white">
                  <RetakeIcon />
                  <span className="text-sm mt-1">Retake</span>
                </button>
                <button onClick={handleIdentify} className="flex flex-col items-center text-green-400">
                  <CheckIcon />
                  <span className="text-sm mt-1">Identify</span>
                </button>
              </>
            ) : (
              <button onClick={handleCapture} className="p-4 bg-white rounded-full text-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white">
                 <div className="w-8 h-8 rounded-full bg-brand-primary border-2 border-white"></div>
              </button>
            )}
          </div>
          <button onClick={onExit} className="absolute top-4 right-4 text-white text-3xl font-light">&times;</button>
        </>
      )}
    </div>
  );
};


const Capture: React.FC<CaptureProps> = ({ onIdentify, onViewHistory }) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        onIdentify(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isCameraOpen) {
    return <CameraView onCapture={onIdentify} onExit={() => setIsCameraOpen(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-content-100">Identify Component</h1>
        <p className="mt-2 text-content-200">Use your camera, upload an image, or view your history.</p>
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          onClick={() => setIsCameraOpen(true)}
          className="group flex flex-col items-center justify-center w-60 h-48 bg-base-200 rounded-lg shadow-lg hover:bg-brand-primary transition-all duration-300 transform hover:-translate-y-1"
        >
          <CameraIcon />
          <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-white">Use Camera</span>
        </button>

        <button
          onClick={handleUploadClick}
          className="group flex flex-col items-center justify-center w-60 h-48 bg-base-200 rounded-lg shadow-lg hover:bg-brand-secondary transition-all duration-300 transform hover:-translate-y-1"
        >
          <UploadIcon />
          <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-white">Upload Image</span>
        </button>

        <button
          onClick={onViewHistory}
          className="group flex flex-col items-center justify-center w-60 h-48 bg-base-200 rounded-lg shadow-lg hover:bg-gray-500 transition-all duration-300 transform hover:-translate-y-1"
        >
          <HistoryIcon />
          <span className="mt-4 text-lg font-semibold text-content-100 group-hover:text-white">View History</span>
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default Capture;