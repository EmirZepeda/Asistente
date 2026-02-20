"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';

interface SignUpProps {
    onNavigateLogin: () => void;
    onRegister: (data: any) => void;
}

export function SignUp({ onNavigateLogin, onRegister }: SignUpProps) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister(formData);
    };

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col justify-between relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
                {/* Logo/Icon */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="w-20 h-20 bg-[#1a2333] rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-900/20 border border-blue-500/20"
                >
                    <Shield className="text-blue-500 fill-blue-500/20" size={32} />
                </motion.div>

                {/* Header */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Crear Cuenta</h1>
                    <p className="text-gray-400 text-center text-sm leading-relaxed max-w-[280px] mx-auto">
                        Únete a BioVault para asegurar tus activos digitales más valiosos.
                    </p>
                </motion.div>

                {/* Form */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="w-full space-y-5"
                >
                    {/* Full Name */}
                    <div className="space-y-2">
                        <label className="text-gray-300 text-xs font-medium ml-1">Nombre Completo</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <User className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-[#131b2c] border border-gray-800 text-white text-sm rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-gray-300 text-xs font-medium ml-1">Correo Electrónico</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            </div>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-[#131b2c] border border-gray-800 text-white text-sm rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-gray-300 text-xs font-medium ml-1">Contraseña</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="text-gray-500 group-focus-within:text-blue-400 transition-colors" size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-[#131b2c] border border-gray-800 text-white text-sm rounded-xl py-3.5 pl-12 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Activar Biometría removed as requested */}

                    {/* Terms */}
                    <p className="text-center text-gray-500 text-[10px] mt-6 px-4 leading-normal">
                        Al registrarte, aceptas nuestros <a href="#" className="text-blue-500 hover:underline">Términos de Servicio</a> y <a href="#" className="text-blue-500 hover:underline">Política de Privacidad</a>.
                    </p>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all mt-4"
                    >
                        <span>Registrarse</span>
                        <ArrowRight size={18} />
                    </motion.button>
                </motion.form>

                {/* Login Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8"
                >
                    <p className="text-gray-400 text-sm">
                        ¿Ya tienes cuenta?{' '}
                        <button onClick={onNavigateLogin} className="text-blue-400 font-medium hover:text-blue-300 transition-colors">
                            Inicia sesión
                        </button>
                    </p>
                </motion.div>
            </div>


        </div>
    );
}
