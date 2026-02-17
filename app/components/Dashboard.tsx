"use client";

import React, { useState } from 'react';
import { Shield, Settings, Search, Folder, FileText, Key, Lightbulb, FileSpreadsheet, Plus, FolderPlus } from 'lucide-react';
import { Badge } from './Badge';
import { FolderCard } from './FolderCard';
import { motion } from 'framer-motion';

interface DashboardProps {
    onFolderClick: (folder: string) => void;
    onSettingsClick: () => void;
    onNewFolderClick: () => void;
}

export function Dashboard({ onFolderClick, onSettingsClick, onNewFolderClick }: DashboardProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const recentAccess = [
        { icon: Folder, iconColor: 'bg-blue-500', title: 'Work Projects', count: 12, type: 'Encrypted Files' },
        { icon: FileSpreadsheet, iconColor: 'bg-green-500', title: 'Financials', count: 8, type: 'Encrypted Files' },
    ];

    const folders = [
        { icon: FileText, iconColor: 'bg-purple-500', title: 'Personal Journal', count: 365, type: 'Entries' },
        { icon: Key, iconColor: 'bg-yellow-500', title: 'Passwords', count: 42, type: 'Keys' },
        { icon: FileText, iconColor: 'bg-red-500', title: 'Legal Docs', count: 5, type: 'PDF Files' },
        { icon: Lightbulb, iconColor: 'bg-cyan-500', title: 'Secret Ideas', count: 14, type: 'Notes' },
    ];

    return (
        <div className="min-h-screen bg-[#0f1829] pb-20">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Shield className="text-blue-400" size={28} />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Confidential Vault</h1>
                            <Badge variant="green" className="mt-1">
                                ● Biometrics Verified
                            </Badge>
                        </div>
                    </div>
                    <button
                        onClick={onSettingsClick}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <Settings className="text-white/60" size={24} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                    <input
                        type="text"
                        placeholder="Search secure notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="vault-input pl-12"
                    />
                </div>
            </div>

            {/* Recent Access */}
            <div className="px-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider">Recent Access</h2>
                    <button className="text-xs font-semibold text-blue-400 hover:text-blue-300">View All</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {recentAccess.map((folder, index) => (
                        <FolderCard
                            key={index}
                            icon={folder.icon}
                            iconColor={folder.iconColor}
                            title={folder.title}
                            fileCount={folder.count}
                            fileType={folder.type}
                            onClick={() => onFolderClick(folder.title)}
                        />
                    ))}
                </div>
            </div>

            {/* Folders */}
            <div className="px-6 mb-6">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Folders</h2>
                <div className="grid grid-cols-2 gap-4">
                    {folders.map((folder, index) => (
                        <FolderCard
                            key={index}
                            icon={folder.icon}
                            iconColor={folder.iconColor}
                            title={folder.title}
                            fileCount={folder.count}
                            fileType={folder.type}
                            onClick={() => onFolderClick(folder.title)}
                        />
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="px-6">
                <h2 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-4">Recent Activity</h2>
                <div className="vault-card">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <FileText size={20} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-medium text-sm">Q4 Project Budget</p>
                            <p className="text-white/40 text-xs">Updated 2 mins ago</p>
                        </div>
                    </div>
                </div>
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
