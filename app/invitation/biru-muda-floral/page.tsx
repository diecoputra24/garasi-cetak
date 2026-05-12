'use client';

import React, { Suspense } from 'react';
import BiruMudaFloralTemplate from '@/app/[slug]/templates/BiruMudaFloral';

const SAMPLE_DATA = {
  id: "preview",
  brideName: "Raiza Pitaloka",
  brideShort: "Raiza",
  brideInstagram: "raiza_pitaloka",
  brideImage: "/images/biru-muda-floral/Biru muda.png",
  groomName: "Marco Marcopolo",
  groomShort: "Marco",
  groomInstagram: "marco_marcopolo",
  groomImage: "/images/biru-muda-floral/Biru muda.png",
  brideParents: "Putri pertama dari Bapak Nano & Ibu Musrinah",
  groomParents: "Putra pertama dari Bapak Kasmin & Ibu Runtah",
  akadDate: new Date('2026-05-24'),
  akadTime: "10:00",
  akadPlace: "Kediaman Mempelai Wanita",
  akadAddress: "Jl. Gedung KUA Maleber Kabupaten Kuningan",
  akadMaps: "https://maps.google.com",
  resepsiDate: new Date('2026-05-24'),
  resepsiTime: "11:00",
  resepsiPlace: "Kediaman Mempelai Wanita",
  resepsiAddress: "Jl. Gedung KUA Maleber Kabupaten Kuningan",
  resepsiMaps: "https://maps.google.com",
  gallery: [
    "/images/biru-muda-floral/Biru muda.png",
    "/images/biru-muda-floral/Biru muda.png",
    "/images/biru-muda-floral/Biru muda.png",
    "/images/biru-muda-floral/Biru muda.png"
  ],
  gifts: [
    { bankName: "BCA", accountNo: "123456789", accountHolder: "Raiza Pitaloka" },
    { bankName: "MANDIRI", accountNo: "987654321", accountHolder: "Marco Marcopolo" }
  ],
  wishes: [
    { name: "Admin", message: "Selamat menempuh hidup baru!", time: "Baru saja" }
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  story: "[]"
};

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Preview...</div>}>
      <BiruMudaFloralTemplate data={SAMPLE_DATA as any} />
    </Suspense>
  );
}
