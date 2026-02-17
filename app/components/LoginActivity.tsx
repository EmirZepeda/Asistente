"use client";

import React, { useState } from 'react';
import { ArrowLeft, Filter, Smartphone, Laptop, MapPin, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from './Badge';

interface LoginActivity {
    id: string;
    device: string;
    deviceType: 'mobile' | 'desktop';
    location: string;
    action: string;
    time: string;
    status: 'success' | 'safe' | 'suspicious';
}

interface LoginActivityProps {
    onBack: () => void;
}

export function LoginActivity({ onBack }: LoginActivityProps) {
    const [filter, setFilter] = useState<'all' | 'success' | 'suspicious'>('all');

    const activities: LoginActivity[] = [
        {
            id: '1',
            device: 'iPhone 14 Pro',
            deviceType: 'mobile',
            location: 'San Francisco, CA',
            action: 'Face ID login successful',
            time: '2 mins ago',
            status: 'success'
        },
        {
            id: '2',
            device: 'MacBook Pro',
            deviceType: 'desktop',
            location: 'San Francisco, CA',
            action: 'Password login attempt',
            time: 'Yesterday',
            status: 'safe'
        },
        {
            id: '3',
            device: 'Windows Desktop',
            deviceType: 'desktop',
            location: 'New York, NY',
            action: 'Failed login attempt (3x)',
            time: '2 days ago',
            status: 'suspicious'
        },
        {
            id: '4',
            device: 'iPad Air',
            deviceType: 'mobile',
            location: 'San Francisco, CA',
            action: 'Touch ID login successful',
            time: '3 days ago',
            status: 'success'
        },
        {
            id: '5',
            device: 'Android Phone',
            deviceType: 'mobile',
            location: 'Los Angeles, CA',
            action: 'Fingerprint login successful',
            time: '5 days ago',
            status: 'success'
        }
    ];

    const filteredActivities = filter === 'all'
        ? activities
        : activities.filter(a => a.status === filter);

    return (
        <div className="min-h-screen bg-[#0f1829] pb-8">
            {/* Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Login/Security Activity</h1>
                            <p className="text-white/50 text-sm mt-1">Monitor all access attempts</p>
                        </div>
                    </div>

                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                        <Filter className="text-white/60" size={24} />
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('success')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'success'
                                ? 'bg-green-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        Successful
                    </button>
                    <button
                        onClick={() => setFilter('suspicious')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'suspicious'
                                ? 'bg-red-500 text-white'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        Suspicious
                    </button>
                </div>
            </div>

            {/* Activity List */}
            <div className="px-6 space-y-3">
                {filteredActivities.map((activity) => {
                    const DeviceIcon = activity.deviceType === 'mobile' ? Smartphone : Laptop;

                    return (
                        <div key={activity.id} className="vault-card">
                            <div className="flex items-start gap-4">
                                {/* Device Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.status === 'success' ? 'bg-green-500/20' :
                                        activity.status === 'suspicious' ? 'bg-red-500/20' :
                                            'bg-blue-500/20'
                                    }`}>
                                    <DeviceIcon size={24} className={
                                        activity.status === 'success' ? 'text-green-400' :
                                            activity.status === 'suspicious' ? 'text-red-400' :
                                                'text-blue-400'
                                    } />
                                </div>

                                {/* Activity Info */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-white font-semibold">{activity.device}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <MapPin size={14} className="text-white/40" />
                                                <span className="text-white/50 text-sm">{activity.location}</span>
                                            </div>
                                        </div>
                                        <span className="text-white/40 text-xs">{activity.time}</span>
                                    </div>

                                    <p className="text-white/70 text-sm mb-3">{activity.action}</p>

                                    {/* Status Badge & Actions */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {activity.status === 'success' && (
                                                <Badge variant="green" className="text-xs">
                                                    ● Verified
                                                </Badge>
                                            )}
                                            {activity.status === 'safe' && (
                                                <Badge variant="blue" className="text-xs">
                                                    ● Safe
                                                </Badge>
                                            )}
                                            {activity.status === 'suspicious' && (
                                                <Badge variant="red" className="text-xs">
                                                    <AlertTriangle size={12} />
                                                    Suspicious
                                                </Badge>
                                            )}
                                        </div>

                                        {activity.status !== 'success' && (
                                            <div className="flex gap-2">
                                                {activity.status === 'suspicious' ? (
                                                    <>
                                                        <button className="text-red-400 text-xs font-semibold hover:text-red-300 transition-colors">
                                                            Report
                                                        </button>
                                                        <span className="text-white/20">•</span>
                                                        <button className="text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors">
                                                            Mark as Safe
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors">
                                                        Mark as Safe
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Security Info */}
            <div className="px-6 mt-8">
                <div className="vault-card bg-blue-500/5 border-blue-500/20">
                    <div className="flex items-start gap-3">
                        <Shield className="text-blue-400 mt-0.5" size={20} />
                        <div>
                            <h4 className="text-white font-semibold text-sm mb-1">Security Tip</h4>
                            <p className="text-blue-200/70 text-xs leading-relaxed">
                                Review your login activity regularly. Report any suspicious attempts immediately to secure your account.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
