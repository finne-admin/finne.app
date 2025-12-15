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
  const menuItems = useAdminMenuItems();
  const { isOpen, startTutorial, stopTutorial } = useTutorialState();

  const supabase = createClientComponentClient();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // --- Estado para racha (overlay con Rive) ---
  const [streakOpen, setStreakOpen] = useState(false);
  const [streakValue, setStreakValue] = useState<number>(0);
  const [checkingStreak, setCheckingStreak] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ringScale, setRingScale] = useState(6);

  useEffect(() => {
    if (!streakOpen) return;
    const compute = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const scale = Math.max(vw / rect.width, vh / rect.height) * 1.2;
      setRingScale(scale);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [streakOpen]);

  const closeStreakCelebration = () => {
    setStreakOpen(false);
    setStreakValue(0);
  };

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (data?.avatar_url) setAvatarUrl(data.avatar_url);
    })();
  }, [supabase]);

  const triggerStreak = useCallback(async () => {
    setCheckingStreak(true);
    try {
      const { data } = await supabase.rpc('celebrate_streak', { p_org: null });
      const streak = (data?.[0]?.streak as number) ?? 0;
      setStreakValue(streak);
      setStreakOpen(true);
    } finally {
      setCheckingStreak(false);
    }
  }, [supabase]);

  const headerContent = useMemo(
    () => (
      <header className="h-16 border-b bg-white flex justify-between items-center px-4 lg:px-8">
        <div className="flex-1 flex items-center max-w-xl ml-12 lg:ml-0" />

        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200"
            onClick={triggerStreak}
            title="Celebrar racha"
          >
            {checkingStreak ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Flame className="h-6 w-6 text-amber-600" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-200"
            onClick={startTutorial}
            title="Iniciar Tutorial"
          >
            <PlayCircle className="h-6 w-6 text-green-600" />
          </Button>

          <Link href="/help/notifications">
            <Button variant="ghost" size="icon" className="hover:bg-gray-200">
              <HelpCircle className="h-6 w-6 text-gray-600" />
            </Button>
          </Link>

          <Link href="/settings">
            <Image
              src={avatarUrl || "/default-avatar.png"}
              alt="Avatar"
              width={36}
              height={36}
              className="rounded-full border border-gray-300 hover:scale-105 transition"
            />
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
    <div className="h-screen flex overflow-hidden">
      {/* ===== MOBILE DRAWER ===== */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-2 top-2 z-50"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-80 p-0 bg-gradient-to-b from-[#8BC5B5] to-[#5B9B8B] border-none z-[9999]"
        >
          <MobileNav menuItems={[...menuItems.primary, ...menuItems.footer]} />
        </SheetContent>
      </Sheet>

      {/* ===== SIDEBAR DESKTOP ===== */}
      <div className="flex w-64 h-full flex-shrink-0 bg-[#8BC5B5] text-white">
        <Sidebar primaryItems={menuItems.primary} footerItems={menuItems.footer} />
      </div>

      {/* ===== MAIN CONTENT (estructurado igual que el layout viejo) ===== */}
      <div className="flex flex-col flex-1 h-full min-h-0 min-w-0">
        {headerContent}

        <main className="flex-1 overflow-y-auto bg-gray-50 min-h-0 min-w-0">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
            {children}
          </div>
        </main>

        <Tutorial onClose={stopTutorial} run={isOpen} />
      </div>

      {/* ===== OVERLAY RIVE ===== */}
      <AnimatePresence>
        {streakOpen && (
          <motion.div
            key="streak-backdrop"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeStreakCelebration}
          >
            <div ref={wrapperRef} className="relative">
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-emerald-400/45 -z-10"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: ringScale, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <motion.div
                key="streak-card"
                onClick={(e) => e.stopPropagation()}
                className="
                  relative text-center shadow-2xl rounded-[24px]
                  px-5 py-4 sm:px-6 sm:py-5 bg-white/85
                  ring-1 ring-white/50 backdrop-blur-md
                "
                initial={{ x: -120, opacity: 0, scale: 0.98 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: 120, opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.26 }}
              >
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <FireCounter
                    value={streakValue}
                    src="/streak-normal.riv"
                    stateMachine="State Machine 1"
                    size={220}
                    color="#46B991"
                  />

                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                    ¡Racha {streakValue} días!
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 -mt-1">
                    ¡Sigue así!
                  </p>

                  <button
                    onClick={closeStreakCelebration}
                    className="mt-2 rounded-xl bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
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
