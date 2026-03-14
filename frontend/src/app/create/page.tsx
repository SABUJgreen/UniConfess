"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import { Loader2, Info } from 'lucide-react';

export default function CreatePost() {
    const [category, setCategory] = useState('confession');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const router = useRouter();

    const categories = [
        { id: 'confession', label: 'Confession', desc: 'Got a secret? Get it off your chest.' },
        { id: 'doubts', label: 'Doubts', desc: 'Need help with academics or campus life?' },
        { id: 'placements', label: 'Placements', desc: 'Interview tips, package leaks, offers.' },
        { id: 'gossip', label: 'Gossip', desc: 'Spill the tea. Keep it civilized.' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (content.trim().length < 10) {
            toast.error('Post content is too short.');
            return;
        }

        setSubmitting(true);

        try {
            await api.post('/posts', { category, content });
            toast.success('Posted successfully. Anonymity maintained.');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create post');
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-6">
            <h1 className="text-3xl font-bold mb-2 display-font">Create Post</h1>
            <p className="text-muted-foreground mb-8 text-sm flex items-center gap-2">
                <Info size={16} className="text-primary" />
                This post will appear in your college and the global feed. Your real identity is completely hidden.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 bg-card/70 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-xl shadow-black/20 backdrop-blur-sm animate-fade-up">

                <div className="space-y-4">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Select Category</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categories.map(c => (
                            <div
                                key={c.id}
                                onClick={() => setCategory(c.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${category === c.id
                                        ? 'bg-primary/10 border-primary text-foreground shadow-[0_0_18px_rgba(255,69,0,0.25)]'
                                        : 'bg-secondary/60 border-white/10 text-muted-foreground hover:bg-secondary'
                                    }`}
                            >
                                <div className="font-bold mb-1">{c.label}</div>
                                <div className="text-xs opacity-80">{c.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                    <label className="text-sm font-semibold tracking-wide uppercase text-muted-foreground flex justify-between">
                        <span>Content</span>
                        <span className="text-xs font-normal opacity-70 border px-2 py-0.5 rounded-full">Markdown not supported</span>
                    </label>
                    <textarea
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={`What's on your mind? Type your ${category} here...`}
                        className="w-full h-40 bg-secondary/60 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none text-base leading-relaxed"
                    />
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={submitting || content.trim().length === 0}
                        className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-primary/90 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(255,69,0,0.3)] disabled:shadow-none"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Post Anonymously'}
                    </button>
                </div>
            </form>
        </div>
    );
}
