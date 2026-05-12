'use client';

import React from 'react';

interface NavItem {
    id: string;
    icon: React.ReactNode;
    label: string;
}

interface NavProps {
    isOpen: boolean;
    theme?: 'modern' | 'rustic';
}

export const InvitationBottomNav = ({ isOpen, theme = 'modern' }: NavProps) => {
    const navItems: NavItem[] = [
        { id: '#home', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, label: 'Muka' },
        { id: '#section-1', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, label: 'Mempelai' },
        { id: '#event', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, label: 'Acara' },
        { id: '#gallery', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>, label: 'Galeri' },
        { id: '#rsvp', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>, label: 'RSVP' },
        { id: '#gift', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>, label: 'Kado' },
        { id: '#wishes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, label: 'Doa' }
    ];

    return (
        <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-white/10 rounded-t-md p-2 flex justify-around items-center shadow-md z-[9999] opacity-0 transition-all duration-500 pointer-events-none [&.active]:opacity-100 [&.active]:pointer-events-auto ${isOpen ? 'active' : ''}`}>
            {navItems.map((link) => (
                <a key={link.id} href={link.id} className="flex flex-col items-center justify-center w-auto h-auto text-white/50 hover:text-[#D4AF37] transition-all px-1">
                    {link.icon}
                    <span className="text-[6px] uppercase tracking-tighter mt-1 font-bold">{link.label}</span>
                </a>
            ))}
        </nav>
    );
};
