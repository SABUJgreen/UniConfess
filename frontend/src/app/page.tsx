"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useFeed } from "../../hooks/usePosts";
import PostCard from "../../components/PostCard";
import api from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { Home, TrendingUp, Flame, Sparkles, Compass, Users } from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useFeed("hot", 1);

  const { data: colleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const { data } = await api.get("/colleges");
      return data;
    },
  });

  const sidebarItems = [
    { label: "Home", icon: <Home size={18} /> },
    { label: "Popular", icon: <TrendingUp size={18} /> },
    { label: "Hot", icon: <Flame size={18} /> },
    { label: "New", icon: <Sparkles size={18} /> },
    { label: "Explore", icon: <Compass size={18} /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px] gap-6">
      <aside className="hidden lg:block">
        <div className="bg-card/90 border border-white/10 rounded-2xl p-4 sticky top-24">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Menu
          </div>
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-6 text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Resources
          </div>
          <div className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/70 transition">
              <Users size={18} />
              Communities
            </button>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        {!user && (
          <div className="bg-card/90 border border-white/10 rounded-2xl p-6">
            <h1 className="text-2xl font-bold display-font mb-2">
              Welcome to UniConfess
            </h1>
            <p className="text-muted-foreground mb-4">
              Log in to view the full campus feed and participate.
            </p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="bg-secondary/90 text-foreground px-4 py-2 rounded-full text-sm hover:bg-secondary"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm hover:bg-primary/90 shadow-[0_0_12px_rgba(255,69,0,0.35)]"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        <div className="bg-card/90 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Best</span>
            <span>Everywhere</span>
            <span>Posts</span>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground py-12">Loading feed...</div>
        ) : error ? (
          <div className="bg-card/90 border border-white/10 rounded-2xl p-6 text-muted-foreground">
            Please log in to view the feed.
          </div>
        ) : (
          <div className="space-y-4">
            {data?.posts?.map((post: any) => (
              <PostCard key={post._id} post={post} refetch={refetch} />
            ))}
          </div>
        )}
      </section>

      <aside className="hidden lg:block">
        <div className="bg-card/90 border border-white/10 rounded-2xl p-4 sticky top-24">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Popular Communities
          </div>
          <div className="space-y-3">
            {(colleges || []).slice(0, 6).map((college: any) => (
              <div key={college._id} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-secondary/90 flex items-center justify-center text-xs text-foreground">
                  {college.name?.[0] || "C"}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {college.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{college.city}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">See more</div>
        </div>
      </aside>
    </div>
  );
}
