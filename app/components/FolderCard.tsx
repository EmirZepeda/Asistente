"use client";

import React from 'react';
import { LucideIcon, Lock } from 'lucide-react';

interface FolderCardProps {
    icon: LucideIcon;
    iconColor: string;
    title: string;
    fileCount: number;
    fileType?: string;
    onClick?: () => void;
}

export function FolderCard({ icon: Icon, iconColor, title, fileCount, fileType = 'Encrypted Files', onClick }: FolderCardProps) {
    return (
        <button
            onClick={onClick}
            className="vault-card vault-card-hover text-left relative overflow-hidden"
        >
            {/* Icon */}
            <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center mb-4`}>
                <Icon size={24} className="text-white" />
            </div>

            {/* Lock Indicator */}
            <div className="absolute top-6 right-6">
                <Lock size={16} className="text-white/30" />
            </div>

            {/* Text */}
            <h3 className="text-white font-semibold text-lg mb-1">{title}</h3>
            <p className="text-white/50 text-sm">{fileCount} {fileType}</p>
        </button>
    );
}
