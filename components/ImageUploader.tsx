
import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, Search, X, Zap } from 'lucide-react';

interface Props {
  onImageSelect: (file: File) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<Props> = ({ onImageSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("عذراً، لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-photo.jpg", { type: "image/jpeg" });
            onImageSelect(file);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-gray-100 relative overflow-hidden">
      {/* Hidden Canvas for Capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Interface Overlay */}
      {isCameraOpen && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm">
            <h3 className="text-white font-bold">التقط صورة للبحث</h3>
            <button onClick={stopCamera} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex-grow relative overflow-hidden flex items-center justify-center bg-gray-900">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover mirror"
              style={{ transform: 'scaleX(-1)' }} // Mirror view for user
            />
            {/* Guide Overlay */}
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-blue-500/50 rounded-[40px] relative">
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 flex justify-center items-center bg-black/50 backdrop-blur-sm gap-8">
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all border-8 border-gray-400/30"
            >
              <div className="w-14 h-14 bg-white border-4 border-blue-600 rounded-full"></div>
            </button>
          </div>
        </div>
      )}

      {/* Main Upload Interface */}
      <div 
        className={`relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-12 transition-all hover:border-blue-400 hover:bg-blue-50/30 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Search size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">ارفع صورتك للبحث الاجتماعي</h3>
            <p className="text-gray-500 mt-2 max-w-xs">
              سنقوم بمسح فيسبوك، إنستغرام، لينكد إن والمنصات الأخرى بحثاً عن أي ظهور لصورتك
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full justify-center">
            <button 
              onClick={startCamera}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <Camera size={20} />
              التقاط صورة الآن
            </button>
            <button 
              onClick={triggerUpload}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all active:scale-95"
            >
              <ImageIcon size={20} />
              اختر من المعرض
            </button>
          </div>
        </div>
      </div>

      {cameraError && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
          <Zap size={16} />
          {cameraError}
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-8 text-xs text-gray-400 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
          مسح شامل للمنصات
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          حماية خصوصية فائقة
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          تحليل فوري
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
