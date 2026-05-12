'use client';

import React, { useEffect, useState } from 'react';
import './style.css';
import Image from 'next/image';
import { Playfair_Display, Great_Vibes, Montserrat, Sacramento, Cormorant_Garamond, Alex_Brush } from 'next/font/google';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Heart, Calendar, MapPin, Clock, Copy, Check, Music, Volume2, VolumeX, Send, Gift, Landmark } from 'lucide-react';
import { useInvitation, InvitationData } from '@/components/templates/shared/useInvitation';
import { InvitationGallery } from '@/components/templates/shared/InvitationGallery';

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap' });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin'], display: 'swap' });
const sacramento = Sacramento({ weight: '400', subsets: ['latin'], display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
const alexBrush = Alex_Brush({ weight: '400', subsets: ['latin'], display: 'swap' });

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const tiltLeftScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -6,
    transition: { duration: 2.5, ease: "easeOut" }
  }
};

const tiltRightScaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotate: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 6,
    transition: { duration: 2.5, ease: "easeOut" }
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

interface TemplateProps {
  data: InvitationData;
}

export default function SoftFloralPinkTemplate({ data }: TemplateProps) {
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

  const getBankLogo = (bankName: string) => {
    const name = bankName.toLowerCase();
    if (name.includes('bca')) return '/images/bank/bca.svg';
    if (name.includes('mandiri')) return '/images/bank/mandiri.png';
    if (name.includes('bri')) return '/images/bank/bri.png';
    if (name.includes('bsi')) return '/images/bank/bsi.png';
    if (name.includes('btn')) return '/images/bank/btn.png';
    if (name.includes('bjb')) return '/images/bank/bjb.png';
    if (name.includes('dana')) return '/images/bank/dana.png';
    if (name.includes('shopee') || name.includes('spay')) return '/images/bank/sopeepay.png';
    return null;
  };

  if (!isMounted) return null;

  let galleryImages = data.gallery && data.gallery.length > 0 ? [...data.gallery] : [];
  const fallbacks = [
    "/images/couple.png",
    "/images/studio.png",
    "/images/couple.png",
    "/images/studio.png",
    "/images/couple.png",
    "/images/studio.png"
  ];
  
  if (galleryImages.length < 6) {
    galleryImages = [...galleryImages, ...fallbacks.slice(galleryImages.length, 6)];
  }

  return (
    <div className={`outer-container ${montserrat.className} text-[#7A5C5C]`}>
      <div className="main-mobile-frame overflow-x-hidden scrollbar-hide flex flex-col">
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
        <AnimatePresence>
          {!isCoverRemoved && (
            <motion.section
              className={`cover-section ${isOpen ? 'opened' : ''}`}
              style={{ backgroundImage: 'url("/images/Pink Floral/1.png")' }}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -100, transition: { duration: 0.8 } }}
            >
              <div className="absolute inset-0 bg-white/10 pointer-events-none" />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 w-full max-w-[360px] glass-card-names p-10 flex flex-col items-center text-center overflow-hidden"
              >
                {/* Gold Frame Ornament from Folder */}
                <div className="absolute inset-0 z-0 opacity-100 pointer-events-none p-2">
                    <img src="/images/Pink Floral/8.png" alt="frame" className="w-full h-full object-stretch" />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    <p className={`${cormorant.className} text-2xl mb-8 tracking-widest`}>
                      The Wedding Of
                    </p>
                    
                    <div className="mb-12 flex flex-col items-center">
                      <h1 className={`${alexBrush.className} text-6xl md:text-7xl text-[#7A5C5C] leading-none`}>
                        {data.brideShort}
                      </h1>
                      <div className={`${alexBrush.className} text-5xl text-[#B18585] my-4`}>&</div>
                      <h1 className={`${alexBrush.className} text-6xl md:text-7xl text-[#7A5C5C] leading-none`}>
                        {data.groomShort}
                      </h1>
                    </div>

                    <div className="mb-8">
                      <p className={`${cormorant.className} text-sm mb-1`}>Kepada Yth.</p>
                      <p className={`${cormorant.className} text-sm mb-6`}>Bapak/Ibu/Saudara/i</p>
                      
                      <h2 className={`${playfair.className} text-3xl italic mb-4 text-[#7A5C5C]`}>
                        {guestName}
                      </h2>
                      
                      <p className="text-[10px] text-[#A08585] mt-4 italic">Maaf apabila ada kesalahan pada penulisan nama/gelar</p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleOpen}
                      className="btn-open-solid"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      BUKA UNDANGAN
                    </motion.button>
                </div>
              </motion.div>

            </motion.section>
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        {isOpen && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative flex-1"
          >
            {/* FLOATING AUDIO TOGGLE */}
            <button onClick={toggleMute} className={`audio-btn ${isMuted ? '' : 'audio-spinning'}`}>
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            {/* BACKGROUND WRAPPER FOR HOME & MEMPELAI */}
            <div 
              style={{ 
                backgroundImage: 'url("/images/Pink Floral/1.png")',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                backgroundPosition: 'top center'
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-white/40 pointer-events-none z-0" />
            {/* SECTION 1: HEADER & QUOTE */}
            <section 
              id="home" 
              className="relative flex flex-col items-center px-4"
            >
                <motion.div
                 variants={staggerContainer}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true }}
                 className="text-center min-h-screen flex flex-col items-center justify-center relative z-10 py-10"
                >
                  <motion.p variants={fadeInDown} className={`${cormorant.className} text-2xl mb-6 text-[#4A3737] tracking-widest`}>The Wedding Of</motion.p>
                  
                  <motion.div variants={scaleIn} className="flex flex-col items-center mb-10">
                      <h2 className={`${alexBrush.className} text-6xl md:text-7xl text-[#7A5C5C] leading-none`}>
                        {data.brideShort}
                      </h2>
                      <div className={`${alexBrush.className} text-5xl text-[#B18585] my-4`}>&</div>
                      <h2 className={`${alexBrush.className} text-6xl md:text-7xl text-[#7A5C5C] leading-none`}>
                        {data.groomShort}
                      </h2>
                  </motion.div>

                  <motion.p variants={fadeInUp} className={`${cormorant.className} text-3xl italic text-[#4A3737] mb-8`}>Save The Date</motion.p>
                  
                  {/* SOLID MAUVE COUNTDOWN - SLIGHTLY SMALLER */}
                  <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-3 max-w-[320px] mx-auto mb-16">
                    {[
                      { label: 'Hari', val: timeLeft.days },
                      { label: 'Jam', val: timeLeft.hours },
                      { label: 'Menit', val: timeLeft.minutes },
                      { label: 'Detik', val: timeLeft.seconds }
                    ].map((item, idx) => (
                       <motion.div variants={scaleIn} key={idx} className="bg-white/40 backdrop-blur-md rounded-xl p-3 w-16 shadow-md flex flex-col items-center justify-center border border-white/40">
                         <p className="text-xl font-bold text-[#B18585] leading-none">{item.val}</p>
                         <p className="text-[9px] text-[#A08585] mt-1 font-bold">{item.label}</p>
                       </motion.div>
                    ))}
                  </motion.div>

                  {/* SCROLL INDICATOR */}
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-70">
                    <div className="flex flex-col -space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3737" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4A3737" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </div>
                    <p className={`${cormorant.className} text-lg italic text-[#4A3737]`}>Scroll Keatas</p>
                  </div>
                </motion.div>
            </section>
            
                 {/* LINE DIVIDER */}
                 <div className="w-full flex justify-center relative z-10">
                    <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#B18585]/30 to-transparent" />
                 </div>

                 {/* SECTION 2: MEMPELAI */}
                 <section id="mempelai" className="section-padding relative overflow-hidden">
                    {/* FLORAL BOTTOM */}
                    <div className="absolute bottom-0 left-0 w-full h-24 opacity-100 z-0 sway-floral">
                      <img src="/images/Pink Floral/9.png" alt="floral-border" className="w-full h-full object-cover" />
                    </div>
                   <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-[500px] mx-auto bg-white/40 backdrop-blur-sm rounded-[40px] border border-white/40 p-8 md:p-12 text-center relative z-10 shadow-md"
                   >
                     <motion.div variants={fadeInDown} className="mb-4">
                       <img src="/images/Pink Floral/bismillah.svg" alt="bismillah" className="h-10 mx-auto opacity-80" />
                     </motion.div>
                     <motion.h2 variants={fadeInUp} className={`${playfair.className} text-lg font-bold text-[#7A5C5C] mb-4 tracking-wide`}>Assalamu'alaikum Wr. Wb.</motion.h2>
                     <motion.p variants={fadeInUp} className={`${cormorant.className} text-sm leading-relaxed text-[#7A5C5C] mb-10 px-4`}>
                       Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaaAllah kami akan menyelenggarakan acara pernikahan :
                     </motion.p>

                      {/* PHOTOS SIDE BY SIDE */}
                      <div className="flex justify-center items-center gap-4 mb-10">
                        <motion.div variants={tiltLeftScaleIn} className="relative w-32 h-32 min-w-[128px] min-h-[128px] rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={((data.groomImage?.length ?? 0) > 10) ? fixImageUrl(data.groomImage!) : "/images/couple.png"} 
                            alt="" 
                            className="w-full h-full"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            onError={(e) => { e.currentTarget.src = "/images/couple.png"; }}
                          />
                        </motion.div>
                        
                        <motion.div variants={scaleIn} className="text-[#B18585]/40 sway-floral flex-shrink-0">
                          <Heart size={24} fill="currentColor" />
                        </motion.div>

                        <motion.div variants={tiltRightScaleIn} className="relative w-32 h-32 min-w-[128px] min-h-[128px] rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          <img 
                            src={((data.brideImage?.length ?? 0) > 10) ? fixImageUrl(data.brideImage!) : "/images/couple.png"} 
                            alt="" 
                            className="w-full h-full"
                            style={{ objectFit: 'cover', objectPosition: 'center' }}
                            onError={(e) => { e.currentTarget.src = "/images/couple.png"; }}
                          />
                        </motion.div>
                      </div>

                     {/* NAMES STACKED */}
                     <div className="space-y-8 mb-12">
                       <motion.div variants={fadeInLeft}>
                         <h3 className={`${alexBrush.className} text-4xl text-[#B18585] mb-1`}>{data.groomName}</h3>
                         <p className="text-[10px] uppercase tracking-widest font-semibold text-[#A08585]">Putra Dari Bapak {data.groomParents?.split('&')[0]} & Ibu {data.groomParents?.split('&')[1]}</p>
                       </motion.div>

                       <motion.div variants={scaleIn} className="flex items-center justify-center gap-4">
                         <div className="h-[1px] w-12 bg-[#B18585]/20"></div>
                         <div className={`${sacramento.className} text-3xl text-[#B18585]`}>&</div>
                         <div className="h-[1px] w-12 bg-[#B18585]/20"></div>
                       </motion.div>

                       <motion.div variants={fadeInRight}>
                         <h3 className={`${alexBrush.className} text-4xl text-[#B18585] mb-1`}>{data.brideName}</h3>
                         <p className="text-[10px] uppercase tracking-widest font-semibold text-[#A08585]">Putri Dari Bapak {data.brideParents?.split('&')[0]} & Ibu {data.brideParents?.split('&')[1]}</p>
                       </motion.div>
                     </div>

                     {/* AR-RUM QUOTE MOVED HERE */}
                     <motion.div variants={fadeInUp} className="mt-10 px-4 py-6 bg-white/20 rounded-3xl border border-white/30 shadow-sm">
                       <p className={`${cormorant.className} text-xs italic leading-relaxed mb-4 text-[#7A5C5C]`}>
                         "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri,
                         supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.
                         Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."
                       </p>
                       <p className="font-semibold text-[8px] tracking-widest text-[#B18585] uppercase">( QS. Ar-Rum: 21 )</p>
                     </motion.div>
                   </motion.div>
                 </section>


            {/* SECTION 3: ACARA */}
            <section id="acara" className="section-padding relative overflow-hidden">
              {/* FLORAL BOTTOM */}
              <div className="absolute bottom-0 left-0 w-full h-24 opacity-100 z-0 sway-floral">
                <img src="/images/Pink Floral/9.png" alt="floral-border" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <img src="/images/Pink Floral/1.png" alt="bg" className="w-full h-full object-cover" />
              </div>
              
              <motion.div
                variants={fadeInDown}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12 relative z-10"
              >
                <div className="text-[#B18585] mb-4 flex justify-center">
                    <Calendar size={32} />
                </div>
                <h2 className={`${sacramento.className} text-5xl text-[#B18585] mb-2`}>Save the Date</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A08585]">Mohon Doa & Restu</p>
              </motion.div>


              {/* AKAD & RESEPSI */}
              <div className="space-y-8">
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white/25 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-white/40 relative overflow-hidden"
                >
                  <motion.div variants={tiltLeftScaleIn} className="polaroid-frame mx-auto max-w-[220px] relative">
                    <img 
                        src={((data.akadImage?.length ?? 0) > 10) ? fixImageUrl(data.akadImage!) : "/images/studio.png"} 
                        alt="" 
                        onError={(e) => { e.currentTarget.src = "/images/studio.png"; }}
                    />
                    <div className="absolute -top-4 -right-4 w-16 h-16 opacity-80">
                        <img src="/images/Pink Floral/7.png" alt="floral" className="w-full h-full object-contain" />
                    </div>
                  </motion.div>

                  <motion.h3 variants={fadeInDown} className={`${playfair.className} text-2xl font-bold text-[#B18585] mb-6`}>Akad Nikah</motion.h3>
                  
                  <motion.div variants={scaleIn} className="date-grid">
                    <div className="date-side border-y border-[#B18585]/40 py-1">{new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(data.akadDate || new Date())}</div>
                    <div className="date-center">
                      <div className="date-number">{data.akadDate ? new Date(data.akadDate).getDate() : '10'}</div>
                      <div className="date-year">{data.akadDate ? new Date(data.akadDate).getFullYear() : '2026'}</div>
                    </div>
                    <div className="date-side border-y border-[#B18585]/40 py-1">{new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(data.akadDate || new Date())}</div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                    <div className="flex flex-col items-center gap-1">
                      <Clock size={18} className="text-[#B18585] mb-1" />
                      <p className="text-sm font-semibold">{data.akadTime} WIB - Selesai</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MapPin size={18} className="text-[#B18585] mb-1" />
                      <p className="text-sm font-bold">{data.akadPlace}</p>
                      <p className="text-xs text-[#A08585] px-4">{data.akadAddress}</p>
                    </div>
                  </motion.div>
                  <motion.a variants={fadeInUp} href={data.akadMaps} target="_blank" className="btn-inv">
                    <MapPin size={14} />
                    Lihat Lokasi
                  </motion.a>
                </motion.div>

                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white/25 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-white/40 relative overflow-hidden"
                >
                  <motion.div variants={tiltRightScaleIn} className="polaroid-frame mx-auto max-w-[220px] relative">
                    <img 
                        src={((data.resepsiImage?.length ?? 0) > 10) ? fixImageUrl(data.resepsiImage!) : "/images/studio.png"} 
                        alt="" 
                        onError={(e) => { e.currentTarget.src = "/images/studio.png"; }}
                    />
                    <div className="absolute -top-4 -left-4 w-16 h-16 opacity-80 -scale-x-100">
                        <img src="/images/Pink Floral/7.png" alt="floral" className="w-full h-full object-contain" />
                    </div>
                  </motion.div>

                  <motion.h3 variants={fadeInDown} className={`${playfair.className} text-2xl font-bold text-[#B18585] mb-6`}>Resepsi</motion.h3>

                  <motion.div variants={scaleIn} className="date-grid">
                    <div className="date-side border-y border-[#B18585]/40 py-1">{new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(data.resepsiDate || data.akadDate || new Date())}</div>
                    <div className="date-center">
                      <div className="date-number">{data.resepsiDate ? new Date(data.resepsiDate).getDate() : '10'}</div>
                      <div className="date-year">{data.resepsiDate ? new Date(data.resepsiDate).getFullYear() : '2026'}</div>
                    </div>
                    <div className="date-side border-y border-[#B18585]/40 py-1">{new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(data.resepsiDate || data.akadDate || new Date())}</div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-4 mb-8">
                    <div className="flex flex-col items-center gap-1">
                      <Clock size={18} className="text-[#B18585] mb-1" />
                      <p className="text-sm font-semibold">{data.resepsiTime} WIB - Selesai</p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MapPin size={18} className="text-[#B18585] mb-1" />
                      <p className="text-sm font-bold">{data.resepsiPlace || data.akadPlace}</p>
                      <p className="text-xs text-[#A08585] px-4">{data.resepsiAddress || data.akadAddress}</p>
                    </div>
                  </motion.div>
                  <motion.a variants={fadeInUp} href={data.resepsiMaps || data.akadMaps} target="_blank" className="btn-inv">
                    <MapPin size={14} />
                    Lihat Lokasi
                  </motion.a>
                </motion.div>
              </div>
            </section>
            

            {/* SECTION 4: GALERI */}
            <section id="galeri" className="section-padding bg-white/30 backdrop-blur-sm relative overflow-hidden">
              {/* FLORAL BOTTOM */}
              <div className="absolute bottom-0 left-0 w-full h-24 opacity-100 z-0 sway-floral">
                <img src="/images/Pink Floral/9.png" alt="floral-border" className="w-full h-full object-cover" />
              </div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-10"
              >
                <h2 className={`${sacramento.className} text-5xl text-[#B18585] mb-2`}>Gallery Bahagia</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A08585]">Kenangan Indah Kami</p>
              </motion.div>

              <InvitationGallery images={galleryImages} fixImageUrl={fixImageUrl} />
            </section>

            {/* SECTION: LOVE STORY */}
            <section id="story" className="section-padding relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-64 opacity-50 pointer-events-none rotate-180 z-0">
                <img src="/images/Pink Floral/2.png" alt="floral" className="w-full h-full object-contain" />
              </div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12 relative z-10"
              >
                <div className="text-[#B18585] mb-4 flex justify-center">
                    <Heart size={32} />
                </div>
                <h2 className={`${sacramento.className} text-5xl text-[#B18585] mb-2`}>Cerita Cinta</h2>
                <p className="text-xs uppercase tracking-[0.3em] text-[#A08585]">Perjalanan Cinta Kami</p>
              </motion.div>

              <div className="max-w-[400px] mx-auto relative z-10 px-4">
                {/* Tracking Line */}
                <div className="absolute left-[31px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-[#B18585] to-transparent shadow-[0_0_10px_rgba(177,133,133,0.3)]" />

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
                      className="relative flex flex-col items-start"
                    >
                      {/* Tracking Dot */}
                      <div className="absolute left-[2px] top-0 w-6 h-6 rounded-full bg-white border-2 border-[#B18585] flex items-center justify-center z-20 shadow-[0_0_10px_rgba(177,133,133,0.3)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B18585] animate-pulse" />
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
                              <span className="inline-block text-[#B18585] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                              {item.date}
                              </span>
                              <h3 className={`text-xl text-[#7A5C5C] mb-1 ${playfair.className} font-bold tracking-wide`}>{item.title}</h3>
                              <p className="text-xs text-[#A08585] leading-relaxed font-medium">{item.text || item.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>


            {/* SECTION 5: KADO */}
            <section id="kado" className="section-padding relative overflow-hidden">
              {/* FLORAL BOTTOM */}
              <div className="absolute bottom-0 left-0 w-full h-24 opacity-100 z-0 sway-floral">
                <img src="/images/Pink Floral/9.png" alt="floral-border" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 right-0 w-40 h-80 opacity-40 pointer-events-none rotate-180">
                <img src="/images/Pink Floral/2.png" alt="floral" className="w-full h-full object-contain" />
              </div>

              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-16 relative z-10"
              >
                <div className="text-[#B18585] mb-4 flex justify-center">
                    <Gift size={32} />
                </div>
                <motion.h2 variants={fadeInDown} className={`${sacramento.className} text-5xl text-[#B18585] mb-2`}>Kado Digital</motion.h2>
                <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#A08585]">Terima Kasih Atas Tanda Kasih Anda</motion.p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-6 max-w-[400px] mx-auto relative z-10"
              >
                {data.gifts?.map((gift, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="gift-card text-center"
                  >
                    <div className="flex justify-center items-center mb-6 min-h-[40px]">
                       {getBankLogo(gift.bankName) || gift.logo ? (
                          <img src={getBankLogo(gift.bankName) || gift.logo} className="bank-logo-small mb-0" alt={gift.bankName} />
                       ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Landmark size={24} className="text-[#B18585] mb-1" />
                            <p className="font-bold text-lg text-[#B18585] leading-tight">{gift.bankName}</p>
                          </div>
                       )}
                    </div>
                    <div className="space-y-1 mb-6">
                      <p className="text-[10px] font-bold text-[#A08585] uppercase tracking-widest">Nomor Rekening</p>
                      <p className="text-xl font-bold tracking-widest">{gift.accountNo}</p>
                      <p className="text-sm font-medium">a.n {gift.accountHolder}</p>
                    </div>
                    
                    <button 
                      onClick={() => handleCopy(gift.accountNo, gift.bankName)}
                      className="btn-inv w-full justify-center"
                    >
                      {copiedBank === gift.bankName ? <><Check size={14} /> Berhasil Tersalin</> : <><Copy size={14} /> Salin No. Rek</>}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </section>



            {/* SECTION 6: RSVP & WISHES */}
            <section id="rsvp" className="section-padding bg-white/30 backdrop-blur-sm relative overflow-hidden">
              {/* FLORAL BOTTOM */}
              <div className="absolute bottom-0 left-0 w-full h-24 opacity-100 z-0 sway-floral">
                <img src="/images/Pink Floral/9.png" alt="floral-border" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                  <img src="/images/Pink Floral/1.png" alt="bg" className="w-full h-full object-cover" />
              </div>
              
              <div className="max-w-[600px] mx-auto relative z-10">
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="text-center mb-12"
                >
                  <motion.h2 variants={fadeInDown} className={`${sacramento.className} text-5xl text-[#B18585] mb-2`}>Konfirmasi Kehadiran</motion.h2>
                  <motion.p variants={fadeInUp} className="text-xs uppercase tracking-[0.3em] text-[#A08585]">Berikan Ucapan & Doa Restu</motion.p>
                </motion.div>

                <motion.div 
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white/40 backdrop-blur-md rounded-[40px] p-8 md:p-10 shadow-lg border border-white/40 mb-16"
                >
                  <form onSubmit={handleRSVP} className="space-y-6">
                    <motion.div variants={fadeInUp}>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#B18585] mb-2 ml-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        className="w-full bg-white/50 border border-white/40 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#B18585]/20 transition"
                        placeholder="Masukkan nama Anda"
                        required
                      />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#B18585] mb-2 ml-1">Jumlah Tamu</label>
                      <select 
                        value={rsvpTotal}
                        onChange={(e) => setRsvpTotal(e.target.value)}
                        className="w-full bg-white/50 border border-white/40 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#B18585]/20 transition appearance-none"
                      >
                        {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Orang</option>)}
                      </select>
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label className="block text-[10px] uppercase tracking-widest font-bold text-[#B18585] mb-2 ml-1">Kehadiran</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          type="button"
                          onClick={() => setRsvpStatus('HADIR')}
                          className={`py-4 rounded-2xl border transition-all duration-300 font-bold text-xs tracking-widest ${rsvpStatus === 'HADIR' ? 'bg-[#B18585] text-white border-[#B18585] shadow-md scale-[1.02]' : 'bg-white/50 border-white/40 text-[#A08585]'}`}
                        >
                          HADIR
                        </button>
                        <button 
                          type="button"
                          onClick={() => setRsvpStatus('TIDAK HADIR')}
                          className={`py-4 rounded-2xl border transition-all duration-300 font-bold text-xs tracking-widest ${rsvpStatus === 'TIDAK HADIR' ? 'bg-[#7A5C5C] text-white border-[#7A5C5C] shadow-md scale-[1.02]' : 'bg-white/50 border-white/40 text-[#A08585]'}`}
                        >
                          TIDAK HADIR
                        </button>
                      </div>
                    </motion.div>

                    <motion.button 
                      variants={scaleIn}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={isSubmittingRSVP}
                      className="w-full bg-gradient-to-r from-[#B18585] to-[#7A5C5C] text-white rounded-2xl py-5 font-bold tracking-[0.3em] text-xs shadow-lg hover:shadow-xl transition disabled:opacity-50 mt-4"
                    >
                      {isSubmittingRSVP ? 'MENGIRIM...' : 'KIRIM KONFIRMASI'}
                    </motion.button>
                  </form>
                </motion.div>
              </div>

              {/* WISHES */}
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-8"
              >
                <motion.h2 variants={fadeInDown} className={`${sacramento.className} text-4xl text-[#B18585] mb-2`}>Ucapan & Doa</motion.h2>
                <motion.p variants={fadeInUp} className="text-[10px] uppercase tracking-widest text-[#A08585]">Berikan Ucapan Untuk Mempelai</motion.p>
              </motion.div>

              <motion.div 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="max-w-[600px] mx-auto bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white shadow-lg mb-8 relative z-10"
              >
                <form onSubmit={handleSubmitWish} className="space-y-4">
                  <motion.input variants={fadeInUp} value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Anda" className="inv-input" required />
                  <motion.textarea variants={fadeInUp} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Tulis ucapan & doa..." rows={4} className="inv-input resize-none" required />
                  <motion.button variants={scaleIn} type="submit" disabled={isSubmittingWish} className="btn-inv w-full justify-center py-4">
                    {isSubmittingWish ? 'Mengirim...' : <><Send size={16} /> Kirim Ucapan</>}
                  </motion.button>
                </form>

                <div className="h-[1px] bg-[#B18585]/10 my-8" />

                <motion.div variants={staggerContainer} className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar p-2">
                  {localWishes.map((wish, idx) => (
                    <motion.div variants={fadeInUp} key={idx} className="text-left border-b border-[#B18585]/5 pb-4 last:border-0">
                      <p className="font-bold text-sm text-[#B18585]">{wish.name}</p>
                      <p className="text-[9px] text-[#A08585] mb-2">{wish.time}</p>
                      <p className="text-sm italic text-[#7A5C5C]">"{wish.message}"</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </section>
 

            
            {/* FOOTER */}
            <footer className="section-padding bg-white/50 text-center relative overflow-hidden pb-32">
               <div className="relative z-10">
                 <h2 className={`${sacramento.className} text-5xl mb-4 text-[#B18585]`}>{data.brideShort} & {data.groomShort}</h2>
                 <p className={`${cormorant.className} text-lg italic mb-12 text-[#7A5C5C]`}>Sampai jumpa di hari bahagia kami</p>
                 
                  <div className="pt-8 border-t border-[#B18585]/20">
                     <p className="text-[10px] uppercase tracking-[0.3em] mb-6 font-bold text-[#B18585]/30">Digital Invitation by</p>
                     <a href="https://garasicetak.com" target="_blank" className="flex items-center justify-center gap-3 group opacity-70 hover:opacity-100 transition-all">
                        <img src="/images/logo.png" alt="logo" className="h-12 w-auto grayscale group-hover:grayscale-0 transition-all" />
                        <div className="text-left">
                          <span className="text-xl font-bold block text-[#B18585]">Garasi Cetak</span>
                          <span className="text-[8px] italic opacity-50 block tracking-widest text-[#B18585]">www.garasicetak.com</span>
                        </div>
                     </a>
                  </div>
               </div>

            </footer>
            </div>

          </motion.main>
        )}
      </div>
    </div>
  );
}
