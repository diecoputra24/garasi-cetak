'use client';

import React, { useEffect, Suspense, useRef } from 'react';
import './style.css';
import Image from 'next/image';
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
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
  bgImage = '/images/biru-modern-floral/2.png',
  fullBgImage,
  bgColor = '#eef2f7',
  topPos = 'top-0',
  topRot = 'rotate-180',
  bottomPos = 'bottom-0',
  bottomRot = '',
  ornamentOpacity = 'opacity-[0.85]', // Made less transparent per user request
  showMarble = true,
  hideTopOrnament = false,
  hideBottomOrnament = false
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  bgImage?: string | null;
  fullBgImage?: string;
  bgColor?: string;
  topPos?: string;
  topRot?: string;
  bottomPos?: string;
  bottomRot?: string;
  ornamentOpacity?: string;
  showMarble?: boolean;
  hideTopOrnament?: boolean;
  hideBottomOrnament?: boolean;
}) => {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      id={id}
      className={`relative overflow-hidden w-full m-0 p-0 block border-none ${className}`} style={{ backgroundColor: bgColor }}
    >
      {/* Full background image */}
      {fullBgImage && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src={fullBgImage}
            fill
            className="object-cover opacity-[0.4]"
            alt="bg-full"
            priority
          />
        </div>
      )}

      {/* Subtle marble texture overlay */}
      {showMarble && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
          <Image src="/images/biru-modern-floral/3.png" fill className="object-cover" alt="marble" />
        </div>
      )}

      {/* Top decoration */}
      {bgImage && !hideTopOrnament && (
        <div
          className={`absolute ${topPos} left-[-20%] w-[140%] z-10 pointer-events-none ${ornamentOpacity}`}
        >
          <img src={bgImage} alt="floral-top" className={`w-full h-auto ${topRot}`} />
        </div>
      )}

      {/* Bottom decoration */}
      {bgImage && !hideBottomOrnament && (
        <div
          className={`absolute ${bottomPos} left-[-20%] w-[140%] z-10 pointer-events-none ${ornamentOpacity}`}
        >
          <img src={bgImage} alt="floral-bottom" className={`w-full h-auto ${bottomRot}`} />
        </div>
      )}

      {/* Content Container - padding moved here */}
      <div className="relative z-20 flex flex-col items-center text-center w-full pt-8 pb-12 px-6">
        {children}
      </div>
    </section>
  );
};

