"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { apiGet } from "@/lib/apiClient"; // ya lo usas en notifications
import { SvelteQuotaToken } from "@/components/svelte/SvelteQuotaToken";

type QuotaState = {
  usedToday: number;
  remainingToday: number;
  limit: number;
  times: string[];
  timezone: string;
  pausesToday: string[];
  slots: QuotaSlot[];
  hasOpenSlot: boolean;
  loadingQuota: boolean;
  quotaError: string | null;
  refetchQuota: () => Promise<void>;
};

type SlotStatus = "completed" | "open" | "upcoming" | "expired";

export type QuotaSlot = {
  time: string;
  status: SlotStatus;
  windowStart: string;
  windowEnd: string;
};

const DEFAULT_TIMEZONE = "Europe/Madrid";
const WINDOW_BEFORE_MINUTES = 20;
const WINDOW_AFTER_MINUTES = 25;

const buildSlots = (times: string[], pauses: string[], timezone: string): QuotaSlot[] => {
  const now = DateTime.now().setZone(timezone);
  return times.map((time) => {
    const [hRaw, mRaw] = time.split(":");
    const hour = Number(hRaw);
    const minute = Number(mRaw);
    const slotTime = now.startOf("day").set({ hour, minute, second: 0, millisecond: 0 });
    const windowStart = slotTime.minus({ minutes: WINDOW_BEFORE_MINUTES });
    const windowEnd = slotTime.plus({ minutes: WINDOW_AFTER_MINUTES });

    const completed = pauses.some((timestamp) => {
      const pauseTime = DateTime.fromISO(timestamp, { zone: timezone });
      return pauseTime >= windowStart && pauseTime <= windowEnd;
    });

    let status: SlotStatus = "upcoming";
    if (completed) {
      status = "completed";
    } else if (now >= windowStart && now <= windowEnd) {
      status = "open";
    } else if (now > windowEnd) {
      status = "expired";
    }

    return {
      time,
      status,
      windowStart: windowStart.toISO() || "",
      windowEnd: windowEnd.toISO() || "",
    };
  });
};

