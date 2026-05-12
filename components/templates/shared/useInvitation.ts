'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitRSVP, submitWish } from "@/app/actions/invitation";

export interface InvitationData {
    id: string;
    brideName: string;
    brideShort: string;
    brideInstagram: string;
    brideImage: string;
    groomName: string;
    groomShort: string;
    groomInstagram: string;
    groomImage: string;
    brideParents: string;
    groomParents: string;
    akadDate: Date | null;
    akadTime: string;
    akadPlace: string;
    akadAddress: string;
    akadMaps: string;
    resepsiDate: Date | null;
    resepsiTime: string;
    resepsiPlace: string;
    resepsiAddress: string;
    resepsiMaps: string;
    gallery: string[];
    gifts: any[];
    wishes: any[];
    musicUrl?: string;
    story?: string;
    akadImage?: string;
    resepsiImage?: string;
}

export function useInvitation(data: InvitationData) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCoverRemoved, setIsCoverRemoved] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const searchParams = useSearchParams();
    const guestName = searchParams.get('to') || 'Tamu Undangan';

    const [timeLeft, setTimeLeft] = useState({
        days: 0, hours: 0, minutes: 0, seconds: 0
    });

    const [localWishes, setLocalWishes] = useState(data.wishes);
    const [newName, setNewName] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [isSubmittingWish, setIsSubmittingWish] = useState(false);

    const [rsvpName, setRsvpName] = useState('');
    const [rsvpTotal, setRsvpTotal] = useState('1');
    const [rsvpStatus, setRsvpStatus] = useState('Hadir');
    const [isSubmittingRSVP, setIsSubmittingRSVP] = useState(false);

    const [copiedBank, setCopiedBank] = useState<string | null>(null);

    useEffect(() => {
        const targetDate = data.akadDate ? new Date(data.akadDate).getTime() : new Date().getTime();
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [data.akadDate]);

    const handleOpen = () => {
        setIsOpen(true);
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.log("Audio play blocked", e));
        }
        setTimeout(() => { setIsCoverRemoved(true); }, 1100);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleSubmitWish = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newMessage) return;
        setIsSubmittingWish(true);
        try {
            await submitWish(data.id, { name: newName, message: newMessage });
            setLocalWishes([{ name: newName, message: newMessage, time: 'Baru saja' }, ...localWishes]);
            setNewName('');
            setNewMessage('');
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmittingWish(false);
        }
    };

    const handleRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rsvpName) return;
        setIsSubmittingRSVP(true);
        try {
            await submitRSVP(data.id, { name: rsvpName, total: parseInt(rsvpTotal), status: rsvpStatus });
            alert(`Terima kasih ${rsvpName}, konfirmasi kehadiran Anda telah disimpan!`);
            setRsvpName('');
        } catch (err) {
            alert("Gagal menyimpan konfirmasi");
        } finally {
            setIsSubmittingRSVP(false);
        }
    };

    const handleCopy = (text: string, bank: string) => {
        navigator.clipboard.writeText(text);
        setCopiedBank(bank);
        setTimeout(() => setCopiedBank(null), 2000);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return new Intl.DateTimeFormat('id-ID', { dateStyle: 'full' }).format(new Date(date));
    };

    const fixImageUrl = (url: string) => {
        if (!url || url === 'undefined' || url === 'null') return "";
        if (url.includes('drive.google.com')) {
            const id = url.split('/d/')[1]?.split('/')[0] || url.split('id=')[1]?.split('&')[0];
            if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
        }
        return url;
    };

    const isYouTube = (url: string) => {
        return url?.includes('youtube.com') || url?.includes('youtu.be');
    };

    const getYoutubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return {
        isOpen,
        isCoverRemoved,
        isMuted,
        audioRef,
        guestName,
        timeLeft,
        localWishes,
        newName,
        setNewName,
        newMessage,
        setNewMessage,
        isSubmittingWish,
        rsvpName,
        setRsvpName,
        rsvpTotal,
        setRsvpTotal,
        rsvpStatus,
        setRsvpStatus,
        isSubmittingRSVP,
        copiedBank,
        handleOpen,
        toggleMute,
        handleSubmitWish,
        handleRSVP,
        handleCopy,
        formatDate,
        fixImageUrl,
        isYouTube,
        getYoutubeId,
        story: (() => {
            if (!data.story) return [];
            if (Array.isArray(data.story)) return data.story;
            if (typeof data.story !== 'string') return [];
            try {
                return JSON.parse(data.story);
            } catch (e) {
                console.error("Failed to parse story JSON:", e);
                return [];
            }
        })()
    };
}