function InvitationContent({ data }: TemplateProps) {
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
    getYoutubeId,
    story
  } = useInvitation(data);

  const assetPath = "/images/biru-modern-floral";

  return (
    <div className={`outer-container flex justify-center min-h-screen ${montserrat.className}`}>
      <div className={`main-mobile-frame relative bg-white shadow-2xl overflow-x-hidden scrollbar-hide w-full max-w-none sm:max-w-[450px] min-h-screen flex flex-col ${!isOpen ? 'h-screen overflow-hidden' : ''}`}>
        {/* Continuous Background Image (Like Red Template) */}
        <div className="relative inset-0 z-0 opacity-[0.15] pointer-events-none">
          <Image src={`${assetPath}/bg1.png`} fill style={{ objectFit: 'cover' }} alt="bg-main" className="scale-105" />
        </div>
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
            <source src={data.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"} type="audio/mpeg" />
          </audio>
        )}

        {/* ====================== COVER ====================== */}
        {!isCoverRemoved && (
          <section
            className={`cover-section flex flex-col items-center justify-center ${isOpen ? 'opened' : ''} overflow-hidden`}
            style={{ background: 'linear-gradient(180deg, #f0f4f8 0%, #e8eef5 30%, #f5f0eb 70%, #eef2f7 100%)' }}
          >
            {/* Unified Background Ornament like Red Template */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
              <Image src={`${assetPath}/bg1.png`} fill style={{ objectFit: 'cover' }} alt="bg" className="scale-105" />
            </div>

            {/* Center content */}
            <div className="text-center px-6 z-20 relative w-full flex flex-col items-center">
              <p className="tracking-[0.5em] uppercase text-[8px] mb-8 font-bold text-[#1e3a5f]/60">The Wedding of</p>

              {/* Hexagonal frame with initials */}
              <div className="relative w-[60vw] max-w-[240px] aspect-square flex items-center justify-center my-6">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image src={`${assetPath}/1.png`} fill alt="frame" className="object-contain" sizes="(max-width: 768px) 60vw, 240px" />
                </div>
                <div className="relative z-10 w-full flex flex-col items-center pt-2">
                  <div className={`text-5xl text-[#1e3a5f] font-normal ${greatVibes.className}`}>
                    {data.brideShort.charAt(0)} & {data.groomShort.charAt(0)}
                  </div>
                </div>
              </div>

              {/* Names */}
              <div className="mb-0 text-center scale-[1.15]">
                <div className={`text-5xl sm:text-6xl mb-1 text-[#1e3a5f] drop-shadow-sm ${greatVibes.className}`}>
                  {data.brideShort} & {data.groomShort}
                </div>
                <div className="gold-divider mt-2" />
              </div>

              {/* Guest name */}
              <div className="mt-12 mb-10 px-6 text-center">
                <p className={`text-[10px] mb-4 text-[#5a7fa5] uppercase tracking-[0.4em] font-bold ${playfair.className}`}>
                  Kepada Bapak/Ibu/Saudara/i
                </p>
                <div className={`text-3xl mb-1 text-[#1e3a5f] font-semibold border-b-2 border-[#c9a84c]/30 pb-2 px-10 inline-block ${playfair.className}`}>
                  {guestName}
                </div>
                <p className="text-[7px] text-[#5a7fa5]/60 font-light mt-3 italic">
                  *Mohon maaf apabila ada kesalahan penulisan nama/gelar
                </p>
              </div>

              <button
                onClick={handleOpen}
                className="btn-blue-gold flex items-center gap-3 px-12 py-3.5 text-[10px] tracking-[0.3em] font-bold uppercase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                Buka Undangan
              </button>
            </div>
          </section>
        )}

        {/* ====================== MAIN CONTENT ====================== */}
        {isOpen && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* ===== PART 1: SALAM SAMPAI AR-RUM ===== */}
            <SectionBg id="section-1" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg1.png`} showMarble={false} className="!pt-6">
              <div id="home" className="w-full flex flex-col items-center">
                <RevealSection>
                  <h2 className={`text-lg mb-6 text-[#1e3a5f] text-center leading-relaxed ${playfair.className} italic font-medium`}>
                    Assalamu'alaikum Warahmatullahi Wabarakatuh
                  </h2>
                </RevealSection>

                <RevealSection delay={0.1}>
                  <p className="mb-10 text-[#5a7fa5] text-center leading-[1.8] text-[12px] px-2 font-light">
                    Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                    Dengannya rasa syukur yang mendalam, kami bermaksud mengundang Bapak/Ibu/Saudara/i
                    untuk hadir di acara pernikahan kami:
                  </p>
                </RevealSection>

                {/* BRIDE & GROOM */}
                <div className="space-y-10 w-full">
                  {/* BRIDE */}
                  <RevealSection delay={0.15}>
                    <div className="text-center">
                      <div className="classic-frame mb-10">
                        <div className="inner-photo">
                          <img
                            src={fixImageUrl(data.brideImage) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop"}
                            alt="bride"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h2 className={`text-[32px] sm:text-[42px] text-[#1e3a5f] mt-8 mb-2 leading-tight ${greatVibes.className} whitespace-nowrap`}>{data.brideName}</h2>
                      <p className="font-semibold text-[9px] uppercase tracking-[0.3em] text-[#5a7fa5] mb-1">dari :</p>
                      <p className="text-sm font-medium text-[#1e3a5f]/70 px-6">{data.brideParents}</p>
                      {data.brideInstagram && (
                        <a href={`https://instagram.com/${data.brideInstagram.replace('@', '')}`} target="_blank"
                          className="inline-flex items-center gap-2 mt-3 text-[10px] bg-[#1e3a5f]/5 px-4 py-2 rounded-full border border-[#1e3a5f]/10 text-[#1e3a5f]/60 italic tracking-wider hover:bg-[#1e3a5f]/10 transition-all"
                        >
                          @{data.brideInstagram.replace('@', '')}
                        </a>
                      )}
                    </div>
                  </RevealSection>

                  {/* Ampersand */}
                  <RevealSection delay={0.2}>
                    <div className="flex justify-center pt-10 pb-24">
                      <span className={`ampersand-text ${greatVibes.className}`}>&</span>
                    </div>
                  </RevealSection>

                  {/* GROOM */}
                  <RevealSection delay={0.25}>
                    <div className="text-center">
                      <div className="classic-frame mb-10">
                        <div className="inner-photo">
                          <img
                            src={fixImageUrl(data.groomImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"}
                            alt="groom"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <h2 className={`text-[32px] sm:text-[42px] text-[#1e3a5f] mt-8 mb-2 leading-tight ${greatVibes.className} whitespace-nowrap`}>{data.groomName}</h2>
                      <p className="font-semibold text-[9px] uppercase tracking-[0.3em] text-[#5a7fa5] mb-1">dari :</p>
                      <p className="text-sm font-medium text-[#1e3a5f]/70 px-6">{data.groomParents}</p>
                      {data.groomInstagram && (
                        <a href={`https://instagram.com/${data.groomInstagram.replace('@', '')}`} target="_blank"
                          className="inline-flex items-center gap-2 mt-3 text-[10px] bg-[#1e3a5f]/5 px-4 py-2 rounded-full border border-[#1e3a5f]/10 text-[#1e3a5f]/60 italic tracking-wider hover:bg-[#1e3a5f]/10 transition-all"
                        >
                          @{data.groomInstagram.replace('@', '')}
                        </a>
                      )}
                    </div>
                  </RevealSection>
                </div>

                {/* AR-RUM QUOTE */}
                <RevealSection delay={0.3}>
                  <div className="pt-8 pb-4 text-center px-6">
                    <p className={`text-[13px] italic leading-[2] text-[#1e3a5f]/70 mb-6 ${playfair.className}`}>
                      "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri,
                      supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.
                      Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
                    </p>
                    <p className="font-bold text-[10px] tracking-[0.3em] text-[#c9a84c] uppercase">( QS. Ar-Rum: 21 )</p>
                  </div>
                </RevealSection>
              </div>
            </SectionBg>

            {/* ===== PART 2: ACARA BAHAGIA ===== */}
            <SectionBg id="event" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg2.png`} showMarble={false}>
              <div className="w-full flex flex-col items-center text-center">
                <RevealSection>
                  <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold`}>Acara Bahagia</h2>
                  <div className="gold-divider mb-10" />
                </RevealSection>

                {/* Countdown */}
                <RevealSection delay={0.1}>
                  <div className="grid grid-cols-4 gap-3 mb-14 w-full">
                    {[
                      { val: timeLeft.days, label: 'Hari' },
                      { val: timeLeft.hours, label: 'Jam' },
                      { val: timeLeft.minutes, label: 'Menit' },
                      { val: timeLeft.seconds, label: 'Detik' }
                    ].map((item, i) => (
                      <div key={i} className="countdown-item">
                        <span className={`text-2xl font-bold text-[#1e3a5f] ${playfair.className}`}>{item.val}</span>
                        <span className="text-[8px] uppercase tracking-[0.2em] text-[#c9a84c] font-semibold mt-1">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </RevealSection>

                <div className="space-y-8 w-full">
                  {/* Akad */}
                  <RevealSection delay={0.15}>
                    <div className="event-card">
                      <h3 className={`text-2xl mb-4 text-[#c9a84c] ${playfair.className} font-bold`}>Akad Nikah</h3>
                      <p className={`font-bold text-base mb-1 text-[#1e3a5f] ${playfair.className}`}>{formatDate(data.akadDate)}</p>
                      <p className="text-[#5a7fa5] text-sm mb-4">{data.akadTime}</p>
                      <div className="gold-divider mb-4" />
                      <p className="font-bold text-sm text-[#1e3a5f] uppercase tracking-wider">{data.akadPlace}</p>
                      <p className="text-xs text-[#5a7fa5] px-4 leading-relaxed italic mt-2 mb-6">{data.akadAddress}</p>
                      <a href={data.akadMaps} target="_blank" className="btn-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        Lihat Lokasi
                      </a>
                    </div>
                  </RevealSection>

                  {/* Resepsi */}
                  <RevealSection delay={0.2}>
                    <div className="event-card">
                      <h3 className={`text-2xl mb-4 text-[#c9a84c] ${playfair.className} font-bold`}>Resepsi</h3>
                      <p className={`font-bold text-base mb-1 text-[#1e3a5f] ${playfair.className}`}>{formatDate(data.resepsiDate || data.akadDate)}</p>
                      <p className="text-[#5a7fa5] text-sm mb-4">{data.resepsiTime}</p>
                      <div className="gold-divider mb-4" />
                      <p className="font-bold text-sm text-[#1e3a5f] uppercase tracking-wider">{data.resepsiPlace || data.akadPlace}</p>
                      <p className="text-xs text-[#5a7fa5] px-4 leading-relaxed italic mt-2 mb-6">{data.resepsiAddress || data.akadAddress}</p>
                      <a href={data.resepsiMaps || data.akadMaps} target="_blank" className="btn-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                        Lihat Lokasi
                      </a>
                    </div>
                  </RevealSection>
                </div>
              </div>
            </SectionBg>

            {/* ##### STORY SECTION ##### */}
            {story && story.length > 0 && (
              <SectionBg
                id="story"
                bgColor="#ffffff"
                fullBgImage={`${assetPath}/bg3.png`}
                bgImage={null}
                showMarble={false}
              >
                <div className="w-full flex flex-col items-center text-center">
                  <RevealSection className="mb-12">
                    <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold`}>Cerita Kami</h2>
                    <div className="gold-divider mb-10" />
                  </RevealSection>

                  <div className="w-full relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[30px] -translate-x-1/2 top-4 bottom-4 w-[3px] bg-gradient-to-b from-[#c9a84c] to-transparent shadow-[0_0_10px_rgba(201,168,76,0.3)] z-10" />

                    <div className="flex flex-col gap-12 w-full">
                      {story.map((item: any, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -30, scale: 0.95 }}
                          whileInView={{ opacity: 1, x: 0, scale: 1 }}
                          viewport={{ once: true, amount: 0.1 }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="relative w-full pl-16 flex flex-col items-start"
                        >
                          {/* Dot */}
                          <div className="absolute left-[30px] -translate-x-1/2 top-0 w-8 h-8 rounded-full bg-[#fdfdff] border-2 border-[#1e3a5f] flex items-center justify-center z-20 shadow-md">
                            <div className="w-3 h-3 rounded-full bg-[#1e3a5f] animate-pulse" />
                          </div>

                          <div className="w-full space-y-4 pb-12">
                            {item.image && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="relative w-32 aspect-square overflow-hidden border bg-white border-[#1e3a5f]/10 shadow-lg"
                              >
                                <img src={fixImageUrl(item.image)} className="absolute inset-0 w-full h-full object-cover" alt={item.title} />
                              </motion.div>
                            )}
                            <div className="text-left">
                              <p className="text-[10px] text-[#c9a84c] font-bold uppercase tracking-widest mb-1">{item.date}</p>
                              <h3 className={`text-2xl text-[#1e3a5f] mb-2 ${playfair.className} font-bold`}>{item.title}</h3>
                              <p className="text-sm text-[#5a7fa5] leading-relaxed italic">{item.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

              </SectionBg>
            )}

            {/* ===== PART 3: GALERI ===== */}
            <SectionBg id="gallery" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg3.png`} showMarble={false}>
                <div className="w-full flex flex-col items-center">
                  <RevealSection>
                    <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold text-center`}>Galeri Bahagia</h2>
                    <div className="gold-divider mb-10" />
                  </RevealSection>
                  
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
                </div>
            </SectionBg>

            {/* ===== PART 4: KONFIRMASI KEHADIRAN ===== */}
            <SectionBg id="rsvp" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg3.png`} showMarble={false}>
              <div className="w-full flex flex-col items-center">
                <RevealSection>
                  <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold text-center`}>Konfirmasi Kehadiran</h2>
                  <div className="gold-divider mb-10" />
                </RevealSection>

                <RevealSection delay={0.1}>
                  <InvitationRSVP
                    rsvpName={rsvpName} setRsvpName={setRsvpName}
                    rsvpTotal={rsvpTotal} setRsvpTotal={setRsvpTotal}
                    rsvpStatus={rsvpStatus} setRsvpStatus={setRsvpStatus}
                    isSubmittingRSVP={isSubmittingRSVP} handleRSVP={handleRSVP}
                    theme="modern"
                    titleFont={playfair.className}
                    flat={true}
                    hideHeader={true}
                    customButtonClass="btn-blue-gold"
                  />
                </RevealSection>
              </div>
            </SectionBg>

            {/* ===== PART 5: KADO ===== */}
            <SectionBg id="gift" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg2.png`} showMarble={false}>
              <div className="w-full flex flex-col items-center">
                <RevealSection>
                  <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold text-center`}>Kado Digital</h2>
                  <div className="gold-divider mb-4" />
                  <p className="text-center text-[#5a7fa5] text-sm mb-10 px-4 font-light">
                    Doa restu Anda merupakan karunia yang sangat berarti bagi kami.
                  </p>
                  <InvitationGift gifts={data.gifts} handleCopy={handleCopy} copiedBank={copiedBank} theme="modern" flat={true} />
                </RevealSection>
              </div>
            </SectionBg>

            <SectionBg id="wishes" bgImage="" bgColor="#ffffff" fullBgImage={`${assetPath}/bg3.png`} showMarble={false}>
              <div className="w-full flex flex-col items-center">
                <RevealSection>
                  <h2 className={`text-3xl mb-3 text-[#1e3a5f] ${playfair.className} font-bold text-center`}>Ucapan & Doa</h2>
                  <div className="gold-divider mb-10" />
                  <InvitationWishes
                    newName={newName} setNewName={setNewName}
                    newMessage={newMessage} setNewMessage={setNewMessage}
                    isSubmittingWish={isSubmittingWish} handleSubmitWish={handleSubmitWish}
                    localWishes={localWishes}
                    theme="modern"
                    titleFont={playfair.className}
                    flat={false}
                    customButtonClass="btn-blue-gold"
                  />
                </RevealSection>
              </div>
            </SectionBg>

            {/* ===== FOOTER ===== */}
            <footer className="footer-blue relative text-center pt-10 pb-4 px-10 bg-[#0c1a2e] overflow-hidden z-20">
              {/* Soft floral overlay */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
                <img src={`${assetPath}/2.png`} alt="bg" className="w-full absolute top-0 left-0" />
                <img src={`${assetPath}/2.png`} alt="bg" className="w-full absolute bottom-0 left-0 rotate-180" />
              </div>

              <div className="relative z-10 text-white pt-6 pb-12 text-center">
                <p className={`text-5xl text-white mb-4 ${greatVibes.className} drop-shadow-xl text-center`}>{data.brideShort} & {data.groomShort}</p>
                <p className="text-sm text-white/60 mb-10 italic tracking-wide font-light text-center">Sampai jumpa di hari bahagia kami</p>

                <div className="pt-8 border-t border-gray-200 flex flex-col items-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4 font-bold text-center">Digital Invitation by</p>
                  <a href="https://garasicetak.com" target="_blank" className="flex items-center gap-3 group">
                    <img src="/images/logo.png" alt="logo" className="w-14 h-14 object-contain transition-opacity" />
                    <div className="flex flex-col items-start">
                      <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-white transition-all duration-500 font-serif">
                        Garasi Cetak
                      </span>
                      <span className="text-[8px] text-white/20 italic tracking-widest text-left">www.garasicetak.com</span>
                    </div>
                  </a>
                </div>
              </div>
            </footer>

            {/* FLOATING AUDIO TOGGLE */}
            <div className="audio-btn-blue fixed bottom-32 left-6 z-50" onClick={toggleMute}>
              <div className={!isMuted ? 'audio-spinning' : ''}>
                {!isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><line x1="3" y1="3" x2="21" y2="21" /></svg>
                )}
              </div>
            </div>


          </motion.main>
        )}
        {/* NAVIGATION BOTTOM */}
        <InvitationBottomNav 
          isOpen={isOpen} 
          theme="modern" 
          textColor="text-[#1e3a5f]" 
          activeColor="text-[#c9a84c]" 
        />
      </div>
    </div>
  );
}

export default function BlueModernFloralTemplate(props: TemplateProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #eef2f7, #f5f0eb)' }}>
        <div className={`text-[#1e3a5f] text-2xl italic ${playfair.className}`}>Menyiapkan kebahagiaan...</div>
      </div>
    }>
      <InvitationContent {...props} />
    </Suspense>
  );
}
