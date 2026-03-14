"use client"

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

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
            // Check if input is email or phone
            const isEmail = emailOrPhone.includes('@');
            const payload = isEmail
                ? { email: emailOrPhone, password }
                : { phone: emailOrPhone, password };

            const res = await api.post('/auth/login', payload);

            login(res.data.token, res.data);
            toast.success('Logged in successfully!');
            router.push('/feed');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to login');
            setSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <div className="bg-card/70 w-full max-w-md p-8 rounded-2xl border border-white/10 shadow-xl shadow-black/20 backdrop-blur-sm animate-fade-up">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 display-font">Welcome Back</h1>
                    <p className="text-muted-foreground">Enter your credentials to access the network.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email or Phone Number</label>
                        <input
                            type="text"
                            required
                            value={emailOrPhone}
                            onChange={(e) => setEmailOrPhone(e.target.value)}
                            className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="Enter email or phone"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary/60 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            placeholder="********"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,69,0,0.3)] mt-6 flex justify-center items-center h-12 hover:-translate-y-0.5"
                    >
                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Login'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Don't have an account? <Link href="/signup" className="text-primary hover:underline font-medium">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
