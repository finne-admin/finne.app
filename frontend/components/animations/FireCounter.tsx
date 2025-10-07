"use client";

import { useRive } from "@rive-app/react-canvas";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value: number;
  src?: string;          // ruta al .riv en /public
  stateMachine?: string; // nombre exacto de tu state machine
  size?: number;         // px
  color?: string;        // color del número
  offsetY?: number;      // ajuste vertical
  offsetX?: number;      // ajuste horizontal
  show?: boolean;        // controlar si se muestra o no
};

export default function FireCounter({
  value,
  src = "/streak-normal.riv",
  stateMachine = "State Machine 1",
  size = 240,
  color = "rgba(70, 185, 145, 0.95)",
  offsetY = 0.09,
  offsetX = 0.15,
  show = true,
}: Props) {
  const { RiveComponent } = useRive({
    src,
    autoplay: true,
    stateMachines: stateMachine,
  });

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
      <AnimatePresence>
        {show && (
          <motion.div
            key={value} // fuerza animación si cambia el número
            aria-label={`contador ${value}`}
            initial={{ opacity: 0, scale: 0.6, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: `${offsetY * 100}%`,
              right: `${offsetX * 100}%`,
              fontSize: Math.round(size * 0.35),
              fontWeight: 900,
              lineHeight: 1,
                color: "#8BC5B5", // más contraste
                textShadow: "0 3px 12px rgba(0,0,0,0.45)", // más definido
              pointerEvents: "none",
            }}
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
