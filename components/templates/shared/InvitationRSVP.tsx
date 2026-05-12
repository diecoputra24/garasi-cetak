'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RSVPProps {
    rsvpName: string;
    setRsvpName: (val: string) => void;
    rsvpTotal: string;
    setRsvpTotal: (val: string) => void;
    rsvpStatus: string;
    setRsvpStatus: (val: string) => void;
    isSubmittingRSVP: boolean;
    handleRSVP: (e: React.FormEvent) => void;
    theme?: 'modern' | 'rustic';
    titleFont?: string;
    flat?: boolean;
    hideHeader?: boolean;
    customButtonClass?: string;
}

export const InvitationRSVP = ({
    rsvpName,
    setRsvpName,
    rsvpTotal,
    setRsvpTotal,
    rsvpStatus,
    setRsvpStatus,
    isSubmittingRSVP,
    handleRSVP,
    theme = 'modern',
    titleFont = '',
    flat = false,
    hideHeader = false,
    customButtonClass = ''
}: RSVPProps) => {
    const [isTotalDropdownOpen, setIsTotalDropdownOpen] = useState(false);

    const containerClasses = flat 
        ? "w-full p-0" 
        : `backdrop-blur-xl border border-white/10 p-8 rounded-md shadow-md ${theme === 'modern' ? 'bg-white/5' : 'bg-white/5 p-6 rounded-2xl'}`;

    const labelColor = flat ? "text-[#1e3a5f]/60" : "text-white/50";
    const subtextColor = flat ? "text-[#1e3a5f]/60" : "text-white/60";
    const inputBg = flat ? "bg-white/80" : "bg-white";

    return (
        <div className={containerClasses}>
            {!hideHeader && (
                <>
                    <h2 className={`text-3xl mb-4 text-[#C9A84C] font-bold text-center ${titleFont}`}>Konfirmasi Kehadiran</h2>
                    <p className={`text-center ${subtextColor} text-xs mb-8 italic`}>Kehadiran Anda adalah kado terindah bagi kami</p>
                </>
            )}
            
            <form onSubmit={handleRSVP} className="w-full max-w-[340px] space-y-5 mx-auto">
                <div className="w-full space-y-1.5">
                    <label className={`text-[10px] uppercase font-bold ${labelColor} mb-1 ml-1 block tracking-widest`}>Nama Lengkap</label>
                    <input 
                        value={rsvpName} 
                        onChange={(e) => setRsvpName(e.target.value)} 
                        placeholder={theme === 'modern' ? "Contoh: Budi & Keluarga" : "Nama Anda"} 
                        className={`w-full px-5 py-4 rounded-md text-black outline-none font-bold text-sm shadow-inner ${inputBg} ${theme === 'rustic' ? 'rounded-xl' : ''}`} 
                        required 
                    />
                </div>

                <div className="w-full relative space-y-1.5">
                    <label className={`text-[10px] uppercase font-bold ${labelColor} mb-1 ml-1 block tracking-widest`}>Jumlah Orang</label>
                    <button 
                        type="button" 
                        onClick={() => setIsTotalDropdownOpen(!isTotalDropdownOpen)} 
                        className={`w-full px-5 py-4 rounded-md text-black font-bold text-sm flex items-center justify-between shadow-lg relative z-20 ${inputBg} ${theme === 'rustic' ? 'rounded-xl' : ''}`}
                    >
                        <span>{rsvpTotal} Orang</span>
                        <svg className={`w-4 h-4 transition-transform ${isTotalDropdownOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                    
                    <AnimatePresence>
                        {isTotalDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsTotalDropdownOpen(false)} />
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }} 
                                    className={`absolute z-20 left-0 right-0 mt-2 bg-white shadow-2xl overflow-hidden border border-gray-100 ${theme === 'modern' ? 'rounded-md' : 'rounded-xl'}`}
                                >
                                    {[1, 2, 3, 4, 5].map((num) => (
                                        <div 
                                            key={num} 
                                            onClick={() => { setRsvpTotal(num.toString()); setIsTotalDropdownOpen(false); }} 
                                            className="px-5 py-4 hover:bg-gray-50 text-black text-sm font-bold cursor-pointer border-b border-gray-50 last:border-0"
                                        >
                                            {num} Orang
                                        </div>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full space-y-1.5">
                    <label className={`text-[10px] uppercase font-bold ${labelColor} mb-1 ml-1 block tracking-widest`}>Status Kehadiran</label>
                    <div className="grid grid-cols-2 gap-3 w-full">
                        {['Hadir', 'Tidak Hadir'].map((s) => (
                            <button 
                                key={s} 
                                type="button" 
                                onClick={() => setRsvpStatus(s)} 
                                className={`w-full py-4 rounded-md border text-[10px] font-bold uppercase tracking-widest transition-all overflow-hidden whitespace-nowrap px-0 ${rsvpStatus === s ? (customButtonClass ? customButtonClass : 'bg-[#C9A84C] text-white border-[#C9A84C] shadow-xl') : `bg-white/5 ${flat ? 'text-[#1e3a5f]/60 border-[#1e3a5f]/20' : 'text-white/60 border-white/10'} hover:border-white/30`}`}
                                style={{ paddingLeft: 0, paddingRight: 0 }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmittingRSVP} 
                    className={`w-full py-5 rounded-md text-[11px] font-bold uppercase tracking-[0.3em] shadow-2xl mt-4 active:scale-95 transition-transform ${customButtonClass ? customButtonClass : 'bg-[#C9A84C] text-white'} ${theme === 'rustic' ? 'rounded-xl' : ''}`}
                >
                    {isSubmittingRSVP ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
            </form>
        </div>
    );
};

