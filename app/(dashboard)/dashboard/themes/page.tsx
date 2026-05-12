"use client";

import { motion } from "framer-motion";
import { Check, Eye, ChevronRight, LayoutTemplate, Palette } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const themes = [
    { id: "modern-floral-red", name: "Modern Floral Red", color: "bg-red-900", desc: "Aesthetic Floral with Bold Accents" },
    { id: "blue-modern-floral", name: "Blue Modern Floral", color: "bg-blue-900", desc: "Clean Serene Professional Blue" },
    { id: "biru-muda-floral", name: "Biru Muda Floral", color: "bg-[#b7e4f7]", desc: "Soft, Light and Modern Floral" },
    { id: "soft-floral-pink", name: "Soft Floral Pink", color: "bg-[#FDEEF4]", desc: "Elegant Soft Pink with Cherry Blossom" },
];

export default function ThemesPage() {
    const [selected, setSelected] = useState("modern-floral-red");

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-[2px] bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Design Laboratory</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase leading-none italic">
                        THEMES CATALOG
                    </h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Pilih arsitektur desain untuk instance undangan Anda.</p>
                </div>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => setSelected(theme.id)}
                        className={`group relative bg-white rounded-sm overflow-hidden border transition-all cursor-pointer ${selected === theme.id
                                ? "border-blue-600 ring-4 ring-blue-500/5 shadow-xl shadow-blue-600/10"
                                : "border-gray-200 hover:border-gray-300 shadow-sm"
                            }`}
                    >
                        {/* Status Badge */}
                        {selected === theme.id && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 z-20 rounded-bl-sm flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                <Check size={12} strokeWidth={4} /> ACTIVE
                            </div>
                        )}

                        {/* Preview Image Placeholder */}
                        <div className={`aspect-[4/5] ${theme.color} relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-slate-900/40 opacity-40 group-hover:opacity-20 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <LayoutTemplate className="w-20 h-20 text-white/10 group-hover:text-white/20 transition-all group-hover:scale-110" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950/90 to-transparent">
                                <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight italic">{theme.name}</h3>
                                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{theme.desc}</p>
                            </div>
                        </div>

                        {/* Actions Overlay */}
                        <div className="p-6 space-y-3">
                            <Link
                                href={`/dashboard/builder?theme=${theme.id}`}
                                className={`w-full py-3 rounded-sm text-[10px] font-black transition-all text-center uppercase tracking-[0.2em] block ${selected === theme.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-gray-50 text-slate-500 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                DEPLOY THEME &rarr;
                            </Link>
                            <Link
                                href={`/invitation/${theme.id}`}
                                target="_blank"
                                className="w-full inline-flex items-center justify-center gap-2 py-1 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-[0.2em]"
                            >
                                <Eye className="w-4 h-4" strokeWidth={3} />
                                OPEN PREVIEW
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}