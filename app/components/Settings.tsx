"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Shield } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';

interface SettingsProps {
    onBack: () => void;
}

export function Settings({ onBack }: SettingsProps) {
    const [faceIdEnabled, setFaceIdEnabled] = useState(true);
    const [fingerprintBackup, setFingerprintBackup] = useState(false);
    const [autoLock, setAutoLock] = useState(true);
    const [stealthMode, setStealthMode] = useState(true);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('vaultSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            setFaceIdEnabled(settings.faceIdEnabled ?? true);
            setFingerprintBackup(settings.fingerprintBackup ?? false);
            setAutoLock(settings.autoLock ?? true);
            setStealthMode(settings.stealthMode ?? true);
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        const settings = {
            faceIdEnabled,
            fingerprintBackup,
            autoLock,
            stealthMode
        };
        localStorage.setItem('vaultSettings', JSON.stringify(settings));
    }, [faceIdEnabled, fingerprintBackup, autoLock, stealthMode]);

    return (
        <div className="min-h-screen bg-[#0f1829] pb-8">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="text-white" size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Security & Vault Settings</h1>
                </div>
            </div>

            {/* Vault Status Card */}
            <div className="px-6 mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600/20 via-blue-700/10 to-blue-900/5 border border-blue-500/30 p-6">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500 rounded-full blur-2xl" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                                <Lock className="text-blue-300" size={24} />
                            </div>
                            <h2 className="text-xl font-bold text-blue-200 uppercase tracking-wide">VAULT ACTIVE</h2>
                        </div>
                        <p className="text-blue-100/80 text-sm leading-relaxed">
                            Your secure notes are encrypted. Biometric access is currently enabled.
                        </p>
                    </div>
                </div>
            </div>

            {/* Biometrics Section */}
            <div className="px-6 mb-8">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">BIOMETRICS</h2>
                <div className="space-y-4">
                    <div className="vault-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M19 20c0-3.87-3.13-7-7-7s-7 3.13-7 7" stroke="currentColor" strokeWidth="2" />
                                    <path d="M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M3 15v3a2 2 0 0 0 2 2h3M21 15v3a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <ToggleSwitch
                                    enabled={faceIdEnabled}
                                    onChange={setFaceIdEnabled}
                                    label="Face ID Unlock"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="vault-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                                    <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="15" r="1" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <ToggleSwitch
                                    enabled={fingerprintBackup}
                                    onChange={setFingerprintBackup}
                                    label="Fingerprint Backup"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Behavior Section */}
            <div className="px-6">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">BEHAVIOR</h2>
                <div className="space-y-4">
                    <div className="vault-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" stroke="currentColor" strokeWidth="2" />
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <ToggleSwitch
                                    enabled={autoLock}
                                    onChange={setAutoLock}
                                    label="Auto-Lock on App Exit"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="vault-card">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue-400">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" />
                                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <ToggleSwitch
                                    enabled={stealthMode}
                                    onChange={setStealthMode}
                                    label="Stealth Mode"
                                    description="Prevents screen capture and hides app contents in the recent apps switcher."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
