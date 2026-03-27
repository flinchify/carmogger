// SVG path data for each league icon (no emoji)
export const LEAGUE_ICONS = {
  junkyard: {
    viewBox: "0 0 24 24",
    path: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6-7.6 7.6-1.6-1.6a1 1 0 0 0-1.4 1.4l4 4a1 1 0 0 0 1.4 0l9-9a1 1 0 0 0 0-1.4l-4-4a1 1 0 0 0-1.4 0zM3.34 2.93l1.42 1.42A3.5 3.5 0 0 0 4 6.5c0 .97.39 1.85 1.03 2.49L3.1 11.35a1 1 0 0 0 1.42 1.42L6.88 10.4A3.5 3.5 0 0 0 11 6.5a3.5 3.5 0 0 0-2.15-3.23L10.27 1.9a1 1 0 0 0-1.42-1.42L3.34 2.93z",
  },
  garage: {
    viewBox: "0 0 24 24",
    path: "M2 20V10l10-8 10 8v10H2zm2-2h16v-7.2L12 4.5 4 10.8V18zm2-2h12v-2H6v2zm0-4h12v-2H6v2z",
  },
  street: {
    viewBox: "0 0 24 24",
    path: "M11 2v4h2V2h-2zm0 6v4h2V8h-2zm0 6v4h2v-4h-2zm0 6v2h2v-2h-2zM4 2h4v22H4V2zm12 0h4v22h-4V2z",
  },
  track: {
    viewBox: "0 0 24 24",
    path: "M4 2v20h2V2H4zm4 0v6l6-3-6-3zm0 8v6l6-3-6-3zm0 8v6l6-3-6-3zM14 2v6l6-3-6-3zm0 8v6l6-3-6-3zm0 8v6l6-3-6-3z",
  },
  elite: {
    viewBox: "0 0 24 24",
    path: "M12 2l3 6.5L22 10l-5 5 1.2 7L12 18.5 5.8 22 7 15 2 10l7-1.5L12 2z",
  },
  apex: {
    viewBox: "0 0 24 24",
    path: "M12 2L2 22h20L12 2zm0 4l7.5 14h-15L12 6z",
  },
} as const;

export const LEAGUES = [
  { name: "junkyard", display: "Junkyard", min: 0, max: 999, color: "#6B7280", bg: "from-gray-600 to-gray-800", icon: "junkyard" as const },
  { name: "garage", display: "Garage", min: 1000, max: 4999, color: "#10B981", bg: "from-emerald-500 to-emerald-700", icon: "garage" as const },
  { name: "street", display: "Street", min: 5000, max: 14999, color: "#3B82F6", bg: "from-blue-500 to-blue-700", icon: "street" as const },
  { name: "track", display: "Track", min: 15000, max: 49999, color: "#8B5CF6", bg: "from-purple-500 to-purple-700", icon: "track" as const },
  { name: "elite", display: "Elite", min: 50000, max: 149999, color: "#F59E0B", bg: "from-amber-400 to-amber-600", icon: "elite" as const },
  { name: "apex", display: "Apex", min: 150000, max: Infinity, color: "#EF4444", bg: "from-red-500 to-red-700", icon: "apex" as const },
] as const;

export function getLeague(xp: number) {
  for (let i = LEAGUES.length - 1; i >= 0; i--) {
    if (xp >= LEAGUES[i].min) return LEAGUES[i];
  }
  return LEAGUES[0];
}

export function getLevel(lifetimeXp: number): number {
  if (lifetimeXp >= 5000000) return 100;
  if (lifetimeXp >= 1000000) return 76 + Math.floor((lifetimeXp - 1000000) / 80000);
  if (lifetimeXp >= 250000) return 51 + Math.floor((lifetimeXp - 250000) / 30000);
  if (lifetimeXp >= 50000) return 26 + Math.floor((lifetimeXp - 50000) / 8000);
  if (lifetimeXp >= 10000) return 11 + Math.floor((lifetimeXp - 10000) / 2666);
  return 1 + Math.floor(lifetimeXp / 1000);
}

export function getXpForNextLevel(level: number): number {
  if (level >= 100) return Infinity;
  if (level >= 76) return 1000000 + (level - 76) * 80000 + 80000;
  if (level >= 51) return 250000 + (level - 51) * 30000 + 30000;
  if (level >= 26) return 50000 + (level - 26) * 8000 + 8000;
  if (level >= 11) return 10000 + (level - 11) * 2666 + 2666;
  return (level) * 1000;
}

export function getDivision(seasonalXp: number, league: typeof LEAGUES[number]): number {
  const range = league.max - league.min;
  const progress = seasonalXp - league.min;
  const third = range / 3;
  if (progress >= third * 2) return 1;
  if (progress >= third) return 2;
  return 3;
}
