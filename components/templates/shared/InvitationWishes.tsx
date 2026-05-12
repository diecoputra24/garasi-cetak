'use client';

import React from 'react';

interface Wish {
    name: string;
    message: string;
    time: string;
}

interface WishesProps {
    newName: string;
    setNewName: (val: string) => void;
    newMessage: string;
    setNewMessage: (val: string) => void;
    isSubmittingWish: boolean;
    handleSubmitWish: (e: React.FormEvent) => void;
    localWishes: Wish[];
    theme?: 'modern' | 'rustic';
    titleFont?: string;
    flat?: boolean;
    customButtonClass?: string;
}

export const InvitationWishes = ({
    newName,
    setNewName,
    newMessage,
    setNewMessage,
    isSubmittingWish,
    handleSubmitWish,
    localWishes,
    theme = 'modern',
    titleFont = '',
    flat = false,
    customButtonClass = ''
}: WishesProps) => {
    return (
        <div className={`w-full ${theme === 'modern' ? (flat ? 'bg-transparent p-0' : 'bg-white rounded-md shadow-md p-8 overflow-hidden') : 'space-y-4'}`}>
            <form onSubmit={handleSubmitWish} className={`w-full mx-auto mb-0 ${theme === 'rustic' ? 'space-y-4 mb-8' : ''}`}>
                <input 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    placeholder="Nama Anda" 
                    className={`w-full px-5 py-4 rounded-md outline-none font-bold text-sm ${theme === 'modern' ? (flat ? 'bg-white border border-gray-100 mb-4 text-black' : 'bg-gray-50 border border-gray-200 mb-4 text-black') : 'bg-white/5 border border-white/10 text-white'}`} 
                    required 
                />
                <textarea 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Berikan ucapan selamat & doa" 
                    rows={4} 
                    className={`w-full px-5 py-4 rounded-md outline-none text-sm ${theme === 'modern' ? (flat ? 'bg-white border border-gray-100 mb-5 text-black italic' : 'bg-gray-50 border border-gray-200 mb-5 text-black italic') : 'bg-white/5 border border-white/10 text-white italic'}`} 
                    required
                ></textarea>
                <button 
                    type="submit" 
                    disabled={isSubmittingWish} 
                    className={`w-full py-5 rounded-md text-[11px] font-bold uppercase tracking-widest shadow-md transition-all active:scale-95 ${customButtonClass ? customButtonClass : (theme === 'modern' ? 'bg-[#1e3a5f] text-white' : 'rustic-btn-primary')}`}
                >
                    {isSubmittingWish ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
            </form>
            
            <div className={`mt-10 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar ${theme === 'modern' ? 'space-y-2' : 'space-y-4'}`}>
                {localWishes.map((w, i) => (
                    <div key={i} className={`${theme === 'modern' ? 'pb-6 pt-4 border-b border-gray-100 last:border-0 relative text-left transition-all' : 'p-4 bg-white/5 rounded-xl border border-white/5 text-left'}`}>
                        <div className={`font-bold ${theme === 'modern' ? `text-base ${flat ? 'text-[#1e3a5f]' : 'text-[#8B0000]'} mb-1` : 'text-[#D4AF37]'}`}>{w.name}</div>
                        {theme === 'modern' && <div className="text-[8px] text-gray-400 font-bold mb-3 uppercase tracking-[0.2em]">{w.time}</div>}
                        <p className={`text-sm leading-relaxed italic ${theme === 'modern' ? 'text-gray-700 font-medium' : 'text-white'}`}>"{w.message}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
