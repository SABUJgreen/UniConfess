"use client"

import { use, useState } from 'react';
import { usePost, useComments } from '../../../hooks/usePosts';
import PostCard from '../../../components/PostCard';
import { Loader2, MessageSquareText, Send, ArrowLeft } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
        if (n >= 1) return `${n}${label} ago`;
    }
    return 'just now';
};

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
    const [commentContent, setCommentContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { id } = use(params);

    const { data: post, isLoading: postLoading, refetch: refetchPost } = usePost(id);
    const { data: comments, isLoading: commentsLoading, refetch: refetchComments } = useComments(id);

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        setSubmitting(true);
        try {
            await api.post('/comments', { postId: id, content: commentContent });
            toast.success('Comment posted anonymously');
            setCommentContent('');
            refetchComments();
            refetchPost();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to add comment');
        } finally {
            setSubmitting(false);
        }
    };

    if (postLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="animate-spin text-primary" size={36} />
                <p className="text-sm text-muted-foreground">Loading post...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-24 animate-fade-up">
                <h2 className="text-2xl font-bold mb-2 display-font">Post not found</h2>
                <p className="text-muted-foreground mb-6">It may have been deleted.</p>
                <Link href="/" className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                    ← Back to Feed
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-6 animate-fade-up">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 group"
            >
                <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Feed
            </Link>

            <PostCard post={post} refetch={refetchPost} />

            {/* Comments header */}
            <div className="mt-8 mb-5 flex items-center gap-2">
                <MessageSquareText size={18} className="text-primary" />
                <h3 className="text-base font-bold display-font">
                    {post.commentCount ?? 0} {post.commentCount === 1 ? 'Comment' : 'Comments'}
                </h3>
            </div>

            {/* Comment input */}
            <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="relative flex items-center gap-3 bg-secondary/60 border border-white/[0.07] rounded-2xl p-2 pl-4 focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all duration-200">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/30 to-violet-900/50 border border-primary/20 shrink-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-white">?</span>
                    </div>
                    <input
                        type="text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Write an anonymous comment..."
                        className="flex-grow bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none py-1.5"
                        aria-label="Comment input"
                    />
                    <button
                        type="submit"
                        disabled={submitting || !commentContent.trim()}
                        className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-40 disabled:hover:translate-y-0 hover:-translate-y-0.5 shadow-[0_0_14px_rgba(139,92,246,0.4)] disabled:shadow-none shrink-0"
                        aria-label="Post comment"
                    >
                        {submitting ? (
                            <Loader2 className="animate-spin" size={16} />
                        ) : (
                            <>
                                <Send size={14} />
                                <span className="hidden sm:inline">Post</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Comments list */}
            <div className="space-y-3 border-t border-white/[0.04] pt-4">
                {commentsLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-muted-foreground/50" size={24} />
                    </div>
                ) : comments?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground/60 text-sm">
                        <MessageSquareText size={28} className="mx-auto mb-3 opacity-30" />
                        No comments yet — start the discussion!
                    </div>
                ) : (
                    comments?.map((comment: any, i: number) => (
                        <div
                            key={comment._id}
                            className="bg-card/60 hover:bg-card/80 p-4 rounded-xl border border-white/[0.06] transition-all duration-150 animate-fade-up"
                            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                        >
                            <div className="flex justify-between items-center mb-2 gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/25 to-violet-900/40 border border-primary/15 flex items-center justify-center shrink-0">
                                        <span className="text-[9px] font-bold text-primary">
                                            {comment.alias?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">{comment.alias}</span>
                                </div>
                                <span className="text-xs text-muted-foreground/60 shrink-0">{timeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed pl-8">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
