"use client"

import Link from 'next/link';
import { MessageSquare, Share2, MoreHorizontal, Heart, HelpCircle, Briefcase, MessageCircle } from 'lucide-react';
import VoteButtons from './VoteButtons';
import toast from 'react-hot-toast';

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const intervals: [number, string][] = [
        [31536000, 'y'], [2592000, 'mo'], [86400, 'd'],
        [3600, 'h'], [60, 'm'],
    ];
    for (const [secs, label] of intervals) {
        const n = Math.floor(seconds / secs);
        if (n >= 1) return `${n}${label}`;
    }
    return `${Math.floor(seconds)}s`;
};

const categoryConfig: Record<string, {
    badge: string;
    border: string;
    glow: string;
    gradient: string;
    icon: React.ReactNode;
}> = {
    confession: {
        badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        border: '[border-left-color:var(--color-pink-500)]',
        glow: 'hover:shadow-pink-500/10',
        gradient: 'from-pink-500/5',
        icon: <Heart size={10} />,
    },
    doubts: {
        badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        border: '[border-left-color:var(--color-blue-500)]',
        glow: 'hover:shadow-blue-500/10',
        gradient: 'from-blue-500/5',
        icon: <HelpCircle size={10} />,
    },
    placements: {
        badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        border: '[border-left-color:var(--color-green-500)]',
        glow: 'hover:shadow-emerald-500/10',
        gradient: 'from-emerald-500/5',
        icon: <Briefcase size={10} />,
    },
    gossip: {
        badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        border: '[border-left-color:var(--color-yellow-500)]',
        glow: 'hover:shadow-amber-500/10',
        gradient: 'from-amber-500/5',
        icon: <MessageCircle size={10} />,
    },
};

const defaultConfig = {
    badge: 'bg-white/5 text-muted-foreground border-white/10',
    border: '[border-left-color:rgba(255,255,255,0.15)]',
    glow: 'hover:shadow-primary/10',
    gradient: 'from-primary/5',
    icon: null,
};

export default function PostCard({ post, refetch }: { post: any; refetch: () => void }) {
    const config = categoryConfig[post.category] ?? defaultConfig;

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(`${window.location.origin}/post/${post._id}`);
        toast.success('Link copied!');
    };

    return (
        <Link href={`/post/${post._id}`} className="block group/card">
            <article
                className={`
                    relative overflow-hidden cursor-pointer
                    bg-card/80 hover:bg-card/95
                    border border-white/[0.07] border-l-2 ${config.border}
                    rounded-2xl p-5
                    shadow-lg shadow-black/30
                    hover:shadow-xl hover:shadow-black/40 ${config.glow}
                    hover:-translate-y-1
                    transition-all duration-250
                `}
            >
                {/* Category gradient tint */}
                <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                {/* Mouse-follow glow */}
                <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 bg-[radial-gradient(500px_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),rgba(139,92,246,0.04),transparent_60%)] pointer-events-none" />

                {/* Header */}
                <div className="relative flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-violet-900/50 border border-primary/20 shrink-0">
                            <span className="text-[9px] font-bold text-primary-foreground">
                                {post.alias?.[0]?.toUpperCase()}
                            </span>
                        </div>
                        <span className="font-bold text-foreground text-sm">{post.alias}</span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className="text-muted-foreground/70 truncate max-w-[120px] sm:max-w-[200px]" title={post.collegeId?.name}>
                            {post.collegeId?.name || 'Unknown College'}
                        </span>
                        <span className="text-muted-foreground/50">·</span>
                        <span className="text-muted-foreground/70 shrink-0">{timeAgo(post.createdAt)}</span>
                    </div>
                    <button
                        className="text-muted-foreground/40 hover:text-muted-foreground hidden sm:flex opacity-0 group-hover/card:opacity-100 transition-all p-1 rounded-full hover:bg-white/5"
                        onClick={e => e.preventDefault()}
                        aria-label="More options"
                    >
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                {/* Category badge */}
                <div className="relative mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-widest ${config.badge}`}>
                        {config.icon}
                        {post.category}
                    </span>
                </div>

                {/* Content */}
                <p className="relative text-foreground/90 text-sm sm:text-base leading-relaxed whitespace-pre-wrap line-clamp-4 mb-4">
                    {post.content}
                </p>

                {/* Footer actions */}
                <div className="relative flex items-center gap-2">
                    <div onClick={e => e.preventDefault()}>
                        <VoteButtons post={post} onVote={refetch} />
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 text-sm">
                        <MessageSquare size={15} />
                        <span className="font-medium">{post.commentCount ?? 0}</span>
                    </div>

                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-white/5 ml-auto text-sm"
                        aria-label="Copy link"
                    >
                        <Share2 size={15} />
                        <span className="hidden sm:inline font-medium">Share</span>
                    </button>
                </div>
            </article>
        </Link>
    );
}
