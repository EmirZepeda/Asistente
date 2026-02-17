"use client";

import React from 'react';
import { FileText, Mic, Camera, Paperclip, ScanLine, ChevronRight } from 'lucide-react';
import { BottomSheet } from './BottomSheet';

interface NewEntrySheetProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewEntrySheet({ isOpen, onClose }: NewEntrySheetProps) {
    const entryTypes = [
        {
            icon: FileText,
            title: 'Text Note',
            description: 'Standard encrypted text',
            color: 'bg-blue-500'
        },
        {
            icon: Mic,
            title: 'Voice Memo',
            description: 'Secure audio recording',
            color: 'bg-blue-500'
        },
        {
            icon: Camera,
            title: 'Secret Photo',
            description: 'Direct to vault camera',
            color: 'bg-blue-500'
        },
        {
            icon: Paperclip,
            title: 'Secure Attachment',
            description: 'Encrypted file upload',
            color: 'bg-blue-500'
        },
        {
            icon: ScanLine,
            title: 'Scan Document',
            description: 'Built-in OCR scanner',
            color: 'bg-blue-500'
        }
    ];

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose}>
            <div className="px-6 pb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">New Secure Entry</h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-sm font-medium"
                    >
                        Close
                    </button>
                </div>

                <div className="space-y-3">
                    {entryTypes.map((entry, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                // Handle entry creation
                                onClose();
                            }}
                            className="w-full flex items-center gap-4 p-4 bg-[#1e293b] hover:bg-[#243447] rounded-xl border border-white/10 transition-all group"
                        >
                            <div className={`w-12 h-12 ${entry.color} rounded-xl flex items-center justify-center`}>
                                <entry.icon size={24} className="text-white" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="text-white font-semibold">{entry.title}</p>
                                <p className="text-white/50 text-sm">{entry.description}</p>
                            </div>
                            <ChevronRight className="text-white/30 group-hover:text-white/60 transition-colors" size={20} />
                        </button>
                    ))}
                </div>
            </div>
        </BottomSheet>
    );
}
