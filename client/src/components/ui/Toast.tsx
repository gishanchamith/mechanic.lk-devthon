"use client";

import React, { useEffect, useState } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose: () => void;
}

export function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const bgColor = type === 'success'
        ? 'bg-green-500'
        : type === 'error'
            ? 'bg-red-500'
            : 'bg-primary';

    const icon = type === 'success'
        ? 'check_circle'
        : type === 'error'
            ? 'error'
            : 'info';

    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div className={`${bgColor} text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]`}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
                <span className="text-sm font-bold">{message}</span>
            </div>
        </div>
    );
}
