'use client';

import React from 'react';

interface AudioToggleProps {
    isMuted: boolean;
    toggleMute: () => void;
    theme?: 'modern' | 'rustic';
}

export const InvitationAudioToggle = ({ isMuted, toggleMute, theme = 'modern' }: AudioToggleProps) => {
    return (
        <button 
            onClick={toggleMute} 
            className={`fixed z-[999] p-3 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg ${theme === 'modern' ? 'left-6 bottom-32 !bg-[#8B0000] border-4 border-white/10' : 'rustic-audio-btn'} ${!isMuted ? (theme === 'modern' ? 'audio-spinning' : 'rustic-audio-spinning') : ''}`}
        >
            {isMuted ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M11 5L6 9H2V15H6L11 19V5ZM19.07 4.93L17.66 6.34C19.1 7.78 20 9.78 20 12C20 14.22 19.1 16.22 17.66 17.66L19.07 19.07C21.1 17.04 22 14.22 22 12C22 9.78 21.1 6.96 19.07 4.93ZM15.54 8.46L14.13 9.87C14.63 10.37 15 11.08 15 12C15 12.92 14.63 13.63 14.13 14.13L15.54 15.54C16.46 14.62 17 13.31 17 12C17 10.69 16.46 9.38 15.54 8.46Z"/></svg>
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M11 5L6 9H2V15H6L11 19V5ZM15.54 8.46L14.13 9.87C14.63 10.37 15 11.08 15 12C15 12.92 14.63 13.63 14.13 14.13L15.54 15.54C16.46 14.62 17 13.31 17 12C17 10.69 16.46 9.38 15.54 8.46Z"/></svg>
            )}
        </button>
    );
};
