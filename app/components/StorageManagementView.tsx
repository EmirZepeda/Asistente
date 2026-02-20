"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, EyeOff, Archive, Trash2, RotateCcw, Folder, FileText, FileSpreadsheet, Image, Mic, Key, BookOpen } from 'lucide-react';
import type { FolderType } from './NewFolderSheet';

interface ManagedFolder {
    id: string;
    name: string;
    folderType: FolderType;
    status: 'hidden' | 'archived' | 'deleted';
    _count?: { items: number };
}

type Tab = 'hidden' | 'archived' | 'deleted';

const typeIconMap: Record<string, { icon: React.ElementType; color: string }> = {
    documentos: { icon: FileText, color: 'bg-blue-500' },
    hojas: { icon: FileSpreadsheet, color: 'bg-green-500' },
    media: { icon: Image, color: 'bg-orange-500' },
    notas: { icon: Mic, color: 'bg-purple-500' },
    claves: { icon: Key, color: 'bg-yellow-500' },
    diario: { icon: BookOpen, color: 'bg-pink-500' },
    privado: { icon: EyeOff, color: 'bg-red-500' },
};

const tabConfig: Record<Tab, { label: string; icon: React.ElementType; iconClass: string; emptyText: string }> = {
    hidden: { label: 'Ocultos', icon: EyeOff, iconClass: 'text-blue-400', emptyText: 'No hay carpetas ocultas' },
    archived: { label: 'Archivados', icon: Archive, iconClass: 'text-amber-400', emptyText: 'No hay carpetas archivadas' },
    deleted: { label: 'Eliminados', icon: Trash2, iconClass: 'text-red-400', emptyText: 'No hay carpetas eliminadas' },
};

interface StorageManagementViewProps {
    onBack: () => void;
    onRestoreFolder: (folderId: string, folderName: string) => void;
}

export function StorageManagementView({ onBack, onRestoreFolder }: StorageManagementViewProps) {
    const [activeTab, setActiveTab] = useState<Tab>('hidden');
    const [folders, setFolders] = useState<ManagedFolder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState<ManagedFolder | null>(null);

    useEffect(() => {
        fetchFolders(activeTab);
    }, [activeTab]);

    const fetchFolders = async (status: Tab) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/folders?status=${status}`);
            if (res.ok) {
                const data = await res.json();
                setFolders(data);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateStatus = async (folderId: string, status: 'active' | 'deleted') => {
        await fetch(`/api/folders/${folderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        fetchFolders(activeTab);
    };

    const permanentDelete = async (folderId: string) => {
        await fetch(`/api/folders/${folderId}`, { method: 'DELETE' });
        setConfirmDelete(null);
        fetchFolders(activeTab);
    };

    const handleRestore = (folder: ManagedFolder) => {
        updateStatus(folder.id, 'active');
        onRestoreFolder(folder.id, folder.name);
    };

    const tabs: Tab[] = ['hidden', 'archived', 'deleted'];

    return (
        <div className="min-h-screen bg-[#0f1829] text-white">
            {/* Header */}
            <div className="px-6 pt-12 pb-6 bg-[#0f1829]/80 backdrop-blur-xl sticky top-0 z-10 border-b border-white/5">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-white/80" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">Almacenamiento</h1>
                        <p className="text-white/40 text-sm">Gestiona tus carpetas</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                    {tabs.map(tab => {
                        const cfg = tabConfig[tab];
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'text-white/50 hover:text-white'
                                    }`}
                            >
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : folders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                            {React.createElement(tabConfig[activeTab].icon, { size: 28, className: 'text-white/20' })}
                        </div>
                        <p className="text-white/40 text-sm font-medium">{tabConfig[activeTab].emptyText}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-3">
                            Carpetas ({folders.length})
                        </p>
                        {folders.map(folder => {
                            const typeInfo = typeIconMap[folder.folderType] ?? { icon: Folder, color: 'bg-blue-500' };
                            const FolderIcon = typeInfo.icon;
                            return (
                                <div key={folder.id} className="flex items-center gap-4 p-4 bg-[#1a2332] rounded-2xl border border-white/5">
                                    <div className={`w-12 h-12 ${typeInfo.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <FolderIcon size={22} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-semibold truncate">{folder.name}</p>
                                        <p className="text-white/40 text-xs mt-0.5">
                                            {folder._count?.items ?? 0} elementos
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Restore */}
                                        <button
                                            onClick={() => handleRestore(folder)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-lg transition-colors"
                                        >
                                            <RotateCcw size={12} />
                                            Restaurar
                                        </button>
                                        {/* Permanent delete (only for deleted tab) */}
                                        {activeTab === 'deleted' && (
                                            <button
                                                onClick={() => setConfirmDelete(folder)}
                                                className="p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Permanent Delete Confirmation */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1a2332] border border-white/10 rounded-t-3xl p-6 space-y-4">
                        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Trash2 size={22} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold">¿Eliminar permanentemente?</h3>
                                <p className="text-white/50 text-sm truncate max-w-[200px]">{confirmDelete.name}</p>
                            </div>
                        </div>
                        <p className="text-white/40 text-sm">
                            Se eliminarán también todos los archivos dentro de esta carpeta. Esta acción es irreversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmDelete(null)}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => permanentDelete(confirmDelete.id)}
                                className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} />
                                Eliminar todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
