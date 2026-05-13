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
                <div className="flex flex-col h-full relative">
                    {/* Brand Section */}
                    <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100 overflow-hidden shrink-0">
                        <img src="/images/logo.png" alt="logo" className="h-8 w-auto object-contain shrink-0" />
                        <div className="flex flex-col leading-none">
                            <span className="text-base font-medium bg-gradient-to-r from-blue-600 to-rose-600 bg-clip-text text-transparent whitespace-nowrap">
                                Garasi Cetak
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium mt-1">Management</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                        <p className="px-3 mb-4 text-xs font-semibold text-slate-500">Menu Utama</p>
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium ${
                                        isActive 
                                            ? "bg-slate-100 text-slate-900" 
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                >
                                    <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Bottom Area */}
                    <div className="p-4 border-t border-slate-100 space-y-1 shrink-0">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Preferences</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Exit System</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Display Engine */}
            <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : ""}`}>
                <div className="p-6 md:p-8 flex-1 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>

                <footer className="py-6 px-8 border-t text-sm text-slate-500 bg-white border-slate-100 text-center">
                    &copy; 2024 Garasi Cetak Framework. All rights reserved.
                </footer>
            </main>
        </div>
    );
}
