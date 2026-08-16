"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { dashboardStats, roleNames, type PortalRole } from "@/lib/portal-config";

function getRole(pathname: string): PortalRole {
  if (pathname.startsWith("/administrator")) return "administrator";
  if (pathname.startsWith("/teacher")) return "teacher";
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/parent")) return "parent";
  return "school-admin";
}

const labels: Record<string, string> = {
  dashboard: "Dashboard", schools: "Schools", "school-admins": "School Administrators", reports: "Reports", settings: "Settings",
  students: "Students", teachers: "Teachers", classes: "Classes", sections: "Sections", subjects: "Subjects", timetable: "Timetable",
  attendance: "Attendance", fees: "Fees & Payments", examinations: "Examinations", exams: "Examinations", results: "Results",
  assignments: "Assignments", homework: "Homework", notices: "Notices", calendar: "Academic Calendar", marks: "Marks Entry",
  leave: "Leave Management", children: "My Children"
};

const descriptions: Record<string, string> = {
  schools: "Manage assigned schools, status and operational overview.", "school-admins": "Manage school administrators and their access.",
  students: "Manage admissions, profiles, class allocation and student records.", teachers: "Manage faculty profiles, subject allocation and workload.",
  classes: "Organize classes and academic groups for the active session.", sections: "Manage sections, capacities and class teachers.", subjects: "Configure subjects and teacher mappings.",
  timetable: "View and manage the weekly academic schedule.", attendance: "Track daily attendance and monthly performance.", fees: "Monitor fee collection, dues, receipts and payment status.",
  examinations: "Create exams, schedules and assessment structures.", exams: "View upcoming examinations and schedules.", results: "Review academic results and performance.",
  assignments: "Create, track and review student assignments.", homework: "Track homework, deadlines and completion.", notices: "Publish and review school announcements.",
  calendar: "View holidays, exams, PTMs and school events.", marks: "Enter and review examination marks.", leave: "Submit and track leave requests.",
  children: "View linked children and their academic overview.", reports: "Review consolidated school performance and operational reports.", settings: "Manage portal preferences and school configuration."
};

