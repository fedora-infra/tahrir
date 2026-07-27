import { useSelector } from "react-redux";
import { Bar, BarChart, Brush, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function TimeLine({ badges }) {
  const vibe = useSelector((data) => data.area.vibe);

  if (!badges || badges.length === 0) return null;

  const bins = {};
  badges.forEach((item) => {
    const date = new Date(item.created_on * 1000);
    const indx = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    bins[indx] = (bins[indx] || 0) + 1;
  });

  const keys = Object.keys(bins).sort();
  const strt = keys[0].split("-").map(Number);
  const stop = keys[keys.length - 1].split("-").map(Number);
  const data = [];

  let [year, mont] = strt;
  while (year < stop[0] || (year === stop[0] && mont <= stop[1])) {
    const indx = `${year}-${String(mont).padStart(2, "0")}`;
    data.push({
      mont: new Date(indx + "-01").toLocaleDateString("en-US", { year: "numeric", month: "short" }),
      poll: bins[indx] || 0,
    });
    mont++;
    if (mont > 12) {
      mont = 1;
      year++;
    }
  }

  if (data.length < 2) return null;

  const peak = Math.max(...data.map((d) => d.poll));

  return (
    <ResponsiveContainer width="100%" height={275}>
      <BarChart data={data}>
        <XAxis
          dataKey="mont"
          tick={{ fontSize: 12, fill: "var(--bs-body-color)" }}
          interval="preserveStartEnd"
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--bs-body-color)" }}
          tickLine={false}
          width={25}
          allowDecimals={false}
          domain={[0, peak]}
          ticks={[0, peak]}
        />
        <Bar dataKey="poll" fill={vibe} fillOpacity={0.6} radius={[2, 2, 0, 0]} />
        <Brush
          dataKey="mont"
          height={20}
          stroke={vibe}
          startIndex={Math.max(0, data.length - 12)}
          tickFormatter={() => ""}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--bs-body-bg)",
            border: `1px solid ${vibe}`,
            borderRadius: 4,
            padding: "4px 8px",
            fontSize: 12,
          }}
          labelStyle={{ display: "none" }}
          itemStyle={{ color: "var(--bs-body-color)", fontSize: 12, padding: 0 }}
          formatter={(poll, _, prop) => [`${poll} badge(s) in ${prop.payload.mont}`]}
          cursor={{ fill: vibe, fillOpacity: 0.25 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
