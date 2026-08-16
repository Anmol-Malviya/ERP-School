"use client";

import { Icon } from "../ui/Icon";

export function Header({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Icon name="menu" /></button>
      <div className="topbar-search">
        <Icon name="search" size={18} />
        <input placeholder="Search schools, admins, tickets..." aria-label="Search platform" />
        <kbd>⌘ K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="icon-button notification-button" aria-label="Notifications"><Icon name="bell" size={19} /><span /></button>
        <div className="divider" />
        <button className="profile-button">
          <span className="avatar">AM</span>
          <span className="profile-copy"><strong>Anmol Malviya</strong><small>Platform Owner</small></span>
          <span className="profile-chevron">⌄</span>
        </button>
      </div>
    </header>
  );
}
