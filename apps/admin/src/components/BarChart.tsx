interface Props {
  data: { label: string; value: number }[];
  maxValue?: number;
}

export function BarChart({ data, maxValue }: Props) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value));
  return (
    <div className="bar-chart">
      {data.map((d) => (
        <div className="bar-col" key={d.label}>
          <div className="bar" style={{ height: `${(d.value / max) * 100}%` }} title={String(d.value)} />
          <div className="bar-label">{d.label}</div>
        </div>
      ))}
    </div>
  );
}