"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Lock, MoreVertical, Trash2, CheckCircle, Square, Mic } from 'lucide-react';
import { Badge } from './Badge';

interface VoiceRecorderViewProps {
    onBack: () => void;
    onSave: (file: Blob, duration: string) => void;
}

export function VoiceRecorderView({ onBack, onSave }: VoiceRecorderViewProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        startRecording();
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                mediaRecorderRef.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            // Handle error (maybe show a UI message)
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleSave = () => {
        if (audioBlob) {
            onSave(audioBlob, formatTime(elapsedTime));
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Simulated waveform bars
    const bars = Array.from({ length: 40 });

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-radial-gradient from-blue-500/10 to-transparent opacity-50 pointer-events-none" />

            {/* Header */}
            <div className="px-6 py-6 flex items-center justify-between z-10">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="text-white" size={24} />
                </button>

                <div className="flex items-center gap-2">
                    <Lock size={16} className="text-blue-500" />
                    <span className="text-white font-semibold">Sesión de Grabación Privada</span>
                </div>

                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <MoreVertical className="text-white/60" size={24} />
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 space-y-12">
                {/* Timer */}
                <div className="text-center space-y-4">
                    <h1 className="text-7xl font-bold text-white tracking-tighter tabular-nums">
                        {formatTime(elapsedTime)}
                    </h1>

                    <div className="flex items-center justify-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
                        <span className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                            {isRecording ? 'GRABANDO AUDIO CIFRADO...' : 'GRABACIÓN DETENIDA'}
                        </span>
                    </div>
                </div>

                {/* Waveform Visualization */}
                <div className="h-32 flex items-center justify-center gap-1 w-full max-w-xs px-8">
                    {bars.map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-blue-500/50 rounded-full transition-all duration-300"
                            style={{
                                height: isRecording ? `${Math.random() * 80 + 20}%` : '10%',
                                opacity: isRecording ? Math.random() * 0.5 + 0.5 : 0.2
                            }}
                        />
                    ))}
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-3 gap-12 text-center">
                    <div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">TASA</p>
                        <p className="text-white font-semibold text-lg">256 kbps</p>
                    </div>
                    <div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">FORMATO</p>
                        <p className="text-white font-semibold text-lg">B-ENC</p>
                    </div>
                    <div>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">TAMAÑO</p>
                        <p className="text-white font-semibold text-lg">
                            {(elapsedTime * 0.05).toFixed(1)} MB
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="p-12 z-10">
                {isRecording ? (
                    <div className="flex items-center justify-center">
                        <button
                            onClick={stopRecording}
                            className="w-24 h-24 rounded-[32px] bg-[#1a2332] border border-white/10 flex items-center justify-center group hover:scale-105 transition-all shadow-2xl shadow-black/50"
                        >
                            <div className="w-10 h-10 bg-red-500 rounded-lg shadow-lg shadow-red-500/50 group-hover:scale-90 transition-transform" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-white/60 hover:text-white px-6 py-4 rounded-xl hover:bg-white/5 transition-all"
                        >
                            <Trash2 size={20} />
                            <span className="font-semibold">Descartar</span>
                        </button>

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-1"
                        >
                            <CheckCircle size={20} />
                            <span>Guardar de Forma Segura</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
