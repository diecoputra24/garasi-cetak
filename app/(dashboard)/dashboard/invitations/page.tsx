import {
    Heart,
    ExternalLink,
    Edit2,
    Users,
    Search,
    Filter,
    Plus,
    ChevronRight,
    MoreHorizontal,
    Eye,
    Trash2,
    CloudIcon,
    ArrowRight,
    Settings
} from "lucide-react";
import Link from "next/link";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function InvitationsListPage() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    const invitations = await prisma.invitation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="space-y-3">
                    <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-[0.3em] font-black">
                        Infrastructure <ChevronRight size={10} className="mx-2" strokeWidth={3} />
                        <span className="text-blue-500 italic">Invitations Registry</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic leading-none">
                        INSTANCES CATALOG
                    </h1>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Operational view of all active and pending invitation containers.</p>
                </div>

            </div>

            {/* Catalog Controller */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <div className="p-6 bg-gray-50/50 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH BY COUPLE OR SLUG..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-sm text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-sm text-[10px] font-black text-slate-500 hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest italic group">
                            <Filter size={14} className="group-hover:rotate-180 transition-transform" /> Filter Operational Status
                        </button>
                    </div>
                </div>

                {invitations.length === 0 ? (
                    <div className="p-32 text-center bg-white">
                        <div className="relative inline-block mb-6">
                            <CloudIcon className="w-20 h-20 text-gray-50" strokeWidth={1} />
                            <Plus className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-100" />
                        </div>
                        <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-xs mb-2 italic">Null Data Ingress</p>
                        <p className="text-[10px] text-gray-400 mb-8 font-black uppercase tracking-widest leading-loose max-w-sm mx-auto">No operational invitation containers found in this partition. Create your first project to begin deployment.</p>
                        <Link href="/dashboard/builder" className="inline-flex items-center gap-3 text-blue-600 font-extrabold text-[11px] uppercase tracking-[0.3em] hover:text-black transition-colors group">
                           DEPLOY INSTANCE <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Database Record / Couple</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Status</th>
                                    <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Deployment Date</th>
                                    <th className="px-8 py-5 text-right text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Operational Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {invitations.map((inv) => (
                                    <tr key={inv.id} className="hover:bg-blue-50/20 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-12 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Heart className="w-5 h-5 text-blue-600" strokeWidth={3} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-[13px] text-slate-900 uppercase italic tracking-tight">{inv.brideShort} & {inv.groomShort}</div>
                                                    <div className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1 italic">URL: /{inv.slug}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${inv.status === 'ACTIVE'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                }`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest italic tabular-nums">
                                            {new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(inv.createdAt))}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={`/dashboard/invitation/${inv.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 text-[10px] font-black text-white bg-blue-600 rounded-sm hover:bg-slate-950 transition-all border border-blue-600 uppercase tracking-widest italic"
                                                >
                                                    <Settings size={14} strokeWidth={3} />
                                                    Manage
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
}