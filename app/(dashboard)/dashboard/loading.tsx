export default function DashboardLoading() {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
            <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-blue-50 border-t-blue-600 animate-spin shadow-lg shadow-blue-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900 italic">Processing</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Requesting infrastructure data...</span>
            </div>
        </div>
    );
}
