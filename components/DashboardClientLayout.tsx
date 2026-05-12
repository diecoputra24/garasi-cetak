"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Heart, 
    Palette, 
    Settings, 
    LogOut, 
    Menu, 
    ChevronRight,
    Command,
    Bell,
    PlusCircle,
    X,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function DashboardClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const pathname = usePathname();
    const router = useRouter();

    // Responsive initial state
    useEffect(() => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    }, []);

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
        { icon: Heart, label: "Undangan", href: "/dashboard/invitations" },
        { icon: PlusCircle, label: "Buat Baru", href: "/dashboard/builder" },
        { icon: Palette, label: "Tema Toko", href: "/dashboard/themes" },
    ];

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
            
            {/* Sidebar Toggle - Modern Glassmorphism Light */}
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`fixed top-1/2 -translate-y-1/2 z-[60] h-12 w-6 bg-white border border-slate-200 flex items-center justify-center text-slate-500 transition-all duration-300 hover:text-blue-600 active:scale-95 shadow-md rounded-tr-xl rounded-br-xl ${isSidebarOpen ? "left-64" : "left-0"}`}
                title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
                {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
            </button>

            {/* Sidebar - Clean Light Corporate */}
            <aside 
                className={`fixed inset-y-0 left-0 z-50 w-64 transition-all duration-300 border-r bg-white border-slate-100 text-slate-900 shadow-[20px_0_50px_rgba(0,0,0,0.02)] ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"}`}
            >
                <div className="flex flex-col h-full uppercase tracking-tight relative">
                    {/* Brand Section */}
                    <div className="h-24 flex items-center gap-4 px-8 border-b border-slate-50 overflow-hidden shrink-0">
                        <img src="/images/logo.png" alt="logo" className="h-10 w-auto object-contain shrink-0" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[13px] font-black tracking-widest bg-gradient-to-r from-blue-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent uppercase italic leading-none whitespace-nowrap">
                                GARASI CETAK
                            </span>
                            <span className="text-[8px] text-slate-400 font-bold tracking-[0.4em] mt-1 uppercase leading-none">Management</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 py-10 px-4 space-y-1 overflow-y-auto">
                        <p className="px-5 mb-6 text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic leading-tight">Terminal / Hub</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-[11px] font-bold tracking-[0.1em] group ${
                                        isActive 
                                            ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={isActive ? 3 : 2} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Area */}
                    <div className="p-6 border-t border-slate-50 space-y-3 bg-slate-50/50 shrink-0">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black text-slate-400 hover:text-slate-900 hover:bg-white transition-all tracking-widest uppercase border border-transparent hover:border-slate-100"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Preferences</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all tracking-widest uppercase border border-transparent hover:border-rose-100"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Exit System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Display Engine */}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
                <div className="p-8 md:p-14 lg:p-16 flex-1 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

                <footer className="py-10 px-10 border-t text-[9px] font-black uppercase tracking-[0.5em] bg-white border-slate-100 text-slate-300 italic text-center">
                    &copy; 2024 Garasi Cetak Framework // Enterprise v2.3.0
                </footer>
            </main>
        </div>
    );
}
