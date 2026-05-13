'use client';

import React, { useEffect, useState, useRef } from 'react';
import './style.css';
import Image from 'next/image';
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useInvitation, InvitationData } from '@/components/templates/shared/useInvitation';
import { InvitationBottomNav } from '@/components/templates/shared/InvitationBottomNav';
import { InvitationGallery } from '@/components/templates/shared/InvitationGallery';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap' });

// Animation Variants matching preview
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

interface TemplateProps {
  data: InvitationData;
}

export default function ModernFloralRedTemplate({ data }: TemplateProps) {
  const [isMounted, setIsMounted] = useState(false);

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
    getYoutubeId,
    story
  } = useInvitation(data);

  if (!isMounted) return null;

  return (
    <div className={`outer-container flex justify-center bg-white min-h-screen ${montserrat.className}`}>
      <div className="main-mobile-frame relative bg-white shadow-2xl overflow-x-hidden scrollbar-hide w-full max-w-none sm:max-w-[450px] min-h-screen flex flex-col">
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
            className={`cover-section flex flex-col items-center justify-center text-white ${isOpen ? 'opened' : ''} overflow-hidden`}
            style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/images/modern-floral-red/BG 7.png")' }}
          >
            {/* Subtle Background Ornament */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
              <Image src="/images/modern-floral-red/6.png" fill style={{ objectFit: 'cover' }} alt="bg" className="scale-110" />
            </div>

            <div className="text-center animate-fade-in-up px-4 z-20 relative w-full flex flex-col items-center">
              <p className="tracking-[0.8em] uppercase text-[9px] mb-6 font-bold text-inv-gold">Undangan Pernikahan</p>

              {/* NAME SECTION */}
              <div className="relative w-full max-w-[340px] flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Image src="/images/modern-floral-red/1.png" fill alt="frame" className="opacity-100 object-stretch w-full h-full scale-x-[1.25] scale-y-[0.88]" />
                </div>

                <div className={`relative z-10 w-full flex flex-col items-center pt-20 pb-12 ${greatVibes.className}`}>
                  <h1 className="text-6xl text-white mb-3 mr-10 drop-shadow-2xl leading-none pt-3">{data.brideShort}</h1>
                  <h2 className="text-4xl text-white my-3 drop-shadow-lg">&</h2>
                  <h1 className="text-6xl text-white mt-1 ml-10 drop-shadow-2xl leading-none">{data.groomShort}</h1>
                </div>
              </div>

              <div className="mb-10 px-6 text-center">
                <p className={`italic text-[9px] mb-3 font-bold text-white uppercase tracking-[0.2em] ${playfair.className}`}>Kepada Bapak/Ibu/Saudara/i</p>
                <div className={`text-2xl mb-1 text-white inline-block border-b border-white/20 pb-1 px-8 ${playfair.className}`}>{guestName}</div>
                <p className="text-[8px] text-white/60 font-light mt-3 italic">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
              </div>

              <button
                onClick={handleOpen}
                className="btn-primary group flex items-center gap-3 mx-auto px-10 py-3.5 text-[10px] tracking-[0.3em] uppercase font-bold transition-all border-white shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Buka Undangan
              </button>
            </div>
          </section>
        )}

        {/* MAIN CONTENT */}
        <AnimatePresence>
          {isOpen && (
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className={`relative ${montserrat.className}`}
              style={{ backgroundImage: 'url("/images/modern-floral-red/BG 7.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'scroll' }}
            >

              {/* BAGIAN 1: PEMBUKA & PROFIL & AYAT AR-RUM */}
              <section id="mempelai" className="relative pt-12 pb-24 overflow-hidden">
                {/* Dekorasi Atas & Bawah di Bagian 1 */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-0"
                >
                  <img src="/images/modern-floral-red/2.png" alt="deco-top-1" className="w-full h-auto" />
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
                >
                  <img src="/images/modern-floral-red/3.png" alt="deco-bottom-1" className="w-full h-auto" />
                </motion.div>

                <div id="home" className="relative z-20 w-full px-6">
                  <motion.h2
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className={`text-xl mb-6 text-white text-center ${playfair.className} italic font-bold drop-shadow-lg`}
                  >
                    Assalamu’alaikum Warahmatullahi Wabarakatuh
                  </motion.h2>
                  <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 text-white text-center leading-relaxed text-sm px-4 font-light drop-shadow-md"
                  >
                    Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                    Dengannya rasa syukur yang mendalam, kami bermaksud mengundang Bapak/Ibu/Saudara/i
                    untuk hadir di acara pernikahan kami:
                  </motion.p>

                  <div className="flex flex-col items-center gap-10 mb-12">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center group">
                      <div className="w-48 h-64 mx-auto mb-6 border-8 border-white bg-white shadow-2xl rotate-[-2deg] overflow-hidden relative transition-transform group-hover:rotate-0 duration-500">
                        <img src={fixImageUrl(data.brideImage) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop"} className="absolute inset-0 w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="bride" />
                      </div>
                      <h2 className={`text-5xl text-white mb-3 leading-tight ${greatVibes.className} drop-shadow-xl`}>{data.brideName}</h2>
                      <p className="font-bold text-[10px] uppercase tracking-[0.3em] text-white mb-1 drop-shadow-md">dari :</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm px-4">{data.brideParents}</p>
                      {data.brideInstagram && (
                        <a href={`https://instagram.com/${data.brideInstagram.replace('@', '')}`} target="_blank" className="inline-flex items-center gap-2 mt-4 text-[11px] text-white bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          @{data.brideInstagram.replace('@', '')}
                        </a>
                      )}
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative py-4 flex items-center justify-center">
                      <div className={`text-5xl text-white drop-shadow-lg ${greatVibes.className}`}>&</div>
                    </motion.div>

                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center group">
                      <div className="w-48 h-64 mx-auto mb-6 border-8 border-white bg-white shadow-2xl rotate-[2deg] overflow-hidden relative transition-transform group-hover:rotate-0 duration-500">
                        <img src={fixImageUrl(data.groomImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"} className="absolute inset-0 w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="groom" />
                      </div>
                      <h2 className={`text-5xl text-white mb-3 leading-tight ${greatVibes.className} drop-shadow-xl`}>{data.groomName}</h2>
                      <p className="font-bold text-[10px] uppercase tracking-[0.3em] text-white mb-1 drop-shadow-md">dari :</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm px-4">{data.groomParents}</p>
                      {data.groomInstagram && (
                        <a href={`https://instagram.com/${data.groomInstagram.replace('@', '')}`} target="_blank" className="inline-flex items-center gap-2 mt-4 text-[11px] text-white bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                          @{data.groomInstagram.replace('@', '')}
                        </a>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="py-6 relative mb-12 text-center"
                  >
                    <div className="px-10 relative z-10 text-white text-center">
                      <p className={`text-sm italic leading-relaxed text-white mb-6 ${playfair.className} drop-shadow-lg`}>
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri,
                        supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.
                        Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
                      </p>
                      <p className="font-bold text-xs tracking-widest text-white uppercase drop-shadow-md">( QS. Ar-Rum: 21 )</p>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* BAGIAN 2: AKAD NIKAH & EVENT */}
              <section id="acara" className="relative pt-12 pb-24 overflow-hidden">
                {/* Dekorasi Atas & Bawah di Bagian 2 */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-4"
                >
                  <img src="/images/modern-floral-red/2.png" alt="deco-top-2" className="w-full h-auto" />
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
                >
                  <img src="/images/modern-floral-red/3.png" alt="deco-bottom-2" className="w-full h-auto" />
                </motion.div>

                <div id="event" className="relative z-20 mx-4 py-14">
                  <div className="w-full px-4 text-white">
                    <motion.h2
                      variants={fadeInUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className={`text-4xl mb-4 text-white ${playfair.className} font-bold drop-shadow-xl text-center`}
                    >
                      Acara Bahagia
                    </motion.h2>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: 64 }}
                      viewport={{ once: true }}
                      className="h-[2px] bg-white/30 mx-auto mb-10 shadow-sm"
                    ></motion.div>

                    {/* COUNTDOWN SECTION */}
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="grid grid-cols-4 gap-3 mb-16 px-2"
                    >
                      {[
                        { val: timeLeft.days, label: 'Hari' },
                        { val: timeLeft.hours, label: 'Jam' },
                        { val: timeLeft.minutes, label: 'Menit' },
                        { val: timeLeft.seconds, label: 'Detik' }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          variants={scaleIn}
                          className="relative flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-b from-white/15 to-white/5 border border-white/20 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] group hover:border-[#D4AF37]/50 transition-colors"
                        >
                          <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-2xl font-bold text-white drop-shadow-md z-10 leading-none mb-1">{item.val}</span>
                          <span className={`text-[8px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] z-10 ${playfair.className}`}>{item.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* EVENT CARDS */}
                    <div className="space-y-12">
                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="relative group"
                      >
                        <div className="relative z-20 px-8 pt-10 pb-24 text-white text-center bg-white/5 border border-gray-200 rounded-lg backdrop-blur-xl shadow-2xl overflow-hidden">
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
                          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8B0000]/20 rounded-full blur-3xl"></div>

                          <h3 className={`text-3xl mb-4 text-[#D4AF37] ${playfair.className} font-bold drop-shadow-md`}>Akad Nikah</h3>
                          <p className="text-[10px] text-gray-500 italic mb-6 px-10 leading-relaxed">Momen sakral pengucapan janji suci di hadapan Allah SWT.</p>

                          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8"></div>

                          <div className="space-y-6 mb-10">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Waktu :</span>
                              <p className="font-bold text-lg text-white drop-shadow-sm">{formatDate(data.akadDate)}</p>
                              <p className="text-white/70 text-sm">Pukul {data.akadTime} WIB</p>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Lokasi :</span>
                              <p className="text-md font-bold text-white drop-shadow-sm leading-tight text-center">{data.akadPlace}</p>
                              <p className="text-[11px] text-white/60 italic max-w-[200px] text-center">{data.akadAddress}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 px-4">
                            <a href={data.akadMaps} target="_blank" className="w-full py-4 px-6 rounded-md bg-[#D4AF37] text-white text-[10px] tracking-[0.2em] font-bold uppercase shadow-xl hover:bg-[#B8860B] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                              Lihat Lokasi
                            </a>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.1 }}
                        className="relative group"
                      >
                        <div className="relative z-20 px-8 pt-10 pb-24 text-white text-center bg-white/5 border border-gray-200 rounded-lg backdrop-blur-xl shadow-2xl overflow-hidden">
                          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
                          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8B0000]/20 rounded-full blur-3xl"></div>

                          <h3 className={`text-3xl mb-4 text-[#D4AF37] ${playfair.className} font-bold drop-shadow-md`}>Resepsi</h3>
                          <p className="text-[10px] text-gray-500 italic mb-6 px-10 leading-relaxed">Ungkapan syukur dan kebahagiaan kami bersama keluarga & sahabat.</p>

                          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8"></div>

                          <div className="space-y-6 mb-10">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Waktu :</span>
                              <p className="font-bold text-lg text-white drop-shadow-sm">{formatDate(data.resepsiDate)}</p>
                              <p className="text-white/70 text-sm">Pukul {data.resepsiTime} WIB</p>
                            </div>

                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Lokasi :</span>
                              <p className="text-md font-bold text-white drop-shadow-sm leading-tight text-center">{data.resepsiPlace || data.akadPlace}</p>
                              <p className="text-[11px] text-white/60 italic max-w-[200px] text-center">{data.resepsiAddress || data.akadAddress}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 px-4">
                            <a href={data.resepsiMaps || data.akadMaps} target="_blank" className="w-full py-4 px-6 rounded-md bg-[#D4AF37] text-white text-[10px] tracking-[0.2em] font-bold uppercase shadow-xl hover:bg-[#B8860B] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                              Lihat Lokasi
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>
              {/* BAGIAN: CERITA CINTA (STORY) */}
              {story && story.length > 0 && (
                <section id="story" className="relative pt-12 pb-24 overflow-hidden">
                  {/* Dekorasi Atas & Bawah */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-4"
                  >
                    <img src="/images/modern-floral-red/2.png" alt="deco-top-story" className="w-full h-auto" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
                  >
                    <img src="/images/modern-floral-red/3.png" alt="deco-bottom-story" className="w-full h-auto" />
                  </motion.div>

                  <div className="relative z-20 px-6">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
                      <h2 className={`text-4xl mb-4 text-white ${playfair.className} font-bold drop-shadow-xl`}>Cerita Cinta</h2>
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        viewport={{ once: true }}
                        className="h-[2px] bg-white/30 mx-auto shadow-sm"
                      ></motion.div>
                    </motion.div>
 
                    <div className="relative">
                      {/* Tracking Line */}
                      <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#D4AF37] to-transparent shadow-[0_0_10px_rgba(212,175,55,0.5)]" />

                      <div className="space-y-12">
                        {(story && story.length > 0 ? story : [
                          { title: "Pertama Bertemu", date: "Januari 2021", description: "Berawal dari perkenalan singkat di acara teman, kami mulai saling mengenal dan bertukar cerita.", image: "/images/studio.png" },
                          { title: "Menyatakan Cinta", date: "Maret 2022", description: "Setelah merasa memiliki banyak kesamaan, kami memutuskan untuk memulai hubungan yang lebih serius.", image: "/images/couple.png" },
                          { title: "Lamaran", date: "Desember 2025", description: "Dengan penuh keyakinan dan restu dari kedua keluarga, kami melangsungkan pertunangan.", image: "/images/studio.png" }
                        ]).map((item: any, i: number) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, x: -30, scale: 0.95 }}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true, amount: 0.1 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="relative flex flex-col items-start"
                          >
                            {/* Tracking Dot */}
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#8B0000] border-2 border-[#D4AF37] flex items-center justify-center z-20 shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                            </div>
                            
                            {/* Content */}
                            <div className="w-full pl-12 pb-12">
                              <div className="relative space-y-4">
                                {item.image && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="relative w-32 aspect-square overflow-hidden border bg-white border-gray-200 shadow-lg mb-2"
                                  >
                                    <img src={fixImageUrl(item.image)} alt={item.title} className="absolute inset-0 w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </motion.div>
                                )}
                                <div>
                                    <span className="inline-block text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
                                    {item.date}
                                    </span>
                                    <h3 className={`text-2xl text-white mb-2 ${playfair.className} font-bold tracking-wide`}>{item.title}</h3>
                                    <p className="text-sm text-white/80 leading-relaxed font-light italic">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              )}
 

              {/* BAGIAN: GALERI */}
              <section id="galeri" className="relative pt-12 pb-24 overflow-hidden" style={{ backgroundImage: 'url("/images/modern-floral-red/BG 7.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <motion.div initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-5">
                  <img src="/images/modern-floral-red/2.png" alt="deco" className="w-full h-auto" />
                </motion.div>

                <div className="relative z-20 px-6">
                  <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-4xl mb-4 text-white ${playfair.className} font-bold text-center drop-shadow-xl`}>
                    Galeri Bahagia
                  </motion.h2>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} className="h-[2px] bg-white/30 mx-auto mb-10 shadow-sm"></motion.div>

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
              </section>

              {/* BAGIAN: KONFIRMASI KEHADIRAN (RSVP) */}
              <section id="rsvp" className="relative pt-12 pb-24 overflow-hidden">
                <div className="relative z-20 px-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-gray-200 p-8 rounded-md shadow-md">
                    <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-3xl mb-4 text-[#D4AF37] ${playfair.className} font-bold text-center`}>
                      Konfirmasi Kehadiran
                    </motion.h2>
                    <p className="text-center text-white/60 text-xs mb-8 italic">Kehadiran Anda adalah kado terindah bagi kami</p>

                    <form onSubmit={handleRSVP} className="space-y-4">
                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Nama Lengkap</label>
                        <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Masukkan Nama Anda" className="w-full px-5 py-4 rounded-md bg-white border border-gray-200 text-black outline-none focus:border-[#D4AF37]/50 transition placeholder:text-gray-400 font-bold" />
                      </motion.div>

                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Jumlah Tamu</label>
                        <select value={rsvpTotal} onChange={(e) => setRsvpTotal(e.target.value)} className="w-full px-5 py-4 rounded-md bg-white border border-gray-200 text-black outline-none focus:border-[#D4AF37]/50 transition font-bold">
                          <option value="1">1 Orang</option>
                          <option value="2">2 Orang</option>
                          <option value="3">3 Orang</option>
                          <option value="4">4 Orang</option>
                          <option value="5">5 Orang</option>
                        </select>
                      </motion.div>

                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Status Kehadiran</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Hadir', 'Tidak Hadir'].map((status) => (
                            <button key={status} type="button" onClick={() => setRsvpStatus(status)} className={`py-3 rounded-md border transition-all text-[11px] font-bold uppercase tracking-wider ${rsvpStatus === status ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20' : 'bg-white/5 border-gray-200 text-white/60'}`}>
                              {status}
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmittingRSVP} className="w-full py-5 bg-[#D4AF37] text-white rounded-md text-xs font-bold tracking-[0.2em] uppercase shadow-md hover:bg-[#B8860B] transition-all mt-4">
                        {isSubmittingRSVP ? 'Mengirim...' : 'Kirim Konfirmasi'}
                      </motion.button>
                    </form>
                  </div>
                </div>
              </section>

              {/* BAGIAN: HADIAH DIGITAL */}
              <section id="kado" className="relative pt-12 pb-24 overflow-hidden">
                <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
                  <img src="/images/modern-floral-red/3.png" alt="deco" className="w-full h-auto" />
                </motion.div>

                <div className="relative z-20 px-6">
                  <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-4xl mb-4 text-white ${playfair.className} font-bold text-center`}>
                    Kado Digital
                  </motion.h2>
                  <p className="text-center text-white/70 text-sm mb-12 px-6">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan hadiah, kami sediakan fitur kado digital ini.</p>

                  <div className="space-y-6">
                    {data.gifts.map((gift, idx) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-md border border-gray-200 rounded-2xl p-8 text-white relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
                        <div className="flex flex-col items-center mb-6">
                          <div className="mb-4 h-12 w-full flex items-center justify-center">
                            {gift.logo ? (
                              <img src={gift.logo} className="max-h-full object-contain" alt={gift.bankName} />
                            ) : (
                              <span className="text-xl font-bold">{gift.bankName}</span>
                            )}
                          </div>
                          <div className="h-px w-12 bg-[#D4AF37]/30 mx-auto" />
                        </div>

                        <div className="text-center space-y-1 mb-6">
                          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Nomor Rekening</p>
                          <p className="text-2xl font-bold tracking-widest text-white">{gift.accountNo}</p>
                        </div>

                        <div className="text-center space-y-1 mb-8">
                          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Atas Nama</p>
                          <p className="text-lg font-bold text-white">{gift.accountHolder}</p>
                        </div>

                        <button onClick={() => handleCopy(gift.accountNo, gift.bankName)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.3em] border border-gray-200 transition-all flex items-center justify-center gap-2">
                          {copiedBank === gift.bankName ? '✅ Berhasil Tersalin' : '📋 Salin Rekening'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* BAGIAN 3: UCAPAN & DOA */}
              <section id="wishes" className="relative pt-12 pb-24 overflow-hidden">
                {/* Dekorasi Atas & Bawah di Bagian 3 */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-4"
                >
                  <img src="/images/modern-floral-red/2.png" alt="deco-top-3" className="w-full h-auto" />
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  className="absolute bottom-0 left-0 w-full z-10 pointer-events-none"
                >
                  <img src="/images/modern-floral-red/3.png" alt="deco-bottom-3" className="w-full h-auto" />
                </motion.div>

                <div className="relative z-20 w-full px-6">
                  <motion.h2
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`text-3xl mb-10 text-white ${playfair.className} font-bold text-center drop-shadow-xl`}
                  >
                    Ucapan & Doa
                  </motion.h2>
                  <div className="bg-white rounded-md shadow-md overflow-hidden">
                    <div className="p-8 pb-0">
                      <motion.form
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        onSubmit={handleSubmitWish} className="mb-0"
                      >
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Anda" className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-200 mb-4 text-sm outline-none focus:border-[#8B0000]/50 transition text-black placeholder:text-gray-400 font-bold" />
                        <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Berikan ucapan selamat & doa" rows={4} className="w-full px-5 py-4 rounded-md bg-gray-50 border border-gray-200 mb-5 text-sm outline-none focus:border-[#8B0000]/50 resize-none transition text-black placeholder:text-gray-400 italic"></textarea>
                        <button type="submit" disabled={isSubmittingWish} className="w-full py-5 bg-[#8B0000] text-white rounded-md text-[11px] font-bold tracking-widest uppercase shadow-md hover:bg-[#660000] transition-all">
                          {isSubmittingWish ? 'Mengirim...' : 'Kirim Ucapan'}
                        </button>
                      </motion.form>
                    </div>

                    <div className="h-[1px] bg-gray-100 mx-8 mt-10 mb-2"></div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar p-8">
                      {localWishes.map((wish, idx) => (
                        <motion.div
                          key={idx}
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="pb-6 pt-4 border-b border-gray-100 last:border-0 relative transition-all text-left"
                        >
                          <div className="font-bold text-base text-[#8B0000] mb-1">{wish.name}</div>
                          <div className="text-[8px] text-gray-400 font-bold mb-3 uppercase tracking-[0.2em]">{wish.time}</div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium italic">"{wish.message}"</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* FOOTER */}
              <motion.footer
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative text-center pt-10 pb-4 px-10 bg-[#8b0000] overflow-hidden z-20" style={{ backgroundImage: 'url("/images/modern-floral-red/4.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="relative z-10 text-white pt-6 pb-12 text-center">
                  <p className={`text-5xl text-white mb-4 ${greatVibes.className} drop-shadow-xl text-center`}>{data.brideShort} & {data.groomShort}</p>
                  <p className="text-sm text-white/60 mb-10 italic tracking-wide font-light text-center">Sampai jumpa di hari bahagia kami</p>

                  <div className="pt-8 border-t border-gray-200 flex flex-col items-center">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4 font-bold text-center">Digital Invitation by</p>
                    <a href="https://garasicetak.com" target="_blank" className="flex items-center gap-3 group">
                      <img src="/images/logo.png" alt="logo" className="w-14 h-14 object-contain transition-opacity" />
                      <div className="flex flex-col items-start">
                        <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-rose-400 group-hover:to-amber-400 transition-all duration-500 font-serif">
                          Garasi Cetak
                        </span>
                        <span className="text-[8px] text-white/20 italic tracking-widest text-left">www.garasicetak.com</span>
                      </div>
                    </a>
                  </div>
                </div>
              </motion.footer>
            </motion.main>
          )}
        </AnimatePresence>

        {/* FLOATING AUDIO TOGGLE */}
        <button onClick={toggleMute} className={`audio-btn left-6 bottom-32 shadow-md !bg-white border-4 border-gray-100 text-gray-800 ${isMuted ? '' : 'audio-spinning'} z-[999]`}>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 13.84V11a2 2 0 0 1-1.48-1.92l5.52-1.38V5l1.63-.27C18.66 4.56 20 5.3 20 6.34v8.5m0 5.16v.5a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3Z" /><circle cx="6" cy="18" r="3" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          )}
        </button>

        {/* NAVIGATION BOTTOM */}
        <InvitationBottomNav 
          isOpen={isOpen} 
          theme="modern" 
          activeColor="text-[#8B0000]" 
          textColor="text-gray-500" 
          bgColor="bg-white/95"
        />
      </div>
    </div>
  );
}
