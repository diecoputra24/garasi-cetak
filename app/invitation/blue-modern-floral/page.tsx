'use client';

import React, { Suspense } from 'react';
import BlueModernFloralTemplate from "../../[slug]/templates/BlueModernFloral";

const sampleData = {
    id: "sample",
    brideName: "Siti Fatimah, S.Kom",
    brideShort: "Siti",
    brideInstagram: "siti_fatimah",
    brideImage: "",
    groomName: "Ahmad Subagja, B.A",
    groomShort: "Ahmad",
    groomInstagram: "ahmad_subagja",
    groomImage: "",
    brideParents: "Putri dari Bapak H. Ahmad Subardjo & Ibu Hj. Aminah",
    groomParents: "Putra dari Bapak H. Yusuf Mansur & Ibu Hj. Khadijah",
    akadDate: new Date('2026-12-12'),
    akadTime: "08:00 - 10:00 WIB",
    akadPlace: "Masjid Agung Al-Azhar",
    akadAddress: "Kebayoran Baru, Jakarta Selatan",
    akadMaps: "https://maps.app.goo.gl/3q2Nn",
    resepsiDate: new Date('2026-12-12'),
    resepsiTime: "11:00 - 14:00 WIB",
    resepsiPlace: "Ballroom Hotel Kemang",
    resepsiAddress: "Mampang Prapatan, Jakarta Selatan",
    resepsiMaps: "https://maps.app.goo.gl/3q2Nn",
    gallery: [
        "/images/biru-modern-floral/7.png",
        "/images/biru-modern-floral/6.png",
        "/images/biru-modern-floral/2.png",
        "/images/biru-modern-floral/3.png",
        "/images/biru-modern-floral/1.png",
        "/images/biru-modern-floral/4.png"
    ],
    gifts: [
        { bankName: "BCA", accountNo: "123456789", accountHolder: "Ahmad Subagja" },
        { bankName: "Dana", accountNo: "08123456789", accountHolder: "Siti Fatimah" }
    ],
    wishes: [
        { name: "Budi Santoso", message: "Selamat menempuh hidup baru Ahmad & Siti! Semoga samawa selalu.", time: "2 jam yang lalu" },
        { name: "Sari Indah", message: "MasyaAllah cantik sekali Siti. Selamat ya kalian berdua!", time: "5 jam yang lalu" },
        { name: "Deni", message: "Lancar sampai hari H bro Ahmad!", time: "1 hari yang lalu" }
    ],
    story: [
        { title: "Pertemuan Pertama", content: "Kami bertemu secara tidak sengaja di sebuah perpustakaan kota pada tahun 2020. Pandangan pertama yang sederhana namun membekas di hati." },
        { title: "Mulai Pendekatan", content: "Setelah pertemuan itu, kami mulai sering berbagi cerita melalui pesan singkat dan menyadari banyak kecocokan dalam visi hidup kami." },
        { title: "Momen Lamaran", content: "Di hadapan keluarga besar, kami memutuskan untuk mengikat janji suci dan melangkah bersama menuju pernikahan yang penuh berkah." }
    ]
};

export default function BlueModernFloralDemo() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#003366] flex items-center justify-center text-[#D4AF37] text-3xl font-bold italic">Menyiapkan demo kebahagiaan...</div>}>
            <BlueModernFloralTemplate data={sampleData as any} />
        </Suspense>
    );
}
