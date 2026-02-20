"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MoreVertical, FileText, Mic, Image as ImageIcon, ScanLine, Play, Pause, Lock, Trash2 } from 'lucide-react';
import { Badge } from './Badge';
import { CreateNoteView } from './CreateNoteView';
import { VoiceRecorderView } from './VoiceRecorderView';
import { CameraView } from './CameraView';
import { ScannerView } from './ScannerView';
import { ItemViewer } from './ItemViewer';

interface FolderDetailViewProps {
    folderId: string;
    folderName: string;
    securityLevel: 'standard' | 'enhanced' | 'maximum';
    onBack: () => void;
}

interface StoredItem {
    id: string;
    type: 'note' | 'voice' | 'photo' | 'scan';
    title: string;
    description: string | null;
    timestamp: string;
    size: string | null;
    content?: string;
    fileUrl?: string;
    duration?: string;
    createdAt: string;
}

export function FolderDetailView({ folderId, folderName, securityLevel, onBack }: FolderDetailViewProps) {
    const [items, setItems] = useState<StoredItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [creationMode, setCreationMode] = useState<null | 'note' | 'voice' | 'photo' | 'scan'>(null);
    const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
    const [viewingItem, setViewingItem] = useState<StoredItem | null>(null);
    const [itemToDelete, setItemToDelete] = useState<StoredItem | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [folderId]);

    const fetchItems = async () => {
        try {
            const response = await fetch(`/api/folders/${folderId}/items`);
            if (response.ok) {
                const data = await response.json();
                setItems(data.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    size: item.fileSize || '1 KB'
                })));
            }
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveNote = async (title: string, content: string) => {
        try {
            const response = await fetch(`/api/folders/${folderId}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'note',
                    title: title,
                    content: content,
                    description: content.substring(0, 30) + (content.length > 30 ? '...' : '')
                })
            });

            if (response.ok) {
                fetchItems();
                setCreationMode(null);
            }
        } catch (error) {
            console.error('Failed to save note:', error);
        }
    };

    const handleSaveFile = async (file: Blob, type: 'voice' | 'photo' | 'scan', extraData?: { duration?: string }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            // Default titles based on type
            const title = type === 'voice' ? 'Nota de Voz' : type === 'photo' ? 'Foto Segura' : 'Documento Escaneado';
            formData.append('title', title);

            if (extraData?.duration) {
                formData.append('duration', extraData.duration);
            }

            const response = await fetch(`/api/folders/${folderId}/items`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                fetchItems();
                setCreationMode(null);
            }
        } catch (error) {
            console.error(`Failed to save ${type}:`, error);
        }
    };

    const toggleAudioPlayback = (itemId: string) => {
        if (playingAudioId === itemId) {
            setPlayingAudioId(null);
        } else {
            setPlayingAudioId(itemId);
        }
    };

    const handleDeleteItem = async () => {
        if (!itemToDelete) return;
        setIsDeleting(true);
        // Optimistic update
        setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
        try {
            await fetch(`/api/folders/${folderId}/items/${itemToDelete.id}`, { method: 'DELETE' });
        } catch (error) {
            console.error('Failed to delete item:', error);
            // Rollback on error
            fetchItems();
        } finally {
            setIsDeleting(false);
            setItemToDelete(null);
        }
    };

    // --- Render Creation Views ---
    if (creationMode === 'note') {
        return <CreateNoteView onBack={() => setCreationMode(null)} onSave={handleSaveNote} />;
    }
    if (creationMode === 'voice') {
        return <VoiceRecorderView onBack={() => setCreationMode(null)} onSave={(blob, duration) => handleSaveFile(blob, 'voice', { duration })} />;
    }
    if (creationMode === 'photo') {
        return <CameraView onBack={() => setCreationMode(null)} onSave={(blob) => handleSaveFile(blob, 'photo')} />;
    }
    if (creationMode === 'scan') {
        return <ScannerView onBack={() => setCreationMode(null)} onSave={(blob) => handleSaveFile(blob, 'scan')} />;
    }

    // --- Main Folder List View ---
    return (
        <div className="flex flex-col h-full bg-[#0f1829] text-white">
            {viewingItem && (
                <ItemViewer item={viewingItem} onClose={() => setViewingItem(null)} />
            )}

            {/* Delete Confirmation Sheet */}
            {itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-[#1a2332] border border-white/10 rounded-t-3xl p-6 space-y-4">
                        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                                <Trash2 size={22} className="text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-base">¿Eliminar este elemento?</h3>
                                <p className="text-white/50 text-sm truncate max-w-[220px]">{itemToDelete.title}</p>
                            </div>
                        </div>
                        <p className="text-white/40 text-sm">
                            Esta acción no se puede deshacer. El elemento se eliminará permanentemente.
                        </p>
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={() => setItemToDelete(null)}
                                className="flex-1 py-3.5 rounded-xl border border-white/10 text-white/70 font-semibold text-sm hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteItem}
                                disabled={isDeleting}
                                className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Trash2 size={16} />
                                )}
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-6 py-6 flex flex-col gap-6 border-b border-white/5 bg-[#0f1829]/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors"
                    >
                        <ArrowLeft className="text-white/80" size={24} />
                    </button>
                    <div className="flex gap-3">
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <Search className="text-white/60" size={20} />
                        </button>
                        <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <MoreVertical className="text-white/60" size={20} />
                        </button>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">{folderName}</h1>
                        <Badge variant={securityLevel === 'enhanced' ? 'purple' : securityLevel === 'maximum' ? 'red' : 'blue'}>
                            {securityLevel.toUpperCase()}
                        </Badge>
                    </div>
                    <p className="text-white/40 text-sm font-medium">
                        {items.length} elementos • Cifrado
                    </p>
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-32">
                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-white/40 space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                            <Search size={32} />
                        </div>
                        <p>Sin elementos guardados aún</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setViewingItem(item)}
                            className="group p-4 bg-[#1a2332] hover:bg-[#1f2b3e] rounded-2xl border border-white/5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === 'note' ? 'bg-blue-500/10 text-blue-400' :
                                    item.type === 'voice' ? 'bg-purple-500/10 text-purple-400' :
                                        item.type === 'photo' ? 'bg-orange-500/10 text-orange-400' :
                                            'bg-blue-500/10 text-blue-400' // scan
                                    }`}>
                                    {item.type === 'note' && <FileText size={24} />}
                                    {item.type === 'voice' && <Mic size={24} />}
                                    {item.type === 'photo' && <ImageIcon size={24} />}
                                    {item.type === 'scan' && <ScanLine size={24} />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-white truncate pr-2">
                                            {item.title}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <Lock size={12} className="text-white/30" />
                                            <span className="text-xs font-medium text-white/40 whitespace-nowrap">
                                                {item.timestamp}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setItemToDelete(item);
                                                }}
                                                className="p-1 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-white/60 mt-1 line-clamp-2 leading-relaxed">
                                        {item.description || 'Sin descripción'}
                                    </p>

                                    {/* Footer / Metadata */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs font-medium text-white/30 bg-white/5 px-2 py-0.5 rounded-md">
                                            {item.size || '0 KB'}
                                        </span>
                                        {item.type === 'voice' && item.duration && (
                                            <span className="text-xs font-medium text-purple-400/80 bg-purple-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                <div className="w-1 h-1 rounded-full bg-purple-400" />
                                                {item.duration}
                                            </span>
                                        )}
                                        {item.type === 'voice' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleAudioPlayback(item.id);
                                                }}
                                                className="ml-auto p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 transition-colors"
                                            >
                                                {playingAudioId === item.id ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                                                {playingAudioId === item.id && (
                                                    <audio
                                                        src={item.fileUrl}
                                                        autoPlay
                                                        onEnded={() => setPlayingAudioId(null)}
                                                        className="hidden"
                                                    />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Bar */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-[#1a2332]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-20">
                <button
                    onClick={() => setCreationMode('note')}
                    className="flex flex-col items-center gap-1 p-3 min-w-[4.5rem] rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    <FileText size={24} />
                    <span className="text-[10px] font-medium">Texto</span>
                </button>

                <div className="w-px h-8 bg-white/10" />

                <button
                    onClick={() => setCreationMode('voice')}
                    className="flex flex-col items-center gap-1 p-3 min-w-[4.5rem] rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    <Mic size={24} />
                    <span className="text-[10px] font-medium">Voz</span>
                </button>

                <div className="w-px h-8 bg-white/10" />

                <button
                    onClick={() => setCreationMode('photo')}
                    className="flex flex-col items-center gap-1 p-3 min-w-[4.5rem] rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    <ImageIcon size={24} />
                    <span className="text-[10px] font-medium">Foto</span>
                </button>

                <div className="w-px h-8 bg-white/10" />

                <button
                    onClick={() => setCreationMode('scan')}
                    className="flex flex-col items-center gap-1 p-3 min-w-[4.5rem] rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all active:scale-95"
                >
                    <ScanLine size={24} />
                    <span className="text-[10px] font-medium">Escanear</span>
                </button>
            </div>
        </div>
    );
}
