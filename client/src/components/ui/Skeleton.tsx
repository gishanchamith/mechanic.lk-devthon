"use client";

import React from 'react';

export function SkeletonCard() {
    return (
        <div className="rounded-2xl bg-white dark:bg-card-dark p-5 shadow-soft border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="flex justify-between items-start mb-3">
                <div className="space-y-2 flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-lg w-1/2"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
            <div className="flex items-end justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div className="space-y-1">
                    <div className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
        </div>
    );
}

export function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
    return (
        <div className={`${width} ${height} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}></div>
    );
}

export function SkeletonHistoryItem() {
    return (
        <div className="rounded-2xl bg-white dark:bg-card-dark p-4 shadow-soft border border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mt-3"></div>
        </div>
    );
}
