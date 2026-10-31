"use client";

import React from "react";
import { MessageSquareText } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/utils";

interface WhatsAppFloatingButtonProps {
  whatsapp?: string;
  companyName?: string;
}

export function WhatsAppFloatingButton({
  whatsapp = "6281234567890",
  companyName = "PT MITRA KARYA PRATAMA",
}: WhatsAppFloatingButtonProps) {
  const defaultMessage = `Halo ${companyName}, saya ingin berkonsultasi mengenai pengadaan barang / kebutuhan jasa perusahaan kami.`;
  const href = getWhatsAppUrl(whatsapp, defaultMessage);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center p-3.5 bg-emerald-600 text-white rounded-full shadow-2xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-label="Hubungi kami via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
        <MessageSquareText className="w-6 h-6" />

        {/* Tooltip on hover */}
        <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-corporate-navy px-3 py-1.5 text-xs font-medium text-white shadow-corporate opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200">
          Chat WhatsApp Pengadaan
        </span>
      </a>
    </div>
  );
}
