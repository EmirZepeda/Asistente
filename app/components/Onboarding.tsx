"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Smartphone, ArrowRight, Check, Mail } from 'lucide-react';
import { signIn } from "next-auth/react";

interface OnboardingProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 0,
        title: "Bienvenido a tu Bóveda Privada",
        description: "Tus notas más sensibles protegidas con biometría y cifrado de máxima seguridad.",
        icon: <Lock size={64} className="text-blue-500" />,
        color: "bg-blue-500"
    },
    {
        id: 1,
        title: "Máxima Seguridad",
        description: "Tus archivos se fragmentan y cifran con AES-256 antes de salir de tu dispositivo. Solo tú tienes la llave.",
        icon: <Shield size={64} className="text-blue-500" />,
        color: "bg-blue-600"
    },
    {
        id: 2,
        title: "Control Total",
        description: "Configura bloqueos por carpeta, temporizadores de sesión y alertas de intrusión. Tu privacidad es nuestra prioridad.",
        icon: <Smartphone size={64} className="text-blue-500" />,
        color: "bg-indigo-500"
    }
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showLoginOptions, setShowLoginOptions] = useState(false);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            setShowLoginOptions(true);
        }
    };

    const skip = () => {
        setShowLoginOptions(true);
    };

    if (showLoginOptions) {
        return (
            <div className="min-h-screen bg-[#0f1829] flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md space-y-8 z-10"
                >
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                            <Shield size={32} className="text-blue-500" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">BioVault</h1>
                        <p className="text-white/60">
                            Tus archivos, protegidos por expertos con los más altos estándares biométricos.
                        </p>
                    </div>

                    <div className="space-y-4 pt-8">
                        <button
                            onClick={() => signIn("google")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            {/* Mock Google Icon using text/font for now or basic circle */}
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">G</div>
                            Continuar con Google
                        </button>

                        <button
                            onClick={onComplete}
                            className="w-full bg-white/5 hover:bg-white/10 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-3 border border-white/10"
                        >
                            <Mail size={20} />
                            Ingresar con correo
                        </button>
                    </div>

                    <div className="text-center pt-8">
                        <p className="text-white/40 text-sm">
                            ¿No tienes cuenta? <button className="text-blue-400 hover:underline font-medium">Regístrate</button>
                        </p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <Check size={12} className="text-blue-400" />
                            <span className="text-xs text-white/60">Acceso cifrado de extremo a extremo</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col relative overflow-hidden">
            {/* Skip button */}
            <div className="absolute top-6 right-6 z-20">
                <button onClick={skip} className="text-white/60 hover:text-white text-sm font-medium transition-colors">
                    Saltar
                </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center text-center max-w-sm"
                    >
                        {/* Visual Container */}
                        <div className="w-64 h-64 bg-blue-500/5 rounded-[40px] flex items-center justify-center mb-12 relative">
                            {/* Decorative Rings */}
                            <div className="absolute inset-0 border border-blue-500/10 rounded-[40px] scale-110" />
                            <div className="absolute inset-0 border border-blue-500/5 rounded-[40px] scale-125" />

                            <div className="w-32 h-32 bg-blue-500/10 rounded-3xl flex items-center justify-center relative z-10 backdrop-blur-sm">
                                {slides[currentSlide].icon}
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-white mb-4">
                            {slides[currentSlide].title}
                        </h2>
                        <p className="text-white/60 leading-relaxed">
                            {slides[currentSlide].description}
                        </p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Navigation */}
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0f1829] to-transparent">
                <div className="max-w-md mx-auto w-full flex flex-col items-center gap-8">
                    {/* Dots */}
                    <div className="flex gap-3">
                        {slides.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-blue-500 w-8' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Primary Button */}
                    <button
                        onClick={nextSlide}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/20"
                    >
                        {currentSlide === slides.length - 1 ? 'Empezar' : 'Siguiente'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {currentSlide === 1 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                            <Check size={12} className="text-blue-400" />
                            <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Zero-Knowledge Architecture</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
