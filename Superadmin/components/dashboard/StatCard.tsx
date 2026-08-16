import { Icon } from "../ui/Icon";

type IconName = Parameters<typeof Icon>[0]["name"];

export function StatCard({ label, value, change, icon }: { label: string; value: string; change: string; icon: IconName }) {
  return (
    <div className="stat-card surface-card">
      <div className="stat-card-top">
        <div className="stat-icon"><Icon name={icon} size={20} /></div>
        <span className="stat-change">{change}</span>
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}
