"use client";

import React from "react";

type TickerBarProps = {
  message?: string;
  speedSeconds?: number; // tiempo de un ciclo completo
};

export default function TickerBar({
  message = process.env.NEXT_PUBLIC_TICKER_MESSAGE ||
    "Aviso: recuerda completar tus retos semanales y revisar las notificaciones.",
  speedSeconds = 20,
}: TickerBarProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 h-10 bg-gradient-to-r from-[#8BC5B5] to-[#5B9B8B] text-white border-t border-white/20"
      role="region"
      aria-label="Avisos en curso"
    >
      <div className="h-full marquee">
        <div
          className="marquee-track"
          style={{ animationDuration: `${speedSeconds}s` }}
        >
          <span className="px-6 whitespace-nowrap text-sm font-medium tracking-wide">
            {message}
          </span>
          <span className="px-6 whitespace-nowrap text-sm font-medium tracking-wide" aria-hidden>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}

