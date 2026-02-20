"use client";

import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { FolderPlus, FileText, FileSpreadsheet, Image, Mic, ScanLine, Key, BookOpen, Shield, EyeOff } from 'lucide-react';

export type FolderType = 'documentos' | 'hojas' | 'media' | 'notas' | 'claves' | 'diario' | 'privado';

interface FolderTypeOption {
    id: FolderType;
    icon: React.ElementType;
    iconColor: string;
    bgColor: string;
    label: string;
    description: string;
}

const folderTypes: FolderTypeOption[] = [
    {
        id: 'documentos',
        icon: FileText,
        iconColor: 'text-blue-400',
        bgColor: 'bg-blue-500',
        label: 'Bóveda de Documentos',
        description: 'PDF, Word, Contratos',
    },
    {
        id: 'hojas',
        icon: FileSpreadsheet,
        iconColor: 'text-green-400',
        bgColor: 'bg-green-500',
        label: 'Hojas de Cálculo',
        description: 'Excel, CSV, Financieros',
    },
    {
        id: 'media',
        icon: Image,
        iconColor: 'text-orange-400',
        bgColor: 'bg-orange-500',
        label: 'Media Segura',
        description: 'Imágenes, Videos, Evidencias',
    },
    {
        id: 'notas',
        icon: Mic,
        iconColor: 'text-purple-400',
        bgColor: 'bg-purple-500',
        label: 'Notas y Grabaciones',
        description: 'Apuntes rápidos, Ideas, Audios',
    },
    {
        id: 'claves',
        icon: Key,
        iconColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500',
        label: 'Contraseñas y Claves',
        description: 'Accesos, Tokens, PINs',
    },
    {
        id: 'diario',
        icon: BookOpen,
        iconColor: 'text-pink-400',
        bgColor: 'bg-pink-500',
        label: 'Diario Personal',
        description: 'Entradas privadas, Reflexiones',
    },
    {
        id: 'privado',
        icon: EyeOff,
        iconColor: 'text-red-400',
        bgColor: 'bg-red-500',
        label: 'Carpeta Privada',
        description: 'Contenido sensible, Uso general',
    },
];

interface NewFolderSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (folderName: string, folderType: FolderType) => void;
}

export function NewFolderSheet({ isOpen, onClose, onCreate }: NewFolderSheetProps) {
    const [folderName, setFolderName] = useState('');
    const [selectedType, setSelectedType] = useState<FolderType>('documentos');

    const handleCreate = () => {
        if (folderName.trim()) {
            onCreate(folderName.trim(), selectedType);
            setFolderName('');
            setSelectedType('documentos');
            onClose();
        }
    };

    const selected = folderTypes.find(t => t.id === selectedType)!;

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="px-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Nueva Carpeta Segura</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-sm font-medium"
                    >
                        Cerrar
                    </button>
                </div>

                {/* Folder Name */}
                <div className="mb-6">
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 block">
                        Nombre de la Carpeta
                    </label>
                    <div className="relative">
                        <FolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                        <input
                            type="text"
                            placeholder="Nombre de la carpeta (ej. Finanzas)"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-[#0f1829] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                        />
                    </div>
                </div>

                {/* Folder Type */}
                <div className="mb-6">
                    <label className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3 block">
                        Tipo de Carpeta
                    </label>
                    <div className="space-y-2">
                        {folderTypes.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`w-full p-3.5 rounded-xl border transition-all flex items-center gap-3 ${isSelected
                                        ? 'bg-blue-500/10 border-blue-500'
                                        : 'bg-[#0f1829] border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? `${type.bgColor}/20` : 'bg-white/5'}`}>
                                        <Icon size={18} className={isSelected ? type.iconColor : 'text-white/40'} />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-white/70'}`}>{type.label}</p>
                                        <p className="text-white/40 text-xs">{type.description}</p>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-white/30'}`}>
                                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 mb-5 px-3 py-2.5 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <Shield size={14} className="text-blue-400 flex-shrink-0" />
                    <p className="text-blue-300/80 text-xs">
                        Protegida con Face ID · Cifrado AES-256
                    </p>
                </div>

                {/* Create Button */}
                <button
                    onClick={handleCreate}
                    disabled={!folderName.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/30 text-white px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <FolderPlus size={20} />
                    Crear Carpeta
                </button>
            </div>
        </BottomSheet>
    );
}
