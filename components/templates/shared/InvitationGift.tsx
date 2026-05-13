'use client';

import React from 'react';

interface GiftProps {
  gifts: any[];
  handleCopy: (text: string, bank: string) => void;
  copiedBank: string | null;
  theme?: 'modern' | 'rustic';
  flat?: boolean;
  customButtonClass?: string;
}

export const InvitationGift = ({ gifts, handleCopy, copiedBank, theme = 'modern', flat = false, customButtonClass }: GiftProps) => {
  const bankLogos: Record<string, string> = {
    "BRI": "/images/bank/bri.png",
    "MANDIRI": "/images/bank/mandiri.png",
    "BSI": "/images/bank/bsi.png",
    "BJB": "/images/bank/bjb.png",
    "BTN": "/images/bank/btn.png",
    "BCA": "/images/bank/bca.svg",
    "DANA": "/images/bank/dana.png",
    "SHOPEEPAY": "/images/bank/sopeepay.png",
    "GOPAY": "/images/bank/gopay.png",
    "OVO": "/images/bank/ovo.png"
  };

  return (
    <div className="space-y-6 w-full max-w-sm">
      {gifts.map((gift, idx) => {
        const bankKey = (gift.bankName || "").toUpperCase();
        const logo = bankLogos[bankKey];

        return (
          <div key={idx} className={`${flat ? 'bg-white/40 border-white/20' : 'bg-white/5 border-white/10'} backdrop-blur-md border rounded-2xl p-8 text-white relative overflow-hidden group hover:border-[#C9A84C]/50 transition-all shadow-sm`}>
            <div className="flex flex-col items-center mb-6">
              {logo ? (
                <div className="mb-4 h-12 w-full flex items-center justify-center">
                  <img src={logo} className="max-h-full object-contain" alt={gift.bankName} />
                </div>
              ) : (
                <h4 className="text-[#C9A84C] font-medium text-2xl mb-4 leading-none">
                  {gift.bankName === "Lainnya" ? gift.customBankName : gift.bankName}
                </h4>
              )}
              <div className="h-px w-12 bg-[#C9A84C]/30 mx-auto" />
            </div>

            <div className={`text-center space-y-1 mb-6 ${flat ? 'text-[#1e3a5f]' : 'text-white'}`}>
              <p className={`text-[10px] font-medium ${flat ? 'text-[#1e3a5f]/40' : 'text-white/40'}`}>Nomor Rekening</p>
              <p className="text-2xl font-medium">{gift.accountNo}</p>
            </div>

            <div className={`text-center space-y-1 mb-8 ${flat ? 'text-[#1e3a5f]' : 'text-white'}`}>
              <p className={`text-[10px] font-medium ${flat ? 'text-[#1e3a5f]/40' : 'text-white/40'}`}>Atas Nama</p>
              <p className="text-lg font-medium">{gift.accountHolder}</p>
            </div>

            <button
              onClick={() => handleCopy(gift.accountNo, gift.bankName)}
              className={customButtonClass ? `w-full ${customButtonClass}` : `w-full py-3 rounded-xl text-[10px] font-medium border transition-all flex items-center justify-center gap-2 ${flat ? 'bg-[#1e3a5f]/10 text-[#1e3a5f] border-[#1e3a5f]/10 hover:bg-[#1e3a5f]/20' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
            >
              {copiedBank === gift.bankName ? '✅ Tersalin' : '📋 Salin Rekening'}
            </button>
          </div>
        );
      })}
    </div>
  );
};
