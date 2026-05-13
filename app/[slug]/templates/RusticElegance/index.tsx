'use client';

import React, { Suspense } from 'react';
import './style.css';
import { Playfair_Display, Great_Vibes, Montserrat } from 'next/font/google';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

interface TemplateProps {
    data: InvitationData;
}

function InvitationContent({ data }: TemplateProps) {
  const {
    isOpen,
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
    fixImageUrl,
    isYouTube,
    getYoutubeId,
    story
  } = useInvitation(data);

  return (
    <div className={`rustic-outer-container ${montserrat.className}`}>
      <div className="rustic-mobile-frame relative overflow-hidden bg-[#4B3621] text-white">
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
            <source src={data.musicUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"} type="audio/mpeg" />
          </audio>
        )}

        <AnimatePresence>
            {!isOpen ? (
                <motion.section 
                    key="cover"
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/60"
                >
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img src="/images/modern-floral-red/BG 7.png" className="w-full h-full object-cover" alt="bg" />
                    </div>
                    
                    <div className="relative z-10 text-center">
                        <p className={`text-inv-gold uppercase tracking-[0.4em] text-[10px] mb-8 ${playfair.className}`}>The Wedding of</p>
                        <h1 className={`text-7xl mb-4 ${greatVibes.className} text-[#D4AF37]`}>{data.brideShort} & {data.groomShort}</h1>
                        <div className="h-px w-24 bg-[#D4AF37] mx-auto mb-10" />
                        
                        <p className="text-sm mb-2 opacity-60 italic">Kepada Bapak/Ibu/Saudara/i:</p>
                        <h3 className={`text-2xl mb-12 ${playfair.className} font-bold`}>{guestName}</h3>
                        
                        <button onClick={handleOpen} className="rustic-btn-primary uppercase tracking-widest text-xs">
                            Buka Undangan
                        </button>
                    </div>
                </motion.section>
            ) : null}
        </AnimatePresence>

        {isOpen && (
            <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-32">
                {/* HERO SECTION */}
                <section className="relative h-[80vh] flex flex-col items-center justify-center text-center p-8">
                    <div className="absolute inset-0 z-0 opacity-40">
                        <img src={fixImageUrl(data.brideImage) || "/images/modern-floral-red/gallery-1.png"} className="w-full h-full object-cover" alt="hero" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#4B3621]" />
                    </div>
                    <div className="relative z-10 mt-auto">
                        <p className="text-inv-gold uppercase tracking-[0.4em] text-[10px] mb-2 font-bold">Kami Menantikan Kehadiran Anda</p>
                        <h1 className={`text-6xl mb-4 ${greatVibes.className} text-[#D4AF37]`}>{data.brideShort} & {data.groomShort}</h1>
                        <p className="text-lg font-bold">12.12.2026</p>
                    </div>
                </section>

                {/* MEMPELAI SECTION */}
                <section className="p-8 space-y-12 text-center bg-[#4B3621]">
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#D4AF37] overflow-hidden mb-6">
                            <img src={fixImageUrl(data.brideImage) || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="bride" />
                        </div>
                        <h2 className={`text-4xl text-[#D4AF37] mb-2 ${greatVibes.className}`}>{data.brideName}</h2>
                        <p className="text-sm opacity-60 mb-1">Putri dari :</p>
                        <p className="font-bold">{data.brideParents}</p>
                    </motion.div>

                    <div className={`text-4xl text-[#D4AF37] ${greatVibes.className}`}>&</div>

                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#D4AF37] overflow-hidden mb-6">
                            <img src={fixImageUrl(data.groomImage) || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop"} className="w-full h-full object-cover" alt="groom" />
                        </div>
                        <h2 className={`text-4xl text-[#D4AF37] mb-2 ${greatVibes.className}`}>{data.groomName}</h2>
                        <p className="text-sm opacity-60 mb-1">Putra dari :</p>
                        <p className="font-bold">{data.groomParents}</p>
                    </motion.div>
                </section>

                {/* EVENT SECTION */}
                <section className="p-8 bg-[#3d2b1a]">
                    <h2 className={`text-3xl text-center text-[#D4AF37] mb-12 ${playfair.className} font-bold`}>Acara Pernikahan</h2>
                    
                    <div className="grid grid-cols-4 gap-2 mb-12">
                        {[
                            { val: timeLeft.days, unit: 'Hari' },
                            { val: timeLeft.hours, unit: 'Jam' },
                            { val: timeLeft.minutes, unit: 'Menit' },
                            { val: timeLeft.seconds, unit: 'Detik' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 p-2 rounded-lg text-center border border-gray-200">
                                <p className="text-xl font-bold">{item.val}</p>
                                <p className="text-[8px] uppercase">{item.unit}</p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white/5 p-6 rounded-2xl border border-gray-200 text-center">
                            <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Akad Nikah</h3>
                            <p className="text-sm mb-4">{data.akadPlace}</p>
                            <p className="text-xs opacity-60">{data.akadAddress}</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-gray-200 text-center">
                            <h3 className="text-xl font-bold text-[#D4AF37] mb-4">Resepsi</h3>
                            <p className="text-sm mb-4">{data.resepsiPlace}</p>
                            <p className="text-xs opacity-60">{data.resepsiAddress}</p>
                        </div>
                    </div>
                </section>

                {/* STORY SECTION */}
                {story && story.length > 0 && (
                    <section className="p-8 bg-[#4B3621]">
                        <h2 className={`text-3xl text-center text-[#D4AF37] mb-12 ${playfair.className} font-bold`}>Cerita Kami</h2>
                        <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-[#D4AF37]/30">
                            {story.map((item: any, i: number) => (
                                <motion.div key={i} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="relative pl-12">
                                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#4B3621] border-2 border-[#D4AF37] flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                    </div>
                                    <div className="space-y-4">
                                        {item.image && (
                                            <div className="relative w-32 aspect-square overflow-hidden border bg-white border-gray-200 shadow-lg mb-4">
                                                <img src={fixImageUrl(item.image)} className="absolute inset-0 w-full h-full object-cover" alt={item.title} />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest mb-1">{item.date}</p>
                                            <h3 className={`text-xl mb-2 ${playfair.className} font-bold text-white`}>{item.title}</h3>
                                            <p className="text-sm opacity-80 leading-relaxed italic">{item.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* GALLERY SECTION */}
                {data.gallery && data.gallery.length > 0 && (
                    <section id="gallery" className="p-8 bg-[#3d2b1a]">
                        <h2 className={`text-3xl text-center text-[#D4AF37] mb-12 ${playfair.className} font-bold`}>Galeri Bahagia</h2>
                        <InvitationGallery 
                            images={data.gallery && data.gallery.length > 0 ? data.gallery : [
                                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=600&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1522673607200-164883eeca48?q=80&w=600&auto=format&fit=crop",
                                "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=600&auto=format&fit=crop"
                            ]} 
                            fixImageUrl={fixImageUrl} 
                        />
                    </section>
                )}

                {/* RSVP SECTION */}
                <section id="rsvp" className="p-8 bg-[#3d2b1a] relative overflow-hidden">
                    <div className="relative z-10">
                        <InvitationRSVP 
                            rsvpName={rsvpName} setRsvpName={setRsvpName}
                            rsvpTotal={rsvpTotal} setRsvpTotal={setRsvpTotal}
                            rsvpStatus={rsvpStatus} setRsvpStatus={setRsvpStatus}
                            isSubmittingRSVP={isSubmittingRSVP} handleRSVP={handleRSVP}
                            theme="rustic"
                            titleFont={playfair.className}
                        />
                    </div>
                </section>

                {/* KADO SECTION */}
                <section id="gift" className="relative pt-12 pb-24 overflow-hidden bg-[#4B3621]">
                    <div className="relative z-20 px-6">
                        <h2 className={`text-4xl mb-4 text-[#D4AF37] ${playfair.className} font-bold text-center`}>Kado Digital</h2>
                        <InvitationGift gifts={data.gifts} handleCopy={handleCopy} copiedBank={copiedBank} theme="rustic" />
                    </div>
                </section>

                {/* WISHES SECTION */}
                <section className="p-8 bg-[#4B3621]">
                    <h2 className={`text-3xl text-center text-[#D4AF37] mb-8 ${playfair.className} font-bold`}>Ucapan & Doa</h2>
                    <InvitationWishes 
                        newName={newName} setNewName={setNewName}
                        newMessage={newMessage} setNewMessage={setNewMessage}
                        isSubmittingWish={isSubmittingWish} handleSubmitWish={handleSubmitWish}
                        localWishes={localWishes}
                        theme="rustic"
                        titleFont={playfair.className}
                    />
                </section>

                {/* WATERMARK FOOTER */}
                <footer className="p-12 text-center bg-[#3d2b1a]">
                    <h2 className={`text-4xl text-[#D4AF37] mb-12 ${greatVibes.className}`}>{data.brideShort} & {data.groomShort}</h2>
                    <div className="pt-8 border-t border-white/5">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Digital Invitation by</p>
                        <a href="https://garasicetak.com" target="_blank" className="inline-flex items-center gap-3 group">
                            <img src="/images/logo.png" alt="logo" className="w-14 h-14 object-contain transition-opacity" />
                            <div className="flex flex-col items-start">
                                <span className="text-2xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-400 transition-all duration-500 font-serif text-left">
                                    Garasi Cetak
                                </span>
                                <span className="text-[7px] text-white/15 italic tracking-widest text-left">www.garasicetak.com</span>
                            </div>
                        </a>
                    </div>
                </footer>

                {/* AUDIO TOGGLE */}
                <InvitationAudioToggle isMuted={isMuted} toggleMute={toggleMute} theme="rustic" />

                {/* NAVIGATION BOTTOM */}
                <InvitationBottomNav isOpen={isOpen} theme="rustic" bgColor="bg-[#2c2a26]/95" textColor="text-white/50" activeColor="text-[#D4AF37]" className="border-[#D4AF37]/20" />

            </motion.main>
        )}
      </div>
    </div>
  );
}

export default function RusticElegance(props: TemplateProps) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <InvitationContent {...props} />
        </Suspense>
    );
}
