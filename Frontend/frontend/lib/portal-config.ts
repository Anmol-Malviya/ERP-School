import type { IconName } from "@/components/ui/Icon";

export type PortalRole = "administrator" | "school-admin" | "teacher" | "student" | "parent";
export type NavItem = { label: string; href: string; icon: IconName };

export const roleNames: Record<PortalRole, string> = {
  administrator: "Administrator",
  "school-admin": "School Admin",
  teacher: "Teacher",
  student: "Student",
  parent: "Parent",
};

export const roleUsers: Record<PortalRole, { name: string; subtitle: string; initials: string }> = {
  administrator: { name: "Aarav Sharma", subtitle: "Regional Administrator", initials: "AS" },
  "school-admin": { name: "Neha Verma", subtitle: "School Administrator", initials: "NV" },
  teacher: { name: "Ritika Mehta", subtitle: "Mathematics Teacher", initials: "RM" },
  student: { name: "Arjun Patel", subtitle: "Class 10 · Section A", initials: "AP" },
  parent: { name: "Sanjay Patel", subtitle: "Parent of Arjun Patel", initials: "SP" },
};

export const navByRole: Record<PortalRole, NavItem[]> = {
  administrator: [
    { label: "Dashboard", href: "/administrator/dashboard", icon: "dashboard" },
    { label: "Schools", href: "/administrator/schools", icon: "school" },
    { label: "School Admins", href: "/administrator/school-admins", icon: "users" },
    { label: "Reports", href: "/administrator/reports", icon: "report" },
    { label: "Settings", href: "/administrator/settings", icon: "settings" },
  ],
  "school-admin": [
    { label: "Dashboard", href: "/school-admin/dashboard", icon: "dashboard" },
    { label: "Students", href: "/school-admin/students", icon: "student" },
    { label: "Teachers", href: "/school-admin/teachers", icon: "teacher" },
    { label: "Classes", href: "/school-admin/classes", icon: "school" },
    { label: "Sections", href: "/school-admin/sections", icon: "grid" },
    { label: "Subjects", href: "/school-admin/subjects", icon: "book" },
    { label: "Timetable", href: "/school-admin/timetable", icon: "clock" },
    { label: "Attendance", href: "/school-admin/attendance", icon: "check" },
    { label: "Fees", href: "/school-admin/fees", icon: "wallet" },
    { label: "Examinations", href: "/school-admin/examinations", icon: "exam" },
    { label: "Results", href: "/school-admin/results", icon: "award" },
    { label: "Assignments", href: "/school-admin/assignments", icon: "file" },
    { label: "Notices", href: "/school-admin/notices", icon: "bell" },
    { label: "Calendar", href: "/school-admin/calendar", icon: "calendar" },
    { label: "Settings", href: "/school-admin/settings", icon: "settings" },
  ],
  teacher: [
    { label: "Dashboard", href: "/teacher/dashboard", icon: "dashboard" },
    { label: "My Classes", href: "/teacher/classes", icon: "school" },
    { label: "Attendance", href: "/teacher/attendance", icon: "check" },
    { label: "Timetable", href: "/teacher/timetable", icon: "clock" },
    { label: "Homework", href: "/teacher/homework", icon: "book" },
    { label: "Assignments", href: "/teacher/assignments", icon: "file" },
    { label: "Exams", href: "/teacher/exams", icon: "exam" },
    { label: "Marks", href: "/teacher/marks", icon: "award" },
    { label: "Students", href: "/teacher/students", icon: "student" },
    { label: "Leave", href: "/teacher/leave", icon: "leave" },
    { label: "Notices", href: "/teacher/notices", icon: "bell" },
  ],
  student: [
    { label: "Dashboard", href: "/student/dashboard", icon: "dashboard" },
    { label: "Timetable", href: "/student/timetable", icon: "clock" },
    { label: "Attendance", href: "/student/attendance", icon: "check" },
    { label: "Homework", href: "/student/homework", icon: "book" },
    { label: "Assignments", href: "/student/assignments", icon: "file" },
    { label: "Exams", href: "/student/exams", icon: "exam" },
    { label: "Results", href: "/student/results", icon: "award" },
    { label: "Fees", href: "/student/fees", icon: "wallet" },
    { label: "Notices", href: "/student/notices", icon: "bell" },
    { label: "Calendar", href: "/student/calendar", icon: "calendar" },
  ],
  parent: [
    { label: "Dashboard", href: "/parent/dashboard", icon: "dashboard" },
    { label: "Children", href: "/parent/children", icon: "child" },
    { label: "Attendance", href: "/parent/attendance", icon: "check" },
    { label: "Homework", href: "/parent/homework", icon: "book" },
    { label: "Results", href: "/parent/results", icon: "award" },
    { label: "Fees", href: "/parent/fees", icon: "wallet" },
    { label: "Notices", href: "/parent/notices", icon: "bell" },
    { label: "Leave", href: "/parent/leave", icon: "leave" },
  ],
};

export const dashboardStats: Record<PortalRole, { label: string; value: string; note: string; icon: IconName }[]> = {
  administrator: [
    { label: "Assigned Schools", value: "12", note: "+2 this term", icon: "school" },
    { label: "Total Students", value: "8,426", note: "+6.4% growth", icon: "student" },
    { label: "Teaching Staff", value: "512", note: "96.8% active", icon: "teacher" },
    { label: "Fee Collection", value: "₹1.82Cr", note: "92.6% collected", icon: "wallet" },
  ],
  "school-admin": [
    { label: "Students", value: "1,248", note: "+38 new admissions", icon: "student" },
    { label: "Teachers", value: "76", note: "73 present today", icon: "teacher" },
    { label: "Attendance", value: "94.2%", note: "+1.3% this month", icon: "check" },
    { label: "Fee Collected", value: "₹28.4L", note: "89.4% this term", icon: "wallet" },
  ],
  teacher: [
    { label: "Classes Today", value: "6", note: "Next: 10-A Mathematics", icon: "school" },
    { label: "My Students", value: "184", note: "Across 5 sections", icon: "student" },
    { label: "Attendance", value: "95.8%", note: "This month", icon: "check" },
    { label: "Pending Checks", value: "23", note: "Assignments & marks", icon: "file" },
  ],
  student: [
    { label: "Attendance", value: "94.7%", note: "126 / 133 days", icon: "check" },
    { label: "Assignments", value: "4", note: "2 due this week", icon: "file" },
    { label: "Average Score", value: "86.4%", note: "+3.8% from last exam", icon: "award" },
    { label: "Classes Today", value: "7", note: "Next: Physics Lab", icon: "clock" },
  ],
  parent: [
    { label: "Child Attendance", value: "94.7%", note: "Good standing", icon: "check" },
    { label: "Current Average", value: "86.4%", note: "+3.8% improvement", icon: "award" },
    { label: "Pending Homework", value: "3", note: "1 due tomorrow", icon: "book" },
    { label: "Fee Status", value: "Paid", note: "Next due: Oct 10", icon: "wallet" },
  ],
};
