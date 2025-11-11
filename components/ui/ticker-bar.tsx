"use client";

import React from "react";

type TickerBarProps = {
  message?: string;
  speedSeconds?: number; // tiempo de un ciclo completo
  gapPx?: number; // separación opcional entre repeticiones
};

export default function TickerBar({
  message = process.env.NEXT_PUBLIC_TICKER_MESSAGE ||
    "La temporada piloto finaliza en menos de un día. El jueves se entregarán los premios. Vuelve a registrarte según las instrucciones del administrador o del correo  // ",
  speedSeconds = 20,
  gapPx = 0,
}: TickerBarProps) {
  return (
    <div
      className="fixed left-0 right-0 top-1/2 -translate-y-1/2 z-40 h-14 bg-gradient-to-r from-[#8BC5B5]/80 to-[#5B9B8B]/80 backdrop-blur-sm text-white border-y border-white/20 shadow-md"
      role="region"
      aria-label="Avisos en curso"
    >
      <div className="h-full marquee">
        <div
          className="marquee-track"
          style={{ animationDuration: `${speedSeconds}s`, gap: `${gapPx}px` }}
        >
          <span className="whitespace-nowrap text-base sm:text-lg font-medium tracking-wide shrink-0">
            {message}
          </span>
          <span className="whitespace-nowrap text-base sm:text-lg font-medium tracking-wide shrink-0" aria-hidden>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
