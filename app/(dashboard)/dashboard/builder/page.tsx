"use client";

import { useState, Suspense } from "react";
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
    PenTool,
    ArrowRight,
    AlertCircle,
    Info,
    CheckCircle2,
    ArrowLeft,
    Trash2
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { createInvitation } from "@/app/actions/invitation";
import Link from "next/link";
import { toast } from "sonner";

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

function BuilderContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const themeIdFromUrl = searchParams.get("theme") || "modern-floral-red";

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const bankList = ["BRI", "Mandiri", "BSI", "BJB", "BTN", "DANA", "ShopeePay", "BCA", "BNI", "QRIS", "OVO", "GoPay", "LinkAja"];

    const [modal, setModal] = useState<{
        show: boolean;
        type: 'confirm' | 'alert' | 'success' | 'error';
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({ show: false, type: 'alert', title: '', message: '' });

    const [formData, setFormData] = useState({
        themeId: themeIdFromUrl || "",
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
        akadTime: "08:00 - Selesai",
        akadPlace: "",
        akadAddress: "",
        akadMaps: "",
        resepsiDate: "",
        resepsiTime: "11:00 - Selesai",
        resepsiPlace: "",
        resepsiAddress: "",
        resepsiMaps: "",
        gallery: JSON.stringify([]),
        gifts: JSON.stringify([{ bankName: "", accountNo: "", accountHolder: "" }]),
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        story: JSON.stringify([]),
    });

    const showAlert = (title: string, message: string, type: 'success' | 'error' | 'alert' = 'alert') => {
        setModal({ show: true, type, title, message });
    };

    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setModal({ show: true, type: 'confirm', title, message, onConfirm });
    };

    const getGifts = () => { try { return JSON.parse(formData.gifts); } catch { return []; } };
    const updateGifts = (index: number, field: string, value: string) => {
        const current = getGifts();
        current[index][field] = value;
        setFormData({ ...formData, gifts: JSON.stringify(current) });
    };
    const addBank = () => {
        const current = getGifts();
        setFormData({ ...formData, gifts: JSON.stringify([...current, { bankName: "", accountNo: "", accountHolder: "" }]) });
    };
    const removeBank = (index: number) => {
        const current = getGifts();
        current.splice(index, 1);
        setFormData({ ...formData, gifts: JSON.stringify(current) });
    };

    const getGallery = () => { try { return JSON.parse(formData.gallery); } catch { return []; } };
    const addGalleryItem = (url: string) => {
        const current = getGallery();
        setFormData({ ...formData, gallery: JSON.stringify([...current, url]) });
    };
    const removeGalleryItem = (index: number) => {
        const current = getGallery();
        current.splice(index, 1);
        setFormData({ ...formData, gallery: JSON.stringify(current) });
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
        const current = getStory();
        current.splice(index, 1);
        setFormData({ ...formData, story: JSON.stringify(current) });
    };

    const fixImageUrl = (url: string) => {
        if (!url) return "";
        if (url.includes('drive.google.com')) {
            const gid = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
            if (gid) return `https://drive.google.com/thumbnail?id=${gid}&sz=w1000`;
        }
        return url;
    };

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};
        const s = steps[step].id;
        if (s === "tema" && !formData.themeId) newErrors.themeId = "Wajib.";
        else if (s === "mempelai") {
            if (!formData.brideName) newErrors.brideName = "Wajib.";
            if (!formData.groomName) newErrors.groomName = "Wajib.";
        } else if (s === "acara") {
            if (!formData.akadDate) newErrors.akadDate = "Wajib.";
            if (!formData.resepsiDate) newErrors.resepsiDate = "Wajib.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => { if (validateStep(currentStep)) { setCurrentStep(prev => prev + 1); setErrors({}); window.scrollTo(0, 0); } };
    const prevStep = () => { setCurrentStep(prev => prev - 1); setErrors({}); window.scrollTo(0, 0); };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;
        setLoading(true);
        try {
            const res = await createInvitation({
                ...formData,
                akadDate: formData.akadDate ? new Date(formData.akadDate) : null,
                resepsiDate: formData.resepsiDate ? new Date(formData.resepsiDate) : null,
            }) as any;

            showAlert('Deployment Success', 'Project invitation baru telah berhasil dideploy.', 'success');
            setTimeout(() => {
                if (res?.id) router.push(`/dashboard/invitation/${res.id}`);
            }, 1000);
        } catch (error) {
            showAlert('Error', 'Gagal memproses inisialisasi invitation.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const ErrorMsg = ({ name }: { name: string }) => errors[name] ? (
        <span className="text-sm font-medium text-rose-500 mt-1 block">{errors[name]}</span>
    ) : null;

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20 animate-in fade-in duration-700">
            <SuccessModal modal={modal} setModal={setModal} />
            {/* Header Area */}

            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="space-y-4">
                    <div className="flex items-center text-sm text-gray-400">
                        Infrastructure <ChevronRight size={10} className="mx-2" />
                        <span className="text-blue-500">Full Configuration Deployment</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-sm bg-blue-600 flex items-center justify-center text-white"><PenTool size={28} strokeWidth={2.5} /></div>
                        <div>
                            <h1 className="text-3xl  text-slate-900 leading-none">NEW INVITATION</h1>
                            <p className="text-sm text-gray-500 font-medium mt-2">Deploying a new complete instance of digital invitation framework.</p>
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

                        // Helper for UI check ONLY (no state updates)
                        const isStepValid = (sIdx: number) => {
                            const s = steps[sIdx].id;
                            if (s === "tema") return !!formData.themeId;
                            if (s === "mempelai") return formData.brideName && formData.groomName;
                            if (s === "acara") return formData.akadDate && formData.resepsiDate;
                            return true;
                        };

                        // Builder: Only allow jumping back, or moving forward to the immediate next step if current is valid
                        const canNavigate = index <= currentStep || (index === currentStep + 1 && isStepValid(currentStep));
                        const isCompleted = currentStep > index;
                        
                        return (
                            <button
                                key={step.id}
                                onClick={() => { if (canNavigate) { setCurrentStep(index); setErrors({}); window.scrollTo(0, 0); } }}
                                className={`w-full flex items-center gap-4 px-6 py-5 rounded-sm transition-all border-l-4 ${isActive ? "bg-blue-50/50 border-blue-600 text-blue-600" : canNavigate ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50/30" : "border-transparent text-gray-200 cursor-not-allowed opacity-50"}`}
                            >
                                {isCompleted ? <Check size={18} strokeWidth={4} /> : <Icon size={18} strokeWidth={isActive ? 3 : 2} />}
                                <p className={`text-sm ${isActive ? 'italic' : ''}`}>{step.title}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-8">
                    <div className="bg-white border border-gray-200 rounded-sm min-h-[600px] flex flex-col overflow-hidden">
                        {/* Progress Bar */}
                        <div className="h-1 bg-gray-50 w-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-600"
                                initial={{ width: "0%" }}
                                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>

                        <div className="flex-1 p-8 md:p-14">
                            <AnimatePresence mode="wait">
                                <motion.div key={currentStep} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                                    <div className="border-b border-gray-100 pb-10 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl  text-slate-900 flex items-center gap-3 leading-none">
                                                {(() => { const Icon = steps[currentStep].icon; return <Icon size={22} className="text-blue-600" strokeWidth={3} />; })()}
                                                {steps[currentStep].title}
                                            </h2>
                                            <p className="text-sm text-gray-400 font-medium mt-2">Configuring parameters for {steps[currentStep].id} module.</p>
                                        </div>
                                        <div className="text-sm text-blue-600/20">Stage 0{currentStep + 1}</div>
                                    </div>

                                    {/* Content Switcher */}
                                    {currentStep === 0 && (
                                        <div className="grid grid-cols-1 gap-4">
                                            {themes.map((theme) => (
                                                <div key={theme.id} onClick={() => setFormData({ ...formData, themeId: theme.id })} className={`p-8 rounded-sm border-2 transition-all cursor-pointer flex items-center justify-between group ${formData.themeId === theme.id ? "bg-blue-50/30 border-blue-600" : "bg-white border-gray-100 hover:border-gray-300"}`}>
                                                    <div className="flex items-center gap-8">
                                                        <div className={`w-16 h-16 rounded-full border-4 border-white ${theme.color}`} />
                                                        <div>
                                                            <p className="font-black text-base  text-slate-900">{theme.name}</p>
                                                            <p className="text-sm text-gray-400 mt-1">Official System Preset</p>
                                                        </div>
                                                    </div>
                                                    {formData.themeId === theme.id && <Check size={20} strokeWidth={5} className="text-blue-600" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {currentStep === 1 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                            <div className="space-y-8">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-blue-600 pl-4 underline underline-offset-8 decoration-blue-500/20">The Bride</h3>
                                                <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Full Legal Name</label>
                                                        <input value={formData.brideName} onChange={(e) => setFormData({ ...formData, brideName: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="E.G. JESSICA DOE" />
                                                        <ErrorMsg name="brideName" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Short Name (For URL)</label>
                                                        <input value={formData.brideShort} onChange={(e) => setFormData({ ...formData, brideShort: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="E.G. JESSICA" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Avatar URL</label>
                                                        <input value={formData.brideImage} onChange={(e) => setFormData({ ...formData, brideImage: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm font-mono outline-none focus:border-blue-500 transition-all" placeholder="Paste URL..." />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-slate-900 pl-4 underline underline-offset-8 decoration-slate-900/20">The Groom</h3>
                                                <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-6">
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Full Legal Name</label>
                                                        <input value={formData.groomName} onChange={(e) => setFormData({ ...formData, groomName: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="E.G. JOHN DOE" />
                                                        <ErrorMsg name="groomName" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Short Name (For URL)</label>
                                                        <input value={formData.groomShort} onChange={(e) => setFormData({ ...formData, groomShort: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none focus:border-blue-500 transition-all" placeholder="E.G. JOHN" />
                                                    </div>
                                                    <div className="space-y-3">
                                                        <label className="text-sm text-gray-400">Avatar URL</label>
                                                        <input value={formData.groomImage} onChange={(e) => setFormData({ ...formData, groomImage: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm font-mono outline-none focus:border-blue-500 transition-all" placeholder="Paste URL..." />
                                                    </div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                            <div className="space-y-6">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-blue-600 pl-4 underline underline-offset-8 decoration-blue-500/20">Bride Lineage</h3>
                                                <textarea value={formData.brideParents} onChange={(e) => setFormData({ ...formData, brideParents: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-8 py-6 text-sm h-48 outline-none font-medium leading-relaxed focus:bg-white focus:border-blue-500 transition-all" />
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-sm text-slate-900 border-l-4 border-slate-900 pl-4 underline underline-offset-8 decoration-slate-900/20">Groom Lineage</h3>
                                                <textarea value={formData.groomParents} onChange={(e) => setFormData({ ...formData, groomParents: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-8 py-6 text-sm h-48 outline-none font-medium leading-relaxed focus:bg-white focus:border-blue-500 transition-all" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 3 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-6">
                                                <p className="text-sm text-blue-600 mb-4">Akad Celebration</p>
                                                <input type="date" value={formData.akadDate} onChange={(e) => setFormData({ ...formData, akadDate: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" />
                                                <input value={formData.akadPlace} onChange={(e) => setFormData({ ...formData, akadPlace: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" placeholder="Venue Name" />
                                                <textarea value={formData.akadAddress} onChange={(e) => setFormData({ ...formData, akadAddress: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm h-24 outline-none" placeholder="Full Address..." />
                                                <input value={formData.akadMaps} onChange={(e) => setFormData({ ...formData, akadMaps: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" placeholder="Google Maps URL (https://...)" />
                                            </div>
                                            <div className="bg-gray-50 p-8 rounded-sm border border-gray-100 space-y-6">
                                                <p className="text-sm text-slate-900 mb-4">Resepsi Wedding</p>
                                                <input type="date" value={formData.resepsiDate} onChange={(e) => setFormData({ ...formData, resepsiDate: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" />
                                                <input value={formData.resepsiPlace} onChange={(e) => setFormData({ ...formData, resepsiPlace: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" placeholder="Venue Name" />
                                                <textarea value={formData.resepsiAddress} onChange={(e) => setFormData({ ...formData, resepsiAddress: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm h-24 outline-none" placeholder="Full Address..." />
                                                <input value={formData.resepsiMaps} onChange={(e) => setFormData({ ...formData, resepsiMaps: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm outline-none" placeholder="Google Maps URL (https://...)" />
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 4 && (
                                        <div className="space-y-10 animate-in fade-in duration-500">
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-sm p-2 gap-2 focus-within:border-blue-500 transition-all">
                                                <div className="w-10 h-10 rounded-sm bg-white border border-gray-100 flex items-center justify-center text-blue-600 shrink-0">
                                                    <ImageIcon size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-400 ml-1 mb-0.5">Visual Asset URL</p>
                                                    <input 
                                                        id="galInput" 
                                                        className="w-full bg-transparent border-none px-1 py-1 text-sm outline-none font-mono focus:ring-0" 
                                                        placeholder="Paste image link here..." 
                                                    />
                                                </div>
                                                <button 
                                                    onClick={() => { const el = document.getElementById('galInput') as HTMLInputElement; if (el.value) addGalleryItem(el.value); el.value = ''; }} 
                                                    className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-sm active:scale-95 transition-all flex items-center gap-2"
                                                >
                                                    <PlusCircle size={14} /> Add
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between border-b pb-4">
                                                    <h3 className="text-sm text-gray-400">Curated Assets ({getGallery().length})</h3>
                                                </div>

                                                {getGallery().length === 0 ? (
                                                    <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-sm bg-gray-50/30">
                                                        <Camera size={40} className="text-gray-200 mb-4" />
                                                        <p className="text-sm font-medium text-gray-400">No assets deployed yet</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                                        {getGallery().map((url: string, i: number) => (
                                                            <motion.div 
                                                                key={i} 
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                className="aspect-[4/5] relative group rounded-sm overflow-hidden border border-gray-100 bg-gray-50"
                                                            >
                                                                <img src={fixImageUrl(url)} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                                <button 
                                                                    onClick={() => removeGalleryItem(i)} 
                                                                    className="absolute top-3 right-3 bg-white text-rose-600 p-2.5 rounded-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-rose-600 hover:text-white"
                                                                >
                                                                    <Trash2 size={14} strokeWidth={3} />
                                                                </button>
                                                                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                                    <p className="text-sm text-white">Asset #{i + 1}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
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
                                                    <div key={i} className="p-8 bg-gray-50 border rounded-sm relative space-y-6 animate-in slide-in-from-top-2 duration-300">
                                                        <button onClick={() => removeStory(i)} className="absolute top-6 right-6 text-gray-300 hover:text-rose-500 transition-colors"><X size={20} /></button>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-4">
                                                                <input value={item.title} onChange={(e) => updateStory(i, 'title', e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm outline-none focus:border-blue-500" placeholder="Epoch Title (e.g. First Meeting)" />
                                                                <input value={item.date} onChange={(e) => updateStory(i, 'date', e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm font-mono outline-none focus:border-blue-500" placeholder="Date (e.g. 21 June 2020)" />
                                                                <input value={item.image} onChange={(e) => updateStory(i, 'image', e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-3 text-sm font-mono outline-none focus:border-blue-500" placeholder="Illustration Image URL" />
                                                            </div>
                                                            <textarea value={item.description} onChange={(e) => updateStory(i, 'description', e.target.value)} className="w-full bg-white border border-gray-200 rounded-sm px-5 py-4 text-sm h-full outline-none leading-relaxed" placeholder="Tell the details of this story..." />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 6 && (
                                        <div className="space-y-8">
                                            <h3 className="text-sm text-slate-900 underline decoration-blue-500 decoration-2 underline-offset-4">Atmospheric Background Audio</h3>
                                            <div className="bg-gray-50 p-10 rounded-sm border border-gray-100 flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-sm bg-slate-900 flex items-center justify-center text-white"><Music size={28} /></div>
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-sm text-gray-400">Audio Stream URL (.mp3)</label>
                                                    <input value={formData.musicUrl} onChange={(e) => setFormData({ ...formData, musicUrl: e.target.value })} className="w-full bg-white border border-gray-200 rounded-sm px-6 py-4 text-sm font-mono outline-none focus:border-blue-500" placeholder="https://..." />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {currentStep === 7 && (
                                        <div className="space-y-10">
                                            <div className="flex items-center justify-between border-b pb-6">
                                                <h3 className="text-sm text-slate-900 underline decoration-emerald-500 decoration-2 underline-offset-4">Digital Wallet Hub</h3>
                                                <button onClick={addBank} className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-sm text-sm transition-all active:scale-95"><PlusCircle size={16} className="inline mr-2" /> Add Account</button>
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
                                                                onClick={() => removeBank(i)} 
                                                                className="text-sm text-rose-500 hover:underline flex items-center gap-2"
                                                            >
                                                                <Trash2 size={12} /> Remove Account
                                                            </button>
                                                        </div>

                                                        <div className="space-y-10">
                                                            <div className="space-y-4">
                                                                <p className="text-sm text-slate-300 ml-1">1. Choose Financial Provider</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {bankList.map(bank => (
                                                                        <button
                                                                            key={bank}
                                                                            onClick={() => updateGifts(i, 'bankName', bank)}
                                                                            className={`px-4 py-2 text-sm transition-all border-b-2 ${gift.bankName === bank ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50' : 'border-transparent text-gray-400 hover:text-slate-600'}`}
                                                                        >
                                                                            {bank}
                                                                        </button>
                                                                    ))}
                                                                    <input 
                                                                        value={bankList.includes(gift.bankName) ? "" : gift.bankName}
                                                                        onChange={(e) => updateGifts(i, 'bankName', e.target.value)}
                                                                        className="px-4 py-2 text-sm border-b-2 border-dashed border-gray-200 outline-none w-32 bg-transparent focus:border-blue-500 transition-all"
                                                                        placeholder="Custom..."
                                                                    />
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

                        {/* Footer Controls */}
                        <div className="bg-white border-t border-gray-100 p-8 flex items-center justify-between mt-auto">
                            <button onClick={prevStep} disabled={currentStep === 0} className={`inline-flex items-center gap-3 px-8 py-3 rounded-sm text-sm transition-all border border-gray-200 bg-white ${currentStep === 0 ? "opacity-0 invisible" : "text-gray-500 hover:text-slate-900"}`}>
                                <ChevronLeft size={18} strokeWidth={3} /> Previous Stage
                            </button>
                            <div className="flex gap-4">
                                {currentStep < steps.length - 1 ? (
                                    <button onClick={nextStep} className="inline-flex items-center gap-4 px-10 py-4 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-sm text-sm transition-all">
                                        Next Stage <ArrowRight size={20} strokeWidth={4} />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} disabled={loading} className="inline-flex items-center gap-4 px-10 py-4 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-sm text-sm transition-all">
                                        {loading ? <Loader2 size={20} className="animate-spin" /> : <PenTool size={20} strokeWidth={3} />} Finalize & Deploy
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BuilderPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <BuilderContent />
        </Suspense>
    );
}

function SuccessModal({ modal, setModal }: { modal: any, setModal: any }) {
    return (
        <AnimatePresence>
            {modal.show && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-[4px]" 
                        onClick={() => setModal({ ...modal, show: false })}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.95, y: 10 }} 
                        className="relative bg-white border border-gray-100 w-full max-w-sm rounded-sm p-8 shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            {modal.type === 'success' ? <CheckCircle2 size={20} className="text-emerald-500" /> :
                                modal.type === 'error' ? <AlertCircle size={20} className="text-rose-500" /> :
                                    <Info size={20} className="text-blue-500" />}
                            <h3 className="text-sm text-slate-900 leading-none">{modal.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-8 font-medium leading-relaxed">{modal.message}</p>
                        <div className="flex justify-end">
                            <button 
                                onClick={() => setModal({ ...modal, show: false })} 
                                className={`px-10 py-3 ${modal.type === 'success' ? 'bg-emerald-600 hover:bg-emerald-700' : modal.type === 'error' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-900 hover:bg-black'} text-sm text-white rounded-sm active:scale-95 transition-all shadow-xl`}
                            >
                                Mengerti
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

