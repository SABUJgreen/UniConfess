"use client"

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, PenSquare, User as UserIcon, Search, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [searchFocused, setSearchFocused] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-background/85 backdrop-blur-xl">
            {/* Top glow line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="container mx-auto max-w-6xl flex h-16 items-center gap-4 px-4">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex gap-2.5 items-center shrink-0 group"
                >
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-primary/40 blur-md group-hover:bg-primary/60 transition-all duration-300" />
                        <div className="relative bg-gradient-to-br from-primary to-violet-800 h-9 w-9 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-primary/30">
                            <Zap size={16} className="fill-white" />
                        </div>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-foreground display-font">
                        Uni<span className="text-primary">Confess</span>
                    </span>
                </Link>

                {/* Search bar */}
                <div className="hidden md:flex flex-1 items-center max-w-md">
                    <div className={`flex w-full items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 border ${
                        searchFocused
                            ? 'bg-secondary border-primary/50 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]'
                            : 'bg-secondary/50 border-white/[0.06] hover:border-white/10'
                    }`}>
                        <Search size={14} className={`transition-colors shrink-0 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
                        <input
                            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                            placeholder="Search confessions, doubts..."
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-3 ml-auto">
                    {user ? (
                        <>
                            <Link
                                href="/create"
                                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
                                    isActive('/create')
                                        ? 'bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                                        : 'bg-primary text-white hover:bg-primary/90 hover:-translate-y-0.5 shadow-[0_0_16px_rgba(139,92,246,0.35)] hover:shadow-[0_0_24px_rgba(139,92,246,0.55)]'
                                }`}
                            >
                                <PenSquare size={15} />
                                <span className="hidden sm:inline">Confess</span>
                            </Link>

                            <div className="flex items-center gap-2 text-sm bg-secondary/70 px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/50 to-violet-800/50 flex items-center justify-center">
                                    <UserIcon size={11} className="text-primary-foreground" />
                                </div>
                                <span className="max-w-[100px] truncate text-foreground/80 text-xs font-medium">{user.alias}</span>
                            </div>

                            <button
                                onClick={logout}
                                className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full hover:bg-destructive/10"
                                title="Logout"
                                aria-label="Logout"
                            >
                                <LogOut size={17} />
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 rounded-full hover:bg-white/5 border border-white/[0.06] transition-all"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-[0_0_16px_rgba(139,92,246,0.4)] hover:shadow-[0_0_24px_rgba(139,92,246,0.6)]"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
