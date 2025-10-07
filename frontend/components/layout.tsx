'use client';

import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { HelpCircle, Menu, PlayCircle, Loader2, Flame } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTutorialState } from '@/components/tutorial/useTutorial';
import { Tutorial } from '@/components/tutorial/Tutorial';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { useAdminMenuItems } from '@/components/hooks/useAdminMenuItems';
import { MobileNav } from '@/components/navigation/MobileNav';
import { Sidebar } from '@/components/navigation/Sidebar';
import FireCounter from '@/components/animations/FireCounter';
import { motion, AnimatePresence } from "framer-motion";


export function Layout({ children }: { children: React.ReactNode }) {
  const { menuItems } = useAdminMenuItems();
  const { isOpen, startTutorial, stopTutorial } = useTutorialState();

  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // --- Estado para racha (overlay con Rive) ---
  const [streakOpen, setStreakOpen] = useState(false);
  const [streakValue, setStreakValue] = useState<number>(0);
  const [checkingStreak, setCheckingStreak] = useState(false);
  const [streakLoading, setStreakLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ringScale, setRingScale] = useState(6); // fallback

  useEffect(() => {
    if (!streakOpen) return;
    const compute = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // escala mínima para que el anillo cubra el lado más largo del viewport (+20% margen)
      const scale =
        Math.max(vw / rect.width, vh / rect.height) * 1.2;
      setRingScale(scale);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [streakOpen]);


  const closeStreakCelebration = () => {
    console.log('[RIVE] closeStreakCelebration()');
    setStreakOpen(false);
    setStreakValue(0);
  };

    // Logs de ciclo de vida básicos
  useEffect(() => {
    console.log('[RIVE] Layout mounted. ENV:', process.env.NODE_ENV);
  }, []);

  useEffect(() => {
    console.log('[RIVE] streakOpen changed =>', streakOpen);
  }, [streakOpen]);

  useEffect(() => {
    console.log('[RIVE] streakValue changed =>', streakValue);
  }, [streakValue]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      if (!error && data?.avatar_url) setAvatarUrl(data.avatar_url);
    })();
  }, [supabase]);

  // Botón que dispara (o fuerza con ALT/SHIFT/⌘) la animación de racha
  const triggerStreak = useCallback(async () => {
    console.log('[RIVE] triggerStreak() → fetch streak from DB');
    setCheckingStreak(true);
    setStreakLoading(true);

    try {
      const { data, error } = await supabase.rpc('celebrate_streak', { p_org: null });

      if (error) {
        console.warn('[RIVE] RPC error:', error);
        return;
      }

      const streakFromDb = (data?.[0]?.streak as number) ?? 0;
      console.log('[RIVE] streakFromDb =', streakFromDb);

      setStreakValue(streakFromDb);
      setStreakOpen(true); // 👈 abre el overlay SOLO después de tener el valor real
    } catch (err) {
      console.error('[RIVE] triggerStreak() unexpected error:', err);
    } finally {
      setStreakLoading(false);
      setCheckingStreak(false);
    }
  }, [supabase]);




  const headerContent = useMemo(
    () => (
      <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
        <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0" />
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Botón: disparar animación de racha */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200"
            onClick={triggerStreak}
            title="Celebrar racha (ALT/SHIFT/⌘ para forzar)"
            aria-label="Celebrar racha"
          >
            {/* {checkingStreak ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Flame className="h-6 w-6 text-amber-600" />
            )} */}
          </Button>

          {/* Botón: tutorial */}
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200"
            onClick={() => startTutorial()}
            title="Iniciar Tutorial"
          >
            <PlayCircle className="h-6 w-6 text-green-600" />
          </Button>

          {/* Botón: ayuda */}
          <Link href="/help/notifications">
            <Button variant="ghost" size="icon" className="hover:bg-gray-200">
              <HelpCircle className="h-6 w-6 text-gray-600" aria-hidden="true" />
            </Button>
          </Link>

          {/* Avatar / ajustes */}
          <Link href="/settings">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={36}
                height={36}
                className="rounded-full border border-gray-300 hover:scale-105 transition"
                onError={() => setAvatarUrl('/default-avatar.png')}
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="Default avatar"
                width={36}
                height={36}
                className="rounded-full border border-gray-300 hover:scale-105 transition"
              />
            )}
          </Link>
        </div>
      </header>
    ),
    [startTutorial, avatarUrl, checkingStreak, triggerStreak]
  );

  if (!menuItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-2 top-2 z-50"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] border-none z-[9999]"
        >
          <MobileNav menuItems={menuItems} />
        </SheetContent>
      </Sheet>

      {/* Sidebar desktop */}
      <div className="hidden lg:flex w-64 bg-[#8BC5B5] text-white">
        <Sidebar menuItems={menuItems} />
      </div>

      {/* Main */}
      <div className="flex flex-col h-screen flex-1">
        {headerContent}
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        <Tutorial onClose={stopTutorial} run={isOpen} />
      </div>

      {/* Overlay de celebración con Rive */}
<AnimatePresence>
  {streakOpen && (
    // Backdrop
    <motion.div
      key="streak-backdrop"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={closeStreakCelebration}
    >
      {/* WRAPPER: mismo tamaño que la card, sin overflow, para emitir anillos hacia fuera */}
      <div ref={wrapperRef} className="relative">
        {/* 🔁 RINGS: empiezan del tamaño de la card y escalan hasta cubrir el viewport */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-emerald-400/45 -z-10"
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: ringScale, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-teal-400/40 -z-10"
          initial={{ scale: 1, opacity: 0.45 }}
          animate={{ scale: ringScale, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.35 }}
        />
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-cyan-400/35 -z-10"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: ringScale, opacity: 0 }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
        />

        {/* CARD: compacta, con entrada fuerte izquierda→centro y salida centro→derecha */}
        <motion.div
          key="streak-card"
          onClick={(e) => e.stopPropagation()}
          className="
            relative text-center shadow-2xl
            rounded-[24px] sm:rounded-[28px]
            px-5 py-4 sm:px-6 sm:py-5
            bg-white/85 dark:bg-neutral-900/80
            ring-1 ring-white/50 dark:ring-white/10
            backdrop-blur-md
          "
          initial={{ x: -120, opacity: 0, scale: 0.98 }}
          animate={{ x: 0,    opacity: 1, scale: 1 }}
          exit={{    x: 120,  opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Glow sutil */}
          <div className="pointer-events-none absolute -inset-1 rounded-[28px] bg-gradient-to-tr from-emerald-200/30 via-teal-200/20 to-cyan-200/20 blur-xl" />

          {/* Contenido compacto */}
          <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
            <div className="mx-auto">
              <FireCounter
                value={streakValue}
                src="/streak-normal.riv"
                stateMachine="State Machine 1"
                size={220}
                color="#46B991"
                offsetY={-0.02}
              />
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
              ¡Racha {streakValue} días!
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 -mt-1">
              ¡Sigue así, estás on fire!
            </p>

            <button
              onClick={closeStreakCelebration}
              className="
                mt-2 inline-flex items-center rounded-xl
                bg-emerald-500 px-4 py-2 text-white
                hover:bg-emerald-600 active:scale-[0.98] transition
                shadow-md
              "
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )}
</AnimatePresence>



    </div>
  );
}