export function useDailyQuota(limit = 3): QuotaState {
  const [usedToday, setUsedToday] = useState(0);
  const [remainingToday, setRemainingToday] = useState(limit);
  const [dailyLimit, setDailyLimit] = useState(limit);
  const [times, setTimes] = useState<string[]>([]);
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [pausesToday, setPausesToday] = useState<string[]>([]);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  const fetchDailyQuota = useCallback(async () => {
    setLoadingQuota(true);
    setQuotaError(null);

    try {
      const res = await apiGet("/api/quota/daily");
      if (!res.ok) throw new Error("Error al consultar el cupo diario");

      const data = await res.json();
      const apiLimit = typeof data.limit === "number" ? data.limit : limit;
      setDailyLimit(apiLimit);
      setUsedToday(data.usedToday ?? 0);
      setRemainingToday(data.remainingToday ?? apiLimit);
      setTimes(Array.isArray(data.times) ? data.times : []);
      setTimezone(typeof data.timezone === "string" ? data.timezone : DEFAULT_TIMEZONE);
      setPausesToday(Array.isArray(data.pausesToday) ? data.pausesToday : []);
    } catch (err: any) {
      setQuotaError(err.message || "Error al cargar el cupo");
    } finally {
      setLoadingQuota(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchDailyQuota();
  }, [fetchDailyQuota]);

  const slots = useMemo(
    () => buildSlots(times, pausesToday, timezone),
    [times, pausesToday, timezone]
  );
  const hasOpenSlot = slots.some((slot) => slot.status === "open");

  return {
    usedToday,
    remainingToday,
    limit: dailyLimit,
    times,
    timezone,
    pausesToday,
    slots,
    hasOpenSlot,
    loadingQuota,
    quotaError,
    refetchQuota: fetchDailyQuota,
  };
}

/* =========================
   Barra visual del cupo
   ========================= */
function QuotaToken({
  status,
  timeLabel,
  points,
  unit,
}: {
  status: SlotStatus;
  timeLabel: string;
  points: number;
  unit: string;
}) {
  const isCompleted = status === "completed";
  const isOpen = status === "open";
  const isExpired = status === "expired";
  return (
    <div
      className={[
        "h-10 w-16 sm:h-12 sm:w-20 rounded-md border",
        "flex flex-col items-center justify-center text-center leading-tight select-none",
        isCompleted
          ? "text-white border-emerald-500"
          : isOpen
          ? "bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm"
          : isExpired
          ? "bg-red-100 text-red-500 border-red-300"
          : "bg-gray-100 text-gray-500 border-gray-200",
        "mx-0.01",
      ].join(" ")}
      style={isCompleted ? { backgroundColor: "#8ACC9F" } : undefined}
    >
      {timeLabel ? (
        <>
          <div className="font-semibold text-[14px] sm:text-[15px]">{timeLabel}</div>
          <div
            className={[
              "text-[10px] opacity-80 -mt-0.5",
              isExpired ? "line-through" : "",
            ].join(" ")}
          >
            +{points} {unit}
          </div>
        </>
      ) : (
        <div className="font-semibold text-[12px] sm:text-[13px]">
          +{points} {unit}
        </div>
      )}
    </div>
  );
}

export function DailyQuotaBar({
  limit = 3,
  usedToday,
  slots = [],
  loading,
  error,
  pointsPerPause = 20,
  unitLabel = "AP",
  className,
}: {
  limit?: number;
  usedToday: number;
  slots?: QuotaSlot[];
  loading?: boolean;
  error?: string | null;
  pointsPerPause?: number;
  unitLabel?: string;
  className?: string;
}) {
  const remaining = Math.max(0, limit - usedToday);
  const segments = Array.from({ length: limit }, (_, i) => i < usedToday);
  const renderSlots = slots.length > 0 ? slots : null;
  const remainingFromSlots = renderSlots
    ? renderSlots.filter((slot) => slot.status === "open" || slot.status === "upcoming").length
    : remaining;
  const lostFromSlots = renderSlots
    ? renderSlots.filter((slot) => slot.status === "expired").length
    : 0;
  const [svelteReady, setSvelteReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.customElements?.get("svelte-quota-token")) {
      setSvelteReady(true);
      return;
    }
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/svelte/svelte-lab.js";
    script.onload = () => setSvelteReady(true);
    script.onerror = () => setSvelteReady(false);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className={["mt-4 flex flex-col items-center gap-3", className || ""].join(" ")}>
      <div className="flex items-center gap-2 text-sm">
        {loading ? (
          <span className="text-gray-500">Cargando cupo diario…</span>
        ) : error ? (
          <span className="text-red-600">No se pudo cargar el cupo</span>
        ) : remainingFromSlots > 0 ? (
          <span className="text-gray-700">
            Te quedan{" "}
            <strong className={remainingFromSlots > 0 ? "text-emerald-600" : "text-gray-900"}>
              {remainingFromSlots}
            </strong>{" "}
            pausa
            {remainingFromSlots === 1 ? "" : "s"} con recompensa hoy
          </span>
        ) : (
          <span className="text-gray-700">Has alcanzado el límite diario con recompensa</span>
        )}
        {lostFromSlots > 0 && (
          <span className="text-red-500 text-xs">
            Has perdido <strong>{lostFromSlots}</strong> pausa
            {lostFromSlots === 1 ? "" : "s"} de hoy
          </span>
        )}
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {renderSlots
          ? renderSlots.map((slot) => (
              svelteReady ? (
                <SvelteQuotaToken
                  key={slot.time}
                  status={slot.status}
                  timeLabel={slot.time}
                  points={pointsPerPause}
                  unit={unitLabel}
                  scriptReady={svelteReady}
                />
              ) : (
                <QuotaToken
                  key={slot.time}
                  status={slot.status}
                  timeLabel={slot.time}
                  points={pointsPerPause}
                  unit={unitLabel}
                />
              )
            ))
          : segments.map((isFilled, idx) => (
              svelteReady ? (
                <SvelteQuotaToken
                  key={idx}
                  status={isFilled ? "completed" : "upcoming"}
                  timeLabel=""
                  points={pointsPerPause}
                  unit={unitLabel}
                  scriptReady={svelteReady}
                />
              ) : (
                <QuotaToken
                  key={idx}
                  status={isFilled ? "completed" : "upcoming"}
                  timeLabel=""
                  points={pointsPerPause}
                  unit={unitLabel}
                />
              )
            ))}
      </div>

      <div className="text-[11px] text-gray-500">
        Puedes hacer hasta {limit} pausas con recompensa al dia.
      </div>
    </div>
  );
}
