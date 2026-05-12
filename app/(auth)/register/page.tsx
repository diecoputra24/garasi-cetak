"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2, ArrowRight, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await authClient.signUp.email({
                email,
                password,
                name,
                callbackURL: "/dashboard",
            }, {
                onSuccess: () => {
                    toast.success("Akun berhasil dibuat! Silahkan masuk.");
                    router.push("/login");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message || "Gagal membuat akun");
                }
            });
        } catch (err: any) {
            toast.error("Gagal memproses pendaftaran");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-900">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-100/50 rounded-full blur-3xl" />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Buat Akun</h1>
                    <p className="text-gray-500 text-sm">Bergabung dengan ekosistem Garasi Cetak</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                placeholder="Nama Lengkap"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                placeholder="nama@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:bg-gray-400 shadow-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                                Daftar Sekarang
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-gray-400 text-sm">
                        Sudah punya akun?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
