'use client';

import React, { useState, Suspense } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                toast.error(error.message || 'Login gagal. Silakan cek email dan password Anda.');
            } else {
                toast.success('Selamat datang kembali!');
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            toast.error('Terjadi kesalahan pada server.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fafafa] p-6">
            <div className="w-full max-w-md relative z-10">
                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-gray-900">
                        <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
                        <span>GarasiCetak</span>
                    </Link>
                    <p className="text-gray-500 mt-2">Masuk ke panel manajemen undangan Anda</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-sm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs text-gray-500 hover:text-black">Lupa password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all text-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-all text-sm"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    Masuk Sekarang
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer Links */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <a href="https://wa.me/6282317937260" target="_blank" className="text-black font-semibold hover:underline">
                        Hubungi Admin
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-black" /></div>}>
            <LoginContent />
        </Suspense>
    );
}
