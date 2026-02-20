"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Fingerprint, AlertCircle } from 'lucide-react';
import { useBiometrics } from '@/hooks/useBiometrics';

interface FaceIDAuthProps {
    onAuthenticate: () => void;
}

export function FaceIDAuth({ onAuthenticate }: FaceIDAuthProps) {
    const { checkBiometrics } = useBiometrics();
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleBiometricAuth = async () => {
        setIsAuthenticating(true);
        setError(null);

        try {
            const success = await checkBiometrics();

            if (success) {
                // Small delay for visual feedback
                setTimeout(() => {
                    onAuthenticate();
                }, 500);
            } else {
                setError('Autenticación fallida. Intenta nuevamente.');
                setIsAuthenticating(false);
            }
        } catch (err) {
            setError('Error al acceder a la autenticación biométrica.');
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col items-center justify-between p-8">
            {/* Header Badge */}
            <div className="pt-12">
                <div className="vault-badge vault-badge-blue">
                    <Lock size={14} />
                    AUTENTICACIÓN REQUERIDA
                </div>
            </div>

            {/* Face ID Scanner */}
            <div className="flex flex-col items-center">
                <div className="relative w-80 h-80 flex items-center justify-center">
                    {/* Corner Brackets */}
                    <motion.div
                        animate={{
                            opacity: isAuthenticating ? [0.5, 1, 0.5] : 1
                        }}
                        transition={{ duration: 2, repeat: isAuthenticating ? Infinity : 0 }}
                        className="absolute inset-0"
                    >
                        {/* Top Left */}
                        <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 rounded-tl-3xl" />
                        {/* Top Right */}
                        <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-blue-500 rounded-tr-3xl" />
                        {/* Bottom Left */}
                        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-blue-500 rounded-bl-3xl" />
                        {/* Bottom Right */}
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-blue-500 rounded-br-3xl" />
                    </motion.div>

                    {/* Face ID Icon Container */}
                    <div className={`relative w-64 h-64 bg-gradient-to-br from-blue-900/20 to-blue-950/40 rounded-3xl border border-blue-500/20 flex items-center justify-center ${isAuthenticating ? 'animate-pulse-glow' : ''}`}>
                        {/* Face ID Icon */}
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" className={`${isAuthenticating ? 'text-blue-300' : 'text-blue-400'} transition-colors`}>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M19 20c0-3.87-3.13-7-7-7s-7 3.13-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 9V6a2 2 0 0 1 2-2h3M21 9V6a2 2 0 0 0-2-2h-3M3 15v3a2 2 0 0 0 2 2h3M21 15v3a2 2 0 0 1-2 2h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        {/* Scanning Line */}
                        {isAuthenticating && (
                            <motion.div
                                animate={{ y: [-60, 60, -60] }}
                                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute w-full h-1 bg-blue-400/60 blur-sm"
                            />
                        )}
                    </div>
                </div>

                {/* Status */}
                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-semibold text-white mb-2">Face ID</h2>

                    <AnimatePresence mode="wait">
                        {isAuthenticating ? (
                            <motion.p
                                key="authenticating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-white/60 text-sm"
                            >
                                Verificando identidad...
                            </motion.p>
                        ) : error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center gap-2 text-red-400 text-sm"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        ) : (
                            <motion.p
                                key="ready"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-white/60 text-sm"
                            >
                                Toca para autenticar
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <button
                    onClick={handleBiometricAuth}
                    disabled={isAuthenticating}
                    className={`w-full vault-button vault-button-secondary flex items-center justify-center gap-2 ${isAuthenticating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Fingerprint size={20} />
                    {isAuthenticating ? 'Autenticando...' : 'Usar Autenticación Biométrica'}
                </button>

                <button
                    disabled={isAuthenticating}
                    className="text-white/50 text-sm font-medium uppercase tracking-wider hover:text-white/70 transition-colors disabled:opacity-30"
                >
                    CANCELAR
                </button>

                {/* iOS Style Indicator */}
                <div className="w-32 h-1 bg-white/20 rounded-full mt-2" />
            </div>
        </div>
    );
}
