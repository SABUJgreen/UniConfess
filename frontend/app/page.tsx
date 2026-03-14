"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useFeed } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import PostCardSkeleton from '../components/PostCardSkeleton';
import api from '../services/api';
import { useQuery } from '@tanstack/react-query';
import {
    Home, TrendingUp, Flame, Sparkles, Compass, Users,
    ArrowRight, Trophy, Shield, Zap,
} from 'lucide-react';

const FILTER_TABS = [
    { id: 'hot', label: 'Hot', icon: <Flame size={15} /> },
    { id: 'new', label: 'New', icon: <Sparkles size={15} /> },
    { id: 'top', label: 'Top', icon: <Trophy size={15} /> },
] as const;

type FeedFilter = 'hot' | 'new' | 'top';

export default function HomePage() {
    const { user } = useAuth();
    const [activeFilter, setActiveFilter] = useState<FeedFilter>('hot');
    const { data, isLoading, error, refetch } = useFeed(activeFilter, 1);

    const { data: colleges } = useQuery({
        queryKey: ['colleges'],
        queryFn: async () => {
            const { data } = await api.get('/colleges');
            return data;
        }
    });

    const sidebarItems = [
        { label: 'Home', icon: <Home size={17} /> },
        { label: 'Popular', icon: <TrendingUp size={17} /> },
        { label: 'Hot', icon: <Flame size={17} /> },
        { label: 'New', icon: <Sparkles size={17} /> },
        { label: 'Explore', icon: <Compass size={17} /> },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_280px] gap-6">

            {/* ── Left Sidebar ── */}
            <aside className="hidden lg:block">
                <div className="bg-card/60 border border-white/10 rounded-2xl p-4 sticky top-24 backdrop-blur-sm">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70 font-semibold mb-3 px-1">
                        Menu
                    </div>
                    <div className="flex flex-col gap-0.5">
                        {sidebarItems.map((item, i) => (
                            <button
                                key={item.label}
                                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all duration-150 animate-slide-right"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <span className="text-muted-foreground/60">{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 mb-3 text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70 font-semibold px-1">
                        Resources
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition-all">
                            <Users size={17} className="text-muted-foreground/60" />
                            Communities
                        </button>
                    </div>
                </div>
            </aside>

            {/* ── Main Feed ── */}
            <section className="space-y-5 min-w-0">

                {/* Welcome Hero — guest only */}
                {!user && (
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-8 sm:p-10 backdrop-blur-sm animate-fade-up">
                        {/* Decorative gradient orbs */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_65%)] pointer-events-none animate-float" />
                        <div className="absolute -bottom-12 -left-8 w-56 h-56 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1),transparent_65%)] pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none" />

                        <div className="relative z-10">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-primary border border-primary/30 bg-primary/10 px-3 py-1 rounded-full mb-5 animate-fade-up">
                                <Shield size={11} />
                                Campus Anonymous Platform
                            </div>

                            {/* Headline */}
                            <h1 className="text-4xl sm:text-5xl font-bold display-font leading-tight mb-3 animate-fade-up anim-delay-100">
                                Welcome to{' '}
                                <span className="text-primary [text-shadow:0_0_40px_rgba(139,92,246,0.55)]">
                                    UniConfess
                                </span>
                            </h1>

                            <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md leading-relaxed animate-fade-up anim-delay-200">
                                Share your confessions, doubts, gossip and placement intel — completely anonymous.
                            </p>

                            {/* CTAs */}
                            <div className="flex gap-3 flex-wrap animate-fade-up anim-delay-300">
                                <Link
                                    href="/login"
                                    className="bg-white/10 text-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/15 transition-all border border-white/20 hover:-translate-y-0.5 inline-flex items-center"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/signup"
                                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-[0_0_24px_rgba(139,92,246,0.5)] inline-flex items-center gap-2 hover:-translate-y-0.5"
                                >
                                    Create Account
                                    <ArrowRight size={15} />
                                </Link>
                            </div>

                            {/* Stats strip */}
                            <div className="flex gap-8 mt-8 pt-6 border-t border-white/5 animate-fade-up anim-delay-400">
                                {[
                                    { val: '10K+', label: 'Posts', icon: <Zap size={14} className="text-primary" /> },
                                    { val: '50+', label: 'Colleges', icon: <Users size={14} className="text-blue-400" /> },
                                    { val: '100%', label: 'Anonymous', icon: <Shield size={14} className="text-green-400" /> },
                                ].map(({ val, label, icon }) => (
                                    <div key={label} className="flex items-start gap-2">
                                        <div className="mt-0.5">{icon}</div>
                                        <div>
                                            <div className="text-lg font-bold text-foreground leading-none">{val}</div>
                                            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Feed header + filter tabs */}
                <div className="flex items-center justify-between gap-4 animate-fade-up anim-delay-100">
                    <h2 className="text-lg font-bold display-font tracking-tight text-foreground">
                        Campus Feed
                    </h2>

                    <div className="flex bg-secondary/60 rounded-full p-1 border border-white/10 backdrop-blur-sm">
                        {FILTER_TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveFilter(tab.id)}
                                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                                    activeFilter === tab.id
                                        ? 'bg-primary text-primary-foreground shadow-[0_0_16px_rgba(139,92,246,0.5)]'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                            >
                                {tab.icon}
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Post list */}
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                                <PostCardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-muted-foreground py-16 bg-card/40 rounded-2xl border border-white/10 animate-fade-in">
                        <Shield className="mx-auto mb-3 text-muted-foreground/40" size={32} />
                        <p>Please log in to view the feed.</p>
                        <Link href="/login" className="text-primary hover:underline text-sm mt-2 inline-block">
                            Log in →
                        </Link>
                    </div>
                ) : data?.posts?.length === 0 ? (
                    <div className="text-center py-20 bg-card/40 rounded-2xl border border-white/10 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/70 mb-4">
                            <Sparkles className="text-muted-foreground" size={22} />
                        </div>
                        <p className="font-semibold display-font text-lg mb-1">No posts yet.</p>
                        <p className="text-muted-foreground text-sm">Be the first to confess something.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {data?.posts?.map((post: any, i: number) => (
                            <div
                                key={post._id}
                                className="animate-fade-up"
                                style={{ animationDelay: `${Math.min(i, 6) * 75}ms` }}
                            >
                                <PostCard post={post} refetch={refetch} />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ── Right Sidebar ── */}
            <aside className="hidden lg:block">
                <div className="bg-card/60 border border-white/10 rounded-2xl p-4 sticky top-24 backdrop-blur-sm animate-fade-up anim-delay-200">
                    <div className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground/70 font-semibold mb-3 px-1">
                        Popular Communities
                    </div>
                    <div className="space-y-2.5">
                        {(colleges || []).slice(0, 6).map((college: any, i: number) => (
                            <div
                                key={college._id}
                                className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-secondary/60 transition-all cursor-pointer group animate-fade-up"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/80 flex items-center justify-center text-xs font-bold text-foreground border border-white/10 shrink-0">
                                    {college.name?.[0] || 'C'}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                                        {college.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">{college.city}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(colleges?.length ?? 0) > 6 && (
                        <button className="mt-4 text-xs text-primary hover:text-primary/80 transition-colors font-medium px-2">
                            See all →
                        </button>
                    )}
                </div>
            </aside>

        </div>
    );
}
