"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/apiClient"; // ya lo usas en notifications

type QuotaState = {
  usedToday: number;
  remainingToday: number;
  loadingQuota: boolean;
  quotaError: string | null;
  refetchQuota: () => Promise<void>;
};

export function useDailyQuota(limit = 3): QuotaState {
  const [usedToday, setUsedToday] = useState(0);
  const [remainingToday, setRemainingToday] = useState(limit);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  const fetchDailyQuota = useCallback(async () => {
    setLoadingQuota(true);
    setQuotaError(null);

    try {
      const res = await apiGet("/api/quota/daily");
      if (!res.ok) throw new Error("Error al consultar el cupo diario");

      const data = await res.json();
      setUsedToday(data.usedToday ?? 0);
      setRemainingToday(data.remainingToday ?? limit);
    } catch (err: any) {
      setQuotaError(err.message || "Error al cargar el cupo");
    } finally {
      setLoadingQuota(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchDailyQuota();
  }, [fetchDailyQuota]);

  return { usedToday, remainingToday, loadingQuota, quotaError, refetchQuota: fetchDailyQuota };
}

/* =========================
   Barra visual del cupo
   ========================= */
function QuotaToken({
  filled,
  points,
  unit,
}: {
  filled: boolean;
  points: number;
  unit: string;
}) {
  return (
    <div
      className={[
        "h-10 w-16 sm:h-12 sm:w-20 rounded-md border",
        "flex flex-col items-center justify-center text-center leading-tight select-none",
        filled
          ? "bg-emerald-400 text-white border-emerald-500"
          : "bg-indigo-50 text-indigo-700 border-indigo-200",
        "mx-0.01",
      ].join(" ")}
    >
      <div className="font-semibold text-[11px] sm:text-[12px]">
        +{points}
        <div className="text-[10px] opacity-80 -mt-0.5">{unit}</div>
      </div>
    </div>
  );
}

export function DailyQuotaBar({
  limit = 3,
  usedToday,
  loading,
  error,
  pointsPerPause = 20,
  unitLabel = "AP",
  className,
}: {
  limit?: number;
  usedToday: number;
  loading?: boolean;
  error?: string | null;
  pointsPerPause?: number;
  unitLabel?: string;
  className?: string;
}) {
  const remaining = Math.max(0, limit - usedToday);
  const segments = Array.from({ length: limit }, (_, i) => i < usedToday);

  return (
    <div className={["mt-4 flex flex-col items-center gap-3", className || ""].join(" ")}>
      <div className="flex items-center gap-2 text-sm">
        {loading ? (
          <span className="text-gray-500">Cargando cupo diario…</span>
        ) : error ? (
          <span className="text-red-600">No se pudo cargar el cupo</span>
        ) : remaining > 0 ? (
          <span className="text-gray-700">
            Te quedan <strong>{remaining}</strong> pausa{remaining === 1 ? "" : "s"} con recompensa hoy
          </span>
        ) : (
          <span className="text-gray-700">Has alcanzado el límite diario con recompensa</span>
        )}
      </div>

      <div className="flex gap-3">
        {segments.map((isFilled, idx) => (
          <QuotaToken key={idx} filled={isFilled} points={pointsPerPause} unit={unitLabel} />
        ))}
      </div>

      <div className="text-[11px] text-gray-500">
        Puedes hacer más pausas, pero sólo las primeras {limit} dan experiencia.
      </div>
    </div>
  );
}
