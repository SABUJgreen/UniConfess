"use client"

import { useState } from 'react';
import { useFeed } from '../../../hooks/usePosts';
import PostCard from '../../../components/PostCard';
import { Loader2, Flame, Sparkles, Trophy } from 'lucide-react';

export default function Feed() {
    const [filter, setFilter] = useState<'hot' | 'new' | 'top'>('hot');
    const { data, isLoading, refetch } = useFeed(filter, 1);

    const filterOptions = [
        { id: 'hot', label: 'Hot', icon: <Flame size={16} /> },
        { id: 'new', label: 'New', icon: <Sparkles size={16} /> },
        { id: 'top', label: 'Top', icon: <Trophy size={16} /> },
    ];

    return (
        <div className="max-w-2xl mx-auto py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold display-font">Campus Feed</h1>

                <div className="flex bg-secondary/70 rounded-full p-1 border border-white/10">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFilter(opt.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === opt.id
                                    ? 'bg-primary text-primary-foreground shadow-[0_0_18px_rgba(255,69,0,0.35)]'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            {opt.icon}
                            <span className="hidden sm:inline">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : data?.posts?.length === 0 ? (
                <div className="text-center py-20 bg-card/60 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/70 mb-4">
                        <Sparkles className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 display-font">No Posts Yet</h3>
                    <p className="text-muted-foreground mb-6">Be the first to share something with the campus.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.posts?.map((post: any) => (
                        <PostCard key={post._id} post={post} refetch={refetch} />
                    ))}
                </div>
            )}
        </div>
    );
}
