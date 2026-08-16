"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { navByRole, roleNames, roleUsers, type PortalRole } from "@/lib/portal-config";

function getRole(pathname: string): PortalRole {
  if (pathname.startsWith("/administrator")) return "administrator";
  if (pathname.startsWith("/teacher")) return "teacher";
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/parent")) return "parent";
  return "school-admin";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = getRole(pathname);
  const user = roleUsers[role];
  const [open, setOpen] = useState(false);

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${open ? "is-open" : ""}`}>
        <div className="portal-brand">
          <div className="portal-brand-mark">AV</div>
          <div><strong>School ERP</strong><small>{roleNames[role]} Portal</small></div>
          <button className="sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        </div>
        <div className="school-chip">
          <div className="school-logo">PS</div>
          <div><strong>Prestige Public School</strong><small>Session 2026–27</small></div>
        </div>
        <nav className="portal-nav">
          <span className="nav-section-label">Workspace</span>
          {navByRole[role].map((item) => {
            const active = pathname === item.href;
            return <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`portal-nav-item ${active ? "active" : ""}`}><Icon name={item.icon} size={17}/><span>{item.label}</span></Link>;
          })}
        </nav>
        <div className="portal-sidebar-footer">
          <div className="session-card"><span className="status-dot"/><div><strong>Academic Session Active</strong><small>2026–27 · Term 1</small></div></div>
          <Link href="/login" className="logout-link"><Icon name="logout" size={16}/> Sign out</Link>
        </div>
      </aside>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Close menu"/>}
      <main className="portal-main">
        <header className="portal-topbar">
          <button className="mobile-menu-button" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu"/></button>
          <div className="portal-search"><Icon name="search" size={16}/><input placeholder="Search students, classes, notices..."/><kbd>⌘ K</kbd></div>
          <div className="portal-top-actions">
            <button className="top-icon-button" aria-label="Notifications"><Icon name="bell" size={17}/><span className="notification-dot"/></button>
            <div className="top-divider"/>
            <button className="portal-profile">
              <div className="portal-avatar">{user.initials}</div>
              <div className="profile-text"><strong>{user.name}</strong><small>{user.subtitle}</small></div>
              <span className="profile-arrow">⌄</span>
            </button>
          </div>
        </header>
        <div className="portal-content">{children}</div>
      </main>
    </div>
  );
}
