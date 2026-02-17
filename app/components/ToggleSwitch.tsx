"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    label?: string;
    description?: string;
}

export function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex-1">
                {label && <p className="text-white font-medium">{label}</p>}
                {description && <p className="text-sm text-white/50 mt-1">{description}</p>}
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-500' : 'bg-white/20'
                    }`}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                />
            </button>
        </div>
    );
}