const rowsByModule: Record<string, string[][]> = {
  schools: [["Prestige Public School", "Indore", "1,248", "Active"], ["Sunrise Academy", "Bhopal", "986", "Active"], ["Greenfield School", "Ujjain", "742", "Active"], ["Scholars International", "Dewas", "1,106", "Review"]],
  "school-admins": [["Neha Verma", "Prestige Public School", "neha@school.in", "Active"], ["Karan Joshi", "Sunrise Academy", "karan@school.in", "Active"], ["Pooja Singh", "Greenfield School", "pooja@school.in", "Active"]],
  students: [["Aarav Mehta", "10-A", "STU-1042", "94.8%"], ["Ishita Jain", "10-A", "STU-1043", "97.2%"], ["Kabir Shah", "9-B", "STU-0984", "91.6%"], ["Myra Kapoor", "8-A", "STU-0876", "95.4%"], ["Vivaan Rao", "7-C", "STU-0761", "89.7%"]],
  teachers: [["Ritika Mehta", "Mathematics", "10-A, 10-B", "Present"], ["Amit Sharma", "Physics", "9-A, 10-A", "Present"], ["Sneha Kapoor", "English", "8-A, 9-B", "On Leave"], ["Rahul Jain", "Computer Science", "9-A, 10-B", "Present"]],
  classes: [["Class 10", "A, B, C", "184 students", "6 subjects"], ["Class 9", "A, B, C", "176 students", "6 subjects"], ["Class 8", "A, B", "128 students", "7 subjects"], ["Class 7", "A, B, C", "169 students", "7 subjects"]],
  sections: [["10-A", "42 / 45", "Ritika Mehta", "Room 301"], ["10-B", "44 / 45", "Amit Sharma", "Room 302"], ["9-A", "41 / 45", "Rahul Jain", "Room 204"], ["9-B", "39 / 45", "Sneha Kapoor", "Room 205"]],
  subjects: [["Mathematics", "MAT-10", "Ritika Mehta", "6 periods/week"], ["Physics", "PHY-10", "Amit Sharma", "5 periods/week"], ["English", "ENG-10", "Sneha Kapoor", "5 periods/week"], ["Computer Science", "CS-10", "Rahul Jain", "4 periods/week"]],
  attendance: [["10-A", "42", "40", "95.2%"], ["10-B", "44", "41", "93.2%"], ["9-A", "41", "39", "95.1%"], ["9-B", "39", "35", "89.7%"]],
  fees: [["Aarav Mehta", "10-A", "₹32,500", "Paid"], ["Ishita Jain", "10-A", "₹32,500", "Paid"], ["Kabir Shah", "9-B", "₹28,000", "₹7,000 due"], ["Myra Kapoor", "8-A", "₹25,500", "Paid"]],
  examinations: [["Unit Test 2", "Classes 6–10", "22 Aug – 27 Aug", "Published"], ["Half Yearly", "Classes 1–12", "08 Oct – 19 Oct", "Draft"], ["Practical Assessment", "Classes 9–12", "02 Sep – 06 Sep", "Scheduled"]],
  exams: [["Mathematics", "20 Aug", "09:00 AM", "Room 301"], ["Science", "22 Aug", "09:00 AM", "Lab Block"], ["English", "24 Aug", "09:00 AM", "Room 301"]],
  results: [["Mathematics", "92 / 100", "A1", "Excellent"], ["Science", "86 / 100", "A2", "Very Good"], ["English", "81 / 100", "A2", "Very Good"], ["Social Science", "87 / 100", "A2", "Very Good"]],
  assignments: [["Quadratic Equations", "Mathematics", "18 Aug", "32 / 42 submitted"], ["Light & Reflection", "Physics", "20 Aug", "28 / 41 submitted"], ["Essay Writing", "English", "21 Aug", "36 / 39 submitted"]],
  homework: [["Exercise 6.3", "Mathematics", "Tomorrow", "Pending"], ["Chapter 8 Notes", "Science", "19 Aug", "In Progress"], ["Grammar Worksheet", "English", "20 Aug", "Completed"]],
  notices: [["PTM scheduled for Saturday", "All Parents", "Today", "Published"], ["Half Yearly Exam Registration", "Classes 9–12", "Yesterday", "Published"], ["Independence Day Celebration", "Whole School", "12 Aug", "Published"]],
  leave: [["Medical Leave", "18 Aug – 19 Aug", "2 days", "Pending"], ["Personal Leave", "03 Jul", "1 day", "Approved"], ["Medical Leave", "21 Jun – 22 Jun", "2 days", "Approved"]],
  children: [["Arjun Patel", "Class 10-A", "94.7% attendance", "86.4% average"], ["Aanya Patel", "Class 6-B", "96.1% attendance", "91.2% average"]],
};

const headersByModule: Record<string, string[]> = {
  schools: ["School", "City", "Students", "Status"], "school-admins": ["Administrator", "School", "Email", "Status"],
  students: ["Student", "Class", "Admission No.", "Attendance"], teachers: ["Teacher", "Subject", "Classes", "Today"], classes: ["Class", "Sections", "Strength", "Curriculum"],
  sections: ["Section", "Strength", "Class Teacher", "Room"], subjects: ["Subject", "Code", "Teacher", "Load"], attendance: ["Class", "Enrolled", "Present", "Attendance"],
  fees: ["Student", "Class", "Term Fee", "Status"], examinations: ["Exam", "Scope", "Dates", "Status"], exams: ["Subject", "Date", "Time", "Venue"], results: ["Subject", "Marks", "Grade", "Remark"],
  assignments: ["Assignment", "Subject", "Due Date", "Status"], homework: ["Homework", "Subject", "Due", "Status"], notices: ["Notice", "Audience", "Date", "Status"],
  leave: ["Type", "Dates", "Duration", "Status"], children: ["Child", "Class", "Attendance", "Performance"]
};

