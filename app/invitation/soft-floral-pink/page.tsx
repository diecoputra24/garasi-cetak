'use client';

import React, { Suspense } from 'react';
import SoftFloralPinkTemplate from '@/app/[slug]/templates/SoftFloralPink';

const SAMPLE_DATA = {
  id: "preview",
  brideName: "Siti Nurhaliza",
  brideShort: "Siti",
  brideInstagram: "siti_nurhaliza",
  brideImage: "https://images.unsplash.com/photo-1549333321-12f8d5677f3e?q=80&w=400&h=400&auto=format&fit=crop",
  groomName: "Ahmad Subagja",
  groomShort: "Ahmad",
  groomInstagram: "ahmad_subagja",
  groomImage: "https://images.unsplash.com/photo-1549333321-12f8d5677f3e?q=80&w=400&h=400&auto=format&fit=crop",
  brideParents: "Putri bungsu dari Bapak H. Samsul & Ibu Hj. Aminah",
  groomParents: "Putra pertama dari Bapak Iwan & Ibu Lilis",
  akadDate: new Date('2026-10-10'),
  akadTime: "08:00 - 10:00",
  akadPlace: "Masjid Agung Al-Barkah",
  akadAddress: "Jl. Veteran No. 1, Bekasi Selatan",
  akadMaps: "https://maps.google.com",
  resepsiDate: new Date('2026-10-10'),
  resepsiTime: "11:00 - Selesai",
  resepsiPlace: "Ballroom Hotel Santika",
  resepsiAddress: "Jl. A. Yani No. 12, Bekasi",
  resepsiMaps: "https://maps.google.com",
  gallery: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800"
  ],
  gifts: [
    { bankName: "BCA", accountNo: "1234567890", accountHolder: "Siti Nurhaliza" },
    { bankName: "DANA", accountNo: "081234567890", accountHolder: "Ahmad Subagja" }
  ],
  wishes: [
    { name: "Andi & Keluarga", message: "Selamat menempuh hidup baru ya Siti & Ahmad!", time: "2 jam yang lalu" },
    { name: "Budi Santoso", message: "Semoga Sakinah Mawaddah Warahmah. Amin.", time: "5 jam yang lalu" }
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  story: "[]"
};

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#FDEEF4]">Loading Preview...</div>}>
      <SoftFloralPinkTemplate data={SAMPLE_DATA as any} />
    </Suspense>
  );
}
