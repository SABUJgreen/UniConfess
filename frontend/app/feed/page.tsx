"use client"

import { useState } from 'react';
import { useFeed } from '../../hooks/usePosts';
import PostCard from '../../components/PostCard';
import PostCardSkeleton from '../../components/PostCardSkeleton';
import { Sparkles, Flame, Trophy } from 'lucide-react';

const filterOptions = [
    { id: 'hot',  label: 'Hot',  icon: <Flame  size={15} /> },
    { id: 'new',  label: 'New',  icon: <Sparkles size={15} /> },
    { id: 'top',  label: 'Top',  icon: <Trophy  size={15} /> },
] as const;

type FeedFilter = 'hot' | 'new' | 'top';

export default function Feed() {
    const [filter, setFilter] = useState<FeedFilter>('hot');
    const { data, isLoading, refetch } = useFeed(filter, 1);

    return (
        <div className="max-w-2xl mx-auto py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 gap-4">
                <h1 className="text-3xl font-bold display-font">Campus Feed</h1>

                <div className="flex bg-secondary/60 rounded-full p-1 border border-white/[0.06] backdrop-blur-sm">
                    {filterOptions.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setFilter(opt.id)}
                            aria-pressed={filter === opt.id}
                            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                filter === opt.id
                                    ? 'bg-primary text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]'
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
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
                            <PostCardSkeleton />
                        </div>
                    ))}
                </div>
            ) : data?.posts?.length === 0 ? (
                <div className="text-center py-20 bg-card/60 rounded-2xl border border-white/[0.07] backdrop-blur-sm animate-fade-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/70 mb-4">
                        <Sparkles className="text-muted-foreground" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2 display-font">No Posts Yet</h3>
                    <p className="text-muted-foreground text-sm">Be the first to share something with the campus.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data?.posts?.map((post: any, i: number) => (
                        <div
                            key={post._id}
                            className="animate-fade-up"
                            style={{ animationDelay: `${Math.min(i, 7) * 70}ms` }}
                        >
                            <PostCard key={post._id} post={post} refetch={refetch} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
