import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { getWishes, getRSVPs, getGuests } from "@/app/actions/invitation";
import {
    Users,
    MessageSquare,
    CheckCircle2,
    XCircle,
    Clock,
    ArrowLeft,
    Heart,
    Link as LinkIcon,
    Calendar,
    ExternalLink,
    ChevronRight,
    Edit2,
    Trash2,
    Share2,
    Settings,
    Activity,
    Smartphone
} from "lucide-react";
import Link from "next/link";
import GuestManager from "@/components/GuestManager";
import DeleteInvitationButton from "@/components/DeleteInvitationButton";

export default async function InvitationManagePage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const session = await getServerSession();

    if (!session) redirect("/login");

    const invitation = await prisma.invitation.findUnique({
        where: { id, userId: session.user.id }
    });

    if (!invitation) notFound();

    const wishes = await getWishes(id);
    const rsvps = await getRSVPs(id);
    const guests = await getGuests(id);

    const stats = [
        { label: "Total Tamu", value: guests.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Konfirmasi Hadir", value: rsvps.filter((r: any) => r.status === 'ATTENDING').length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Ucapan & Doa", value: wishes.length, icon: MessageSquare, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
        { label: "Rasio Kehadiran", value: guests.length > 0 ? `${Math.round((rsvps.filter((r: any) => r.status === 'ATTENDING').length / guests.length) * 100)}%` : '0%', icon: Activity, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header & Navigation */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 overflow-hidden">
                <div className="space-y-4">
                    <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                        Infrastructure <ChevronRight size={10} className="mx-2" />
                        Invitations <ChevronRight size={10} className="mx-2" />
                        <span className="text-blue-600">Instance Management</span>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link href="/dashboard/invitations" className="w-12 h-12 rounded-sm bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                            <ArrowLeft size={20} className="text-gray-400" strokeWidth={2.5} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic leading-none">
                                {invitation.brideShort} & {invitation.groomShort}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{invitation.slug}</span>
                                <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(invitation.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href={`/${invitation.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-sm text-[10px] font-black text-slate-600 hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest"
                    >
                        <ExternalLink size={14} strokeWidth={3} /> LIVE PREVIEW
                    </Link>
                    <Link
                        href={`/dashboard/invitation/${id}/edit`}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 border border-blue-600 rounded-sm text-[10px] font-black text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest"
                    >
                        <Edit2 size={14} strokeWidth={3} /> EDIT CONTENT
                    </Link>
                    <DeleteInvitationButton
                        id={id}
                        redirectUrl="/dashboard/invitations"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-50 border border-rose-100 rounded-sm text-[10px] font-black text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm uppercase tracking-widest"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-100 p-6 rounded-sm shadow-xl shadow-slate-200/50 hover:border-blue-200 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2.5 rounded-sm ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                                <stat.icon size={20} strokeWidth={2.5} />
                            </div>
                            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Telemetry</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter text-slate-900 italic">{stat.value}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1 italic">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main: Guest Manager */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            <Users size={16} className="text-blue-600" strokeWidth={3} /> GUEST LIST ARCHIVE
                        </h2>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-sm shadow-2xl overflow-hidden min-h-[500px]">
                        <GuestManager invitationId={id} slug={invitation.slug} />
                    </div>
                </div>

                {/* Sidebar: Components */}
                <div className="space-y-8">
                    {/* RSVP List */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            <CheckCircle2 size={16} className="text-emerald-600" strokeWidth={3} /> CONFIRMATIONS
                        </h2>
                        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xl shadow-slate-200/30">
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-50">
                                        {rsvps.length === 0 ? (
                                            <tr>
                                                <td className="px-8 py-16 text-center text-gray-400 italic font-bold text-[10px] uppercase tracking-widest leading-loose">No Response Detected in the RSVP Buffer</td>
                                            </tr>
                                        ) : rsvps.map((rsvp: any) => (
                                            <tr key={rsvp.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-black text-xs tracking-tight text-slate-900 uppercase italic">{rsvp.name}</div>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm uppercase tracking-widest">{rsvp.status}</span>
                                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">• {rsvp.total} PAX</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Wishes List */}
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 italic">
                            <MessageSquare size={16} className="text-amber-600" strokeWidth={3} /> WISHES LOG
                        </h2>
                        <div className="space-y-4">
                            {wishes.length === 0 ? (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-sm p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-[9px] italic leading-loose">
                                    Awaiting Incoming Data Stream...
                                </div>
                            ) : wishes.slice(0, 5).map((wish: any) => (
                                <div key={wish.id} className="bg-white border border-gray-100 p-5 rounded-sm shadow-md transition-all hover:border-blue-200 hover:shadow-xl">
                                    <div className="font-black text-blue-600 text-[10px] mb-2 uppercase tracking-widest italic border-b border-blue-50 pb-1 inline-block">{wish.name}</div>
                                    <p className="text-slate-600 text-[11px] leading-relaxed font-bold italic italic">"{wish.message}"</p>
                                </div>
                            ))}
                            {wishes.length > 5 && (
                                <button className="w-full py-3 text-[10px] font-black text-gray-400 hover:text-blue-600 transition-colors uppercase tracking-[0.3em]">View Extended Log &rarr;</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
