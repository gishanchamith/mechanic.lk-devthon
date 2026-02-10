import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ServiceCardProps {
    title: string;
    providerName: string;
    price: number;
    rating: number;
    timeEstimate: string; // e.g., "45 mins"
    distance?: string;
    tags?: string[];
    onBook?: () => void;
}

export function ServiceCard({ title, providerName, price, rating, timeEstimate, distance, tags, onBook }: ServiceCardProps) {
    return (
        <Card className="flex flex-col h-full hover:border-primary/50 border-2 border-transparent">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-bold text-lg text-text-main dark:text-white leading-tight">{title}</h3>
                    <p className="text-sm text-text-sub dark:text-gray-400 mt-1">{providerName}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[16px] text-yellow-600 fill-current">star</span>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{rating}</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                {tags?.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-auto flex items-end justify-between border-t border-gray-100 dark:border-gray-700 pt-4">
                <div>
                    <span className="text-2xl font-black text-primary">LKR {price}</span>
                    <p className="text-xs text-text-sub font-medium">{timeEstimate} • {distance}</p>
                </div>
                <Button size="sm" rightIcon="arrow_forward" onClick={onBook}>
                    Book
                </Button>
            </div>
        </Card>
    );
}
