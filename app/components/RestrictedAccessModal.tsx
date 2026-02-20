"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import { useBiometrics } from '@/hooks/useBiometrics';

interface RestrictedAccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
    folderName: string;
    fileCount: number;
}

export function RestrictedAccessModal({
    isOpen,
    onClose,
    onUnlock,
    folderName,
    fileCount
}: RestrictedAccessModalProps) {
    const { checkBiometrics } = useBiometrics();
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFaceIDScan = async () => {
        setIsScanning(true);
        setError(null);

        try {
            const success = await checkBiometrics();

            if (success) {
                // Small delay for visual feedback
                setTimeout(() => {
                    onUnlock();
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
                    className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-gradient-to-br from-[#1e293b] to-[#1a2332] rounded-3xl p-8 max-w-md w-full border border-white/10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={onClose}
                            disabled={isScanning}
                            className="text-white/60 hover:text-white text-sm font-medium disabled:opacity-30"
                        >
                            ← Cancelar
                        </button>
                        <button className="text-blue-400 text-sm font-semibold border border-blue-500/30 px-4 py-1.5 rounded-lg">
                            SEGURO
                        </button>
                    </div>

                    {/* Content */}
                    <div className="text-center">
                        {/* Folder Icon */}
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9l-2-2H5a2 2 0 0 0-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                        {/* Folder Info */}
                        <h3 className="text-2xl font-bold text-white mb-2">{folderName}</h3>
                        <p className="text-white/50 text-sm mb-8">{fileCount} archivos cifrados</p>

                        {/* Face ID Icon with Glow */}
                        <div className="relative mb-8">
                            <motion.div
                                animate={{
                                    boxShadow: isScanning
                                        ? [
                                            '0 0 20px rgba(59, 130, 246, 0.3)',
                                            '0 0 40px rgba(59, 130, 246, 0.6)',
                                            '0 0 20px rgba(59, 130, 246, 0.3)'
                                        ]
                                        : '0 0 20px rgba(59, 130, 246, 0.3)'
                                }}
                                transition={{ duration: 2, repeat: isScanning ? Infinity : 0 }}
                                className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto"
                            >
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className={`${isScanning ? 'text-blue-300' : 'text-blue-400'} transition-colors`}>
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2" />
                                    <path d="M19 20c0-3.87-3.13-7-7-7s-7 3.13-7 7" stroke="currentColor" strokeWidth="2" />
                                    <path d="M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M3 15v3a2 2 0 0 0 2 2h3M21 15v3a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>

                        {/* Status Message */}
                        <AnimatePresence mode="wait">
                            {isScanning ? (
                                <motion.p
                                    key="scanning"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="text-white/60 text-sm mb-6"
                                >
                                    Escaneando biometría...
                                </motion.p>
                            ) : error ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center justify-center gap-2 text-red-400 text-sm mb-6"
                                >
                                    <AlertCircle size={16} />
                                    {error}
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="ready"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-white/60 text-sm mb-6"
                                >
                                    Esta carpeta requiere autenticación secundaria para acceder a los archivos.
                                </motion.p>
                            )}
                        </AnimatePresence>

                        {/* Scan Button */}
                        <button
                            onClick={handleFaceIDScan}
                            disabled={isScanning}
                            className={`w-full vault-button vault-button-primary mb-4 ${isScanning ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isScanning ? 'Verificando...' : 'Escanear Face ID'}
                        </button>

                        {/* Use Passcode Link */}
                        <button
                            disabled={isScanning}
                            className="text-blue-400 text-sm hover:text-blue-300 transition-colors disabled:opacity-30"
                        >
                            Usar código de acceso
                        </button>

                        {/* Privacy Notice */}
                        <p className="text-white/30 text-xs mt-8 leading-relaxed">
                            Sus datos biométricos están protegidos y nunca salen de este dispositivo.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
