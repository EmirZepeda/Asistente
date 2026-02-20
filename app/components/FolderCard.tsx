"use client";

import React, { useRef } from 'react';
import { LucideIcon, Lock, MoreVertical, EyeOff, Archive, Trash2 } from 'lucide-react';

interface FolderCardProps {
    id: string;
    icon: LucideIcon;
    iconColor: string;
    title: string;
    fileCount: number;
    fileType?: string;
    onClick?: () => void;
    onHide?: () => void;
    onArchive?: () => void;
    onDelete?: () => void;
    // Controlled from parent — only one menu open at a time
    menuOpenId: string | null;
    onMenuOpen: (id: string, top: number, right: number) => void;
    onMenuClose: () => void;
    menuPos: { top: number; right: number };
}

export function FolderCard({
    id, icon: Icon, iconColor, title, fileCount, fileType = 'Archivos',
    onClick, onHide, onArchive, onDelete,
    menuOpenId, onMenuOpen, onMenuClose, menuPos,
}: FolderCardProps) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const isOpen = menuOpenId === id;

    const openMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = btnRef.current!.getBoundingClientRect();
        onMenuOpen(id, rect.bottom + 8, window.innerWidth - rect.right);
    };

    return (
        <div className="vault-card vault-card-hover text-left relative">
            <button onClick={onClick} className="w-full text-left block">
                <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-1 pr-8">{title}</h3>
                <p className="text-white/50 text-sm">{fileCount} {fileType}</p>
            </button>

            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <Lock size={14} className="text-white/30" />
                <button
                    ref={btnRef}
                    onClick={openMenu}
                    className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <MoreVertical size={16} />
                </button>
            </div>

            {/* Only render dropdown when THIS card is the open one */}
            {isOpen && (
                <>
                    <div
                        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
                        onClick={onMenuClose}
                    />
                    <div
                        style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 9999 }}
                        className="min-w-[164px] bg-[#1a2332] border border-white/10 rounded-2xl shadow-2xl shadow-black/70 overflow-hidden"
                    >
                        <button
                            onClick={() => { onMenuClose(); onHide?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <EyeOff size={16} className="text-blue-400" />
                            Ocultar
                        </button>
                        <div className="h-px bg-white/5 mx-3" />
                        <button
                            onClick={() => { onMenuClose(); onArchive?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <Archive size={16} className="text-amber-400" />
                            Archivar
                        </button>
                        <div className="h-px bg-white/5 mx-3" />
                        <button
                            onClick={() => { onMenuClose(); onDelete?.(); }}
                            className="w-full flex items-center gap-3 px-4 py-3.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 size={16} />
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
