"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Users,
    Calendar,
    Camera,
    CreditCard,
    ChevronRight,
    ChevronLeft,
    Check,
    MapPin,
    PlusCircle,
    Loader2,
    X,
    Save,
    Image as ImageIcon,
    Palette,
    Music,
    Heart,
    Settings,
    PenTool,
    ArrowRight,
    AlertCircle,
    Info,
    CheckCircle2,
    ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateInvitation, getInvitationById } from "@/app/actions/invitation";

const steps = [
    { id: "tema", title: "Tema Selection", icon: Palette },
    { id: "mempelai", title: "Bride & Groom", icon: Users },
    { id: "orangtua", title: "Parentals", icon: User },
    { id: "acara", title: "Main Events", icon: Calendar },
    { id: "gallery", title: "Visual Gallery", icon: Camera },
    { id: "history", title: "Love Story", icon: Heart },
    { id: "music", title: "Audio Playlist", icon: Music },
    { id: "gift", title: "Digital Wallet", icon: CreditCard },
];

const themes = [
    { id: "modern-floral-red", name: "Modern Floral Red", color: "bg-red-900" },
    { id: "blue-modern-floral", name: "Blue Modern Floral", color: "bg-blue-900" },
    { id: "biru-muda-floral", name: "Biru Muda Floral", color: "bg-[#b7e4f7]" },
    { id: "soft-floral-pink", name: "Soft Floral Pink", color: "bg-[#FDEEF4]" },
];

