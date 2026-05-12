"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Clock, Calendar, Maximize2, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";

// Dynamic import to avoid SSR issues with ApexCharts
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface VisitLog {
    id: string;
    createdAt: string | Date;
    deviceType: string;
}

interface Props {
    logs: VisitLog[];
}

type TimeRange = '30m' | '1h' | '6h' | '12h' | '1d' | '7d' | '15d' | '1m' | '3m' | '6m' | '1y';

export default function AdvancedVisitorChart({ logs }: Props) {
    const [range, setRange] = useState<TimeRange>('7d');
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Filter and Group Data based on Range
    const series = useMemo(() => {
        if (!mounted) return [{ name: 'Visitors', data: [] }];
        const now = new Date();
        let filteredLogs = logs.map(l => ({
            ...l,
            date: new Date(l.createdAt)
        }));

        // 1. Filter based on range
        const rangeMs: Record<TimeRange, number> = {
            '30m': 30 * 60 * 1000,
            '1h': 60 * 60 * 1000,
            '6h': 6 * 60 * 60 * 1000,
            '12h': 12 * 60 * 60 * 1000,
            '1d': 24 * 60 * 60 * 1000,
            '7d': 7 * 24 * 60 * 60 * 1000,
            '15d': 15 * 24 * 60 * 60 * 1000,
            '1m': 30 * 24 * 60 * 60 * 1000,
            '3m': 90 * 24 * 60 * 60 * 1000,
            '6m': 180 * 24 * 60 * 60 * 1000,
            '1y': 365 * 24 * 60 * 60 * 1000,
        };

        const startTime = now.getTime() - rangeMs[range];
        filteredLogs = filteredLogs.filter(l => l.date.getTime() >= startTime);

        // 2. Determine Grouping Interval
        let intervalMs = 60 * 1000; // default 1 min
        if (range === '1d') intervalMs = 60 * 60 * 1000; // 1 hour
        if (range === '7d' || range === '15d' || range === '1m') intervalMs = 24 * 60 * 60 * 1000; // 1 day
        if (range === '3m' || range === '6m' || range === '1y') intervalMs = 30 * 24 * 60 * 60 * 1000; // 1 month
        if (range === '1h' || range === '6h' || range === '12h') intervalMs = 15 * 60 * 1000; // 15 mins

        // 3. Aggregate
        const groups: Record<number, number> = {};
        filteredLogs.forEach(l => {
            const bucket = Math.floor(l.date.getTime() / intervalMs) * intervalMs;
            groups[bucket] = (groups[bucket] || 0) + 1;
        });

        // 4. Fill gaps with 0
        const data: [number, number][] = [];
        for (let t = Math.floor(startTime / intervalMs) * intervalMs; t <= now.getTime(); t += intervalMs) {
            data.push([t, groups[t] || 0]);
        }

        return [{
            name: 'Visitors',
            data: data
        }];
    }, [logs, range, mounted]);

    const options: any = {
        chart: {
            id: 'visitor-chart',
            type: 'line',
            height: 350,
            zoom: {
                autoScaleYaxis: true,
                type: 'x',
                enabled: true
            },
            toolbar: {
                autoSelected: 'zoom',
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            },
            fontFamily: 'inherit',
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 4,
            colors: ['#fff'],
            strokeColors: '#2563eb',
            strokeWidth: 2,
            hover: {
                size: 7,
            }
        },
        title: {
            text: undefined,
        },
        colors: ['#2563eb'],
        stroke: {
            show: true,
            curve: 'straight',
            width: 3,
            lineCap: 'round'
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    colors: '#94a3b8',
                    fontWeight: 700,
                    fontSize: '10px'
                },
                datetimeUTC: false,
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#94a3b8',
                    fontWeight: 700,
                    fontSize: '10px'
                }
            }
        },
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd MMM yyyy, HH:mm'
            },
            y: {
                title: {
                    formatter: () => 'Visitors:'
                }
            },
            style: {
                fontSize: '10px',
                fontFamily: 'inherit'
            }
        },
        grid: {
            borderColor: '#f1f5f9',
            strokeDashArray: 4,
        },
    };

    const filters: TimeRange[] = ['30m', '1h', '6h', '12h', '1d', '7d', '15d', '1m', '3m', '6m', '1y'];

    // Prevent hydration error by returning a placeholder on server
    if (!mounted) {
        return (
            <div className="bg-white border border-gray-100 rounded-sm p-4 sm:p-6 shadow-sm min-h-[450px] animate-pulse flex items-center justify-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Initializing Terminal...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-100 rounded-sm p-4 sm:p-6 shadow-sm relative group">
            {/* Unified Toolbar Row */}
            <div className="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-4 bg-white/80 backdrop-blur-sm p-1 rounded-sm">
                {/* Time Filters */}
                <div className="flex items-center gap-1 border-r border-gray-200 pr-4 mr-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setRange(f)}
                            className={`px-2 py-1 text-[9px] font-black uppercase tracking-tighter rounded-sm transition-all ${range === f
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:text-slate-900 hover:bg-gray-100'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="min-h-[350px] w-full mt-8">
                <Chart
                    options={options}
                    series={series}
                    type="line"
                    height={350}
                />
            </div>

            {/* Smart Insight */}
            <div className="mt-6 flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-sm">
                <div className="p-1.5 bg-slate-900 text-white rounded-sm">
                    <Maximize2 size={12} />
                </div>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">
                    Seleksi area pada grafik untuk ZOOM. Gunakan tombol <span className="text-blue-600">RESET</span> pada toolbar untuk kembali ke tampilan penuh.
                </p>
            </div>
        </div>
    );
}

function Activity(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
    )
}
