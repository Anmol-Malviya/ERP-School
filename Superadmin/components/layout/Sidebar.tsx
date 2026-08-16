"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "../ui/Icon";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" as const },
  { href: "/schools", label: "Schools", icon: "school" as const },
  { href: "/administrators", label: "Administrators", icon: "users" as const },
  { href: "/subscriptions", label: "Subscriptions", icon: "card" as const },
  { href: "/plans", label: "Plans", icon: "plan" as const },
  { href: "/modules", label: "Modules", icon: "grid" as const },
  { href: "/analytics", label: "Analytics", icon: "chart" as const },
  { href: "/support", label: "Support", icon: "support" as const },
  { href: "/audit-logs", label: "Audit Logs", icon: "history" as const },
  { href: "/settings", label: "Settings", icon: "settings" as const },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {open ? <button className="sidebar-backdrop" aria-label="Close navigation" onClick={onClose} /> : null}
      <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span>AV</span></div>
          <div><strong>School ERP</strong><small>Super Admin</small></div>
        </div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          <span className="nav-label">Platform</span>
          {navigation.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={`nav-item ${active ? "active" : ""}`} onClick={onClose}>
                <Icon name={item.icon} size={19} /><span>{item.label}</span>
                {item.label === "Support" ? <span className="nav-count">4</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="system-health">
            <span className="health-dot" />
            <div><strong>All systems operational</strong><small>Last checked 2 min ago</small></div>
          </div>
          <button className="logout-button"><Icon name="logout" size={18} /> Sign out</button>
        </div>
      </aside>
    </>
  );
}
