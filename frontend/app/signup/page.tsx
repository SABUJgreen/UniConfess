"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2, User, Mail, Lock, AtSign, GraduationCap, Zap, AlertCircle } from 'lucide-react';

export default function Signup() {
    const [realName, setRealName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alias, setAlias] = useState('');
    const [collegeId, setCollegeId] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [colleges, setColleges] = useState<{ _id: string; name: string }[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingColleges, setLoadingColleges] = useState(true);

    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        api.get('/colleges')
            .then(res => setColleges(res.data))
            .catch(() => toast.error('Failed to load colleges'))
            .finally(() => setLoadingColleges(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload: { realName: string; email: string; password: string; alias: string; collegeId?: string; collegeName?: string } = {
                realName,
                email,
                password,
                alias
            };

            if (collegeId) {
                payload.collegeId = collegeId;
            } else {
                payload.collegeName = collegeName;
            }

            const res = await api.post('/auth/register', payload);
            login(res.data.token, res.data);
            toast.success('Welcome to UniConfess!');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register');
            setSubmitting(false);
        }
    };

    const inputClass = "w-full bg-secondary/60 border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50";

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
            <div className="w-full max-w-lg animate-fade-up">
                <div className="relative bg-card/70 p-8 rounded-2xl border border-white/[0.07] shadow-2xl shadow-black/40 backdrop-blur-sm overflow-hidden">
                    {/* Decorative glow */}
                    <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-accent/6 blur-3xl pointer-events-none" />

                    {/* Logo mark */}
                    <div className="relative flex justify-center mb-5">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-violet-800 flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.45)]">
                            <Zap size={22} className="fill-white text-white" />
                        </div>
                    </div>

                    <div className="relative text-center mb-7">
                        <h1 className="text-2xl font-bold tracking-tight mb-1.5 display-font">Join the Network</h1>
                        <p className="text-muted-foreground text-sm">Your real identity stays completely hidden.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="relative space-y-4">
                        {/* Name + Email row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Real Name</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                    <input
                                        type="text"
                                        required
                                        value={realName}
                                        onChange={(e) => setRealName(e.target.value)}
                                        className={inputClass}
                                        placeholder="John Doe"
                                        aria-label="Real name"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                                <div className="relative">
                                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={inputClass}
                                        placeholder="you@college.edu"
                                        aria-label="Email address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Alias */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Public Alias</label>
                            <div className="relative">
                                <AtSign size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type="text"
                                    required
                                    value={alias}
                                    onChange={(e) => setAlias(e.target.value)}
                                    className={inputClass}
                                    placeholder="lazy_panda_99"
                                    aria-label="Public alias"
                                />
                            </div>
                            <p className="text-[11px] text-muted-foreground/60 pl-1">This is the only name others will see.</p>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass}
                                    placeholder="••••••••"
                                    aria-label="Password"
                                />
                            </div>
                        </div>

                        {/* College */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Your College</label>
                            <div className="relative">
                                <GraduationCap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                                <input
                                    type="text"
                                    required
                                    value={collegeName}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCollegeName(value);
                                        const matchedCollege = colleges.find((college) => college.name.toLowerCase() === value.trim().toLowerCase());
                                        setCollegeId(matchedCollege?._id || '');
                                    }}
                                    list="college-list"
                                    className={inputClass}
                                    placeholder={loadingColleges ? 'Loading colleges...' : 'Type your institution name'}
                                    aria-label="Enter college name"
                                />
                                <datalist id="college-list">
                                    {colleges.map((college) => (
                                        <option key={college._id} value={college.name} />
                                    ))}
                                </datalist>
                            </div>
                            <p className="text-[11px] text-amber-500/70 flex items-center gap-1 pl-1">
                                <AlertCircle size={11} /> Type freely or pick a suggestion.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_28px_rgba(139,92,246,0.6)] hover:-translate-y-0.5 flex justify-center items-center mt-2 disabled:opacity-60 disabled:hover:translate-y-0"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="relative mt-6 pt-6 border-t border-white/[0.05] text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
