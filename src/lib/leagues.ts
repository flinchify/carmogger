export const LEAGUES = [
  { name: "junkyard", display: "Junkyard", min: 0, max: 999, color: "#6B7280", bg: "from-gray-600 to-gray-800", emoji: "🗑️" },
  { name: "garage", display: "Garage", min: 1000, max: 4999, color: "#10B981", bg: "from-emerald-500 to-emerald-700", emoji: "🔧" },
  { name: "street", display: "Street", min: 5000, max: 14999, color: "#3B82F6", bg: "from-blue-500 to-blue-700", emoji: "🏎️" },
  { name: "track", display: "Track", min: 15000, max: 49999, color: "#8B5CF6", bg: "from-purple-500 to-purple-700", emoji: "🏁" },
  { name: "elite", display: "Elite", min: 50000, max: 149999, color: "#F59E0B", bg: "from-amber-400 to-amber-600", emoji: "👑" },
  { name: "apex", display: "Apex", min: 150000, max: Infinity, color: "#EF4444", bg: "from-red-500 to-red-700", emoji: "🔥" },
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
