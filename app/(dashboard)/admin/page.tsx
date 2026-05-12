import { Users, Heart, Shield, TrendingUp, Search } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="w-8 h-8 text-amber-500" />
                        Admin Panel
                    </h1>
                    <p className="text-gray-500">Overview of Garasi Cetak platform statistics.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500" 
                            placeholder="Cari user/undangan..."
                        />
                    </div>
                </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                        <Users className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">128</div>
                        <div className="text-sm text-gray-500">Total Pengguna</div>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-rose-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">452</div>
                        <div className="text-sm text-gray-500">Undangan Dibuat</div>
                    </div>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold">Rp 12,4M</div>
                        <div className="text-sm text-gray-500">Revenue (Estimasi)</div>
                    </div>
                </div>
            </div>

            {/* User List Table Placeholder */}
            <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Pengguna Terbaru</h3>
                    <button className="text-sm text-rose-500 hover:underline">Lihat Semua</button>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-xs text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">User</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Tgl Daftar</th>
                            <th className="px-6 py-4 font-medium text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {[
                            { name: "Andi Wijaya", email: "andi@mail.com", role: "user", date: "11 Apr 2026" },
                            { name: "Admin Utama", email: "admin@gc.com", role: "admin", date: "01 Mar 2026" },
                        ].map((user, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-amber-500" />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                                        user.role === 'admin' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-sm">Aktif</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
