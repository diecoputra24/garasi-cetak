import { Users, Heart, Shield, TrendingUp, Search } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Panel</h1>
                    <p className="text-muted-foreground text-gray-500 mt-1">Overview of Garasi Cetak platform statistics.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input 
                            className="w-full bg-white border border-gray-200 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900 placeholder:text-gray-400" 
                            placeholder="Cari user/undangan..."
                        />
                    </div>
                </div>
            </div>

            {/* Admin Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Total Pengguna</div>
                        <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">128</div>
                </div>
                <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Undangan Dibuat</div>
                        <Heart className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">452</div>
                </div>
                <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-500">Revenue (Estimasi)</div>
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">Rp 12,4M</div>
                </div>
            </div>

            {/* User List Table Placeholder */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-lg tracking-tight text-slate-900">Pengguna Terbaru</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50/50">
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-3 font-medium text-gray-500">User</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Tgl Daftar</th>
                                <th className="px-6 py-3 font-medium text-right text-gray-500">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {[
                                { name: "Andi Wijaya", email: "andi@mail.com", role: "user", date: "11 Apr 2026" },
                                { name: "Admin Utama", email: "admin@gc.com", role: "admin", date: "01 Mar 2026" },
                            ].map((user, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{user.name}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                                            user.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <span className="text-slate-700">Aktif</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
