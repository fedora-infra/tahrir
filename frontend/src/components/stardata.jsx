import { useSelector } from "react-redux";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Tooltip } from "recharts";

export default function StarData({ sections }) {
  const vibe = useSelector((data) => data.area.vibe);

  if (!sections) return null;

  const data = Object.entries(sections).map(([catg, list]) => ({
    catg: catg.charAt(0).toUpperCase() + catg.slice(1),
    poll: list.length,
  }));

  if (data.length < 3) return null;

  return (
    <RadarChart width={375} height={275} data={data}>
      <PolarGrid stroke="var(--bs-border-color)" />
      <PolarAngleAxis dataKey="catg" tick={{ fontSize: 12, fill: "var(--bs-body-color)" }} />
      <Radar dataKey="poll" stroke={vibe} fill={vibe} fillOpacity={0.25} />
      <Tooltip
        contentStyle={{
          backgroundColor: "var(--bs-body-bg)",
          border: `1px solid ${vibe}`,
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: 11,
        }}
        labelStyle={{ display: "none" }}
        itemStyle={{ color: "var(--bs-body-color)", fontSize: 11, padding: 0 }}
        formatter={(poll) => {
          const full = data.reduce((cost, item) => cost + item.poll, 0);
          return [`${poll} badges (${((poll / full) * 100).toFixed(2)}%)`];
        }}
      />
    </RadarChart>
  );
}
