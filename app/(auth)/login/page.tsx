'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    useEffect(() => setMounted(true), []);

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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8f8f8',
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Subtle background accents */}
            <div style={{
                position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: '-20%', right: '-10%',
                    width: '500px', height: '500px',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-15%', left: '-5%',
                    width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(0,0,0,0.015) 0%, transparent 70%)',
                    borderRadius: '50%',
                }} />
            </div>

            <div style={{
                width: '100%',
                maxWidth: '420px',
                position: 'relative',
                zIndex: 10,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}>
                {/* Logo / Brand */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Link href="/" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '10px',
                        textDecoration: 'none', color: '#0a0a0a',
                    }}>
                        <img src="/images/logo.png" alt="Logo" style={{ height: '36px', width: 'auto' }} />
                        <span style={{
                            fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em',
                        }}>GarasiCetak</span>
                    </Link>
                    <p style={{
                        color: '#888', marginTop: '10px', fontSize: '0.875rem',
                        letterSpacing: '-0.01em', lineHeight: 1.5,
                    }}>Masuk ke panel manajemen undangan</p>
                </div>

                {/* Login Card */}
                <div style={{
                    background: '#fff',
                    padding: '36px',
                    borderRadius: '16px',
                    border: '1px solid #eee',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
                }}>
                    <form onSubmit={handleLogin}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', fontSize: '0.8125rem', fontWeight: 500,
                                color: '#444', marginBottom: '8px',
                            }}>Email</label>
                            <div style={{ position: 'relative' }}>
                                <Mail style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: '#aaa',
                                    width: '16px', height: '16px',
                                }} />
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%', paddingLeft: '42px', paddingRight: '16px',
                                        paddingTop: '12px', paddingBottom: '12px',
                                        background: '#fafafa', border: '1px solid #e5e5e5',
                                        borderRadius: '10px', outline: 'none',
                                        fontSize: '0.875rem', color: '#0a0a0a',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#0a0a0a';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.04)';
                                        e.currentTarget.style.background = '#fff';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e5e5';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.background = '#fafafa';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '28px' }}>
                            <div style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', marginBottom: '8px',
                            }}>
                                <label style={{
                                    fontSize: '0.8125rem', fontWeight: 500, color: '#444',
                                }}>Password</label>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: '#aaa',
                                    width: '16px', height: '16px',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%', paddingLeft: '42px', paddingRight: '44px',
                                        paddingTop: '12px', paddingBottom: '12px',
                                        background: '#fafafa', border: '1px solid #e5e5e5',
                                        borderRadius: '10px', outline: 'none',
                                        fontSize: '0.875rem', color: '#0a0a0a',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = '#0a0a0a';
                                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.04)';
                                        e.currentTarget.style.background = '#fff';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e5e5';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.background = '#fafafa';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '14px', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', cursor: 'pointer', padding: '2px',
                                        color: '#aaa', display: 'flex',
                                    }}
                                >
                                    {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                width: '100%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px',
                                padding: '13px 20px',
                                background: isLoading ? '#888' : '#0a0a0a',
                                color: '#fff',
                                border: 'none', borderRadius: '10px',
                                fontSize: '0.875rem', fontWeight: 600,
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                letterSpacing: '-0.01em',
                            }}
                            onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = '#222'; }}
                            onMouseLeave={(e) => { if (!isLoading) e.currentTarget.style.background = '#0a0a0a'; }}
                        >
                            {isLoading ? (
                                <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} />
                            ) : (
                                <>
                                    Masuk Sekarang
                                    <ArrowRight style={{ width: '16px', height: '16px' }} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center', marginTop: '32px',
                    fontSize: '0.8125rem', color: '#999',
                }}>
                    Belum punya akun?{' '}
                    <a
                        href="https://wa.me/6282317937260"
                        target="_blank"
                        style={{
                            color: '#0a0a0a', fontWeight: 600,
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Hubungi Admin
                    </a>
                </div>

                {/* Copyright */}
                <div style={{
                    textAlign: 'center', marginTop: '16px',
                    fontSize: '0.6875rem', color: '#ccc',
                    letterSpacing: '0.02em',
                }}>
                    © 2026 Garasi Cetak. All rights reserved.
                </div>
            </div>

            {/* Keyframes for spinner */}
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center',
                justifyContent: 'center', background: '#f8f8f8',
            }}>
                <Loader2 style={{
                    width: '32px', height: '32px', color: '#0a0a0a',
                    animation: 'spin 1s linear infinite',
                }} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
