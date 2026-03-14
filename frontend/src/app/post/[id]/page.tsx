"use client"

import { use, useState } from 'react';
import { usePost, useComments } from '../../../../hooks/usePosts';
import PostCard from '../../../../components/PostCard';
import { Loader2, MessageSquareText } from 'lucide-react';
import api from '../../../../services/api';
import toast from 'react-hot-toast';


const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y";
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mo";
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m";
    return Math.floor(seconds) + "s";
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
            await api.post('/comments', {
                postId: id,
                content: commentContent
            });
            toast.success('Comment added anonymously');
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
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-2 display-font">Post not found</h2>
                <p className="text-muted-foreground">It may have been deleted.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-6">
            <PostCard post={post} refetch={refetchPost} />

            <div className="mt-8 mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2 display-font">
                    <MessageSquareText size={20} className="text-primary" />
                    Comments ({post.commentCount})
                </h3>
            </div>

            <form onSubmit={handleCommentSubmit} className="mb-8 flex gap-3">
                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Add an anonymous comment..."
                    className="flex-grow bg-secondary/60 border border-white/10 rounded-full px-5 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                />
                <button
                    type="submit"
                    disabled={submitting || !commentContent.trim()}
                    className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all disabled:opacity-50 hover:-translate-y-0.5"
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Post'}
                </button>
            </form>

            <div className="space-y-4 pt-2 border-t border-white/5">
                {commentsLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                ) : comments?.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        No comments yet. Be the first to start the discussion.
                    </div>
                ) : (
                    comments?.map((comment: any) => (
                        <div key={comment._id} className="bg-card/70 p-4 rounded-2xl border border-white/10 shadow-lg shadow-black/20">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-bold text-sm">{comment.alias}</span>
                                <span className="text-xs text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                {comment.content}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
