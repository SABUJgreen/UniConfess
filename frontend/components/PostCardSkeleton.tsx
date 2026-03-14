export default function PostCardSkeleton() {
    return (
        <div className="bg-card/80 p-5 rounded-2xl border border-white/[0.07] border-l-2 [border-left-color:rgba(255,255,255,0.1)] shadow-lg shadow-black/20 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4">
                <div className="h-5 w-5 rounded-full animate-shimmer shrink-0" />
                <div className="h-3.5 w-20 rounded-full animate-shimmer" />
                <div className="h-3.5 w-3 rounded-full animate-shimmer" />
                <div className="h-3.5 w-28 rounded-full animate-shimmer" />
                <div className="ml-auto h-3.5 w-8 rounded-full animate-shimmer" />
            </div>

            {/* Badge */}
            <div className="h-4 w-20 rounded-full animate-shimmer mb-3" />

            {/* Content lines */}
            <div className="space-y-2 mb-5">
                <div className="h-3.5 w-full rounded-full animate-shimmer" style={{ animationDelay: '80ms' }} />
                <div className="h-3.5 w-[90%] rounded-full animate-shimmer" style={{ animationDelay: '120ms' }} />
                <div className="h-3.5 w-[70%] rounded-full animate-shimmer" style={{ animationDelay: '160ms' }} />
            </div>

            {/* Action bar */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
                <div className="h-8 w-24 rounded-full animate-shimmer" style={{ animationDelay: '200ms' }} />
                <div className="h-8 w-14 rounded-full animate-shimmer" style={{ animationDelay: '240ms' }} />
                <div className="h-8 w-16 rounded-full animate-shimmer ml-auto" style={{ animationDelay: '280ms' }} />
            </div>
        </div>
    );
}
