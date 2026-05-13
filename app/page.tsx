'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './landing.css';
import { 
    Share2, Users, Music, UserCheck, Camera, 
    Calendar, MapPin, Timer, Image as ImageIcon, Heart, 
    MessageSquare, Gift, Video, QrCode, Infinity,
    Layout, FileEdit, ClipboardCheck, Send, LogIn, User
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function Home() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filter, setFilter] = useState('semua');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();

    const features = [
        { icon: <Share2 size={24} />, title: 'Unlimited Share' },
        { icon: <Users size={24} />, title: 'Unlimited Nama Tamu' },
        { icon: <Music size={24} />, title: 'Backsound Music' },
        { icon: <UserCheck size={24} />, title: 'Detail Mempelai' },
        { icon: <Camera size={24} />, title: 'Instagram Mempelai' },
        { icon: <Calendar size={24} />, title: 'Detail Acara' },
        { icon: <MapPin size={24} />, title: 'Google Maps' },
        { icon: <Timer size={24} />, title: 'Countdown Timer' },
        { icon: <ImageIcon size={24} />, title: 'Galeri Foto & Video' },
        { icon: <Heart size={24} />, title: 'Love Story' },
        { icon: <MessageSquare size={24} />, title: 'Ucapan & RSVP' },
        { icon: <Gift size={24} />, title: 'Amplop Digital' },
        { icon: <Video size={24} />, title: 'Live Streaming' },
        { icon: <QrCode size={24} />, title: 'QR Code Tamu' },
        { icon: <Infinity size={24} />, title: 'Masa Aktif Selamanya' },
    ];

    const templates = [
        { id: 1, title: 'Soft Floral Pink', cat: 'pernikahan', img: '/images/Pink Floral/PINK.jpg.jpeg', path: '/invitation/soft-floral-pink' },
        { id: 2, title: 'Blue Modern Floral', cat: 'pernikahan', img: '/images/biru-modern-floral/full.jpeg', path: '/invitation/blue-modern-floral' },
        { id: 3, title: 'Modern Floral Red', cat: 'pernikahan', img: '/images/modern-floral-red/FULL COVER.jpg', path: '/invitation/modern-floral-red' },
        { id: 8, title: 'Biru Muda Floral', cat: 'pernikahan', img: '/images/biru-muda-floral/BIRU F.jpg.jpeg', path: '/invitation/biru-muda-floral' },
        { id: 4, title: 'Ceria Kids Birthday', cat: 'ulang-tahun', img: '/images/mockup.png', path: '#' },
        { id: 5, title: 'Elegant Khitanan', cat: 'khitanan', img: '/images/ornament.png', path: '#' },
        { id: 6, title: 'Playful Party', cat: 'ulang-tahun', img: '/images/hero.png', path: '#' },
        { id: 7, title: 'Aqiqah Modern Blue', cat: 'aqiqah', img: '/images/ornament.png', path: '#' },
    ];

    useEffect(() => {
        // Scroll Reveal logic
        const reveal = () => {
            const reveals = document.querySelectorAll('.reveal');
            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 80;
                if (elementTop < windowHeight - elementVisible) {
                    el.classList.add('active');
                }
            });
        };

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
            reveal();
        };

        window.addEventListener('scroll', handleScroll);
        setTimeout(handleScroll, 100);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-page-root">
            {/* Header */}
            <header id="header" className={isScrolled ? 'scrolled' : ''}>
                <div className="container nav-bar">
                    <Link href="/" className="logo">
                        <img src="/images/logo.png" alt="Garasi Cetak" />
                        <span>GarasiCetak</span>
                    </Link>
                    
                    <nav id="nav-menu" className={isMenuOpen ? 'active' : ''}>
                        <a href="#katalog" onClick={() => setIsMenuOpen(false)}>Katalog</a>
                        <a href="#fitur" onClick={() => setIsMenuOpen(false)}>Fitur</a>
                        <a href="#cara-order" onClick={() => setIsMenuOpen(false)}>Cara Order</a>
                        <a href="#faq" onClick={() => setIsMenuOpen(false)}>FAQ</a>
                    </nav>

                    <div className="nav-actions">
                        {!isPending && (
                            session ? (
                                <Link href="/dashboard" className="btn btn-primary btn-sm flex items-center gap-2">
                                    <User size={14} /> Dashboard
                                </Link>
                            ) : (
                                <Link href="/login" className="btn btn-outline btn-sm flex items-center gap-2">
                                    <LogIn size={14} /> Login
                                </Link>
                            )
                        )}
                        <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section id="hero" className="hero">
                <div className="container hero-inner">
                    <div className="hero-content reveal">
                        <div className="badge">Undangan Digital</div>
                        <h1>Dari Hati, Sampai ke Layar Tamu Anda</h1>
                        <p>Buat undangan digital yang indah untuk acara spesial Anda. Desain impian dengan sentuhan cerita klasik yang elegan dan menawan.</p>
                        <div className="hero-actions">
                            <a href="#katalog" className="btn btn-primary btn-lg">Lihat Semua Katalog</a>
                            <a href="https://wa.me/6282317937260" target="_blank" className="btn btn-outline btn-lg">Coba Sekarang</a>
                        </div>
                    </div>
                    <div className="hero-mockup reveal">
                        <img src="/images/mockup.png" alt="Preview Undangan Digital" />
                    </div>
                </div>
            </section>

            {/* Fitur Section */}
            <section id="fitur" className="section-padding">
                <div className="container">
                    <div className="section-head reveal">
                        <h2>Semua Fitur yang Kamu Dapat</h2>
                        <p>Setiap undangan sudah termasuk fitur-fitur berikut tanpa biaya tambahan</p>
                    </div>
                    <div className="fitur-grid reveal">
                        {features.map((f, i) => (
                            <div className="fitur-item" key={i}>
                                <div className="fitur-icon">{f.icon}</div>
                                <h4>{f.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Katalog / Templates */}
            <section id="katalog" className="section-padding">
                <div className="container">
                    <div className="section-head reveal">
                        <h2>Katalog Undangan</h2>
                        <p>Pilih desain terbaik untuk momen berharga Anda.</p>
                    </div>

                    <div className="katalog-tabs reveal">
                        {['semua', 'pernikahan', 'khitanan', 'ulang-tahun', 'aqiqah'].map((tab) => (
                            <button 
                                key={tab}
                                className={`tab-btn ${filter === tab ? 'active' : ''}`}
                                onClick={() => setFilter(tab)}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    
                    <div className="katalog-grid reveal">
                        {templates.filter(t => filter === 'semua' || t.cat === filter).map((template) => (
                            <div className="tema-card" key={template.id}>
                                <div className="tema-img">
                                    <img src={template.img} alt={template.title} />
                                </div>
                                <div className="tema-info">
                                    <h4>{template.title}</h4>
                                    <p className="tema-cat">{template.cat.charAt(0).toUpperCase() + template.cat.slice(1).replace('-', ' ')}</p>
                                    <div className="tema-actions">
                                        {template.path === '#' ? (
                                            <button onClick={() => setShowModal(true)} className="btn btn-outline btn-sm">Lihat Demo</button>
                                        ) : (
                                            <Link href={template.path} target="_blank" className="btn btn-outline btn-sm">Lihat Demo</Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cara Order / Steps */}
            <section id="cara-order" className="section-padding">
                <div className="container">
                    <div className="section-head reveal">
                        <h2>Cara Pemesanan</h2>
                        <p>Mudahkan langkah Anda menuju hari yang sempurna</p>
                    </div>
                    <div className="order-steps reveal">
                        <div className="step">
                            <div className="step-icon">
                                <Layout size={28} />
                                <div className="step-num-badge">1</div>
                            </div>
                            <h4>Pilih Desain</h4>
                            <p>Pilih desain cantik yang sesuai dengan tema acara Anda.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">
                                <FileEdit size={28} />
                                <div className="step-num-badge">2</div>
                            </div>
                            <h4>Isi Detail Acara</h4>
                            <p>Tambahkan foto, tanggal, dan lokasi acara Anda.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">
                                <ClipboardCheck size={28} />
                                <div className="step-num-badge">3</div>
                            </div>
                            <h4>Review & Finalisasi</h4>
                            <p>Periksa pratinjau dan finalisasi detail undangan Anda.</p>
                        </div>
                        <div className="step">
                            <div className="step-icon">
                                <Send size={28} />
                                <div className="step-num-badge">4</div>
                            </div>
                            <h4>Sebarkan</h4>
                            <p>Kirimkan link unik undangan langsung ke tamu-tamu Anda.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding">
                <div className="container">
                    <div className="section-head reveal">
                        <h2>Kata Mereka Tentang Kami</h2>
                        <p>... dan masih banyak pasangan bahagia lainnya!</p>
                    </div>
                    <div className="testi-grid reveal">
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <p>"Desainnya sangat elegan dan sangat cocok dengan tema pernikahan kami. Tamu-tamu kami sangat menyukainya!"</p>
                            <div className="testi-author">
                                <strong>Riya & Sujeet</strong>
                                <span>Pasangan Bahagia ❤️</span>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <p>"Sangat terjangkau dan indah. Mengelola RSVP dan membagikan lokasi jadi jauh lebih mudah."</p>
                            <div className="testi-author">
                                <strong>Vishal & Komal</strong>
                                <span>Pasangan Bahagia</span>
                            </div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <p>"Dukungan pelanggan yang hebat dan template yang luar biasa. Sangat menghemat waktu dan tenaga kami!"</p>
                            <div className="testi-author">
                                <strong>Arfath & Zaneera</strong>
                                <span>Pasangan Bahagia</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer>
                <div className="container footer-inner">
                    <div className="footer-brand">
                        <div className="logo">GarasiCetak</div>
                        <p>Tetap terhubung! Buat undangan digital yang indah untuk acara spesial Anda.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Bantuan</h4>
                        <a href="#faq">FAQ</a>
                        <a href="#contact">Hubungi Kami</a>
                    </div>
                    <div className="footer-links">
                        <h4>Lainnya</h4>
                        <a href="#">Kebijakan Privasi</a>
                        <a href="#">Syarat & Ketentuan</a>
                        <a href="#">Kebijakan Pengembalian</a>
                        <a href="#">Pengiriman</a>
                    </div>
                </div>
                <div className="container footer-bottom">
                    <p>&copy; 2026 Garasi Cetak.</p>
                </div>
            </footer>
            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                    <div className="bg-white rounded-2xl p-6 shadow-2xl relative text-center flex flex-col items-center" style={{ backgroundColor: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '320px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-blue-500" style={{ width: '48px', height: '48px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: '#3b82f6' }}>
                            <Layout size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '8px', lineHeight: 1.2 }}>Desain Sedang Disempurnakan</h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed" style={{ color: '#4b5563', marginBottom: '24px', lineHeight: 1.5, fontSize: '0.875rem' }}>
                            Terima kasih atas ketertarikan Anda. Saat ini template ini sedang dalam tahap perancangan akhir oleh desainer kami. Silakan jelajahi pilihan desain kami yang lain.
                        </p>
                        <button 
                            onClick={() => setShowModal(false)}
                            className="btn btn-primary w-full py-2.5 rounded-lg text-sm"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            Tutup & Lihat Desain Lain
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
