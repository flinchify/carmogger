"use client";

import { LEAGUES } from "@/lib/leagues";

interface LeagueBadgeProps {
  league: string;
  division?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function LeagueBadge({ league, division, size = "md", showLabel = true }: LeagueBadgeProps) {
  const leagueData = LEAGUES.find((l) => l.name === league) || LEAGUES[0];
  const sizeMap = { sm: "w-6 h-6 text-xs", md: "w-10 h-10 text-sm", lg: "w-16 h-16 text-xl" };
  const divisionLabel = division ? ` ${["", "I", "II", "III"][division]}` : "";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${sizeMap[size]} rounded-full flex items-center justify-center font-black bg-gradient-to-br ${leagueData.bg} shadow-lg`}
        style={{ boxShadow: `0 0 12px ${leagueData.color}40` }}
      >
        {leagueData.emoji}
      </div>
      {showLabel && (
        <div>
          <span className="text-sm font-bold" style={{ color: leagueData.color }}>
            {leagueData.display}{divisionLabel}
          </span>
        </div>
      )}
    </div>
  );
}
