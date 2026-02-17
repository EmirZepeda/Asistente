"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Info, MoreVertical, Link2, Lock, X } from 'lucide-react';
import { Badge } from './Badge';

interface SecureViewerProps {
    fileName: string;
    fileSize: string;
    onBack: () => void;
    onLock: () => void;
}

export function SecureViewer({ fileName, fileSize, onBack, onLock }: SecureViewerProps) {
    const [timeRemaining, setTimeRemaining] = useState(59); // 59 seconds

    // Countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onLock(); // Auto-lock when timer expires
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onLock]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-red-400 uppercase tracking-wider">SECURE VIEWER</h1>
                            <p className="text-red-400/80 text-xs">
                                Session expires in <span className="font-bold">{formatTime(timeRemaining)}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <Info className="text-white/60" size={20} />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                            <MoreVertical className="text-white/60" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* File Info Card */}
            <div className="p-6">
                <div className="vault-card mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h3 className="text-white font-semibold mb-2">{fileName}</h3>
                            <div className="flex items-center gap-3 text-xs text-white/50">
                                <span>{fileSize}</span>
                                <span>•</span>
                                <span>Encrypted AES-256</span>
                            </div>
                        </div>
                    </div>

                    <button className="w-full border-2 border-red-500/40 text-red-400 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
                        <X size={16} />
                        Self-Destruct
                    </button>
                </div>
            </div>

            {/* Document Preview Area */}
            <div className="flex-1 p-6 pt-0">
                <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-[#1a2332] to-[#0f1829] rounded-2xl border border-white/10 overflow-hidden">
                    {/* Sample Document Content (would be actual image/PDF in production) */}
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="w-full max-w-md bg-white/5 rounded-xl p-8 text-center">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white/60">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
                                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-sm">
                                Document Preview
                            </p>
                        </div>
                    </div>

                    {/* Watermark Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute text-red-500/10 text-3xl font-bold whitespace-nowrap"
                                style={{
                                    transform: `rotate(-45deg) translateY(${i * 150}px)`,
                                    top: '50%',
                                    left: '50%',
                                    marginLeft: '-50%',
                                    userSelect: 'none'
                                }}
                            >
                                CONFIDENTIAL DO NOT SHARE
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 bg-[#1a2332] border-t border-white/10">
                <div className="flex gap-3 mb-4">
                    <button className="flex-1 vault-button vault-button-secondary flex items-center justify-center gap-2">
                        <Link2 size={18} />
                        Share Encrypted Link
                    </button>
                    <button
                        onClick={onLock}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <Lock size={18} />
                        Lock Now
                    </button>
                </div>

                {/* Footer Warning */}
                <div className="text-center">
                    <p className="text-xs text-white/40 leading-relaxed">
                        Screen recording disabled. Biometric auth required to reopen.
                    </p>
                </div>
            </div>
        </div>
    );
}
