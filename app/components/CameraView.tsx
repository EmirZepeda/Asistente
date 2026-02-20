"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Settings, Shield, Image as ImageIcon, Check } from 'lucide-react';
import { Badge } from './Badge';

interface CameraViewProps {
    onBack: () => void;
    onSave: (file: Blob) => void;
}

export function CameraView({ onBack, onSave }: CameraViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            // Handle error
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw frame
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        onSave(blob);

                        // Show preview briefly (simulated by setting state, though we save immediately)
                        setCapturedImage(canvas.toDataURL('image/jpeg'));
                        setTimeout(() => setCapturedImage(null), 2000);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black relative flex flex-col">
            {/* Hidden Canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Preview */}
            <div className="absolute inset-0 z-0">
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            {/* Overlays */}
            <div className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none p-6 pt-12">
                {/* Top Controls */}
                <div className="flex items-center justify-between pointer-events-auto">
                    <button
                        onClick={onBack}
                        className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <div className="px-5 py-2.5 bg-[#0f1829]/80 backdrop-blur-xl border border-blue-500/30 rounded-full flex items-center gap-2 shadow-lg shadow-blue-500/20">
                        <Shield size={14} className="text-blue-400 fill-blue-400/20" />
                        <span className="text-blue-100 text-xs font-bold tracking-wider">CAPTURA PRIVADA</span>
                    </div>

                    <button className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
                        <Zap size={24} className={stream ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'} />
                    </button>
                </div>

                {/* Toast Notification (Simulated) */}
                <div className="absolute top-32 left-6 right-6 pointer-events-none">
                    <div className="bg-[#0f1829]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-start gap-3 shadow-xl transform transition-all translate-y-0 opacity-100">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Shield size={16} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium">Foto guardada directamente en la bóveda. No visible en la galería del sistema.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="pointer-events-auto">
                    {/* Visual Focus Ring */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/20 rounded-lg pointer-events-none" />

                    <div className="flex items-center justify-between mb-8 px-6">
                        {/* Gallery Thumbnail */}
                        <button className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden relative">
                            {capturedImage && <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
                        </button>

                        {/* Shutter Button */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl group-hover:bg-blue-500/50 transition-all" />
                            <button
                                onClick={takePhoto}
                                className="relative w-24 h-24 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95"
                            >
                                <div className="w-20 h-20 bg-white rounded-full" />
                            </button>
                        </div>

                        {/* Settings */}
                        <button className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                            <Settings size={24} />
                        </button>
                    </div>

                    <div className="text-center pb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">PIPELINE CIFRADO ACTIVO</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
