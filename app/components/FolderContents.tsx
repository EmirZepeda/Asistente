"use client";

import React, { useState } from 'react';
import { ArrowLeft, Search, Lock, FileText, Image, File, Sheet, MoreVertical, Star, Clock, Settings as SettingsIcon } from 'lucide-react';
import { Badge } from './Badge';

interface FileItem {
    name: string;
    type: 'pdf' | 'docx' | 'jpg' | 'xlsx';
    accessed: string;
}

interface FolderContentsProps {
    folderName: string;
    onBack: () => void;
    onFileClick: (fileName: string) => void;
}

const fileIcons = {
    pdf: FileText,
    docx: File,
    jpg: Image,
    xlsx: Sheet
};

export function FolderContents({ folderName, onBack, onFileClick }: FolderContentsProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'files' | 'starred' | 'recent'>('files');
    const [timeRemaining, setTimeRemaining] = useState(299); // 4:59 in seconds

    // Sample files
    const files: FileItem[] = [
        { name: 'Property Deed.pdf', type: 'pdf', accessed: '2h ago' },
        { name: 'Employee NDAs.docx', type: 'docx', accessed: '5d ago' },
        { name: 'Life Insurance Policy.pdf', type: 'pdf', accessed: '1mo ago' },
        { name: 'Passport Scan.jpg', type: 'jpg', accessed: '3mo ago' },
        { name: 'Tax Returns 2023.xlsx', type: 'xlsx', accessed: '6mo ago' }
    ];

    // Format time remaining as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Filter files based on search
    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0f1829] pb-20">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <Lock className="text-blue-400" size={20} />
                            <h1 className="text-xl font-bold text-white">{folderName}</h1>
                        </div>
                    </div>

                    {/* Session Timer */}
                    <div className="text-xs text-white/60">
                        Session expires in <span className="text-blue-400 font-semibold">{formatTime(timeRemaining)}</span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                        type="text"
                        placeholder="Search encrypted files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-[#1a2332] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-500/50"
                    />
                </div>
            </div>

            {/* File List */}
            <div className="px-6 space-y-3">
                {filteredFiles.map((file, index) => {
                    const Icon = fileIcons[file.type];
                    return (
                        <button
                            key={index}
                            onClick={() => onFileClick(file.name)}
                            className="w-full vault-card vault-card-hover text-left"
                        >
                            <div className="flex items-center gap-4">
                                {/* File Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${file.type === 'pdf' ? 'bg-red-500/20' :
                                        file.type === 'docx' ? 'bg-blue-500/20' :
                                            file.type === 'jpg' ? 'bg-purple-500/20' :
                                                'bg-green-500/20'
                                    }`}>
                                    <Icon size={24} className={
                                        file.type === 'pdf' ? 'text-red-400' :
                                            file.type === 'docx' ? 'text-blue-400' :
                                                file.type === 'jpg' ? 'text-purple-400' :
                                                    'text-green-400'
                                    } />
                                </div>

                                {/* File Info */}
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold mb-1">{file.name}</h3>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="green" className="text-xs">
                                            Encrypted
                                        </Badge>
                                        <span className="text-white/50 text-xs">Last accessed {file.accessed}</span>
                                    </div>
                                </div>

                                {/* More Options */}
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <MoreVertical className="text-white/40" size={20} />
                                </button>
                            </div>
                        </button>
                    );
                })}

                {filteredFiles.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-white/50">No files found</p>
                    </div>
                )}
            </div>

            {/* Security Notice */}
            <div className="px-6 mt-8">
                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                    <p className="text-xs text-blue-300/80 leading-relaxed">
                        <Lock className="inline mr-1" size={12} />
                        Files in this folder are protected with AES-256 encryption. Session will auto-lock after 5 minutes of inactivity.
                    </p>
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-white/10 px-6 py-4">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    <button
                        onClick={() => setActiveTab('files')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'files' ? 'text-blue-400' : 'text-white/40'}`}
                    >
                        <FileText size={24} />
                        <span className="text-xs font-medium">Files</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('starred')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'starred' ? 'text-blue-400' : 'text-white/40'}`}
                    >
                        <Star size={24} />
                        <span className="text-xs font-medium">Starred</span>
                    </button>

                    <button
                        onClick={() => setActiveTab('recent')}
                        className={`flex flex-col items-center gap-1 ${activeTab === 'recent' ? 'text-blue-400' : 'text-white/40'}`}
                    >
                        <Clock size={24} />
                        <span className="text-xs font-medium">Recent</span>
                    </button>

                    <button
                        className="flex flex-col items-center gap-1 text-white/40"
                    >
                        <SettingsIcon size={24} />
                        <span className="text-xs font-medium">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
