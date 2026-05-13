import { Heart, Users, Palette, Activity, Smartphone, Laptop, Tablet as TabletIcon, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import AdvancedVisitorChart from "@/components/AdvancedVisitorChart";

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session) return <div className="p-8 text-center font-medium text-gray-400 text-sm">Sesi Berakhir. Harap Login Kembali.</div>;

    // Fetch Invitations with Theme relation
    const myInvitations = await prisma.invitation.findMany({
        where: { userId: session.user.id },
        include: { theme: true },
        orderBy: { createdAt: 'desc' }
    });

    // Time range for analytics (last 1 year)
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const visitLogs = await prisma.visitLog.findMany({
        where: {
            invitation: { userId: session.user.id },
            createdAt: { gte: oneYearAgo }
        },
        orderBy: { createdAt: 'asc' }
    });

    // Analytics Calculations
    const totalViews = myInvitations.reduce((acc, inv) => acc + (inv.views || 0), 0);
    const uniqueThemes = new Set(myInvitations.map(inv => inv.themeId)).size;
    
    // Quick Stats for Top Row
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentLogs = visitLogs.filter(l => new Date(l.createdAt) >= sevenDaysAgo);

    // Device Analytics
    const devices = visitLogs.reduce((acc: any, log) => {
        const type = log.deviceType || "Desktop";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, { Mobile: 0, Desktop: 0, Tablet: 0 });

    const totalLogs = visitLogs.length || 1;
    const devicePercentages = {
        Mobile: Math.round((devices.Mobile / totalLogs) * 100),
        Desktop: Math.round((devices.Desktop / totalLogs) * 100),
        Tablet: Math.round((devices.Tablet / totalLogs) * 100)
    };

    // Theme Stats
    const themeStatsMap = myInvitations.reduce((acc: any, inv) => {
        const themeName = inv.theme?.name || "Unknown";
        if (!acc[themeName]) {
            const themeId = (inv.themeId || '').toLowerCase();
            acc[themeName] = { 
                count: 0, 
                views: 0, 
                color: themeId.includes('blue') ? 'bg-blue-600' : 
                       themeId.includes('red') ? 'bg-rose-600' : 
                       themeId.includes('pink') ? 'bg-pink-500' : 
                       'bg-amber-600' 
            };
        }
        acc[themeName].count += 1;
        acc[themeName].views += (inv.views || 0);
        return acc;
    }, {});

    const sortedThemes = Object.entries(themeStatsMap)
        .map(([name, data]: [string, any]) => ({ name, ...data }))
        .sort((a, b) => b.views - a.views);

    const stats = [
        { label: "Undangan Aktif", value: myInvitations.length.toString(), icon: Heart, color: "text-blue-600", bg: "bg-blue-500/5", border: "border-blue-500/10" },
        { label: "Unique Visitors (7D)", value: recentLogs.length.toLocaleString(), icon: Users, color: "text-emerald-600", bg: "bg-emerald-500/5", border: "border-emerald-500/10" },
        { label: "Total Page Views", value: totalViews.toLocaleString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-500/5", border: "border-amber-500/10" },
        { label: "Tema Terpakai", value: uniqueThemes.toString(), icon: Palette, color: "text-indigo-600", bg: "bg-indigo-500/5", border: "border-indigo-500/10" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-[2px] bg-blue-600 rounded-full" />
                        <span className="text-sm text-blue-600">Market Intelligence Terminal</span>
                    </div>
                    <h1 className="text-3xl  text-slate-900 leading-none">
                        ANALYTICS COMMAND CENTER
                    </h1>
                    <p className="text-sm text-gray-400 font-medium mt-2">Welcome, {session.user.name} // Pusat kendali monitoring trafik dan performa platform.</p>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`p-7 bg-white border ${stat.border} rounded-sm transition-all group relative overflow-hidden hover:shadow-xl hover:shadow-slate-100`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-2.5 rounded-sm ${stat.bg} ${stat.color}`}>
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-sm text-gray-400 leading-none">Terminal Data</span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-4xl  text-slate-900 tabular-nums leading-none">{stat.value}</div>
                            <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Analytics Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8">
                    <AdvancedVisitorChart logs={visitLogs} />
                </div>

                {/* Device Distribution */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-sm flex items-center gap-3 text-slate-900 leading-none">
                            <Smartphone size={16} className="text-blue-600" /> Device Distribution
                        </h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm space-y-8">
                        {[
                            { label: 'Mobile', icon: Smartphone, percentage: devicePercentages.Mobile, color: 'bg-blue-600' },
                            { label: 'Desktop', icon: Laptop, percentage: devicePercentages.Desktop, color: 'bg-slate-900' },
                            { label: 'Tablet', icon: TabletIcon, percentage: devicePercentages.Tablet, color: 'bg-emerald-500' }
                        ].map((dev, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-1.5 rounded-sm ${dev.color} text-white`}>
                                            <dev.icon size={12} />
                                        </div>
                                        <span className="text-sm text-slate-900">{dev.label}</span>
                                    </div>
                                    <span className="text-sm text-slate-900">{dev.percentage}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <div className={`h-full ${dev.color} transition-all duration-1000`} style={{ width: `${dev.percentage}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Template Performance */}
                <div className="lg:col-span-12 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-sm flex items-center gap-3 text-slate-900 leading-none">
                            <Palette size={16} className="text-blue-600" /> Template Engagement Analysis
                        </h2>
                    </div>
                    <div className="bg-white border border-gray-100 rounded-sm p-8 shadow-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {sortedThemes.map((theme, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-sm text-slate-900  leading-none">{theme.name}</p>
                                            <p className="text-sm text-gray-400 font-medium mt-2">{theme.count} Active Projects</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl text-slate-900 leading-none">{theme.views.toLocaleString()}</p>
                                            <p className="text-sm text-blue-500 mt-1 leading-none">TOTAL VIEWS</p>
                                        </div>
                                    </div>
                                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${theme.color} transition-all duration-1000`} 
                                            style={{ width: `${(theme.views / (totalViews || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
