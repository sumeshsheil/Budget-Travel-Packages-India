"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RotateCcw, Check } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  label: string;
  capturedImage?: string | null;
}

export function CameraCapture({
  onCapture,
  label,
  capturedImage,
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(capturedImage || null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setPreview(null);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setError(
        "Camera access denied. Please allow camera access and try again.",
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  }, [stream]);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPreview(dataUrl);
      onCapture(dataUrl);
      stopCamera();
    }
  }, [onCapture, stopCamera]);

  const retake = useCallback(() => {
    setPreview(null);
    startCamera();
  }, [startCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-gray-700">{label}</p>

      {/* Canvas for capturing (hidden) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Preview or Camera */}
      <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 aspect-4/3 flex items-center justify-center">
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={`${label} capture`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 right-3 bg-emerald-500 text-white rounded-full p-1.5">
              <Check className="h-4 w-4" />
            </div>
          </>
        ) : isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-6">
            <Camera className="h-10 w-10 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-400">
              Camera preview will appear here
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Controls */}
      <div className="flex gap-2">
        {preview ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={retake}
            className="flex-1 rounded-lg"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Retake
          </Button>
        ) : isCameraActive ? (
          <Button
            type="button"
            size="sm"
            onClick={capture}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Capture
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={startCamera}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
          >
            <Camera className="h-3.5 w-3.5 mr-1.5" />
            Open Camera
          </Button>
        )}
      </div>
    </div>
  );
}