export default function InvitationEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Unified Modal State: 'confirm' or 'alert'
    const [modal, setModal] = useState<{
        show: boolean;
        type: 'confirm' | 'alert' | 'success' | 'error';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({ show: false, type: 'alert', title: '', message: '' });

    const [formData, setFormData] = useState<any>({
        themeId: "",
        brideName: "",
        brideShort: "",
        brideInstagram: "",
        brideImage: "",
        groomName: "",
        groomShort: "",
        groomInstagram: "",
        groomImage: "",
        brideParents: "",
        groomParents: "",
        akadDate: "",
        akadTime: "",
        akadPlace: "",
        akadAddress: "",
        akadMaps: "",
        resepsiDate: "",
        resepsiTime: "",
        resepsiPlace: "",
        resepsiAddress: "",
        resepsiMaps: "",
        gallery: "[]",
        gifts: JSON.stringify([{ bankName: "BCA", accountNo: "", accountHolder: "" }]),
        musicUrl: "",
        story: "[]",
    });

    useEffect(() => {
        if (id) {
            getInvitationById(id).then((res: any) => {
                if (res) {
                    setFormData({
                        ...res,
                        brideImage: res.brideImage || "",
                        brideInstagram: res.brideInstagram || "",
                        groomImage: res.groomImage || "",
                        groomInstagram: res.groomInstagram || "",
                        brideParents: res.brideParents || "",
                        groomParents: res.groomParents || "",
                        akadPlace: res.akadPlace || "",
                        akadAddress: res.akadAddress || "",
                        akadMaps: res.akadMaps || "",
                        resepsiPlace: res.resepsiPlace || "",
                        resepsiAddress: res.resepsiAddress || "",
                        resepsiMaps: res.resepsiMaps || "",
                        akadDate: res.akadDate ? new Date(res.akadDate).toISOString().split('T')[0] : "",
                        resepsiDate: res.resepsiDate ? new Date(res.resepsiDate).toISOString().split('T')[0] : "",
                        gallery: res.gallery || "[]",
                        gifts: res.gifts || JSON.stringify([{ bankName: "BCA", accountNo: "", accountHolder: "" }]),
                        musicUrl: res.musicUrl || "",
                        story: res.story || "[]",
                    });
                }
                setIsFetching(false);
            }).catch(err => {
                console.error(err);
                setIsFetching(false);
                showAlert('Error', 'Gagal memuat data undangan.', 'error');
            });
        }
    }, [id]);

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'alert' = 'alert') => {
        setModal({ show: true, type, title, message });
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setModal({ show: true, type: 'confirm', title, message, onConfirm });
    };

    const fixImageUrl = (url: string) => {
        if (!url) return "";
        if (url.includes('drive.google.com')) {
            const gid = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
            if (gid) return `https://drive.google.com/thumbnail?id=${gid}&sz=w1000`;
        }
        return url;
    };

    const getGifts = () => { try { return JSON.parse(formData.gifts); } catch { return []; } };
    const updateGifts = (index: number, field: string, value: string) => {
        const current = getGifts();
        current[index][field] = value;
        setFormData({ ...formData, gifts: JSON.stringify(current) });
    };
    const addBank = () => {
        const current = getGifts();
        setFormData({ ...formData, gifts: JSON.stringify([...current, { bankName: "BCA", accountNo: "", accountHolder: "" }]) });
    };

    const getGallery = () => { try { return JSON.parse(formData.gallery); } catch { return []; } };
    const addGalleryItem = (url: string) => {
        const current = getGallery();
        setFormData({ ...formData, gallery: JSON.stringify([...current, url]) });
        showAlert('Berhasil', 'Gambar berhasil diimpor ke galeri.', 'success');
    };
    const removeGalleryItem = (index: number) => {
        showConfirm("Hapus Item", "Apakah Anda yakin ingin menghapus gambar ini dari galeri?", () => {
            const current = getGallery();
            current.splice(index, 1);
            setFormData({ ...formData, gallery: JSON.stringify(current) });
            setModal({ ...modal, show: false });
        });
    };

    const getStory = () => { try { return JSON.parse(formData.story); } catch { return []; } };
    const updateStory = (index: number, field: string, value: string) => {
        const current = getStory();
        current[index][field] = value;
        setFormData({ ...formData, story: JSON.stringify(current) });
    };
    const addStory = () => {
        const current = getStory();
        setFormData({ ...formData, story: JSON.stringify([...current, { image: "", title: "", date: "", description: "" }]) });
    };
    const removeStory = (index: number) => {
        showConfirm("Hapus Cerita", "Data sejarah pasangan ini akan dihapus secara permanen. Lanjutkan?", () => {
            const current = getStory();
            current.splice(index, 1);
            setFormData({ ...formData, story: JSON.stringify(current) });
            setModal({ ...modal, show: false });
        });
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        const s = steps[step].id;
        if (s === "tema") { if (!formData.themeId) newErrors.themeId = "Wajib."; }
        else if (s === "mempelai") {
            if (!formData.brideName) newErrors.brideName = "Nama lengkap wajib.";
            if (!formData.brideShort) newErrors.brideShort = "Wajib.";
            if (!formData.groomName) newErrors.groomName = "Nama lengkap wajib.";
            if (!formData.groomShort) newErrors.groomShort = "Wajib.";
        } else if (s === "orangtua") {
            if (!formData.brideParents) newErrors.brideParents = "Wajib.";
            if (!formData.groomParents) newErrors.groomParents = "Wajib.";
        } else if (s === "acara") {
            if (!formData.akadDate) newErrors.akadDate = "Wajib.";
            if (!formData.akadPlace) newErrors.akadPlace = "Wajib.";
            if (!formData.resepsiDate) newErrors.resepsiDate = "Wajib.";
            if (!formData.resepsiPlace) newErrors.resepsiPlace = "Wajib.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => { if (validateStep(currentStep)) { setCurrentStep(prev => prev + 1); setErrors({}); window.scrollTo(0, 0); } };
    const prevStep = () => { setCurrentStep(prev => prev - 1); setErrors({}); window.scrollTo(0, 0); };

    const handleSubmit = async (shouldRedirect = false) => {
        if (!validateStep(currentStep)) return;
        setLoading(true);
        try {
            await updateInvitation(id, {
                ...formData,
                akadDate: formData.akadDate ? new Date(formData.akadDate) : null,
                resepsiDate: formData.resepsiDate ? new Date(formData.resepsiDate) : null,
            });
            
            if (shouldRedirect) {
                showAlert('Berhasil', 'Seluruh data telah diperbarui. Mengalihkan ke Dashboard...', 'success');
                setTimeout(() => {
                    router.push(`/dashboard/invitation/${id}`);
                }, 1500);
            } else {
                showAlert('Tersimpan', 'Seluruh perubahan data berhasil disinkronkan ke server.', 'success');
            }
        } catch (error) {
            showAlert('Gagal', 'Terjadi kesalahan sistem saat mencoba menyimpan data.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const ErrorMsg = ({ name }: { name: string }) => errors[name] ? (
        <span className="text-sm font-medium text-rose-500 mt-1 block">{errors[name]}</span>
    ) : null;

    if (isFetching) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center text-gray-400 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            <p className="text-sm animate-pulse">Sinkronisasi Data...</p>
        </div>
    );

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
            {/* Unified Custom Modal */}
            <AnimatePresence>
                {modal.show && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }} 
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[4px]" 
                            onClick={() => setModal({ ...modal, show: false })} 
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                            className="relative bg-white border border-gray-100 w-full max-w-sm rounded-sm p-8 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                {modal.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-500" /> :
                                    modal.type === 'error' ? <AlertCircle size={18} className="text-rose-500" /> :
                                        <Info size={18} className="text-blue-500" />}
                                <h3 className="text-sm text-slate-900 leading-none">{modal.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">{modal.message}</p>
                            <div className="flex justify-end gap-1">
                                {modal.type === 'confirm' ? (
                                    <>
                                        <button onClick={() => setModal({ ...modal, show: false })} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-slate-900 transition-colors">Batal</button>
                                        <button onClick={() => modal.onConfirm?.()} className="px-6 py-2 bg-blue-600 text-sm font-medium text-white rounded-sm transition-all">Lanjutkan</button>
                                    </>
                                ) : (
                                    <button onClick={() => setModal({ ...modal, show: false })} className={`px-6 py-2 ${modal.type === 'success' ? 'bg-emerald-600' : modal.type === 'error' ? 'bg-rose-600' : 'bg-slate-900'} text-sm text-white rounded-sm transition-all`}>Mengerti</button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-400">
                        Management <ChevronRight size={10} className="mx-2" />
                        Editor <ChevronRight size={10} className="mx-2" />
                        <span className="text-blue-500">Instance Configuration</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link href={`/dashboard/invitation/${id}`} className="w-14 h-14 rounded-sm bg-slate-900 flex items-center justify-center text-white transition-all">
                            <ArrowLeft size={28} strokeWidth={2.5} />
                        </Link>
                        <div>
                            <h1 className="text-3xl  text-slate-900 leading-none">
                                {formData.brideShort} & {formData.groomShort}
                            </h1>
                            <p className="text-sm text-gray-400 font-medium mt-2 bg-gray-50 px-3 py-1 border border-gray-100 rounded-sm inline-block">
                                Editing Invitation Archive: <span className="text-blue-600">/{formData.slug}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Lateral Stepper */}
                <div className="lg:col-span-3 space-y-1 self-start sticky top-10">
                    <p className="text-sm text-gray-400 mb-6 ml-4">Deployment Stages</p>
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === index;
                        
                        // Check if the step has data populated
                        const isPopulated = (() => {
                            if (index === 0) return true; // Theme is always populated
                            if (index === 1) return formData.brideName && formData.brideShort && formData.groomName && formData.groomShort;
                            if (index === 2) return formData.brideParents && formData.groomParents;
                            if (index === 3) return formData.akadDate && formData.akadPlace && formData.resepsiDate && formData.resepsiPlace;
                            const gallery = typeof formData.gallery === 'string' ? JSON.parse(formData.gallery || "[]") : (formData.gallery || []);
                            if (index === 4) return gallery.length > 0;
                            const story = typeof formData.story === 'string' ? JSON.parse(formData.story || "[]") : (formData.story || []);
                            if (index === 5) return story.length > 0;
                            if (index === 6) return !!formData.musicUrl;
                            const gifts = typeof formData.gifts === 'string' ? JSON.parse(formData.gifts || "[]") : (formData.gifts || []);
                            if (index === 7) return gifts.some((g: any) => g.accountNo);
                            return false;
                        })();

                        // Theme selection (index 0) is LOCKED in Edit mode
                        const isLocked = index === 0;

                        return (
                            <button
                                key={step.id}
                                disabled={isLocked && !isActive}
                                onClick={() => {
                                    if (isLocked) {
                                        showAlert('Locked', 'Pilihan tema tidak dapat diubah setelah undangan dideploy.', 'alert');
                                        return;
                                    }
                                    setCurrentStep(index);
                                }}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all group border-l-4 ${isActive
                                    ? "bg-blue-50/50 border-blue-600 text-blue-600"
                                    : isPopulated
                                        ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50/30"
                                        : isLocked ? "border-gray-100 text-gray-200 opacity-50 cursor-not-allowed" : "border-transparent text-gray-400 hover:bg-gray-50 hover:text-slate-900"
                                    }`}
                            >
                                <div className={`flex shrink-0 items-center justify-center rounded ${isActive ? "text-blue-600" : isPopulated ? "text-emerald-500" : "text-gray-300"}`}>
                                    {isPopulated ? <Check size={16} strokeWidth={4} /> : <Icon size={18} strokeWidth={isActive ? 3 : 2} />}
                                </div>
                                <div className="text-left">
                                    <p className={`text-sm ${isActive ? 'italic' : ''}`}>{step.title}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 space-y-8">
                    <div className="bg-white border border-gray-200 rounded-sm shadow-xl min-h-[600px] flex flex-col overflow-hidden">
                        <div className="h-1 bg-gray-50 w-full">
                            <motion.div className="h-full bg-blue-600" initial={{ width: "0%" }} animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
                        </div>

                        <div className="flex-1 p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                                    <div className="border-b border-gray-100 pb-8 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl  text-slate-900 flex items-center gap-3 leading-none">
                                                {(() => { const Icon = steps[currentStep].icon; return <Icon size={22} className="text-blue-600" strokeWidth={3} />; })()}
                                                {steps[currentStep].title}
                                            </h2>
                                            <p className="text-sm text-gray-400 font-medium mt-2">Refining operational data for {steps[currentStep].id} block.</p>
                                        </div>
                                        <div className="text-sm text-blue-600/20">Stage 0{currentStep + 1}</div>
                                    </div>

                                    {/* Content Switcher */}
                                    {currentStep === 0 && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {themes.map((theme) => (
                                                <div key={theme.id} onClick={() => setFormData({ ...formData, themeId: theme.id })} className={`p-6 rounded-sm border-2 transition-all cursor-pointer flex items-center justify-between group ${formData.themeId === theme.id ? "bg-blue-50/30 border-blue-600" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                                                    <div className="flex items-center gap-6">
                                                        <div className={`w-14 h-14 rounded-full border-4 border-white ${theme.color}`} />
                                                        <div><p className="font-black text-sm  text-slate-900">{theme.name}</p></div>
                                                    </div>
                                                    {formData.themeId === theme.id && <Check size={18} strokeWidth={4} className="text-blue-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                            <div className="space-y-6">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-blue-600 pl-4">The Bride</h3>
                                                <div className="space-y-4">
                                                    <input value={formData.brideName} onChange={(e) => setFormData({ ...formData, brideName: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500" placeholder="Full Name" />
                                                    <ErrorMsg name="brideName" />
                                                    <input value={formData.brideShort} onChange={(e) => setFormData({ ...formData, brideShort: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500" placeholder="Short Name (URL)" />
                                                    <ErrorMsg name="brideShort" />
                                                    <input value={formData.brideImage} onChange={(e) => setFormData({ ...formData, brideImage: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm font-mono outline-none focus:border-blue-500" placeholder="Avatar URL" />
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-slate-900 pl-4">The Groom</h3>
                                                <div className="space-y-4">
                                                    <input value={formData.groomName} onChange={(e) => setFormData({ ...formData, groomName: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500" placeholder="Full Name" />
                                                    <ErrorMsg name="groomName" />
                                                    <input value={formData.groomShort} onChange={(e) => setFormData({ ...formData, groomShort: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500" placeholder="Short Name (URL)" />
                                                    <ErrorMsg name="groomShort" />
                                                    <input value={formData.groomImage} onChange={(e) => setFormData({ ...formData, groomImage: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-5 py-3 text-sm font-mono outline-none focus:border-blue-500" placeholder="Avatar URL" />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2 p-10 bg-blue-50/30 border-2 border-dashed border-blue-200 rounded-sm text-center">
                                                <p className="text-sm text-blue-400 mb-4">Instance Deployment URL</p>
                                                <div className="text-xl text-blue-600">
                                                    garasicetak.com/
                                                    <span className="underline decoration-wavy decoration-blue-600/30 underline-offset-8">
                                                        {formData.brideShort || "bride"}-dan-{formData.groomShort || "groom"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 2 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-sm text-gray-400">Bride Parentals</label>
                                                <textarea value={formData.brideParents} onChange={(e) => setFormData({ ...formData, brideParents: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-6 py-5 text-sm h-40 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium leading-relaxed" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-sm text-gray-400">Groom Parentals</label>
                                                <textarea value={formData.groomParents} onChange={(e) => setFormData({ ...formData, groomParents: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-6 py-5 text-sm h-40 outline-none focus:bg-white focus:border-blue-500 transition-all font-medium leading-relaxed" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="space-y-12">
                                            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-4">
                                                <p className="text-sm text-blue-600 mb-2">Akad Celebration</p>
                                                <input type="date" value={formData.akadDate} onChange={(e) => setFormData({ ...formData, akadDate: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" />
                                                <input value={formData.akadPlace} onChange={(e) => setFormData({ ...formData, akadPlace: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Venue Name" />
                                                <textarea value={formData.akadAddress} onChange={(e) => setFormData({ ...formData, akadAddress: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm h-24 outline-none focus:border-blue-500 transition-all" placeholder="Full Address" />
                                                <input value={formData.akadMaps} onChange={(e) => setFormData({ ...formData, akadMaps: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Google Maps URL (https://...)" />
                                            </div>
                                            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-4">
                                                <p className="text-sm text-slate-900 mb-2">Resepsi Wedding</p>
                                                <input type="date" value={formData.resepsiDate} onChange={(e) => setFormData({ ...formData, resepsiDate: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" />
                                                <input value={formData.resepsiPlace} onChange={(e) => setFormData({ ...formData, resepsiPlace: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Venue Name" />
                                                <textarea value={formData.resepsiAddress} onChange={(e) => setFormData({ ...formData, resepsiAddress: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm h-24 outline-none focus:border-blue-500 transition-all" placeholder="Full Address" />
                                                <input value={formData.resepsiMaps} onChange={(e) => setFormData({ ...formData, resepsiMaps: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500 transition-all" placeholder="Google Maps URL (https://...)" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-10">
                                            <div className="flex gap-3 bg-gray-50 p-6 rounded-sm border">
                                                <input id="galInput" className="bg-white border rounded-sm px-5 py-3 text-sm flex-1 outline-none font-mono" placeholder="Paste Image URL..." />
                                                <button onClick={() => { const el = document.getElementById('galInput') as HTMLInputElement; if (el.value) addGalleryItem(el.value); el.value = ''; }} className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-sm text-sm active:scale-95 transition-all">Import</button>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {getGallery().map((url: string, i: number) => (
                                                    <div key={i} className="relative aspect-[3/4] rounded-sm overflow-hidden group border border-gray-100">
                                                        <img src={fixImageUrl(url)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <button onClick={() => removeGalleryItem(i)} className="bg-rose-600 text-white p-2 rounded-full transform transition-all"><X size={16} strokeWidth={3} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 5 && (
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">Chronological Love Story</h3>
                                                <button onClick={addStory} className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 hover:bg-black text-white rounded-sm text-sm transition-all active:scale-95"><PlusCircle size={16} className="inline mr-2" /> Add Epoch</button>
                                            </div>
                                            <div className="space-y-6">
                                                {getStory().map((item: any, i: number) => (
                                                    <div key={i} className="p-8 bg-gray-50 border border-gray-200 rounded-sm flex flex-col md:flex-row gap-10 relative group transition-all hover:bg-white">
                                                        <button onClick={() => removeStory(i)} className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 text-sm flex items-center gap-1"><X size={12} strokeWidth={4} /> REMOVE</button>
                                                        <div className="w-10 md:w-44 h-44 rounded-sm bg-white shrink-0 overflow-hidden border border-gray-200 p-2">
                                                            {item.image ? <img src={fixImageUrl(item.image)} className="w-full h-full object-cover rounded-sm" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-200"><ImageIcon size={40} /><span className="text-sm mt-2">NO PREVIEW</span></div>}
                                                        </div>
                                                        <div className="flex-1 space-y-4">
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <input value={item.image} onChange={(e) => updateStory(i, "image", e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm font-mono" placeholder="Image URL" />
                                                                <input value={item.date} onChange={(e) => updateStory(i, "date", e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm" placeholder="Timeline Marker" />
                                                            </div>
                                                            <input value={item.title} onChange={(e) => updateStory(i, "title", e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm" placeholder="Event Designation" />
                                                            <textarea value={item.description} onChange={(e) => updateStory(i, "description", e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-4 py-2 text-sm h-24 outline-none resize-none leading-relaxed font-medium" placeholder="Narrative Matrix Content..." />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 6 && (
                                        <div className="p-8 bg-gray-50 border border-gray-200 rounded-sm space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-sm text-gray-400">Audio Master Source (MP3 / YouTube)</label>
                                                <input value={formData.musicUrl} onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm font-mono outline-none focus:border-blue-500" placeholder="PASTE URL SOURCE..." />
                                            </div>
                                            {formData.musicUrl && <div className="p-10 bg-white rounded-sm border flex items-center justify-center text-sm text-blue-600 animate-pulse">Streaming Core Active & Placeholder</div>}
                                        </div>
                                    )}

                                    {currentStep === 7 && (
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between border-b pb-6">
                                                <h3 className="text-sm text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-4">Digital Wallet Hub</h3>
                                                <button onClick={addBank} className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-sm transition-all"><PlusCircle size={16} className="inline mr-2" /> Add Account</button>
                                            </div>
                                            <div className="divide-y divide-gray-100">
                                                {getGifts().map((gift: any, i: number) => (
                                                    <div key={i} className="py-10 first:pt-0 animate-in fade-in duration-300">
                                                        <div className="flex items-center justify-between mb-8">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">0{i + 1}</div>
                                                                <h4 className="text-sm text-slate-400">Account Configuration</h4>
                                                            </div>
                                                            <button 
                                                                onClick={() => showConfirm("Hapus Rekening", "Hapus detail rekening ini?", () => { const cur = getGifts(); cur.splice(i, 1); setFormData({ ...formData, gifts: JSON.stringify(cur) }); setModal({ ...modal, show: false }); })}
                                                                className="text-sm text-rose-500 hover:underline flex items-center gap-2"
                                                            >
                                                                <X size={12} strokeWidth={4} /> Remove Account
                                                            </button>
                                                        </div>

                                                        <div className="space-y-10">
                                                            <div className="space-y-4">
                                                                <p className="text-sm text-slate-300 ml-1">1. Choose Financial Provider</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {["BRI", "Mandiri", "BSI", "BCA", "BTN", "Dana", "Gopay", "Ovo"].map((bank) => (
                                                                        <button
                                                                            key={bank}
                                                                            onClick={() => updateGifts(i, 'bankName', bank)}
                                                                            className={`px-4 py-2 text-sm transition-all border-b-2 ${gift.bankName === bank ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-400 hover:text-slate-600'}`}
                                                                        >
                                                                            {bank}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                                <div className="group space-y-2">
                                                                    <label className="text-sm text-slate-300 block ml-1 group-focus-within:text-blue-500 transition-colors">2. Account / Card Number</label>
                                                                    <input 
                                                                        value={gift.accountNo} 
                                                                        onChange={(e) => updateGifts(i, 'accountNo', e.target.value)} 
                                                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-sm font-mono outline-none focus:border-blue-500 transition-all placeholder:text-gray-200" 
                                                                        placeholder="Numbers only..." 
                                                                    />
                                                                </div>
                                                                <div className="group space-y-2">
                                                                    <label className="text-sm text-slate-300 block ml-1 group-focus-within:text-blue-500 transition-colors">3. Legal Holder Name</label>
                                                                    <input 
                                                                        value={gift.accountHolder} 
                                                                        onChange={(e) => updateGifts(i, 'accountHolder', e.target.value)} 
                                                                        className="w-full bg-transparent border-b border-gray-200 py-3 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-200" 
                                                                        placeholder="E.G. JESSICA DOE" 
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer Operational Control */}
                        <div className="bg-white border-t border-gray-100 p-8 flex items-center justify-between mt-auto">
                            <button onClick={prevStep} disabled={currentStep <= 1} className={`inline-flex items-center gap-3 px-8 py-3 rounded-sm text-sm transition-all border border-gray-200 bg-white ${currentStep <= 1 ? "opacity-0 invisible pointer-events-none" : "text-gray-500 hover:text-slate-900"}`}>
                                <ChevronLeft size={18} strokeWidth={3} /> Previous Stage
                            </button>
                             <div className="flex gap-3">
                                <button onClick={() => handleSubmit()} disabled={loading} className="inline-flex items-center gap-3 px-8 py-3 bg-white border border-gray-200 text-slate-400 hover:text-emerald-600 hover:border-emerald-600 rounded-sm text-sm transition-all">
                                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={3} />} Save
                                </button>
                                {currentStep === steps.length - 1 ? (
                                    <button onClick={() => handleSubmit(true)} disabled={loading} className="inline-flex items-center gap-3 px-8 py-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-sm text-sm transition-all">
                                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} strokeWidth={4} />} Finish Editing
                                    </button>
                                ) : (
                                    <button onClick={nextStep} className="inline-flex items-center gap-3 px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-sm text-sm transition-all">
                                        Next Stage <ArrowRight size={18} strokeWidth={4} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="text-center text-sm text-gray-300">Engine Ready: V2.3.0-Editor_Partition</div>
                </div>
            </div>
        </div>
    );
}

