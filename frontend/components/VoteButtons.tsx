"use client"

import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VoteButtons({ post, onVote }: { post: any; onVote: () => void }) {
    const [voting, setVoting] = useState(false);
    const [localUpvotes, setLocalUpvotes] = useState<number>(post.upvotes ?? 0);
    const [localDownvotes, setLocalDownvotes] = useState<number>(post.downvotes ?? 0);
    const [userVote, setUserVote] = useState<1 | -1 | 0>(0);
    const [popped, setPopped] = useState<1 | -1 | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        setLocalUpvotes(post.upvotes ?? 0);
        setLocalDownvotes(post.downvotes ?? 0);
    }, [post.upvotes, post.downvotes]);

    const triggerPop = (type: 1 | -1) => {
        setPopped(type);
        setTimeout(() => setPopped(null), 220);
    };

    const handleVote = async (type: 1 | -1) => {
        if (voting || !user) {
            if (!user) toast.error('Please log in to vote');
            return;
        }

        const prevVote = userVote;
        const newVote: 1 | -1 | 0 = prevVote === type ? 0 : type;

        // Optimistic update
        setUserVote(newVote);
        triggerPop(type);

        if (prevVote === 1) setLocalUpvotes(v => v - 1);
        if (prevVote === -1) setLocalDownvotes(v => v - 1);
        if (newVote === 1) setLocalUpvotes(v => v + 1);
        if (newVote === -1) setLocalDownvotes(v => v + 1);

        setVoting(true);
        try {
            await api.post('/votes', { postId: post._id, voteType: type });
            if (onVote) onVote();
        } catch (error: any) {
            // Revert
            setUserVote(prevVote);
            if (prevVote === 1) setLocalUpvotes(v => v + 1);
            if (prevVote === -1) setLocalDownvotes(v => v + 1);
            if (newVote === 1) setLocalUpvotes(v => v - 1);
            if (newVote === -1) setLocalDownvotes(v => v - 1);
            toast.error(error.response?.data?.message || 'Failed to vote');
        } finally {
            setVoting(false);
        }
    };

    const score = localUpvotes - localDownvotes;
    const scoreColor =
        score > 0 ? 'text-emerald-400' :
        score < 0 ? 'text-rose-400' :
        'text-muted-foreground';

    return (
        <div className="flex items-center gap-1 bg-secondary/60 rounded-full px-1.5 py-1 border border-white/[0.06]">
            {/* Upvote */}
            <button
                onClick={(e) => { e.preventDefault(); handleVote(1); }}
                disabled={voting}
                aria-label="Upvote"
                title="Upvote"
                className={`
                    p-1.5 rounded-full transition-all duration-150
                    ${popped === 1 ? 'animate-vote-pop' : ''}
                    ${userVote === 1
                        ? 'text-emerald-400 bg-emerald-500/15 shadow-[0_0_10px_rgba(52,211,153,0.25)]'
                        : 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'
                    }
                    disabled:opacity-50
                `}
            >
                <ArrowBigUp size={18} className={userVote === 1 ? 'fill-emerald-400' : ''} />
            </button>

            {/* Score */}
            <span className={`text-sm font-bold min-w-[2ch] text-center tabular-nums transition-colors duration-150 ${scoreColor}`}>
                {score}
            </span>

            {/* Downvote */}
            <button
                onClick={(e) => { e.preventDefault(); handleVote(-1); }}
                disabled={voting}
                aria-label="Downvote"
                title="Downvote"
                className={`
                    p-1.5 rounded-full transition-all duration-150
                    ${popped === -1 ? 'animate-vote-pop' : ''}
                    ${userVote === -1
                        ? 'text-rose-400 bg-rose-500/15 shadow-[0_0_10px_rgba(248,113,113,0.25)]'
                        : 'text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10'
                    }
                    disabled:opacity-50
                `}
            >
                <ArrowBigDown size={18} className={userVote === -1 ? 'fill-rose-400' : ''} />
            </button>
        </div>
    );
}
