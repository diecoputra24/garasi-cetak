"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function TopProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    // Stop loading when pathname or searchParams change (navigation finished)
    useEffect(() => {
        if (loading) {
            // "Finish" animation
            setProgress(100);
            const timer = setTimeout(() => {
                setLoading(false);
                setTimeout(() => setProgress(0), 200);
            }, 400);
            
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
            return () => clearTimeout(timer);
        }
    }, [pathname, searchParams, loading]);

    useEffect(() => {
        const handleStart = (targetUrl?: string) => {
            // Prevent double trigger if already loading
            if (loading) return;

            // Check if we are in management area (dashboard or admin)
            const isManagementArea = window.location.pathname.startsWith('/dashboard') || 
                                   window.location.pathname.startsWith('/admin');
            
            if (!isManagementArea) return;

            // If a target URL is provided, check if it's actually a different path
            if (targetUrl) {
                try {
                    const currentUrl = new URL(window.location.href);
                    const newUrl = new URL(targetUrl, window.location.origin);
                    if (currentUrl.pathname === newUrl.pathname && currentUrl.search === newUrl.search) {
                        return;
                    }
                } catch (e) {
                    // Ignore URL parsing errors
                }
            }

            setLoading(true);
            setProgress(10);
            
            if (progressInterval.current) clearInterval(progressInterval.current);
            progressInterval.current = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return prev;
                    const increment = Math.random() * 3;
                    return Math.min(prev + increment, 90);
                });
            }, 250);
        };

        const handleAnchorClick = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement).closest("a");
            
            if (anchor && anchor.href && !anchor.target) {
                const href = anchor.href;
                const isInternal = href.startsWith(window.location.origin) || !href.includes(":");
                
                if (isInternal) {
                    handleStart(href);
                }
            }
        };

        // Detect forward/back navigation
        const handlePopState = () => {
            handleStart();
        };

        window.addEventListener("click", handleAnchorClick);
        window.addEventListener("popstate", handlePopState);
        
        return () => {
            window.removeEventListener("click", handleAnchorClick);
            window.removeEventListener("popstate", handlePopState);
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    // Don't render anything if we are not in management area
    const isManagementArea = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');
    if (!isManagementArea && !loading && progress === 0) return null;

    return (
        <AnimatePresence>
            {(loading || progress > 0) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed top-0 left-0 w-full z-[9999] pointer-events-none"
                    id="top-progress-bar-container"
                >
                    <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ 
                            type: "spring",
                            damping: 25,
                            stiffness: 100,
                            mass: 0.5
                        }}
                        className="h-[3px] bg-blue-600 relative overflow-hidden"
                    >
                        {/* Shimmer effect inside the bar */}
                        <motion.div 
                            animate={{ 
                                x: ["-100%", "200%"] 
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 1.5, 
                                ease: "linear" 
                            }}
                            className="absolute top-0 bottom-0 w-1/2 bg-white/20 skew-x-[-20deg]"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
