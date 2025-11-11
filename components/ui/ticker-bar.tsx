"use client";

import React from "react";

type TickerBarProps = {
  message?: string;
  speedSeconds?: number; // tiempo de un ciclo completo
  gapPx?: number; // separación opcional entre repeticiones
};

export default function TickerBar({
  message = process.env.NEXT_PUBLIC_TICKER_MESSAGE ||
    "La temporada piloto finaliza en menos de un día. El jueves se entregarán los premios. Realiza la reinscripción en la app según las instrucciones del administrador o del correo",
  speedSeconds = 20,
  gapPx = 0,
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
          style={{ animationDuration: `${speedSeconds}s`, gap: `${gapPx}px` }}
        >
          <span className="whitespace-nowrap text-sm font-medium tracking-wide shrink-0">
            {message}
          </span>
          <span className="whitespace-nowrap text-sm font-medium tracking-wide shrink-0" aria-hidden>
            {message}
          </span>
        </div>
      </div>
    </div>
  );
}
