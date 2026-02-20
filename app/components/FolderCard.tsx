"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Lock, MoreVertical, EyeOff, Archive, Trash2 } from 'lucide-react';

interface FolderCardProps {
    icon: LucideIcon;
    iconColor: string;
    title: string;
    fileCount: number;
    fileType?: string;
    onClick?: () => void;
    onHide?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
}

export function FolderCard({ icon: Icon, iconColor, title, fileCount, fileType = 'Archivos', onClick, onHide, onArchive, onDelete }: FolderCardProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [menuOpen]);

    return (
        <div className="vault-card vault-card-hover text-left relative overflow-hidden">
            {/* Main clickable area */}
            <button onClick={onClick} className="w-full text-left">
                {/* Icon */}
                <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                </div>

                {/* Text */}
                <h3 className="text-white font-semibold text-lg mb-1 pr-6">{title}</h3>
                <p className="text-white/50 text-sm">{fileCount} {fileType}</p>
            </button>

            {/* Lock + 3-dot menu */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5" ref={menuRef}>
                <Lock size={14} className="text-white/30" />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(v => !v);
                    }}
                    className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <MoreVertical size={16} />
                </button>

                {/* Dropdown */}
                {menuOpen && (
                    <div className="absolute top-8 right-0 min-w-[160px] bg-[#1a2332] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onHide?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <EyeOff size={16} className="text-blue-400" />
                            Ocultar
                        </button>
                        <div className="h-px bg-white/5 mx-3" />
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onArchive?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <Archive size={16} className="text-amber-400" />
                            Archivar
                        </button>
                        <div className="h-px bg-white/5 mx-3" />
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={16} />
                            Eliminar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
