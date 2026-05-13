"use client";

import { motion } from "framer-motion";
import { Check, Eye, ChevronRight, LayoutTemplate, Palette } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const themes = [
    { id: "modern-floral-red", name: "Modern Floral Red", color: "bg-red-900", image: "/images/modern-floral-red/FULL COVER.jpg", desc: "Aesthetic Floral with Bold Accents" },
    { id: "blue-modern-floral", name: "Blue Modern Floral", color: "bg-blue-900", image: "/images/biru-modern-floral/full.jpeg", desc: "Clean Serene Professional Blue" },
    { id: "biru-muda-floral", name: "Biru Muda Floral", color: "bg-[#b7e4f7]", image: "/images/biru-muda-floral/BIRU F.jpg.jpeg", desc: "Soft, Light and Modern Floral" },
    { id: "soft-floral-pink", name: "Soft Floral Pink", color: "bg-[#FDEEF4]", image: "/images/Pink Floral/PINK.jpg.jpeg", desc: "Elegant Soft Pink with Cherry Blossom" },
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
                        <span className="text-sm text-blue-600">Design Laboratory</span>
                    </div>
                    <h1 className="text-3xl  text-slate-900 leading-none">
                        THEMES CATALOG
                    </h1>
                    <p className="text-sm text-gray-500 font-medium">Pilih arsitektur desain untuk instance undangan Anda.</p>
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
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-sm px-4 py-2 z-20 rounded-bl-sm flex items-center gap-2 shadow-lg shadow-blue-600/20">
                                <Check size={12} strokeWidth={4} /> ACTIVE
                            </div>
                        )}

                        {/* Preview Image */}
                        <div className={`aspect-[4/5] relative overflow-hidden bg-gray-100`}>
                            <img 
                                src={theme.image} 
                                alt={theme.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            />
                            <div className="absolute inset-0 bg-slate-900/20 group-hover:opacity-0 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-950/90 to-transparent">
                                <h3 className="text-lg text-white mb-1 ">{theme.name}</h3>
                                <p className="text-white/60 text-sm font-medium">{theme.desc}</p>
                            </div>
                        </div>

                        {/* Actions Overlay */}
                        <div className="p-6 space-y-3">
                            <Link
                                href={`/dashboard/builder?theme=${theme.id}`}
                                className={`w-full py-3 rounded-sm text-sm transition-all text-center block ${selected === theme.id
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "bg-gray-50 text-slate-500 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                DEPLOY THEME &rarr;
                            </Link>
                            <Link
                                href={`/invitation/${theme.id}`}
                                target="_blank"
                                className="w-full inline-flex items-center justify-center gap-2 py-1 text-sm text-gray-400 hover:text-blue-600 transition-colors"
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