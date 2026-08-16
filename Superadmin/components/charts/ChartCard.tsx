export function ChartCard({ title, subtitle, values, suffix = "" }: { title: string; subtitle: string; values: number[]; suffix?: string }) {
  const max = Math.max(...values);
  return (
    <div className="surface-card chart-card">
      <div className="card-heading-row">
        <div><h3>{title}</h3><p>{subtitle}</p></div>
        <select className="compact-select" defaultValue="12m" aria-label="Chart period"><option value="12m">Last 12 months</option><option value="6m">Last 6 months</option></select>
      </div>
      <div className="bar-chart" aria-label={`${title} chart`}>
        {values.map((value, index) => (
          <div className="bar-column" key={`${value}-${index}`}>
            <div className="bar-tooltip">{value}{suffix}</div>
            <div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max(12, (value / max) * 100)}%` }} /></div>
            <span>{["Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
