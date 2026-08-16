export const platformStats = [
  { label: "Total Schools", value: "148", change: "+12 this month", icon: "school" as const },
  { label: "Active Students", value: "42,680", change: "+8.4% growth", icon: "student" as const },
  { label: "Teachers", value: "3,284", change: "+94 this month", icon: "teacher" as const },
  { label: "Monthly Revenue", value: "₹8.42L", change: "+14.2% vs last month", icon: "revenue" as const },
];

export const schools = [
  { name: "Prestige Public School", code: "PPS-IND-001", city: "Indore", students: 1840, plan: "Enterprise", status: "Active", renewal: "28 Sep 2026" },
  { name: "Sage International School", code: "SIS-BPL-014", city: "Bhopal", students: 1296, plan: "Pro", status: "Active", renewal: "12 Oct 2026" },
  { name: "Green Valley Academy", code: "GVA-JBP-032", city: "Jabalpur", students: 864, plan: "Standard", status: "Trial", renewal: "23 Aug 2026" },
  { name: "DPS Horizon Campus", code: "DPS-UJN-041", city: "Ujjain", students: 2184, plan: "Enterprise", status: "Active", renewal: "01 Nov 2026" },
  { name: "Cambridge Scholars", code: "CSC-IND-052", city: "Indore", students: 612, plan: "Pro", status: "Suspended", renewal: "15 Aug 2026" },
];

export const administrators = [
  { name: "Rohit Sharma", email: "rohit.sharma@erp.test", schools: 12, zone: "Indore Cluster", status: "Active", lastLogin: "10 min ago" },
  { name: "Megha Verma", email: "megha.verma@erp.test", schools: 9, zone: "Bhopal Cluster", status: "Active", lastLogin: "1 hr ago" },
  { name: "Arjun Patel", email: "arjun.patel@erp.test", schools: 7, zone: "Jabalpur Cluster", status: "Active", lastLogin: "Yesterday" },
  { name: "Neha Singh", email: "neha.singh@erp.test", schools: 5, zone: "Ujjain Cluster", status: "Inactive", lastLogin: "8 days ago" },
];

export const plans = [
  { name: "Starter", price: "₹1,999", period: "/month", schools: 26, color: "#64748b", features: ["Up to 500 students", "Core academics", "Attendance & notices", "Email support"] },
  { name: "Pro", price: "₹4,999", period: "/month", schools: 78, color: "#2563eb", features: ["Up to 2,000 students", "Fees & examinations", "Parent portal", "Priority support"] },
  { name: "Enterprise", price: "Custom", period: "", schools: 44, color: "#7c3aed", features: ["Unlimited students", "All modules", "Custom branding", "Dedicated support"] },
];

export const modules = [
  { name: "Student Management", key: "students", enabled: 148, description: "Admissions, profiles, promotion and lifecycle" },
  { name: "Attendance", key: "attendance", enabled: 146, description: "Daily attendance, corrections and reports" },
  { name: "Fees & Billing", key: "fees", enabled: 131, description: "Structures, dues, receipts and collections" },
  { name: "Exams & Results", key: "exams", enabled: 139, description: "Exam setup, marks, grades and report cards" },
  { name: "Timetable", key: "timetable", enabled: 142, description: "Classes, teachers, labs and clash control" },
  { name: "Notifications", key: "notifications", enabled: 118, description: "Announcements, alerts and reminders" },
];

export const tickets = [
  { id: "#SUP-1048", school: "Green Valley Academy", subject: "Student bulk import failing", priority: "High", status: "Open", age: "18 min" },
  { id: "#SUP-1047", school: "Prestige Public School", subject: "Fee receipt template update", priority: "Medium", status: "In Progress", age: "1 hr" },
  { id: "#SUP-1046", school: "Sage International School", subject: "Parent login issue", priority: "High", status: "Resolved", age: "3 hrs" },
  { id: "#SUP-1045", school: "DPS Horizon Campus", subject: "Need additional admin seat", priority: "Low", status: "Open", age: "Yesterday" },
];

export const auditLogs = [
  { actor: "Super Admin", action: "School activated", target: "Green Valley Academy", time: "16 Aug, 20:05", ip: "103.87.22.14" },
  { actor: "Rohit Sharma", action: "School admin invited", target: "Prestige Public School", time: "16 Aug, 19:42", ip: "49.36.18.91" },
  { actor: "System", action: "Subscription renewed", target: "Sage International School", time: "16 Aug, 18:10", ip: "Automated" },
  { actor: "Super Admin", action: "Module disabled", target: "Cambridge Scholars / Fees", time: "16 Aug, 17:24", ip: "103.87.22.14" },
];

export const revenueSeries = [42, 48, 45, 58, 61, 67, 64, 72, 76, 81, 78, 88];
export const schoolGrowth = [84, 91, 99, 108, 116, 121, 129, 136, 140, 143, 145, 148];
