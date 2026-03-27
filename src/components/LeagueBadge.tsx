"use client";

import { LEAGUES, LEAGUE_ICONS } from "@/lib/leagues";

interface LeagueBadgeProps {
  league: string;
  division?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function LeagueBadge({ league, division, size = "md", showLabel = true }: LeagueBadgeProps) {
  const leagueData = LEAGUES.find((l) => l.name === league) || LEAGUES[0];
  const iconData = LEAGUE_ICONS[leagueData.icon];
  const sizeMap = { sm: 24, md: 40, lg: 64 };
  const iconSizeMap = { sm: 12, md: 18, lg: 28 };
  const px = sizeMap[size];
  const iconPx = iconSizeMap[size];
  const divisionLabel = division ? ` ${["", "I", "II", "III"][division]}` : "";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full flex items-center justify-center bg-gradient-to-br ${leagueData.bg} shadow-lg`}
        style={{
          width: px,
          height: px,
          boxShadow: `0 0 12px ${leagueData.color}40`,
        }}
      >
        <svg
          width={iconPx}
          height={iconPx}
          viewBox={iconData.viewBox}
          fill="white"
        >
          <path d={iconData.path} />
        </svg>
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
