"use client";

import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="app-shell">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="app-main">
        <Header onMenu={() => setOpen(true)} />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}
