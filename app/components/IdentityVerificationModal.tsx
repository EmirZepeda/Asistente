"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useBiometrics } from '@/hooks/useBiometrics';

interface IdentityVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onVerified: () => void;
    fileName: string;
}

export function IdentityVerificationModal({
    isOpen,
    onClose,
    onVerified,
    fileName
}: IdentityVerificationModalProps) {
    const { checkBiometrics } = useBiometrics();
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setIsScanning(true);
        setError(null);

        try {
            const success = await checkBiometrics();

            if (success) {
                setTimeout(() => {
                    onVerified();
                }, 500);
            } else {
                setError('Verificación fallida. Intenta nuevamente.');
                setIsScanning(false);
            }
        } catch (err) {
            setError('Error al verificar identidad.');
            setIsScanning(false);
        }
    };

    // Auto-trigger verification when modal opens
    React.useEffect(() => {
        if (isOpen && !isScanning && !error) {
            handleVerify();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-gradient-to-br from-[#1e293b] to-[#0f1829] rounded-3xl p-8 max-w-sm w-full border border-white/10"
                >
                    <div className="text-center">
                        {/* Fingerprint Icon with Animation */}
                        <div className="relative mb-8">
                            <motion.div
                                animate={isScanning ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: [
                                        '0 0 30px rgba(59, 130, 246, 0.4)',
                                        '0 0 60px rgba(59, 130, 246, 0.8)',
                                        '0 0 30px rgba(59, 130, 246, 0.4)'
                                    ]
                                } : {}}
                                transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
                                className="w-32 h-32 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto"
                            >
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" className={`${isScanning ? 'text-blue-300' : 'text-blue-400'} transition-colors`}>
                                    <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 0 0 8 11a4 4 0 1 1 8 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0 0 15.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 0 0 8 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                {/* Scanning Pulse Effect */}
                                {isScanning && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute inset-0 rounded-full border-4 border-blue-400"
                                    />
                                )}
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-2">Identity Verification Required</h2>

                        {/* File Info */}
                        <p className="text-white/60 text-sm mb-6">
                            Accessing <span className="text-white font-semibold">{fileName}</span> requires secondary authentication
                        </p>

                        {/* Status Badge */}
                        <AnimatePresence mode="wait">
                            {isScanning ? (
                                <motion.div
                                    key="scanning"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 mb-6"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full"
                                    />
                                    <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                                        Scanning Biometrics
                                    </span>
                                </motion.div>
                            ) : error ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/40 mb-6"
                                >
                                    <AlertCircle size={14} className="text-red-400" />
                                    <span className="text-red-300 text-xs font-semibold uppercase">
                                        Verification Failed
                                    </span>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {error && (
                                <button
                                    onClick={handleVerify}
                                    className="w-full vault-button vault-button-primary"
                                >
                                    Reintentar
                                </button>
                            )}

                            <button
                                disabled={isScanning}
                                className="w-full vault-button vault-button-secondary disabled:opacity-30"
                            >
                                Usar Código de Acceso
                            </button>

                            <button
                                onClick={onClose}
                                disabled={isScanning}
                                className="text-white/50 text-sm font-medium hover:text-white/70 transition-colors disabled:opacity-30"
                            >
                                Cancelar Acceso
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
