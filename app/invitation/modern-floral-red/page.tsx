'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import './invitation.css';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap' });

// Sample wishes data
// Animation Variants
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

const SAMPLE_WISHES = [
  { name: 'Ahmad & Keluarga', message: 'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khair. Selamat menempuh hidup baru ya!', time: '2 jam yang lalu' },
  { name: 'Siti Aminah', message: 'Semoga menjadi keluarga yang Sakinah, Mawaddah, Warahmah. Amin.', time: '5 jam yang lalu' },
  { name: 'Budi Sudarsono', message: 'Selamat ya Bro! Akhirnya sold out juga. Lancar sampai hari H!', time: '1 hari yang lalu' }
];

function InvitationContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCoverRemoved, setIsCoverRemoved] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchParams = useSearchParams();
  const guestName = searchParams.get('to') || 'Tamu Undangan';

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [wishes, setWishes] = useState(SAMPLE_WISHES);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpTotal, setRsvpTotal] = useState('1');
  const [rsvpStatus, setRsvpStatus] = useState('Hadir');

  // Gift Copy State
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Body Background Color Management
  useEffect(() => {
    if (isOpen) {
      document.body.style.backgroundColor = '#8b0000';
    } else {
      document.body.style.backgroundColor = '';
    }
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [isOpen]);

  // Remove manual reveal logic as we're using Framer Motion
  /* 
  useEffect(() => {
    const reveal = () => {
      ...
    };
    ...
  }, [isOpen]);
  */

  useEffect(() => {
    const targetDate = new Date('2026-12-12T09:00:00').getTime();
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
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setTimeout(() => {
      setIsCoverRemoved(true);
    }, 1100);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSubmitWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newMessage) return;
    const newWish = { name: newName, message: newMessage, time: 'Baru saja' };
    setWishes([newWish, ...wishes]);
    setNewName('');
    setNewMessage('');
  };

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Terima kasih ${rsvpName}, konfirmasi kehadiran Anda telah dikirim!`);
    setRsvpName('');
  };

  const handleCopy = (text: string, bank: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  return (
    <div className={`outer-container flex justify-center bg-white min-h-screen ${montserrat.className}`}>
      <div className="main-mobile-frame relative bg-[#8b0000] shadow-2xl overflow-x-hidden md:w-[450px] min-h-screen flex flex-col">
        {/* BACKGROUND MUSIC */}
        <audio ref={audioRef} loop>
          <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        </audio>

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
                  <h1 className="text-6xl text-white mb-3 mr-10 drop-shadow-2xl leading-none pt-3">Romeo</h1>
                  <h2 className="text-4xl text-white my-3 drop-shadow-lg">&</h2>
                  <h1 className="text-6xl text-white mt-1 ml-10 drop-shadow-2xl leading-none">Juliet</h1>
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
              <section id="section-1" className="relative pt-12 pb-20 overflow-hidden">
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className={`text-xl mb-6 text-white text-center ${playfair.className} italic font-bold drop-shadow-lg`}
                  >
                    Assalamu’alaikum Warahmatullahi Wabarakatuh
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 text-white text-center leading-relaxed text-sm px-4 font-light drop-shadow-md"
                  >
                    Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan.
                    Dengannya rasa syukur yang mendalam, kami bermaksud mengundang Bapak/Ibu/Saudara/i
                    untuk hadir di acara pernikahan kami:
                  </motion.p>

                  <div className="flex flex-col items-center gap-10 mb-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      className="text-center group"
                    >
                      <div className="w-52 h-64 mx-auto mb-6 border-8 border-white shadow-lg rotate-[-2deg] overflow-hidden relative transition-transform group-hover:rotate-0 duration-500">
                        <img src="/images/modern-floral-red/gallery-1.png" className="w-full h-full object-cover" alt="groom" />
                      </div>
                      <h2 className={`text-5xl text-white mb-3 leading-tight ${greatVibes.className} drop-shadow-xl`}>Romeo Montague</h2>
                      <p className="font-bold text-[10px] uppercase tracking-[0.3em] text-white mb-1 drop-shadow-md">Putra dari :</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm">Bapak Lord Montague</p>
                      <p className="text-lg font-bold text-white my-1 drop-shadow-lg">&</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm">Ibu Lady Montague</p>
                      <a href="https://instagram.com/romeomontague" target="_blank" className="inline-flex items-center gap-2 mt-4 text-[11px] text-white bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition">
                        @romeomontague
                      </a>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="relative py-4 flex items-center justify-center"
                    >
                      <div className={`text-5xl text-white drop-shadow-lg ${greatVibes.className}`}>&</div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.1 }}
                      className="text-center group"
                    >
                      <div className="w-52 h-64 mx-auto mb-6 border-8 border-white shadow-lg rotate-[2deg] overflow-hidden relative transition-transform group-hover:rotate-0 duration-500">
                        <img src="/images/modern-floral-red/gallery-2.png" className="w-full h-full object-cover" alt="bride" />
                      </div>
                      <h2 className={`text-5xl text-white mb-3 leading-tight ${greatVibes.className} drop-shadow-xl`}>Juliet Capulet</h2>
                      <p className="font-bold text-[10px] uppercase tracking-[0.3em] text-white mb-1 drop-shadow-md">Putri dari :</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm">Bapak Lord Capulet</p>
                      <p className="text-lg font-bold text-white my-1 drop-shadow-lg">&</p>
                      <p className="text-sm font-semibold text-white drop-shadow-sm">Ibu Lady Capulet</p>
                      <a href="https://instagram.com/julietcapulet" target="_blank" className="inline-flex items-center gap-2 mt-4 text-[11px] text-white bg-white/10 px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition">
                        @julietcapulet
                      </a>
                    </motion.div>
                  </div>


                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="py-10 relative mb-12 text-center"
                  >
                    <div className="px-8 relative z-10 text-white text-center">
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
              <section id="section-2" className="relative py-12 overflow-hidden">
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
                      viewport={{ once: true, amount: 0.3 }}
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
                          {/* Inner glow */}
                          <div className="absolute inset-0 rounded-2xl bg-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="text-2xl font-bold text-white drop-shadow-md z-10 leading-none mb-1">{item.val}</span>
                          <span className={`text-[8px] uppercase font-bold tracking-[0.2em] text-[#D4AF37] z-10 ${playfair.className}`}>{item.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* EVENT CARDS */}
                    <div className="space-y-12">
                      {[
                        { title: 'Akad Nikah', date: 'Sabtu, 12 Desember 2026', time: '09.00 - 10.30 WIB', icon: '💍', desc: 'Momen sakral pengucapan janji suci di hadapan Allah SWT.' },
                        { title: 'Resepsi', date: 'Sabtu, 12 Desember 2026', time: '11.00 - 13.00 WIB', icon: '✨', desc: 'Ungkapan syukur dan kebahagiaan kami bersama keluarga & sahabat.' }
                      ].map((event, idx) => (
                        <motion.div
                          key={idx}
                          variants={fadeInUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.1 }}
                          className="relative group"
                        >
                          <div className="relative z-20 px-8 py-10 text-white text-center bg-white/5 border border-white/10 rounded-lg backdrop-blur-xl shadow-2xl overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
                            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8B0000]/20 rounded-full blur-3xl"></div>

                            <h3 className={`text-3xl mb-4 text-[#D4AF37] ${playfair.className} font-bold drop-shadow-md`}>{event.title}</h3>
                            <p className="text-[10px] text-white/50 italic mb-6 px-10 leading-relaxed">{event.desc}</p>

                            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mb-8"></div>

                            <div className="space-y-6 mb-10">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Waktu :</span>
                                <p className="font-bold text-lg text-white drop-shadow-sm">{event.date}</p>
                                <p className="text-white/70 text-sm">{event.time}</p>
                              </div>

                              <div className="flex flex-col items-center gap-1">
                                <span className="text-[9px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">Lokasi :</span>
                                <p className="text-md font-bold text-white drop-shadow-sm leading-tight">Grand Ballroom Hotel Royal</p>
                                <p className="text-[11px] text-white/60 italic max-w-[200px]">Jl. Contoh Boulevard No. 123, Jakarta Utara</p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 px-4">
                              <button className="w-full py-4 px-6 rounded-md bg-[#D4AF37] text-white text-[10px] tracking-[0.2em] font-bold uppercase shadow-xl hover:bg-[#B8860B] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></svg>
                                Lihat Lokasi
                              </button>
                              <button className="w-full py-3 px-6 rounded-md bg-white/10 text-white text-[9px] tracking-[0.15em] font-bold uppercase border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                Simpan ke Kalender
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* BAGIAN: GALERI */}
              <section id="gallery" className="relative py-12 overflow-hidden">
                <motion.div initial={{ y: -50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="absolute top-0 left-0 w-full z-10 pointer-events-none translate-x-5">
                  <img src="/images/modern-floral-red/2.png" alt="deco" className="w-full h-auto" />
                </motion.div>

                <div className="relative z-20 px-6">
                  <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-4xl mb-4 text-white ${playfair.className} font-bold text-center drop-shadow-xl`}>
                    Galeri Bahagia
                  </motion.h2>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: 64 }} viewport={{ once: true }} className="h-[2px] bg-white/30 mx-auto mb-10 shadow-sm"></motion.div>

                  <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <motion.div key={num} variants={scaleIn} className={`relative rounded-lg overflow-hidden border-2 border-white/20 shadow-xl ${num % 3 === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-[3/4]'}`}>
                        <Image src={`/images/modern-floral-red/gallery-${num === 3 ? 1 : num === 6 ? 2 : (num % 2 === 0 ? 2 : 1)}.png`} fill style={{ objectFit: 'cover' }} alt="gallery" className="hover:scale-110 transition-transform duration-700" />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </section>

              {/* BAGIAN: KONFIRMASI KEHADIRAN (RSVP) */}
              <section id="rsvp-section" className="relative py-12 overflow-hidden">
                <div className="relative z-20 px-6">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-md shadow-md">
                    <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-3xl mb-4 text-[#D4AF37] ${playfair.className} font-bold text-center`}>
                      Konfirmasi Kehadiran
                    </motion.h2>
                    <p className="text-center text-white/60 text-xs mb-8 italic">Kehadiran Anda adalah kado terindah bagi kami</p>

                    <form onSubmit={handleRSVP} className="space-y-4">
                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1 block">Nama Lengkap</label>
                        <input value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} placeholder="Masukkan Nama Anda" className="w-full px-5 py-4 rounded-md bg-white border border-white/10 text-black outline-none focus:border-[#D4AF37]/50 transition placeholder:text-gray-400 font-bold" />
                      </motion.div>

                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1 block">Jumlah Tamu</label>
                        <select value={rsvpTotal} onChange={(e) => setRsvpTotal(e.target.value)} className="w-full px-5 py-4 rounded-md bg-white border border-white/10 text-black outline-none focus:border-[#D4AF37]/50 transition font-bold">
                          <option value="1">1 Orang</option>
                          <option value="2">2 Orang</option>
                          <option value="3">3 Orang</option>
                        </select>
                      </motion.div>

                      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <label className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-1 block">Status Kehadiran</label>
                        <div className="grid grid-cols-2 gap-3">
                          {['Hadir', 'Tidak Hadir'].map((status) => (
                            <button key={status} type="button" onClick={() => setRsvpStatus(status)} className={`py-3 rounded-md border transition-all text-[11px] font-bold uppercase tracking-wider ${rsvpStatus === status ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20' : 'bg-white/5 border-white/10 text-white/60'}`}>
                              {status}
                            </button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full py-5 bg-[#D4AF37] text-white rounded-md text-xs font-bold tracking-[0.2em] uppercase shadow-md hover:bg-[#B8860B] transition-all mt-4">
                        Kirim Konfirmasi
                      </motion.button>
                    </form>
                  </div>
                </div>
              </section>

              {/* BAGIAN: HADIAH DIGITAL */}
              <section id="gift" className="relative py-12 overflow-hidden">
                <motion.div initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
                  <img src="/images/modern-floral-red/3.png" alt="deco" className="w-full h-auto" />
                </motion.div>

                <div className="relative z-20 px-6">
                  <motion.h2 variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className={`text-4xl mb-4 text-white ${playfair.className} font-bold text-center`}>
                    Kado Digital
                  </motion.h2>
                  <p className="text-center text-white/70 text-sm mb-12 px-6">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan hadiah, kami sediakan fitur kado digital ini.</p>

                  <div className="space-y-6">
                    {[
                      { bankName: "BRI", accountNo: "1234567890", accountHolder: "Romeo Juliet", logo: "/images/bank/bri.png" },
                      { bankName: "MANDIRI", accountNo: "0987654321", accountHolder: "Romeo Juliet", logo: "/images/bank/mandiri.png" }
                    ].map((gift, idx) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-white relative overflow-hidden group hover:border-[#D4AF37]/50 transition-all">
                        <div className="flex flex-col items-center mb-6">
                          <div className="mb-4 h-12 w-full flex items-center justify-center">
                            <img src={gift.logo} className="max-h-full object-contain" alt={gift.bankName} />
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

                        <button onClick={() => { navigator.clipboard.writeText(gift.accountNo); alert("Nomor rekening berhasil tersalin"); }} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] uppercase font-bold tracking-[0.3em] border border-white/10 transition-all flex items-center justify-center gap-2">
                          📋 Salin Rekening
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* BAGIAN 3: UCAPAN & DOA */}
              <section id="section-3" className="relative py-12 overflow-hidden">
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

                <div id="wishes" className="relative z-20 w-full px-6">
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
                        <button type="submit" className="w-full py-5 bg-[#8B0000] text-white rounded-md text-[11px] font-bold tracking-widest uppercase shadow-md hover:bg-[#660000] transition-all">Kirim Ucapan</button>
                      </motion.form>
                    </div>

                    <div className="h-[1px] bg-gray-100 mx-8 mt-10 mb-2"></div>

                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar p-8">
                      {wishes.map((wish, idx) => (
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
                className="relative text-center py-10 px-10 bg-[#8b0000] overflow-hidden z-20" style={{ backgroundImage: 'url("/images/modern-floral-red/4.png")', backgroundSize: 'cover', backgroundPosition: 'center' }}
              >
                <div className="relative z-10 text-white pt-6 pb-6">
                  <p className={`text-5xl text-white mb-4 ${greatVibes.className} drop-shadow-xl`}>Romeo & Juliet</p>
                  <p className="text-sm text-white/60 mb-10 italic tracking-wide font-light">Sampai jumpa di hari bahagia kami</p>

                  <div className="pt-8 border-t border-white/10">
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] mb-4 font-bold">Digital Invitation by</p>
                    <a href="https://garasicetak.com" target="_blank" className="inline-flex items-center gap-3 group">
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
        <button onClick={toggleMute} className={`audio-btn left-6 bottom-32 shadow-md !bg-[#8B0000] border-4 border-white/10 ${isMuted ? '' : 'audio-spinning'} z-[999]`}>
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 13.84V11a2 2 0 0 1-1.48-1.92l5.52-1.38V5l1.63-.27C18.66 4.56 20 5.3 20 6.34v8.5m0 5.16v.5a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3 3 3 0 0 1 3 3Z" /><circle cx="6" cy="18" r="3" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          )}
        </button>

        {/* NAVIGATION BOTTOM */}
        <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[450px] bg-[#1a1a1a]/90 backdrop-blur-xl border-t border-white/10 rounded-t-md p-2 flex justify-around items-center shadow-md z-[9999] opacity-0 transition-all duration-500 pointer-events-none [&.active]:opacity-100 [&.active]:pointer-events-auto ${isOpen ? 'active' : ''}`}>
          {[
            { id: '#home', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>, label: 'Muka' },
            { id: '#section-1', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, label: 'Mempelai' },
            { id: '#event', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, label: 'Acara' },
            { id: '#gallery', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>, label: 'Galeri' },
            { id: '#rsvp-section', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>, label: 'RSVP' },
            { id: '#gift', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>, label: 'Kado' },
            { id: '#wishes', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>, label: 'Doa' }
          ].map((link) => (
            <a key={link.id} href={link.id} className="flex flex-col items-center justify-center w-auto h-auto text-white/50 hover:text-[#D4AF37] transition-all px-1">
              {link.icon}
              <span className="text-[6px] uppercase tracking-tighter mt-1 font-bold">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default function ModernFloralRed() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitationContent />
    </Suspense>
  );
}