function Dashboard({ role }: { role: PortalRole }) {
  const stats = dashboardStats[role];
  return <>
    <div className="page-heading"><div><span className="eyebrow">{roleNames[role]} workspace</span><h1>Good evening 👋</h1><p>Here’s what is happening at Prestige Public School today.</p></div><div className="page-actions"><button className="btn btn-secondary"><Icon name="download" size={15}/> Export</button><button className="btn btn-primary"><Icon name="plus" size={15}/> Quick action</button></div></div>
    <section className="portal-stats">{stats.map((s) => <article className="stat-card" key={s.label}><div className="stat-card-top"><span className="stat-icon"><Icon name={s.icon}/></span><span className="stat-note">{s.note}</span></div><div><p>{s.label}</p><strong>{s.value}</strong></div></article>)}</section>
    <section className="dashboard-layout">
      <div className="panel schedule-panel"><div className="panel-head"><div><span className="eyebrow">Today</span><h2>{role === "student" || role === "teacher" ? "Today's schedule" : "Academic activity"}</h2></div><button className="link-button">View full timetable →</button></div>
        <div className="timeline">
          {[ ["09:00", "Mathematics", "Class 10-A", "Room 301"], ["10:00", "Physics", "Class 10-A", "Science Lab"], ["11:30", "English", "Class 10-A", "Room 301"], ["12:30", "Lunch Break", "Campus", "30 min"], ["01:15", "Computer Science", "Class 10-A", "Computer Lab"] ].map((x,i)=><div className={`timeline-row ${i===1 ? "current" : ""}`} key={x[0]}><div className="time-cell"><strong>{x[0]}</strong><small>{i < 3 ? "AM" : "PM"}</small></div><span className="timeline-dot"/><div className="timeline-copy"><strong>{x[1]}</strong><small>{x[2]}</small></div><span className="room-chip">{x[3]}</span></div>)}
        </div>
      </div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">Updates</span><h2>Recent notices</h2></div><button className="link-button">View all</button></div>
        <div className="notice-list"><div className="notice-item"><span className="notice-icon blue"><Icon name="bell" size={16}/></span><div><strong>PTM scheduled for Saturday</strong><p>Parents of Classes 9–12 are invited.</p><small>20 min ago</small></div></div><div className="notice-item"><span className="notice-icon amber"><Icon name="exam" size={16}/></span><div><strong>Exam registration open</strong><p>Half yearly assessment forms are live.</p><small>2 hours ago</small></div></div><div className="notice-item"><span className="notice-icon green"><Icon name="wallet" size={16}/></span><div><strong>Fee collection updated</strong><p>Term 1 collection reached 89.4%.</p><small>Yesterday</small></div></div></div>
      </div>
    </section>
    <section className="dashboard-layout lower"><div className="panel"><div className="panel-head"><div><span className="eyebrow">Performance</span><h2>Attendance trend</h2></div><span className="muted-label">Last 6 months</span></div><div className="bar-chart">{[88,91,90,94,93,96].map((v,i)=><div className="bar-col" key={i}><div className="bar-track"><span style={{height:`${v}%`}}/></div><small>{["Mar","Apr","May","Jun","Jul","Aug"][i]}</small></div>)}</div></div>
      <div className="panel"><div className="panel-head"><div><span className="eyebrow">Quick view</span><h2>Upcoming events</h2></div></div><div className="event-list"><div><strong>18</strong><span>Aug</span><p>Science Exhibition<small>Main Auditorium</small></p></div><div><strong>22</strong><span>Aug</span><p>Unit Test 2 begins<small>Classes 6–10</small></p></div><div><strong>29</strong><span>Aug</span><p>Parent Teacher Meeting<small>09:00 AM – 01:00 PM</small></p></div></div></div>
    </section>
  </>;
}

