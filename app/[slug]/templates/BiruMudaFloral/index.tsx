'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import './style.css';
import Image from 'next/image';
import { Playfair_Display, Great_Vibes, Montserrat, Outfit } from 'next/font/google';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Calendar, MapPin, Gift, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useInvitation, InvitationData } from '@/components/templates/shared/useInvitation';
import { InvitationGift } from '@/components/templates/shared/InvitationGift';
import { InvitationWishes } from '@/components/templates/shared/InvitationWishes';
import { InvitationRSVP } from '@/components/templates/shared/InvitationRSVP';
import { InvitationAudioToggle } from '@/components/templates/shared/InvitationAudioToggle';
import { InvitationBottomNav } from '@/components/templates/shared/InvitationBottomNav';
import { InvitationGallery } from '@/components/templates/shared/InvitationGallery';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], display: 'swap' });

interface TemplateProps {
  data: InvitationData;
}

// Reusable reveal animation wrapper
const RevealSection = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    className={`w-full flex flex-col items-center ${className}`}
  >
    {children}
  </motion.div>
);

const SectionBg = ({
  children,
  id,
  className = '',
  bgImage,
  fullBgImage,
  bgColor = '#ffffff',
  showPattern = true,
  ornamentOpacity = 'opacity-80'
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  bgImage?: string | null;
  fullBgImage?: string;
  bgColor?: string;
  showPattern?: boolean;
  ornamentOpacity?: string;
}) => {
  return (
    <section
      id={id}
      className={`relative overflow-hidden w-full m-0 p-0 block border-none py-20 ${className}`} style={{ backgroundColor: bgColor }}
    >
      {/* Full background image (usually Pattern 5) */}
      {showPattern && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
          <Image src="/images/biru-muda-floral/5.png" fill className="object-cover" alt="pattern" />
        </div>
      )}

      {fullBgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src={fullBgImage} fill className="object-cover opacity-[0.15]" alt="bg-full" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 w-full px-6">
        {children}
      </div>
    </section>
  );
};

