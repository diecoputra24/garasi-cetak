'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { deleteInvitation } from '@/app/actions/invitation';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteInvitationButton({ id, redirectUrl, className }: { id: string, redirectUrl?: string, className?: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [toasts, setToasts] = useState<any[]>([]);
    const router = useRouter();

    const addToast = (type: 'success' | 'error', message: string) => {
        const tid = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id: tid, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 3000);
    };

    const handleDelete = async () => {
        setShowModal(false);
        setIsDeleting(true);
        try {
            await deleteInvitation(id);
            addToast('success', 'Undangan berhasil dihapus.');
            setTimeout(() => {
                if (redirectUrl) {
                    router.push(redirectUrl);
                } else {
                    router.refresh();
                }
            }, 500);
        } catch (error) {
            console.error('Failed to delete:', error);
            addToast('error', 'Gagal menghapus data.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Custom Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            className="relative bg-white border border-gray-100 w-full max-w-sm rounded-sm shadow-2xl p-6"
                        >
                            <div className="flex gap-4">
                                <div className="shrink-0 w-10 h-10 rounded-sm bg-rose-50 text-rose-600 flex items-center justify-center">
                                    <AlertCircle size={20} />
                                </div>
                                <div className="space-y-1 pt-1">
                                    <h3 className="text-xs tracking-wider text-slate-900">Konfirmasi Hapus</h3>
                                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Seluruh data tamu, RSVP, dan ucapan pada project ini akan dihapus permanen. Lanjutkan?</p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-1 mt-8">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-[10px] font-medium text-gray-400 hover:text-slate-900 transition-colors">Batal</button>
                                <button onClick={handleDelete} className="px-6 py-2 bg-rose-600 text-[10px] font-medium text-white rounded-sm hover:bg-rose-700 transition-all shadow-xl shadow-rose-600/10 active:scale-95">Ya, Hapus Data</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toasts */}
            <div className="fixed top-24 right-6 z-[210] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div 
                            key={t.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl border-l-4 min-w-[280px] bg-white ${
                                t.type === 'success' ? 'border-emerald-500' : 'border-rose-500'
                            }`}
                        >
                            {t.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-rose-500" />}
                            <p className="text-[10px] text-slate-800">{t.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
                className={className || "p-2 hover:bg-rose-500/10 rounded-lg text-gray-600 hover:text-rose-500 transition-colors disabled:opacity-50"}
                title="Hapus Undangan"
            >
                {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span className="md:inline hidden">Hapus</span>
                    </div>
                )}
            </button>
        </>
    );
}
