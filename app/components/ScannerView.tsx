"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Zap, Settings, ScanLine, FileText, Smartphone, QrCode, Check } from 'lucide-react';
import { Badge } from './Badge';

interface ScannerViewProps {
    onBack: () => void;
    onSave: (file: Blob) => void;
}

export function ScannerView({ onBack, onSave }: ScannerViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [mode, setMode] = useState<'id' | 'document' | 'qr'>('document');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

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
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        onSave(blob);
                        setCapturedImage(canvas.toDataURL('image/jpeg'));
                        setTimeout(() => setCapturedImage(null), 2000);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    return (
        <div className="min-h-screen bg-black relative flex flex-col">
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

            {/* Scanner Overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Header */}
                <div className="px-6 py-6 pt-12 flex items-center justify-between pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>

                    <div className="flex flex-col items-center">
                        <h1 className="text-white font-bold text-lg">Escáner Cifrado</h1>
                        <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">SESIÓN SEGURA</span>
                        </div>
                    </div>

                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Zap size={24} className="text-white" />
                    </button>
                </div>

                {/* Scan Frame */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-[3/4] max-w-sm">
                    {/* Corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-xl" />

                    {/* Scanning Line Animation */}
                    <div className="absolute inset-x-0 h-full bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0 animate-scan">
                        <div className="h-0.5 bg-blue-500/50 w-full shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                    </div>

                    {/* Status Pills */}
                    <div className="absolute -top-12 left-0 right-0 flex justify-center gap-2">
                        <div className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5">
                            <span className="text-blue-400 text-xs font-bold">AUTO-MEJORAR</span>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/20 backdrop-blur-md rounded-full border border-blue-500/30 flex items-center gap-1.5">
                            <div className="w-3 h-3 bg-blue-500 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-white">A</div>
                            <span className="text-blue-200 text-xs font-bold">OCR ACTIVO</span>
                        </div>
                    </div>
                </div>

                {/* Document Detected Badge */}
                <div className="absolute bottom-40 left-0 right-0 flex justify-center">
                    <div className="px-4 py-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/20 flex items-center gap-2 animate-bounce-slight">
                        <div className="bg-white rounded-full p-0.5">
                            <Check size={12} className="text-blue-500" strokeWidth={3} />
                        </div>
                        <span className="text-white text-xs font-bold uppercase tracking-wide">DOCUMENTO DETECTADO</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-8 pt-20 z-20">
                {/* Mode Selector */}
                <div className="flex justify-center mb-8">
                    <div className="bg-[#1a2332]/80 backdrop-blur-xl p-1 rounded-2xl flex border border-white/10">
                        <button
                            onClick={() => setMode('id')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'id' ? 'bg-[#0f1829] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                        >
                            ID Card
                        </button>
                        <button
                            onClick={() => setMode('document')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'document' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Documento
                        </button>
                        <button
                            onClick={() => setMode('qr')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${mode === 'qr' ? 'bg-[#0f1829] text-white shadow-lg' : 'text-white/40 hover:text-white/60'}`}
                        >
                            Código QR
                        </button>
                    </div>
                </div>

                {/* Shutter Area */}
                <div className="flex items-center justify-between px-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl" />

                    <button
                        onClick={takePhoto}
                        className="relative w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                        <div className="w-16 h-16 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform active:scale-95" />
                    </button>

                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                        <Settings size={20} className="text-white" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan {
                    animation: scan 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
