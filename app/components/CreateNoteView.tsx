"use client";

import React, { useState } from 'react';
import { ArrowLeft, Lock, Save, Bold, Italic, List, CheckSquare, Image as ImageIcon, MoreVertical } from 'lucide-react';
import { Badge } from './Badge';

interface CreateNoteViewProps {
    onBack: () => void;
    onSave: (title: string, content: string) => void;
}

export function CreateNoteView({ onBack, onSave }: CreateNoteViewProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (content.trim()) {
            setIsSaving(true);
            await onSave(title || 'Nota sin título', content);
            // We don't verify success here as the parent unmounts us on success,
            // but we can catch errors if we wanted to be robust. 
            // For now, this provides immediate UI feedback.
        }
    };

    const insertFormat = (startTag: string, endTag: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${startTag}${selection}${endTag}${after}`;
        setContent(newText);

        // Reset focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + startTag.length, end + startTag.length);
        }, 0);
    };

    return (
        <div className="min-h-screen bg-[#0f1829] flex flex-col relative">
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0f1829]/80 backdrop-blur-xl sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="text-white/60 hover:text-white transition-colors"
                >
                    Cancelar
                </button>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                    <Lock size={12} className="text-blue-400" />
                    <span className="text-blue-400 text-xs font-bold tracking-wider">CIFRADO</span>
                </div>

                <button
                    onClick={handleSave}
                    disabled={!content.trim() || isSaving}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                >
                    {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Lock size={14} />
                    )}
                    {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
            </div>

            {/* Editor Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto p-6 space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Nota sin título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/20 focus:outline-none"
                        />
                        <div className="flex items-center gap-3 text-white/40 text-xs font-medium">
                            <span className="flex items-center gap-1">
                                📅 {new Date().toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                            <span className="flex items-center gap-1">
                                🕒 {new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    {/* Lined Text Area */}
                    <div className="relative min-h-[50vh]">
                        {/* Lines Background */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
                                backgroundSize: '100% 2.5rem', // Match line-height
                                marginTop: '2.4rem' // Offset first line
                            }}
                        />

                        <textarea
                            ref={textareaRef}
                            placeholder="Escribe tu nota segura aquí..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-full bg-transparent text-white/90 text-lg leading-10 placeholder-white/20 focus:outline-none resize-none font-medium"
                            style={{ minHeight: '50vh' }}
                            autoFocus
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="p-4 border-t border-white/10 bg-[#1a2332]">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => insertFormat('**', '**')}
                            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            title="Bold"
                        >
                            <Bold size={20} />
                        </button>
                        <button
                            onClick={() => insertFormat('_', '_')}
                            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            title="Italic"
                        >
                            <Italic size={20} />
                        </button>
                        <button
                            onClick={() => insertFormat('- ')}
                            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            title="List"
                        >
                            <List size={20} />
                        </button>
                        <button
                            onClick={() => insertFormat('- [ ] ')}
                            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            title="Task List"
                        >
                            <CheckSquare size={20} />
                        </button>
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <button
                            onClick={() => insertFormat('![Image](', ')')}
                            className="p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            title="Insert Image Placeholder"
                        >
                            <ImageIcon size={20} />
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-[#0f1829] hover:bg-[#131c2e] rounded-xl border border-white/10 text-xs font-medium text-blue-400 transition-colors">
                        <Lock size={12} />
                        Seguridad
                    </button>
                </div>
            </div>
        </div>
    );
}
