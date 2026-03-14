"use client"

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2, Mail, Lock, Zap } from 'lucide-react';

export default function Login() {
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const isEmail = emailOrPhone.includes('@');
            const payload = isEmail
                ? { email: emailOrPhone, password }
                : { phone: emailOrPhone, password };

            const res = await api.post('/auth/login', payload);
            login(res.data.token, res.data);
            toast.success('Welcome back!');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to login');
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <div className="w-full max-w-md animate-fade-up">
                {/* Card */}
                <div className="relative bg-card/70 p-8 rounded-2xl border border-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-sm overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/8 blur-3xl pointer-events-none" />

                    {/* Logo mark */}
                    <div className="relative flex justify-center mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-800 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.45)]">
                            <Zap size={22} className="fill-white text-white" />
                        </div>
                    </div>

                    <div className="relative text-center mb-8">
                        <h1 className="text-2xl font-bold tracking-tight mb-1.5 display-font">Welcome Back</h1>
                        <p className="text-muted-foreground text-sm">Sign in to your anonymous identity</p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative space-y-4">
                        {/* Email/Phone field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Email or Phone
                            </label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type="text"
                                    required
                                    value={emailOrPhone}
                                    onChange={(e) => setEmailOrPhone(e.target.value)}
                                    className="w-full bg-secondary/60 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                                    placeholder="you@college.edu"
                                    aria-label="Email or phone number"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary/60 border border-white/[0.07] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                                    placeholder="••••••••"
                                    aria-label="Password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 flex justify-center items-center mt-2 disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="relative mt-6 pt-6 border-t border-white/[0.05] text-center">
                        <p className="text-sm text-muted-foreground">
                            No account?{' '}
                            <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Create one free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
