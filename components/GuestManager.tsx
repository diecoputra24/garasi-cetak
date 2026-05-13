'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Trash2,
    Copy,
    Check,
    Upload,
    FileText,
    Loader2,
    Search,
    X,
    MoreVertical,
    MessageCircle,
    ChevronRight,
    Download,
    AlertCircle,
    CheckCircle2,
    Info
} from 'lucide-react';
import { addGuest, addGuestsBulk, deleteGuest, getGuests } from '@/app/actions/invitation';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

interface Guest {
    id: string;
    name: string;
    phoneNumber?: string | null;
    createdAt: Date;
}

export default function GuestManager({ invitationId, slug }: { invitationId: string, slug: string }) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'list' | 'bulk' | 'excel'>('list');
    const [search, setSearch] = useState('');

    // Toast and Confirm Modal States
    const [toasts, setToasts] = useState<any[]>([]);
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({ show: false, title: '', message: '' });

    // Form states
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [bulkText, setBulkText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        loadGuests();
    }, [invitationId]);

    const addToast = (type: 'success' | 'error' | 'info', message: string) => {
        const tid = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id: tid, type, message }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== tid)), 3000);
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({ show: true, title, message, onConfirm });
    };

    async function loadGuests() {
        setLoading(true);
        try {
            const data = await getGuests(invitationId);
            setGuests(data);
        } catch (error) {
            console.error('Error loading guests:', error);
            addToast('error', 'Gagal memuat daftar tamu.');
        } finally {
            setLoading(false);
        }
    }

    const handleAddSingle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setIsSubmitting(true);
        try {
            await addGuest(invitationId, { name: newName, phoneNumber: newPhone });
            setNewName('');
            setNewPhone('');
            await loadGuests();
            addToast('success', 'Tamu berhasil ditambahkan.');
        } catch (error) {
            addToast('error', 'Gagal menambah tamu.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkAdd = async () => {
        if (!bulkText.trim()) return;
        setIsSubmitting(true);
        try {
            const lines = bulkText.split('\n').filter(l => l.trim() !== '');
            const guestsToAdd = lines.map(line => {
                const parts = line.split(/[,;]/);
                const name = parts[0].trim();
                const phone = parts[1] ? parts[1].trim().replace(/\D/g, '') : undefined;
                return { name, phoneNumber: phone };
            });
            await addGuestsBulk(invitationId, guestsToAdd);
            setBulkText('');
            setActiveTab('list');
            await loadGuests();
            addToast('success', `${guestsToAdd.length} tamu berhasil diimpor bulk.`);
        } catch (error) {
            addToast('error', 'Gagal menambah tamu bulk.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        showConfirm("Hapus Tamu", `Yakin ingin menghapus ${name} dari daftar tamu?`, async () => {
            setConfirmModal({ ...confirmModal, show: false });
            try {
                await deleteGuest(id);
                setGuests(prev => prev.filter(g => g.id !== id));
                addToast('info', 'Tamu berhasil dihapus.');
            } catch (error) {
                addToast('error', 'Gagal menghapus tamu.');
            }
        });
    };

    const copyLink = (guestName: string, id: string) => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/${slug}?to=${encodeURIComponent(guestName)}`;
        navigator.clipboard.writeText(link);
        setCopiedId(id);
        addToast('success', 'Link undangan berhasil disalin.');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const shareWhatsApp = (guestName: string, phoneNumber?: string | null) => {
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/${slug}?to=${encodeURIComponent(guestName)}`;

        const message = `_Assalamualaikum Warahmatullahi Wabarakatuh_

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guestName}* untuk menghadiri acara kami.

*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi :

${link}

Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu.

*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.

Terima kasih banyak atas perhatiannya.

_Wassalamualaikum Warahmatullahi Wabarakatuh_`;

        const phonePath = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
        const waUrl = phonePath
            ? `https://wa.me/${phonePath}?text=${encodeURIComponent(message)}`
            : `https://wa.me/?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank');
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsSubmitting(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet);

            if (json.length > 0) {
                const guests = json.map(row => {
                    const nameKey = Object.keys(row).find(k => k.toLowerCase().includes('nama') || k.toLowerCase().includes('name')) || Object.keys(row)[0];
                    const phoneKey = Object.keys(row).find(k => k.toLowerCase().includes('nomor') || k.toLowerCase().includes('wa') || k.toLowerCase().includes('phone') || k.toLowerCase().includes('telepon'));

                    return {
                        name: String(row[nameKey] || '').trim(),
                        phoneNumber: phoneKey ? String(row[phoneKey] || '').replace(/\D/g, '') : undefined
                    };
                }).filter(n => n.name);

                if (guests.length > 0) {
                    await addGuestsBulk(invitationId, guests);
                    await loadGuests();
                    setActiveTab('list');
                    addToast('success', `Berhasil mengimpor ${guests.length} tamu.`);
                }
            }
        } catch (error) {
            console.error('File upload error:', error);
            addToast('error', 'Gagal membaca atau memproses file Excel.');
        } finally {
            setIsSubmitting(false);
            if (e.target) e.target.value = '';
        }
    };

    const filteredGuests = guests.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white flex flex-col h-full relative">
            {/* Custom Toast Container */}
            <div className="fixed top-24 right-6 z-[110] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <motion.div 
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-sm shadow-2xl border-l-4 min-w-[300px] bg-white ${
                                toast.type === 'success' ? 'border-emerald-500' :
                                toast.type === 'error' ? 'border-rose-500' : 'border-blue-500'
                            }`}
                        >
                            {toast.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> : 
                             toast.type === 'error' ? <AlertCircle size={18} className="text-rose-500" /> : 
                             <Info size={18} className="text-blue-500" />}
                            <p className="text-[11px] font-medium text-slate-800 tracking-wider">{toast.message}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Minimal Confirm Modal */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]"
                            onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                        />
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="relative bg-white border border-gray-100 w-full max-w-sm rounded-sm shadow-2xl p-6"
                        >
                            <h3 className="text-[11px] text-slate-900 mb-2">{confirmModal.title}</h3>
                            <p className="text-[11px] text-gray-500 mb-8 font-medium">{confirmModal.message}</p>
                            <div className="flex justify-end gap-1">
                                <button onClick={() => setConfirmModal({ ...confirmModal, show: false })} className="px-4 py-2 text-[10px] font-medium text-gray-400 hover:text-slate-900 transition-colors">Batal</button>
                                <button onClick={() => confirmModal.onConfirm?.()} className="px-6 py-2 bg-blue-600 text-[10px] font-medium text-white rounded-sm active:scale-95 transition-all shadow-xl shadow-blue-600/10">Lanjutkan</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Minimal Tabs Container */}
            <div className="flex border-b border-gray-100 px-4 bg-gray-50/30">
                {[
                    { id: 'list', label: 'Buku Tamu', icon: Users },
                    { id: 'bulk', label: 'Bulk Paste', icon: FileText },
                    { id: 'excel', label: 'Import Excel', icon: Upload },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative flex items-center gap-2 py-4 px-6 text-xs transition-all ${activeTab === tab.id
                            ? 'text-blue-600'
                            : 'text-gray-400 hover:text-slate-900'
                            }`}
                    >
                        <tab.icon size={14} strokeWidth={3} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabGuest"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="wait">
                    {activeTab === 'list' && (
                        <motion.div
                            key="list-tab"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full"
                        >
                            {/* Toolbar */}
                            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center gap-3">
                                <div className="relative flex-1 min-w-[200px]">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama tamu..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded text-xs outline-none focus:border-blue-500/50 transition-all font-medium"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded text-[10px] text-slate-500 flex items-center gap-2 hover:bg-gray-50 transition-all">
                                        <Download size={14} strokeWidth={3} /> Export CSV
                                    </button>
                                </div>
                            </div>

                            {/* Add Guest Form (Inline) */}
                            <div className="p-6 border-b border-gray-100 bg-blue-50/20">
                                <form onSubmit={handleAddSingle} className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-[2] relative">
                                        <input
                                            type="text"
                                            placeholder="Nama Lengkap Tamu"
                                            value={newName}
                                            onChange={e => setNewName(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-xs font-medium tracking-tight focus:outline-none focus:border-blue-500 transition-all placeholder:font-medium placeholder:normal-case shadow-sm"
                                        />
                                    </div>
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            placeholder="Phone (628...)"
                                            value={newPhone}
                                            onChange={e => setNewPhone(e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500 font-mono shadow-sm"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !newName}
                                        className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                    >
                                        {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} strokeWidth={3} />}
                                        Add Guest
                                    </button>
                                </form>
                            </div>

                            {/* Guest Table */}
                            <div className="flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="sticky top-0 bg-[#1a1c23] z-10">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] text-gray-400">Guest Name / Index</th>
                                            <th className="px-8 py-4 text-[10px] text-gray-400">Communication</th>
                                            <th className="px-8 py-4 text-right text-[10px] text-gray-400">Action Control</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-20 text-center">
                                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                                                    <span className="text-[10px] text-gray-400">Synching with Database...</span>
                                                </td>
                                            </tr>
                                        ) : filteredGuests.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-8 py-24 text-center">
                                                    <div className="w-16 h-16 bg-gray-50 inline-flex items-center justify-center rounded-full border border-dashed border-gray-200 mb-4">
                                                        <Users size={24} className="text-gray-200" />
                                                    </div>
                                                    <p className="text-[10px] text-gray-400">No Guest Entry Detected</p>
                                                </td>
                                            </tr>
                                        ) : filteredGuests.map((guest) => (
                                            <tr key={guest.id} className="group hover:bg-blue-50/30 transition-all border-l-2 border-l-transparent hover:border-l-blue-600">
                                                <td className="px-8 py-4">
                                                    <div className="font-black text-xs tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">{guest.name}</div>
                                                    <div className="text-[9px] text-gray-400 font-medium mt-0.5 whitespace-nowrap">DB UID: {guest.id.substring(0,8)}</div>
                                                </td>
                                                <td className="px-8 py-4">
                                                    {guest.phoneNumber ? (
                                                        <div className="inline-flex items-center gap-2 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-100 font-mono tracking-tight shadow-sm">
                                                            <MessageCircle size={10} /> {guest.phoneNumber}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[9px] text-gray-300">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => shareWhatsApp(guest.name, guest.phoneNumber)}
                                                            className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-sm transition-all shadow-sm border border-emerald-100"
                                                            title="WhatsApp Gateway"
                                                        >
                                                            <MessageCircle size={15} strokeWidth={2.5} />
                                                        </button>
                                                        <button
                                                            onClick={() => copyLink(guest.name, guest.id)}
                                                            className={`p-2 transition-all rounded-sm border shadow-sm ${copiedId === guest.id 
                                                                ? 'text-white bg-blue-600 border-blue-600' 
                                                                : 'text-gray-400 bg-white hover:text-blue-600 hover:border-blue-200 border-gray-100'
                                                                }`}
                                                            title="Cloud Copy"
                                                        >
                                                            {copiedId === guest.id ? <Check size={15} strokeWidth={3} /> : <Copy size={15} strokeWidth={2.5} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(guest.id, guest.name)}
                                                            className="p-2 text-gray-400 bg-white border border-gray-100 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-sm transition-all shadow-sm"
                                                            title="Wipe Entry"
                                                        >
                                                            <Trash2 size={15} strokeWidth={2.5} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'bulk' && (
                        <motion.div
                            key="bulk-tab"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-8 space-y-6"
                        >
                            <div className="bg-slate-900 p-6 rounded-sm border-l-4 border-blue-600 shadow-xl">
                                <p className="font-black text-white text-[10px] mb-3 underline underline-offset-4 decoration-blue-500">OPERATIONAL GUIDELINE:</p>
                                <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-4">Input data satu baris per tamu. Format: <span className="text-white">Nama Tamu, No Telepon</span></p>
                                <div className="bg-black/40 p-3 rounded font-mono text-[10px] text-blue-400 border border-white/5 space-y-1">
                                    <p>Bapak Sukirman, 62812345678</p>
                                    <p>Mbak Linda, 62812345679</p>
                                    <p>Keluarga Besar Jatmiko</p>
                                </div>
                            </div>
                            <textarea
                                value={bulkText}
                                onChange={e => setBulkText(e.target.value)}
                                rows={10}
                                placeholder="PASTE RAW GUEST DATA HERE..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm p-6 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-inner placeholder:normal-case"
                            />
                            <button
                                onClick={handleBulkAdd}
                                disabled={isSubmitting || !bulkText.trim()}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-sm text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />}
                                DEPLOY BULK INSTANCE
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'excel' && (
                        <motion.div
                            key="excel-tab"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-20 text-center space-y-8"
                        >
                            <div className="w-24 h-24 bg-blue-50 border border-dashed border-blue-200 rounded-full flex items-center justify-center mx-auto text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                                <Upload size={36} strokeWidth={1.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-black text-xl tracking-tight text-slate-900">Import Data Matrix</h3>
                                <p className="text-[10px] text-gray-500 font-medium max-w-sm mx-auto leading-relaxed">
                                    Upload file .XLSX atau .CSV. Algoritma otomatis akan memetakan kolom identifikasi tamu.
                                </p>
                            </div>
                            <div className="pt-4">
                                <input
                                    type="file"
                                    id="excel-upload"
                                    className="hidden"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileUpload}
                                />
                                <label
                                    htmlFor="excel-upload"
                                    className="px-10 py-4 bg-slate-900 hover:bg-black text-white rounded-sm inline-flex items-center gap-3 cursor-pointer transition-all text-xs shadow-xl active:scale-95"
                                >
                                    Select Source File
                                </label>
                            </div>
                            <div className="flex items-center justify-center gap-4 pt-4">
                                <span className="text-[9px] text-gray-300 px-2 py-1 border border-gray-100 rounded">.XLSX</span>
                                <span className="text-[9px] text-gray-300 px-2 py-1 border border-gray-100 rounded">.CSV</span>
                                <span className="text-[9px] text-gray-300 px-2 py-1 border border-gray-100 rounded">.XLS</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="px-8 py-4 border-t border-gray-100 bg-[#1a1c23] flex items-center justify-between">
                <p className="text-[9px] text-gray-500">
                    SYSTEM STATUS: <span className="text-emerald-500">NOMINAL / READY</span>
                </p>
                <div className="flex items-center gap-4">
                     <p className="text-[9px] text-gray-500">
                        DATA COUNTER: <span className="text-white">{guests.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