function SettingsView() {
  return <div className="settings-grid"><div className="panel settings-card"><span className="settings-icon"><Icon name="school"/></span><div><h3>School profile</h3><p>Name, board, contact, address and branding information.</p><button className="btn btn-secondary">Manage profile</button></div></div><div className="panel settings-card"><span className="settings-icon"><Icon name="calendar"/></span><div><h3>Academic session</h3><p>Current session, terms, working days and holidays.</p><button className="btn btn-secondary">Configure session</button></div></div><div className="panel settings-card"><span className="settings-icon"><Icon name="bell"/></span><div><h3>Notifications</h3><p>Control email, portal and parent notification preferences.</p><button className="btn btn-secondary">Notification rules</button></div></div><div className="panel settings-card"><span className="settings-icon"><Icon name="settings"/></span><div><h3>Permissions</h3><p>Role permissions and access policies for school users.</p><button className="btn btn-secondary">View permissions</button></div></div></div>;
}

function CalendarView() {
  const days = Array.from({length:35},(_,i)=>i<3?"":String(i-2));
  return <div className="panel calendar-panel"><div className="calendar-toolbar"><button>‹</button><h2>August 2026</h2><button>›</button></div><div className="calendar-grid">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=><strong key={d}>{d}</strong>)}{days.map((d,i)=><div className={`calendar-day ${d==="16"?"today":""}`} key={i}>{d && <span>{d}</span>}{d==="18"&&<small className="event-blue">Science Expo</small>}{d==="22"&&<small className="event-amber">Unit Test</small>}{d==="29"&&<small className="event-green">PTM</small>}</div>)}</div></div>;
}

export default function PortalPage() {
  const pathname = usePathname();
  const role = getRole(pathname);
  const module = pathname.split("/").filter(Boolean).pop() || "dashboard";
  if (module === "dashboard") return <Dashboard role={role}/>;
  const title = labels[module] || module.replaceAll("-", " ");
  const description = descriptions[module] || `Manage ${title.toLowerCase()} for the active academic session.`;
  const rows = rowsByModule[module];
  const headers = headersByModule[module];

  return <>
    <div className="page-heading"><div><span className="eyebrow">{roleNames[role]} · 2026–27</span><h1>{title}</h1><p>{description}</p></div><div className="page-actions"><button className="btn btn-secondary"><Icon name="download" size={15}/> Export</button>{!["student","parent"].includes(role) && <button className="btn btn-primary"><Icon name="plus" size={15}/> Add new</button>}</div></div>
    {module === "settings" ? <SettingsView/> : module === "calendar" ? <CalendarView/> : module === "reports" ? <><section className="portal-stats">{dashboardStats.administrator.map(s=><article className="stat-card" key={s.label}><div className="stat-card-top"><span className="stat-icon"><Icon name={s.icon}/></span><span className="stat-note">Live</span></div><div><p>{s.label}</p><strong>{s.value}</strong></div></article>)}</section><div className="panel report-panel"><div className="panel-head"><div><span className="eyebrow">Consolidated analytics</span><h2>School performance overview</h2></div></div><div className="report-bars">{[72,86,91,78,94,88,83,96,89,92,85,90].map((v,i)=><div key={i}><span style={{height:`${v}%`}}/><small>S{i+1}</small></div>)}</div></div></> : rows && headers ? <div className="panel data-panel"><div className="table-toolbar"><div className="table-search"><Icon name="search" size={15}/><input placeholder={`Search ${title.toLowerCase()}...`}/></div><select><option>All records</option><option>Active</option><option>Pending</option></select><button className="btn btn-secondary">Filters</button></div><div className="table-scroll"><table><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}<th>Action</th></tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{j===row.length-1?<span className={`status-pill ${cell.toLowerCase().includes("paid")||cell.toLowerCase().includes("active")||cell.toLowerCase().includes("present")||cell.toLowerCase().includes("approved")||cell.toLowerCase().includes("published")?"success":cell.toLowerCase().includes("pending")||cell.toLowerCase().includes("review")||cell.toLowerCase().includes("due")?"warning":"neutral"}`}>{cell}</span>:cell}</td>)}<td><button className="row-action">•••</button></td></tr>)}</tbody></table></div><div className="table-footer"><span>Showing {rows.length} records</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>›</button></div></div></div> : <div className="panel empty-module"><span><Icon name="file" size={28}/></span><h2>{title}</h2><p>This module is ready for backend integration.</p><button className="btn btn-primary">Create first record</button></div>}
  </>;
}
