"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#1a2332] rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
                    >
                        {/* Handle */}
                        <div className="flex justify-center pt-3 pb-4">
                            <div className="w-12 h-1 bg-white/20 rounded-full" />
                        </div>

                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
