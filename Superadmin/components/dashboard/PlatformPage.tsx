"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { ChartCard } from "@/components/charts/ChartCard";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "./PageHeader";
import { StatCard } from "./StatCard";
import { administrators, auditLogs, modules, plans, platformStats, revenueSeries, schoolGrowth, schools, tickets } from "@/lib/mock-data";

const schoolColumns: Column<(typeof schools)[number]>[] = [
  { key: "school", label: "School", render: (school) => <div className="entity-cell"><span className="entity-logo">{school.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><div><strong>{school.name}</strong><small>{school.code} · {school.city}</small></div></div> },
  { key: "students", label: "Students", render: (school) => school.students.toLocaleString("en-IN") },
  { key: "plan", label: "Plan", render: (school) => school.plan },
  { key: "status", label: "Status", render: (school) => <Badge tone={school.status === "Active" ? "success" : school.status === "Trial" ? "warning" : "danger"}>{school.status}</Badge> },
  { key: "renewal", label: "Next renewal", render: (school) => school.renewal },
  { key: "actions", label: "", align: "right", render: () => <button className="more-button"><Icon name="more" size={17} /></button> },
];

const adminColumns: Column<(typeof administrators)[number]>[] = [
  { key: "admin", label: "Administrator", render: (admin) => <div className="entity-cell"><span className="entity-logo">{admin.name.split(" ").map((word) => word[0]).join("")}</span><div><strong>{admin.name}</strong><small>{admin.email}</small></div></div> },
  { key: "zone", label: "Coverage", render: (admin) => <><strong style={{ fontSize: 10.5 }}>{admin.zone}</strong><br /><span style={{ fontSize: 9, color: "#9aa5b5" }}>{admin.schools} assigned schools</span></> },
  { key: "status", label: "Status", render: (admin) => <Badge tone={admin.status === "Active" ? "success" : "neutral"}>{admin.status}</Badge> },
  { key: "login", label: "Last login", render: (admin) => admin.lastLogin },
  { key: "actions", label: "", align: "right", render: () => <button className="more-button"><Icon name="more" size={17} /></button> },
];

const activities = [
  { icon: "school" as const, title: "New school onboarded", text: "Green Valley Academy joined the Pro plan", time: "12 min" },
  { icon: "users" as const, title: "Administrator added", text: "Megha Verma assigned to 3 new schools", time: "44 min" },
  { icon: "card" as const, title: "Subscription renewed", text: "Sage International renewed for 12 months", time: "2 hr" },
  { icon: "support" as const, title: "Priority ticket opened", text: "Student import issue needs attention", time: "3 hr" },
];

function Dashboard() {
  return <><PageHeader eyebrow="Platform overview" title="Good evening, Anmol" description="Here is what is happening across your School ERP ecosystem today." actions={<><Button variant="secondary">Export report</Button><Button><Icon name="plus" size={16} /> Add school</Button></>} /><section className="stats-grid">{platformStats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section><section className="dashboard-grid"><ChartCard title="Monthly recurring revenue" subtitle="Platform subscription revenue across all active schools" values={revenueSeries} suffix="k" /><div className="surface-card activity-card"><div className="card-heading-row"><div><h3>Recent activity</h3><p>Latest platform events</p></div><Link href="/audit-logs" className="table-link">View all</Link></div><div className="activity-list">{activities.map((activity) => <div className="activity-row" key={activity.title}><div className="activity-icon"><Icon name={activity.icon} size={16} /></div><div><strong>{activity.title}</strong><p>{activity.text}</p></div><time>{activity.time}</time></div>)}</div></div></section><section className="surface-card section-card"><div className="section-toolbar"><div><h3>Schools requiring attention</h3><p>Trials, renewals and account issues</p></div><Link href="/schools" className="table-link">View all schools →</Link></div><DataTable columns={schoolColumns} rows={schools.slice(0, 4)} /></section></>;
}

function Schools() {
  return <><PageHeader eyebrow="Tenant management" title="Schools" description="Create, activate, suspend and monitor every school using the platform." actions={<><Button variant="secondary">Import schools</Button><Button><Icon name="plus" size={16} /> Add school</Button></>} /><section className="metrics-strip"><div className="metric-box"><span>Total schools</span><strong>148</strong><small>+12 this month</small></div><div className="metric-box"><span>Active</span><strong>141</strong><small>95.2% of total</small></div><div className="metric-box"><span>On trial</span><strong>5</strong><small>2 ending this week</small></div><div className="metric-box"><span>Suspended</span><strong>2</strong><small>Action required</small></div></section><section className="surface-card section-card"><div className="section-toolbar"><div><h3>All schools</h3><p>148 school workspaces across the platform</p></div><div className="table-actions"><div className="table-search"><Icon name="search" size={15} /><input placeholder="Search schools..." /></div><Button variant="secondary">Filter</Button></div></div><DataTable columns={schoolColumns} rows={schools} /></section></>;
}

function Administrators() {
  return <><PageHeader eyebrow="Platform access" title="Administrators" description="Manage regional administrators and the schools assigned to each account." actions={<Button><Icon name="plus" size={16} /> Add administrator</Button>} /><section className="quick-grid" style={{ marginBottom: 18 }}><div className="surface-card quick-card"><span className="quick-icon"><Icon name="users" /></span><div><strong>24 administrators</strong><p>22 currently active</p></div></div><div className="surface-card quick-card"><span className="quick-icon"><Icon name="school" /></span><div><strong>6.2 schools / admin</strong><p>Average allocation</p></div></div><div className="surface-card quick-card"><span className="quick-icon"><Icon name="shield" /></span><div><strong>RBAC enforced</strong><p>All accounts permission scoped</p></div></div></section><section className="surface-card section-card"><div className="section-toolbar"><div><h3>Administrator directory</h3><p>Platform operators with multi-school access</p></div><div className="table-search"><Icon name="search" size={15} /><input placeholder="Search administrators..." /></div></div><DataTable columns={adminColumns} rows={administrators} /></section></>;
}

function Subscriptions() {
  return <><PageHeader eyebrow="Billing" title="Subscriptions" description="Track school plans, renewals, billing status and subscription health." actions={<Button variant="secondary">Download billing report</Button>} /><section className="metrics-strip"><div className="metric-box"><span>MRR</span><strong>₹8.42L</strong><small>+14.2% this month</small></div><div className="metric-box"><span>Annual run rate</span><strong>₹1.01Cr</strong><small>Projected</small></div><div className="metric-box"><span>Renewals due</span><strong>18</strong><small>Next 30 days</small></div><div className="metric-box"><span>Trial conversion</span><strong>68%</strong><small>+4.1% vs last quarter</small></div></section><section className="surface-card section-card"><div className="section-toolbar"><div><h3>Subscription accounts</h3><p>Billing status for active and trial schools</p></div><div className="table-actions"><Button variant="secondary">Filter</Button><Button>New subscription</Button></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>School</th><th>Plan</th><th>Billing cycle</th><th>Amount</th><th>Status</th><th>Renewal</th></tr></thead><tbody>{schools.map((school, index) => <tr key={school.code}><td><div className="entity-cell"><span className="entity-logo">{school.name.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><div><strong>{school.name}</strong><small>{school.code}</small></div></div></td><td>{school.plan}</td><td>{index % 2 ? "Monthly" : "Annual"}</td><td>{school.plan === "Enterprise" ? "₹12,500" : school.plan === "Pro" ? "₹4,999" : "₹1,999"}</td><td><Badge tone={school.status === "Active" ? "success" : school.status === "Trial" ? "warning" : "danger"}>{school.status}</Badge></td><td>{school.renewal}</td></tr>)}</tbody></table></div></section></>;
}

function Plans() {
  return <><PageHeader eyebrow="Commercial configuration" title="Plans" description="Configure subscription tiers and control the feature package available to schools." actions={<Button><Icon name="plus" size={16} /> Create plan</Button>} /><section className="plan-grid">{plans.map((plan) => <article className="surface-card plan-card" key={plan.name} style={{ "--plan-color": plan.color } as CSSProperties}><div className="plan-accent" /><h3>{plan.name}</h3><span className="plan-schools">{plan.schools} schools currently subscribed</span><div className="plan-price">{plan.price}<small>{plan.period}</small></div><ul className="feature-list">{plan.features.map((feature) => <li key={feature}><span className="feature-check"><Icon name="check" size={15} /></span>{feature}</li>)}</ul><Button variant="secondary" style={{ width: "100%" }}>Edit plan</Button></article>)}</section></>;
}

function Modules() {
  return <><PageHeader eyebrow="Feature control" title="ERP Modules" description="Control platform modules globally and see how many schools are using each capability." actions={<Button variant="secondary">Module policy</Button>} /><section className="module-grid">{modules.map((module) => <article className="surface-card module-card" key={module.key}><span className="module-icon"><Icon name="grid" size={18} /></span><div><h3>{module.name}</h3><p>{module.description}</p><span className="module-meta">Enabled for {module.enabled} of 148 schools</span></div><div className="toggle" aria-label={`${module.name} enabled`} /></article>)}</section></>;
}

function Analytics() {
  return <><PageHeader eyebrow="Insights" title="Platform Analytics" description="Growth, engagement and revenue trends across the complete School ERP platform." actions={<Button variant="secondary">Export analytics</Button>} /><section className="metrics-strip"><div className="metric-box"><span>Monthly active users</span><strong>31.8K</strong><small>+9.8%</small></div><div className="metric-box"><span>Avg. school adoption</span><strong>82%</strong><small>+3.4%</small></div><div className="metric-box"><span>API uptime</span><strong>99.98%</strong><small>Last 30 days</small></div><div className="metric-box"><span>Support SLA</span><strong>1h 42m</strong><small>-18 min</small></div></section><section className="dashboard-grid"><ChartCard title="Revenue trend" subtitle="Monthly recurring revenue (₹000s)" values={revenueSeries} suffix="k" /><ChartCard title="School growth" subtitle="Total active schools" values={schoolGrowth} /></section></>;
}

function Support() {
  const priorityTone = { High: "danger", Medium: "warning", Low: "neutral" } as const;
  const statusTone = { Open: "info", "In Progress": "warning", Resolved: "success" } as const;
  return <><PageHeader eyebrow="Customer operations" title="Support Center" description="Track school issues, priority tickets and platform support workload." actions={<Button><Icon name="plus" size={16} /> Create ticket</Button>} /><section className="quick-grid" style={{ marginBottom: 18 }}><div className="surface-card quick-card"><span className="quick-icon"><Icon name="support" /></span><div><strong>14 open tickets</strong><p>4 marked high priority</p></div></div><div className="surface-card quick-card"><span className="quick-icon"><Icon name="clock" /></span><div><strong>1h 42m response</strong><p>Average first response time</p></div></div><div className="surface-card quick-card"><span className="quick-icon"><Icon name="check" /></span><div><strong>96.4% SLA met</strong><p>Across last 30 days</p></div></div></section><section className="surface-card section-card"><div className="section-toolbar"><div><h3>Recent tickets</h3><p>Latest support conversations from schools</p></div><div className="table-search"><Icon name="search" size={15} /><input placeholder="Search tickets..." /></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Ticket</th><th>School</th><th>Issue</th><th>Priority</th><th>Status</th><th>Age</th></tr></thead><tbody>{tickets.map((ticket) => <tr key={ticket.id}><td><strong>{ticket.id}</strong></td><td>{ticket.school}</td><td>{ticket.subject}</td><td><Badge tone={priorityTone[ticket.priority as keyof typeof priorityTone]}>{ticket.priority}</Badge></td><td><Badge tone={statusTone[ticket.status as keyof typeof statusTone]}>{ticket.status}</Badge></td><td>{ticket.age}</td></tr>)}</tbody></table></div></section></>;
}

function AuditLogs() {
  return <><PageHeader eyebrow="Security & compliance" title="Audit Logs" description="Immutable trail of sensitive actions performed across platform and school workspaces." actions={<Button variant="secondary">Export logs</Button>} /><section className="surface-card section-card"><div className="section-toolbar"><div><h3>Platform activity</h3><p>Showing the latest security-relevant events</p></div><div className="table-actions"><div className="table-search"><Icon name="search" size={15} /><input placeholder="Search logs..." /></div><Button variant="secondary">Date filter</Button></div></div><div className="table-wrap"><table className="data-table"><thead><tr><th>Actor</th><th>Action</th><th>Target</th><th>Timestamp</th><th>IP / Source</th></tr></thead><tbody>{auditLogs.map((log, index) => <tr key={`${log.time}-${index}`}><td><div className="entity-cell"><span className="entity-logo"><Icon name={log.actor === "System" ? "settings" : "shield"} size={15} /></span><div><strong>{log.actor}</strong><small>{log.actor === "System" ? "Automated process" : "Authenticated user"}</small></div></div></td><td>{log.action}</td><td>{log.target}</td><td>{log.time}</td><td>{log.ip}</td></tr>)}</tbody></table></div></section></>;
}

function Settings() {
  return <><PageHeader eyebrow="Platform configuration" title="Settings" description="Manage platform identity, operational defaults, security and notification preferences." /><section className="settings-grid"><aside className="surface-card settings-menu"><button className="active"><Icon name="building" size={16} /> General</button><button><Icon name="shield" size={16} /> Security</button><button><Icon name="bell" size={16} /> Notifications</button><button><Icon name="card" size={16} /> Billing</button></aside><div className="surface-card settings-panel"><h3>Platform details</h3><p>These details appear across the Super Admin workspace and system communications.</p><div className="form-grid"><div className="field"><label>Platform name</label><input defaultValue="School ERP" /></div><div className="field"><label>Support email</label><input defaultValue="support@schoolerp.in" /></div><div className="field"><label>Default timezone</label><select defaultValue="Asia/Kolkata"><option>Asia/Kolkata</option><option>UTC</option></select></div><div className="field"><label>Currency</label><select defaultValue="INR"><option>INR — Indian Rupee</option><option>USD — US Dollar</option></select></div><div className="field full"><label>Platform description</label><textarea defaultValue="Multi-school ERP platform for academic, administrative and financial operations." /></div></div><div className="settings-save"><Button>Save changes</Button></div></div></section></>;
}

const pages: Record<string, () => ReactNode> = {
  "/dashboard": Dashboard,
  "/schools": Schools,
  "/administrators": Administrators,
  "/subscriptions": Subscriptions,
  "/plans": Plans,
  "/modules": Modules,
  "/analytics": Analytics,
  "/support": Support,
  "/audit-logs": AuditLogs,
  "/settings": Settings,
};

export default function PlatformPage() {
  const pathname = usePathname();
  const Page = pages[pathname] ?? Dashboard;
  return <Page />;
}
