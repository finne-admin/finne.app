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
