"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function Signup() {
    const [realName, setRealName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alias, setAlias] = useState('');
    const [collegeId, setCollegeId] = useState('');
    const [colleges, setColleges] = useState<{ _id: string, name: string }[]>([]);

    const [submitting, setSubmitting] = useState(false);
    const [loadingColleges, setLoadingColleges] = useState(true);

    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await api.get('/colleges');
                setColleges(res.data);
            } catch (err) {
                toast.error('Failed to load colleges');
            } finally {
                setLoadingColleges(false);
            }
        };
        fetchColleges();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await api.post('/auth/register', {
                realName,
                email, // using email exclusively for signup in this simple implementation
                password,
                alias,
                collegeId
            });

            login(res.data.token, res.data);
            toast.success('Registration successful! Welcome to UniConfess.');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to register');
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] py-8">
            <div className="bg-card/70 w-full max-w-lg p-8 rounded-2xl border border-white/10 shadow-xl shadow-black/20 relative overflow-hidden backdrop-blur-sm animate-fade-up">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[rgba(255,69,0,0.18)] rounded-bl-full blur-[40px] pointer-events-none" />

                <div className="mb-8 text-center relative z-10">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 display-font">Join the Network</h1>
                    <p className="text-muted-foreground text-sm">Your real identity stays private. Post under your alias.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Real Name</label>
                            <input
                                type="text"
                                required
                                value={realName}
                                onChange={(e) => setRealName(e.target.value)}
                                className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Public Alias</label>
                        <input
                            type="text"
                            required
                            value={alias}
                            onChange={(e) => setAlias(e.target.value)}
                            className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="lazy_panda_99"
                        />
                        <p className="text-xs text-muted-foreground">This is the only name people will see.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="********"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select College</label>
                        <select
                            required
                            value={collegeId}
                            onChange={(e) => setCollegeId(e.target.value)}
                            disabled={loadingColleges}
                            className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer disabled:opacity-50"
                        >
                            <option value="">Select your institution</option>
                            {colleges.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <p className="text-xs text-muted-foreground text-destructive mt-1">Note: You cannot change this later.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || loadingColleges}
                        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all flex justify-center items-center h-12 shadow-[0_0_20px_rgba(255,69,0,0.3)] mt-6 hover:-translate-y-0.5"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground relative z-10">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-medium">Log in</Link>
                </p>
            </div>
        </div>
    );
}
