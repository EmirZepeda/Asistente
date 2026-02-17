"use client";

import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { FolderPlus, Lock, Fingerprint, Shield } from 'lucide-react';

interface NewFolderSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (folderName: string, securityLevel: 'standard' | 'enhanced' | 'maximum') => void;
}

export function NewFolderSheet({ isOpen, onClose, onCreate }: NewFolderSheetProps) {
    const [folderName, setFolderName] = useState('');
    const [securityLevel, setSecurityLevel] = useState<'standard' | 'enhanced' | 'maximum'>('enhanced');

    const handleCreate = () => {
        if (folderName.trim()) {
            onCreate(folderName, securityLevel);
            setFolderName('');
            setSecurityLevel('enhanced');
            onClose();
        }
    };

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="px-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">New Secure Folder</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-sm font-medium"
                    >
                        Close
                    </button>
                </div>

                {/* Folder Identity Section */}
                <div className="mb-6">
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 block">
                        Folder Identity
                    </label>
                    <div className="relative">
                        <FolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            placeholder="Folder Name (e.g. Finance)"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#0f1829] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                </div>

                {/* Security Level Section */}
                <div className="mb-6">
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 block">
                        Security Level
                    </label>
                    <div className="space-y-3">
                        {/* Standard */}
                        <button
                            onClick={() => setSecurityLevel('standard')}
                            className={`w-full p-4 rounded-xl border transition-all ${securityLevel === 'standard'
                                    ? 'bg-blue-500/10 border-blue-500'
                                    : 'bg-[#0f1829] border-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${securityLevel === 'standard' ? 'bg-blue-500/20' : 'bg-white/5'
                                        }`}>
                                        <Lock size={20} className={securityLevel === 'standard' ? 'text-blue-400' : 'text-white/40'} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-white font-semibold">Standard</h3>
                                        <p className="text-white/50 text-xs">Protected by main App PIN</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${securityLevel === 'standard'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-white/30'
                                    }`}>
                                    {securityLevel === 'standard' && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Enhanced */}
                        <button
                            onClick={() => setSecurityLevel('enhanced')}
                            className={`w-full p-4 rounded-xl border transition-all ${securityLevel === 'enhanced'
                                    ? 'bg-blue-500/10 border-blue-500'
                                    : 'bg-[#0f1829] border-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${securityLevel === 'enhanced' ? 'bg-blue-500/20' : 'bg-white/5'
                                        }`}>
                                        <Fingerprint size={20} className={securityLevel === 'enhanced' ? 'text-blue-400' : 'text-white/40'} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-white font-semibold">Enhanced</h3>
                                        <p className="text-white/50 text-xs">Biometric authentication required</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${securityLevel === 'enhanced'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-white/30'
                                    }`}>
                                    {securityLevel === 'enhanced' && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Maximum */}
                        <button
                            onClick={() => setSecurityLevel('maximum')}
                            className={`w-full p-4 rounded-xl border transition-all ${securityLevel === 'maximum'
                                    ? 'bg-blue-500/10 border-blue-500'
                                    : 'bg-[#0f1829] border-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${securityLevel === 'maximum' ? 'bg-blue-500/20' : 'bg-white/5'
                                        }`}>
                                        <Shield size={20} className={securityLevel === 'maximum' ? 'text-blue-400' : 'text-white/40'} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-white font-semibold">Maximum</h3>
                                        <p className="text-white/50 text-xs">Double Biometrics + AES-256</p>
                                    </div>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${securityLevel === 'maximum'
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-white/30'
                                    }`}>
                                    {securityLevel === 'maximum' && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Create Button */}
                <button
                    onClick={handleCreate}
                    disabled={!folderName.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/30 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <FolderPlus size={20} />
                    Create Folder
                </button>
            </div>
        </BottomSheet>
    );
}
