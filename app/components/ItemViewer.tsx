"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, FileText, Image as ImageIcon, Mic, ScanLine, Play, Pause, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './Badge';

interface ItemViewerProps {
    item: {
        id: string;
        type: 'note' | 'voice' | 'photo' | 'scan';
        title: string;
        description: string | null;
        content?: string;
        fileUrl?: string;
        timestamp: string;
        createdAt: string;
        duration?: string;
        size?: string | null;
    };
    onClose: () => void;
}

export function ItemViewer({ item, onClose }: ItemViewerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    // Format date nicely
    const dateObj = new Date(item.createdAt);
    const date = dateObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const time = dateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
            >
                <X size={24} />
            </button>

            <div className="w-full max-w-4xl max-h-[90vh] flex flex-col items-center p-6">
                {/* Header Info */}
                <div className="w-full flex items-center justify-between mb-8 text-white">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${item.type === 'note' ? 'bg-blue-500/20 text-blue-400' :
                                item.type === 'voice' ? 'bg-purple-500/20 text-purple-400' :
                                    item.type === 'photo' ? 'bg-orange-500/20 text-orange-400' :
                                        'bg-indigo-500/20 text-indigo-400'
                                }`}>
                                {item.type === 'note' && <FileText size={20} />}
                                {item.type === 'voice' && <Mic size={20} />}
                                {item.type === 'photo' && <ImageIcon size={20} />}
                                {item.type === 'scan' && <ScanLine size={20} />}
                            </div>
                            <h2 className="text-2xl font-bold">{item.title}</h2>
                        </div>
                        <div className="flex items-center gap-4 text-white/50 text-sm">
                            <span className="flex items-center gap-1.5"><Calendar size={14} /> {date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} /> {time}</span>
                            {item.size && <span>• {item.size}</span>}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="w-full flex-1 overflow-auto bg-[#1a2332] rounded-2xl border border-white/10 shadow-2xl relative min-h-[400px] flex items-center justify-center">

                    {/* Note View */}
                    {item.type === 'note' && (
                        <div className="w-full h-full p-8 overflow-y-auto absolute inset-0">
                            <div className="prose prose-invert max-w-none">
                                <p className="text-lg leading-relaxed whitespace-pre-wrap text-white/90">
                                    {item.content || "Sin contenido"}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Photo / Scan View */}
                    {(item.type === 'photo' || item.type === 'scan') && item.fileUrl && (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img
                                src={item.fileUrl}
                                alt={item.title}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Voice View */}
                    {item.type === 'voice' && (
                        <div className="flex flex-col items-center gap-8 py-12 w-full max-w-md">
                            <div className="w-32 h-32 rounded-full bg-purple-500/10 flex items-center justify-center relative">
                                <div className={`absolute inset-0 rounded-full border border-purple-500/30 ${isPlaying ? 'animate-ping' : ''}`} />
                                <Mic size={48} className="text-purple-400" />
                            </div>

                            <div className="w-full space-y-2">
                                <div className="h-12 bg-white/5 rounded-full flex items-center justify-center gap-1 px-4 overflow-hidden">
                                    {/* Fake waveform */}
                                    {Array.from({ length: 30 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-purple-500/50 rounded-full transition-all duration-300"
                                            style={{
                                                height: isPlaying ? `${Math.random() * 100}%` : '20%',
                                                opacity: Math.random() * 0.5 + 0.5
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-white/40 px-2">
                                    <span>0:00</span>
                                    <span>{item.duration || '0:00'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <button className="p-2 text-white/40 hover:text-white transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                                </button>
                                <button className="p-2 text-white/40 hover:text-white transition-colors">
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            {item.fileUrl && (
                                <audio
                                    src={item.fileUrl}
                                    className="hidden"
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    controls
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex gap-4">
                    {item.fileUrl && (
                        <a
                            href={item.fileUrl}
                            download
                            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-colors"
                        >
                            <Download size={18} />
                            Descargar
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
