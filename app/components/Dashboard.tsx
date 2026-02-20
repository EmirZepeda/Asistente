"use client";

import React, { useState } from 'react';
import { Shield, Settings, Search, Folder, FileText, FileSpreadsheet, Image, Mic, Key, BookOpen, EyeOff, FolderPlus } from 'lucide-react';
import { Badge } from './Badge';
import { FolderCard } from './FolderCard';
import { motion } from 'framer-motion';
import type { FolderType } from './NewFolderSheet';

export interface FolderData {
    id: string;
    name: string;
    folderType: FolderType;
    itemCount: number;
    securityLevel: 'standard' | 'enhanced' | 'maximum';
}

interface DashboardProps {
    onFolderClick: (folderName: string, folderId: string, securityLevel: 'standard' | 'enhanced' | 'maximum') => void;
    onSettingsClick: () => void;
    onStorageClick: () => void;
    onNewFolderClick: () => void;
    folders: FolderData[];
    onFolderStatusChange: (folderId: string, status: 'hidden' | 'archived' | 'deleted') => void;
}

// Map folderType -> icon and color
const typeIconMap: Record<FolderType, { icon: React.ElementType; iconColor: string }> = {
    documentos: { icon: FileText, iconColor: 'bg-blue-500' },
    hojas: { icon: FileSpreadsheet, iconColor: 'bg-green-500' },
    media: { icon: Image, iconColor: 'bg-orange-500' },
    notas: { icon: Mic, iconColor: 'bg-purple-500' },
    claves: { icon: Key, iconColor: 'bg-yellow-500' },
    diario: { icon: BookOpen, iconColor: 'bg-pink-500' },
    privado: { icon: EyeOff, iconColor: 'bg-red-500' },
};

// Label for folder type count
const typeLabelMap: Record<FolderType, string> = {
    documentos: 'Documentos',
    hojas: 'Hojas',
    media: 'Archivos',
    notas: 'Notas',
    claves: 'Claves',
    diario: 'Entradas',
    privado: 'Archivos',
};

export function Dashboard({ onFolderClick, onSettingsClick, onStorageClick, onNewFolderClick, folders, onFolderStatusChange }: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

    const filtered = folders.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f1829] pb-20">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-400" size={28} />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Bóveda Confidencial</h1>
                            <Badge variant="green" className="mt-1">
                                ● Biometría Verificada
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onStorageClick}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            title="Almacenamiento"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
                                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                        </button>
                        <button
                            onClick={onSettingsClick}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <Settings className="text-white/60" size={22} />
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar carpetas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="vault-input pl-12"
                    />
                </div>
            </div>

            {/* Folders */}
            <div className="px-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">
                        Mis Carpetas
                        {folders.length > 0 && (
                            <span className="ml-2 text-white/30">({folders.length})</span>
                        )}
                    </h2>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            <Folder size={32} className="text-white/20" />
                        </div>
                        <p className="text-white/40 text-sm font-medium">
                            {searchQuery ? 'No se encontraron carpetas' : 'Aún no tienes carpetas'}
                        </p>
                        {!searchQuery && (
                            <p className="text-white/20 text-xs mt-1">
                                Toca el botón + para crear una
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {filtered.map((folder) => {
                            const { icon, iconColor } = typeIconMap[folder.folderType] ?? { icon: Folder, iconColor: 'bg-blue-500' };
                            const typeLabel = typeLabelMap[folder.folderType] ?? 'Archivos';
                            return (
                                <FolderCard
                                    key={folder.id}
                                    id={folder.id}
                                    icon={icon as any}
                                    iconColor={iconColor}
                                    title={folder.name}
                                    fileCount={folder.itemCount}
                                    fileType={typeLabel}
                                    onClick={() => onFolderClick(folder.name, folder.id, folder.securityLevel)}
                                    onHide={() => onFolderStatusChange(folder.id, 'hidden')}
                                    onArchive={() => onFolderStatusChange(folder.id, 'archived')}
                                    onDelete={() => onFolderStatusChange(folder.id, 'deleted')}
                                    menuOpenId={openMenuId}
                                    onMenuOpen={(id, top, right) => { setOpenMenuId(id); setMenuPos({ top, right }); }}
                                    onMenuClose={() => setOpenMenuId(null)}
                                    menuPos={menuPos}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNewFolderClick}
                className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
            >
                <FolderPlus size={28} className="text-white" />
            </motion.button>
        </div>
    );
}
