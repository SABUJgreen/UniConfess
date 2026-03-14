"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Shield, Heart, HelpCircle, Briefcase, MessageCircle } from 'lucide-react';

const categories = [
    {
        id: 'confession',
        label: 'Confession',
        desc: 'Got a secret? Get it off your chest.',
        icon: Heart,
        color: 'text-pink-400',
        activeBg: 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_16px_rgba(236,72,153,0.2)]',
        hoverBg: 'hover:bg-pink-500/5 hover:border-pink-500/20',
    },
    {
        id: 'doubts',
        label: 'Doubts',
        desc: 'Need help with academics or campus life?',
        icon: HelpCircle,
        color: 'text-blue-400',
        activeBg: 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_16px_rgba(59,130,246,0.2)]',
        hoverBg: 'hover:bg-blue-500/5 hover:border-blue-500/20',
    },
    {
        id: 'placements',
        label: 'Placements',
        desc: 'Interview tips, package leaks, offers.',
        icon: Briefcase,
        color: 'text-emerald-400',
        activeBg: 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_16px_rgba(52,211,153,0.2)]',
        hoverBg: 'hover:bg-emerald-500/5 hover:border-emerald-500/20',
    },
    {
        id: 'gossip',
        label: 'Gossip',
        desc: 'Spill the tea. Keep it civilized.',
        icon: MessageCircle,
        color: 'text-amber-400',
        activeBg: 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.2)]',
        hoverBg: 'hover:bg-amber-500/5 hover:border-amber-500/20',
    },
];

export default function CreatePost() {
    const [category, setCategory] = useState('confession');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const charCount = content.length;
    const maxChars = 1000;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim().length < 10) {
            toast.error('Post content is too short (min 10 chars).');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/posts', { category, content });
            toast.success('Posted anonymously!');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create post');
            setSubmitting(false);
        }
    };

    const activeCat = categories.find(c => c.id === category)!;

    return (
        <div className="max-w-2xl mx-auto py-6 animate-fade-up">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 display-font">Create Post</h1>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Shield size={14} className="text-primary shrink-0" />
                    Your real identity is completely hidden. Post freely under your alias.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category selection */}
                <div className="bg-card/70 p-6 rounded-2xl border border-white/[0.07] backdrop-blur-sm">
                    <label className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                        Select Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map(c => {
                            const Icon = c.icon;
                            const isActive = category === c.id;
                            return (
                                <button
                                    key={c.id}
                                    type="button"
                                    onClick={() => setCategory(c.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 text-left group ${
                                        isActive
                                            ? `${c.activeBg} border-opacity-70`
                                            : `bg-secondary/40 border-white/[0.06] text-muted-foreground ${c.hoverBg} hover:border-opacity-30`
                                    }`}
                                    aria-pressed={isActive}
                                >
                                    <div className="flex items-center gap-2.5 mb-1.5">
                                        <Icon
                                            size={16}
                                            className={`${c.color} ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'} transition-opacity`}
                                        />
                                        <span className={`font-bold text-sm ${isActive ? 'text-foreground' : ''}`}>{c.label}</span>
                                    </div>
                                    <p className="text-xs opacity-60 leading-snug pl-6">{c.desc}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content textarea */}
                <div className="bg-card/70 p-6 rounded-2xl border border-white/[0.07] backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                            Your {activeCat.label}
                        </label>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                            charCount > maxChars * 0.9
                                ? 'text-amber-400 border-amber-500/20 bg-amber-500/10'
                                : 'text-muted-foreground border-white/[0.06] bg-secondary/40'
                        }`}>
                            {charCount}/{maxChars}
                        </span>
                    </div>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={maxChars}
                        placeholder={`What's on your mind? Write your ${activeCat.label.toLowerCase()} here...`}
                        className="w-full h-44 bg-secondary/40 border border-white/[0.06] rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/30 transition-all resize-none text-sm leading-relaxed placeholder:text-muted-foreground/40"
                        aria-label="Post content"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={submitting || content.trim().length < 10}
                        className="bg-primary text-white font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-[0_0_20px_rgba(139,92,246,0.45)] disabled:shadow-none hover:shadow-[0_0_28px_rgba(139,92,246,0.6)]"
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <Shield size={16} />
                                Post Anonymously
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
