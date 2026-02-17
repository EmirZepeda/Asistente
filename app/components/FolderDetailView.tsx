"use client";

import React, { useState } from 'react';
import { ArrowLeft, MoreVertical, FileText, Mic, Camera, ScanLine, Filter, Lock, Plus } from 'lucide-react';
import { Badge } from './Badge';

interface StoredItem {
    id: string;
    type: 'note' | 'voice' | 'photo' | 'scan';
    title: string;
    description: string;
    timestamp: string;
    size?: string;
}

interface FolderDetailViewProps {
    folderName: string;
    securityLevel: 'standard' | 'enhanced' | 'maximum';
    onBack: () => void;
    onAddItem: (type: 'text' | 'voice' | 'photo' | 'scan') => void;
}

export function FolderDetailView({ folderName, securityLevel, onBack, onAddItem }: FolderDetailViewProps) {
    const [items, setItems] = useState<StoredItem[]>([
        {
            id: '1',
            type: 'note',
            title: 'Backup Codes - Exchange',
            description: '2FA recovery codes for the main trading account. Generated on Oct 15.',
            timestamp: '10:42 AM',
            size: '1.2 KB'
        },
        {
            id: '2',
            type: 'voice',
            title: 'Meeting with Legal',
            description: '',
            timestamp: 'Yesterday',
            size: '02:14'
        },
        {
            id: '3',
            type: 'photo',
            title: 'Contract Signatures',
            description: '',
            timestamp: '2 days ago',
            size: '3.4 MB'
        }
    ]);

    const getItemIcon = (type: string) => {
        switch (type) {
            case 'note': return FileText;
            case 'voice': return Mic;
            case 'photo': return Camera;
            case 'scan': return ScanLine;
            default: return FileText;
        }
    };

    const getItemColor = (type: string) => {
        switch (type) {
            case 'note': return 'text-blue-400';
            case 'voice': return 'text-purple-400';
            case 'photo': return 'text-orange-400';
            case 'scan': return 'text-blue-400';
            default: return 'text-blue-400';
        }
    };

    const getItemBg = (type: string) => {
        switch (type) {
            case 'note': return 'bg-blue-500/10';
            case 'voice': return 'bg-purple-500/10';
            case 'photo': return 'bg-orange-500/10';
            case 'scan': return 'bg-blue-500/10';
            default: return 'bg-blue-500/10';
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1829] pb-24">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-white">{folderName}</h1>
                                <Badge variant="green" className="text-xs">
                                    ● SECURE
                                </Badge>
                            </div>
                            <p className="text-white/50 text-sm">Last synced: Just now</p>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <MoreVertical className="text-white/60" size={24} />
                    </button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <button
                        onClick={() => onAddItem('text')}
                        className="flex flex-col items-center gap-2 p-4 bg-[#1a2332] rounded-2xl hover:bg-[#1e293b] transition-colors"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <FileText size={24} className="text-blue-400" />
                        </div>
                        <span className="text-white text-xs font-medium">Text</span>
                    </button>

                    <button
                        onClick={() => onAddItem('voice')}
                        className="flex flex-col items-center gap-2 p-4 bg-[#1a2332] rounded-2xl hover:bg-[#1e293b] transition-colors"
                    >
                        <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                            <Mic size={24} className="text-purple-400" />
                        </div>
                        <span className="text-white text-xs font-medium">Voice</span>
                    </button>

                    <button
                        onClick={() => onAddItem('photo')}
                        className="flex flex-col items-center gap-2 p-4 bg-[#1a2332] rounded-2xl hover:bg-[#1e293b] transition-colors"
                    >
                        <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                            <Camera size={24} className="text-orange-400" />
                        </div>
                        <span className="text-white text-xs font-medium">Photo</span>
                    </button>

                    <button
                        onClick={() => onAddItem('scan')}
                        className="flex flex-col items-center gap-2 p-4 bg-[#1a2332] rounded-2xl hover:bg-[#1e293b] transition-colors"
                    >
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                            <ScanLine size={24} className="text-blue-400" />
                        </div>
                        <span className="text-white text-xs font-medium">Scan</span>
                    </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">STORED ITEMS</h2>
                    <button className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                        Filter
                        <Filter size={16} />
                    </button>
                </div>
            </div>

            {/* Items List */}
            <div className="px-6 space-y-3">
                {items.map((item) => {
                    const Icon = getItemIcon(item.type);
                    return (
                        <div key={item.id} className="vault-card">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 ${getItemBg(item.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon size={24} className={getItemColor(item.type)} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`${getItemColor(item.type)} text-xs font-semibold uppercase`}>
                                                    {item.type}
                                                </span>
                                                <Lock size={12} className="text-white/40" />
                                            </div>
                                            <h3 className="text-white font-semibold">{item.title}</h3>
                                        </div>
                                    </div>

                                    {item.description && (
                                        <p className="text-white/60 text-sm mb-2 line-clamp-2">{item.description}</p>
                                    )}

                                    {item.type === 'voice' && (
                                        <div className="mb-2">
                                            {/* Waveform visualization */}
                                            <div className="flex items-center gap-0.5 h-8">
                                                {[...Array(40)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 bg-blue-500/40 rounded-full"
                                                        style={{
                                                            height: `${Math.random() * 60 + 20}%`,
                                                            opacity: i < 20 ? 0.8 : 0.3
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs text-white/40">
                                        <span>{item.timestamp}</span>
                                        <span>{item.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FAB */}
            <button
                onClick={() => onAddItem('text')}
                className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:scale-110"
            >
                <Plus className="text-white" size={28} />
            </button>
        </div>
    );
}
