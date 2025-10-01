// Calcula el nivel en base a la experiencia total
export function getLevelFromXP(xp: number, base = 100, factor = 1.2): number {
  let level = 1;
  let required = base;

  while (xp >= required) {
    xp -= required;
    level++;
    required = Math.floor(base * level * factor);
  }

  return level;
}

// Devuelve el XP requerido para alcanzar el siguiente nivel
export function getXPForNextLevel(level: number, base = 100, factor = 1.2): number {
  return Math.floor(base * level * factor);
}

// Devuelve el título según el nivel
export function getTitleFromLevel(level: number): string {
  if (level >= 40) return "Leyenda del bienestar";
  if (level >= 30) return "Mentor de vitalidad";
  if (level >= 25) return "Maestro del equilibrio";
  if (level >= 20) return "Referente saludable";
  if (level >= 15) return "Líder del bienestar";
  if (level >= 10) return "Guía activo";
  if (level >= 6) return "Embajador saludable";
  if (level >= 3) return "Movilizador consciente";
  return "Principiante en bienestar";
}

// Estado de nivel a partir del XP total acumulado
export function getLevelStateFromXP(xpTotal: number, base = 100, factor = 1.2) {
  let level = 1;
  let costThisLevel = Math.floor(base * level * factor); // XP para pasar del nivel actual al siguiente
  let xpRemaining = xpTotal;

  // Avanza niveles mientras tengas XP suficiente
  while (xpRemaining >= costThisLevel) {
    xpRemaining -= costThisLevel;
    level++;
    costThisLevel = Math.floor(base * level * factor);
  }

  const xpIntoLevel = xpRemaining;              // XP ya invertido en el nivel actual
  const xpToNext = costThisLevel;               // XP necesario para subir al siguiente nivel desde el actual
  const progress = Math.round((xpIntoLevel / xpToNext) * 100);

  return {
    level,
    xpIntoLevel,
    xpToNext,
    progress: Math.max(0, Math.min(100, progress)), // clamp 0–100
  };
}