export default function BiruMudaFloralTemplate({ data }: TemplateProps) {
  const [isMounted, setIsMounted] = useState(false);
  const fixMapsUrl = (url: string) => {
    if (!url) return "";
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  const assetPath = '/images/biru-muda-floral';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
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
    getYoutubeId
  } = useInvitation(data);

  if (!isMounted) return null;

  const story = data.story ? (typeof data.story === 'string' ? JSON.parse(data.story) : data.story) : [];
  const gallery = data.gallery && data.gallery.length > 0 ? data.gallery : [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522673607200-164883eeca48?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600&auto=format&fit=crop"
  ];
  const gifts = data.gifts ? (typeof data.gifts === 'string' ? JSON.parse(data.gifts) : data.gifts) : [];

  return (
    <div className={`outer-container flex justify-center bg-white min-h-screen ${outfit.className}`}>
      <div className={`main-mobile-frame relative bg-white shadow-2xl overflow-x-hidden scrollbar-hide md:w-[450px] min-h-screen flex flex-col text-[#1e3a5f] ${!isOpen ? 'h-screen overflow-hidden' : ''}`}>
        
        {/* BACKGROUND MUSIC */}
        {data.musicUrl && isYouTube(data.musicUrl) ? (
          <div className="fixed opacity-0 pointer-events-none">
             <iframe
                width="1" height="1"
                src={`https://www.youtube.com/embed/${getYoutubeId(data.musicUrl)}?autoplay=${isOpen ? 1 : 0}&mute=${isMuted ? 1 : 0}&loop=1&playlist=${getYoutubeId(data.musicUrl)}`}
                allow="autoplay"
             ></iframe>
          </div>
        ) : (
          <audio ref={audioRef} loop>
            <source src={data.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} type="audio/mpeg" />
          </audio>
        )}

        {/* COVER SECTION */}
        {!isCoverRemoved && (
          <section
            className={`cover-section flex flex-col items-center justify-center text-[#1e3a5f] ${isOpen ? 'opened' : ''} overflow-hidden`}
            style={{ backgroundColor: '#bcebf5' }} 
          >
            {/* Ornaments */}
            <div className="absolute top-0 left-0 w-32 opacity-80 z-10 pointer-events-none">
              <img src={`${assetPath}/2.png`} alt="ornament top left" className="w-full h-auto" />
            </div>
            <div className="absolute top-0 right-0 w-32 opacity-80 z-10 pointer-events-none">
              <img src={`${assetPath}/3.png`} alt="ornament top right" className="w-full h-auto" />
            </div>
            <div className="absolute bottom-0 left-0 w-32 opacity-80 z-10 pointer-events-none">
              <img src={`${assetPath}/3a.png`} alt="ornament bottom left" className="w-full h-auto" />
            </div>

            {/* Main Content Area */}
            <div className="text-center animate-fade-in-up px-6 z-20 relative w-full flex flex-col items-center justify-center min-h-[70vh]">
              <div className="mb-10 py-1.5 px-6 border border-[#c9a84c] rounded-full inline-block bg-transparent/5">
                <p className="tracking-widest font-bold text-[#1e3a5f]">THE WEDDING OF</p>
              </div>

              <div className={`flex flex-row items-center gap-3 justify-center mb-16 ${greatVibes.className}`}>
                <h1 className="text-6xl md:text-7xl text-[#0b5c6e] drop-shadow-sm">{data.brideShort}</h1>
                <span className="text-5xl text-[#0b5c6e]">&</span>
                <h1 className="text-6xl md:text-7xl text-[#0b5c6e] drop-shadow-sm">{data.groomShort}</h1>
              </div>

              <div className="mb-8 text-center">
                <p className="text-xs text-[#1e3a5f]/80 mb-2 font-medium uppercase tracking-widest">Kepada Yth. Bpk/Ibu/Saudara/i</p>
                <div className="text-xl text-[#0b5c6e] mb-4 font-bold border-b-2 border-[#c9a84c]/30 inline-block px-4 pb-1">{guestName}</div>
              </div>

              <button
                onClick={handleOpen}
                className="relative group px-10 py-3 bg-[#1e3a5f] text-white rounded-full text-xs font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Buka Undangan
              </button>
            </div>

            {/* Reception text at bottom */}
            <div className="absolute bottom-6 z-20 text-center w-full flex justify-center">
               <p className="text-[9px] uppercase tracking-[0.4em] font-bold text-[#1e3a5f]/60">RECEPTION TO FOLLOW</p>
            </div>
          </section>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.main
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex-1 flex flex-col"
            >
              {/* ===== PART 1: SALAM & PROFIL ===== */}
              <SectionBg id="home" bgColor="#ffffff" className="!pt-0 !pb-10 relative">
                {/* Dekorasi Bawah Profil (Gambar 4) */}
                <div className="absolute bottom-0 right-0 w-56 opacity-90 pointer-events-none translate-x-4 translate-y-8 z-0">
                  <img src={`${assetPath}/4.png`} alt="mempelai-bottom-deco" className="w-full h-auto" />
                </div>

                {/* Background 6.png khusus untuk area Salam */}
                <div className="absolute top-0 left-0 w-full h-[320px] opacity-40 z-0 pointer-events-none">
                  <img src={`${assetPath}/6.png`} alt="salam-bg" className="w-full h-full object-cover object-top" />
                </div>

                <RevealSection className="relative z-10 pt-16">
                  <h1 className={`text-5xl mb-6 text-[#0b5c6e] text-center ${greatVibes.className}`}>The Couple</h1>
                  <h2 className={`text-base mb-4 text-[#0b5c6e] text-center font-bold ${playfair.className} italic`}>
                    Assalamu’alaikum wr. wb
                  </h2>
                  <p className={`mb-12 text-[#0b5c6e]/90 text-center leading-relaxed text-sm px-8 font-medium ${playfair.className}`}>
                    Maha Suci Allah yang telah menciptakan makhluk Nya berpasang - pasangan.<br/>
                    Ya Allah semoga Ridho - Mu tercurah mengiringi pernikahan kami
                  </p>
                </RevealSection>

                <div className="flex flex-col items-center gap-16 mt-10">
                  {/* BRIDE */}
                  <RevealSection>
                    <div className="text-center group">
                      <div className="w-48 h-64 mx-auto mb-6 border-[6px] border-white rounded-t-full rounded-b-2xl overflow-hidden relative transition-transform group-hover:scale-105 duration-500 bg-[#0b5c6e]">
                        <img src={fixImageUrl(data.brideImage) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="bride" />
                      </div>
                      <h2 className={`text-5xl text-[#0b5c6e] mb-1 leading-tight ${greatVibes.className}`}>{data.brideName}</h2>
                      <p className="text-[10px] font-medium text-[#0b5c6e]/80 px-4 mb-2">Putri dari {data.brideParents}</p>
                      {data.brideInstagram && (
                        <a href={`https://instagram.com/${data.brideInstagram.replace('@', '')}`} target="_blank" className="inline-flex items-center gap-1.5 mb-3 text-[10px] text-[#0b5c6e] bg-[#0b5c6e]/5 px-3 py-1 rounded-full border border-[#0b5c6e]/10 hover:bg-[#0b5c6e]/10 transition no-underline">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          <span className="font-semibold italic">@{data.brideInstagram.replace('@', '')}</span>
                        </a>
                      )}
                    </div>
                  </RevealSection>

                  <RevealSection delay={0.2}>
                    <div className={`text-4xl text-[#0b5c6e] drop-shadow-sm ${greatVibes.className}`}>&</div>
                  </RevealSection>

                  {/* GROOM */}
                  <RevealSection delay={0.3}>
                    <div className="text-center group">
                      <div className="w-48 h-64 mx-auto mb-6 border-[6px] border-white rounded-t-full rounded-b-2xl overflow-hidden relative transition-transform group-hover:scale-105 duration-500 bg-[#0b5c6e]">
                        <img src={fixImageUrl(data.groomImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="groom" />
                      </div>
                      <h2 className={`text-5xl text-[#0b5c6e] mb-1 leading-tight ${greatVibes.className}`}>{data.groomName}</h2>
                      <p className="text-[10px] font-medium text-[#0b5c6e]/80 px-4 mb-2">Putra dari {data.groomParents}</p>
                      {data.groomInstagram && (
                        <a href={`https://instagram.com/${data.groomInstagram.replace('@', '')}`} target="_blank" className="inline-flex items-center gap-1.5 mb-3 text-[10px] text-[#0b5c6e] bg-[#0b5c6e]/5 px-3 py-1 rounded-full border border-[#0b5c6e]/10 hover:bg-[#0b5c6e]/10 transition no-underline">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          <span className="font-semibold italic">@{data.groomInstagram.replace('@', '')}</span>
                        </a>
                      )}
                    </div>
                  </RevealSection>

                  {/* AR-RUM QUOTE */}
                  <RevealSection delay={0.4}>
                    <div className="px-8 py-10 relative mt-8 w-full text-center">
                      <p className={`text-sm italic leading-relaxed text-[#1e3a5f] mb-6 ${playfair.className}`}>
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri,
                        supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.
                        Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
                      </p>
                      <p className="font-bold text-xs tracking-widest text-[#c9a84c] uppercase">( QS. Ar-Rum: 21 )</p>
                    </div>
                  </RevealSection>

                </div>
              </SectionBg>

              {/* ===== PART 3: ACARA BAHAGIA ===== */}
              <SectionBg id="event" bgColor="#bce7ff" className="relative">
                <div className="absolute -top-24 right-0 w-32 opacity-100 pointer-events-none z-0">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-24 left-0 w-32 opacity-100 pointer-events-none z-0 rotate-180">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                
                <RevealSection>
                  <h2 className={`text-base uppercase tracking-[0.3em] font-medium text-[#1e3a5f] mb-10 text-center`}>Save The Date</h2>
                  
                  {/* COUNTDOWN */}
                  <div className="grid grid-cols-4 gap-3 mb-16 w-full max-w-sm">
                    {Object.entries(timeLeft).map(([label, val], i) => (
                      <div key={label} className="bg-[#f4fafd] border border-[#e6ebf1] shadow-sm p-4 rounded-xl flex flex-col items-center">
                        <span className="text-2xl font-bold text-[#0b5c6e] mb-1">{val}</span>
                        <span className="text-[8px] uppercase tracking-widest font-bold text-[#c9a84c]">{label === 'days' ? 'Hari' : label === 'hours' ? 'Jam' : label === 'minutes' ? 'Menit' : 'Detik'}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-12 w-full">
                    {/* AKAD */}
                    <div className="relative p-8 bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden group text-center flex flex-col items-center">
                      <div className="absolute bottom-0 left-0 w-32 opacity-20 pointer-events-none -translate-x-4 translate-y-4">
                        <img src={`${assetPath}/3c.png`} alt="deco-akad-bottom" className="w-full h-auto" />
                      </div>
                      <h3 className={`text-4xl ${greatVibes.className} text-[#0b5c6e] mb-6`}>Akad Nikah</h3>
                      <div className="space-y-4 mb-8">
                        <div>
                          <p className="text-lg font-bold text-[#1e3a5f]">{formatDate(data.akadDate)}</p>
                          <p className="text-xs text-[#1e3a5f]/60 font-medium tracking-wide">Pukul {data.akadTime} WIB</p>
                        </div>
                        <div className="px-4">
                          <p className="text-sm font-bold text-[#1e3a5f] mb-1">{data.akadPlace}</p>
                          <p className="text-[11px] text-[#1e3a5f]/60 leading-relaxed italic">{data.akadAddress}</p>
                        </div>
                      </div>
                      {data.akadMaps && (
                        <a href={fixMapsUrl(data.akadMaps)} target="_blank" className="inline-flex items-center gap-2 py-3 px-8 bg-[#b7e4f7] rounded-full text-[10px] font-bold uppercase tracking-widest text-[#1e3a5f] hover:shadow-lg transition-all">
                          <MapPin size={14} /> Lihat Lokasi
                        </a>
                      )}
                    </div>

                    {/* RESEPSI */}
                    <div className="relative p-8 bg-white border border-[#e6ebf1] rounded-2xl shadow-sm overflow-hidden group text-center flex flex-col items-center">
                      <div className="absolute bottom-0 left-0 w-32 opacity-20 pointer-events-none -translate-x-4 translate-y-4">
                        <img src={`${assetPath}/3c.png`} alt="deco-resepsi-bottom" className="w-full h-auto" />
                      </div>
                      <h3 className={`text-4xl ${greatVibes.className} text-[#0b5c6e] mb-6`}>Resepsi</h3>
                      <div className="space-y-4 mb-8">
                        <div>
                          <p className="text-lg font-bold text-[#1e3a5f]">{formatDate(data.resepsiDate)}</p>
                          <p className="text-xs text-[#1e3a5f]/60 font-medium tracking-wide">Pukul {data.resepsiTime} WIB</p>
                        </div>
                        <div className="px-4">
                          <p className="text-sm font-bold text-[#1e3a5f] mb-1">{data.resepsiPlace || data.akadPlace}</p>
                          <p className="text-[11px] text-[#1e3a5f]/60 leading-relaxed italic">{data.resepsiAddress || data.akadAddress}</p>
                        </div>
                      </div>
                      {(data.resepsiMaps || data.akadMaps) && (
                        <a href={fixMapsUrl(data.resepsiMaps || data.akadMaps)} target="_blank" className="inline-flex items-center gap-2 py-3 px-8 bg-[#1e3a5f] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:shadow-lg transition-all">
                          <MapPin size={14} /> Lihat Lokasi
                        </a>
                      )}
                    </div>
                  </div>
                </RevealSection>
              </SectionBg>



              {/* ===== PART 4: CERITA KAMI ===== */}
              <SectionBg id="story" bgColor="#ffffff" className="relative">
                <div className="absolute -top-24 right-0 w-32 opacity-100 pointer-events-none z-[-1]">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-24 left-0 w-32 opacity-100 pointer-events-none z-[-1] rotate-180">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                
                <RevealSection>
                  <h2 className={`text-base uppercase tracking-[0.3em] font-medium text-[#1e3a5f] mb-12 text-center`}>Kisah Kami</h2>
                  
                  <div className="relative w-full max-w-sm mx-auto">
                    {/* Tracking Line */}
                    <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#1e3a5f] to-transparent shadow-[0_0_10px_rgba(30,58,95,0.2)]" />
                    
                    <div className="space-y-8">
                      {(story && story.length > 0 ? story : [
                        { title: "Pertama Bertemu", date: "Januari 2021", text: "Berawal dari perkenalan singkat di acara teman, kami mulai saling mengenal dan bertukar cerita.", image: "/images/studio.png" },
                        { title: "Menyatakan Cinta", date: "Maret 2022", text: "Setelah merasa memiliki banyak kesamaan, kami memutuskan untuk memulai hubungan yang lebih serius.", image: "/images/couple.png" },
                        { title: "Lamaran", date: "Desember 2025", text: "Dengan penuh keyakinan dan restu dari kedua keluarga, kami melangsungkan pertunangan.", image: "/images/studio.png" }
                      ]).map((item: any, i: number) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, x: -30, scale: 0.95 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="relative flex flex-col items-start text-left w-full"
                        >
                          {/* Tracking Dot */}
                          <div className="absolute left-[2px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#1e3a5f] flex items-center justify-center z-20 shadow-[0_0_10px_rgba(30,58,95,0.2)]">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f] animate-pulse" />
                          </div>
                          
                          {/* Content */}
                          <div className="w-full pl-12 pb-6">
                            <div className="relative space-y-3">
                              {item.image && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  whileInView={{ opacity: 1, scale: 1 }}
                                  viewport={{ once: true }}
                                  className="w-28 aspect-square overflow-hidden border-2 border-white shadow-md rounded-lg mb-2"
                                >
                                  <img src={fixImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/images/couple.png"; }} />
                                </motion.div>
                              )}
                              <div>
                                  <span className="inline-block text-[#c9a84c] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                                  {item.date}
                                  </span>
                                  <h3 className={`text-3xl text-[#0b5c6e] mb-1 ${greatVibes.className} tracking-wide`}>{item.title}</h3>
                                  <p className="text-xs text-[#1e3a5f]/80 leading-relaxed font-medium">{item.text || item.description || item.content}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </RevealSection>
              </SectionBg>

              {gallery.length > 0 && (
                <div className="flex justify-center -my-8 relative z-20">
                  <img src={`${assetPath}/7.png`} alt="divider" className="w-40 h-auto opacity-70" />
                </div>
              )}

              {/* ===== PART 5: GALERI ===== */}
              <SectionBg id="gallery" bgColor="#ffffff">
                <div className="absolute -top-24 right-0 w-32 opacity-100 pointer-events-none z-[-1]">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-24 left-0 w-32 opacity-100 pointer-events-none z-[-1] rotate-180">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                
                <RevealSection>
                  <h2 className={`text-5xl ${greatVibes.className} text-[#0b5c6e] mb-12`}>Galeri</h2>
                  
                  <InvitationGallery 
                    images={(() => {
                      let imgs = data.gallery && data.gallery.length > 0 ? [...data.gallery] : [];
                      const fallbacks = [
                        "/images/couple.png", "/images/studio.png", "/images/couple.png",
                        "/images/studio.png", "/images/couple.png", "/images/studio.png"
                      ];
                      if (imgs.length < 6) {
                        imgs = [...imgs, ...fallbacks.slice(imgs.length, 6)];
                      }
                      return imgs;
                    })()} 
                    fixImageUrl={fixImageUrl} 
                  />
                </RevealSection>
              </SectionBg>

              {/* ===== PART 6: RSVP ===== */}
              <SectionBg id="rsvp" bgColor="#bce7ff">
                <RevealSection>
                  <h2 className={`text-base uppercase tracking-[0.3em] font-medium text-[#1e3a5f] mb-4 text-center`}>Konfirmasi Kehadiran</h2>
                  <p className="text-center text-[#1e3a5f]/60 text-sm mb-10 italic px-6 font-medium">Kehadiran Anda adalah kado terindah bagi kami</p>
                  
                  <div className="w-full max-w-sm">
                    <InvitationRSVP
                      rsvpName={rsvpName} setRsvpName={setRsvpName}
                      rsvpTotal={rsvpTotal} setRsvpTotal={setRsvpTotal}
                      rsvpStatus={rsvpStatus} setRsvpStatus={setRsvpStatus}
                      isSubmittingRSVP={isSubmittingRSVP} handleRSVP={handleRSVP}
                      theme="modern"
                      flat={true}
                      hideHeader={true}
                      customButtonClass="btn-blue-muda"
                    />
                  </div>
                </RevealSection>
              </SectionBg>

              {/* ===== PART 7: KADO DIGITAL ===== */}
              {gifts.length > 0 && (
                <SectionBg id="gift" bgColor="#ffffff" className="relative">
                  <div className="absolute -top-24 right-0 w-32 opacity-100 pointer-events-none z-10">
                    <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                  </div>
                  <div className="absolute -bottom-24 left-0 w-32 opacity-100 pointer-events-none z-10 rotate-180">
                    <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                  </div>
                  <RevealSection>
                    <h2 className={`text-base uppercase tracking-[0.3em] font-medium text-[#1e3a5f] mb-4 text-center`}>Kado Digital</h2>
                    <p className="text-center text-[#1e3a5f]/60 text-sm mb-10 italic px-6 font-medium">Doa restu Anda merupakan karunia terindah bagi kami, namun jika ingin memberikan tanda kasih, Anda dapat melalui:</p>
                    
                    <div className="w-full max-w-sm px-4">
                      <InvitationGift gifts={gifts} handleCopy={handleCopy} copiedBank={copiedBank} theme="modern" flat={true} />
                    </div>
                  </RevealSection>
                </SectionBg>
              )}

              {/* ===== PART 8: UCAPAN & DOA ===== */}
              <SectionBg id="wishes" bgColor="#bce7ff" className="relative">
                <div className="absolute -top-24 right-0 w-32 opacity-100 pointer-events-none z-[-1]">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                <div className="absolute -bottom-24 left-0 w-32 opacity-100 pointer-events-none z-[-1] rotate-180">
                  <img src={`${assetPath}/5.png`} alt="floral" className="w-full h-auto" />
                </div>
                <RevealSection>
                  <h2 className={`text-base uppercase tracking-[0.3em] font-medium text-[#1e3a5f] mb-4 text-center`}>Ucapan & Doa</h2>
                  <p className="text-center text-[#1e3a5f]/60 text-sm mb-10 italic px-6 font-medium">Berikan ucapan dan doa terbaik untuk kedua mempelai</p>
                  
                  <div className="w-full max-w-sm bg-white p-6 rounded-3xl shadow-md border border-[#e6ebf1] relative z-10">
                    <InvitationWishes
                      newName={newName} setNewName={setNewName}
                      newMessage={newMessage} setNewMessage={setNewMessage}
                      isSubmittingWish={isSubmittingWish} handleSubmitWish={handleSubmitWish}
                      localWishes={localWishes}
                      theme="modern"
                      flat={true}
                      customButtonClass="btn-blue-muda"
                    />
                  </div>
                </RevealSection>
              </SectionBg>

              {/* ===== FOOTER ===== */}
              <footer className="relative py-24 px-10 bg-white flex flex-col items-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 z-0 opacity-70">
                   <img src={`${assetPath}/7.png`} alt="divider" className="w-full h-auto" />
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative z-10 text-center"
                >
                  <h2 className={`text-6xl ${greatVibes.className} text-[#0b5c6e] mb-6`}>
                     {data.brideShort} & {data.groomShort}
                  </h2>
                  <p className="text-sm text-[#1e3a5f]/60 mb-10 italic font-medium">Sampai jumpa di hari bahagia kami</p>
                  
                  <div className="w-40 h-px bg-[#c9a84c]/30 mx-auto mb-16" />
                  
                  <div className="flex flex-col items-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] mb-4 font-bold text-[#1e3a5f]/30">Digital Invitation by</p>
                    <a href="https://garasicetak.com" target="_blank" className="flex items-center gap-3 group opacity-70 hover:opacity-100 transition-all">
                       <img src="/images/logo.png" alt="logo" className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all" />
                       <div className="text-left">
                         <span className="text-xl font-bold block text-[#1e3a5f]">Garasi Cetak</span>
                         <span className="text-[8px] italic opacity-50 block tracking-widest">www.garasicetak.com</span>
                       </div>
                    </a>
                  </div>
                </motion.div>
              </footer>

            </motion.main>
          )}
        </AnimatePresence>

        {/* FLOATING AUDIO TOGGLE */}
        <InvitationAudioToggle isMuted={isMuted} toggleMute={toggleMute} />

        {/* NAVIGATION BOTTOM */}
        <InvitationBottomNav isOpen={isOpen} />

      </div>
    </div>
  );
}
