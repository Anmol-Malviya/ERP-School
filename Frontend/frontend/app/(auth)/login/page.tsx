import Link from "next/link";

const roles = [
  ["Administrator", "/administrator/dashboard"],
  ["School Admin", "/school-admin/dashboard"],
  ["Teacher", "/teacher/dashboard"],
  ["Student", "/student/dashboard"],
  ["Parent", "/parent/dashboard"],
] as const;

export default function LoginPage() {
  return <main className="login-page">
    <section className="login-visual">
      <div className="login-brand"><div className="login-brand-mark">AV</div><div><strong>School ERP</strong><small>Unified Academic Platform</small></div></div>
      <div className="login-copy"><span>Smart school management</span><h1>One school.<br/>One connected system.</h1><p>Bring administrators, teachers, students and parents together with a fast, role-based school ERP experience.</p><div className="login-kpis"><div><strong>1,248</strong><small>Students</small></div><div><strong>94.2%</strong><small>Attendance</small></div><div><strong>76</strong><small>Teachers</small></div></div></div>
      <small style={{color:"#65748b",fontSize:9}}>Prestige Public School · Academic Session 2026–27</small>
    </section>
    <section className="login-form-side"><div className="login-form"><span className="eyebrow">Secure portal access</span><h2>Welcome back</h2><p>Choose your portal and sign in with your school credentials.</p><div className="role-grid">{roles.map(([name,href],i)=><Link key={name} href={href} className={`role-option ${i===1?"active":""}`}>{name}</Link>)}</div><form><div className="login-field"><label>Email / User ID</label><input placeholder="Enter your school ID or email"/></div><div className="login-field"><label>Password</label><input type="password" placeholder="Enter your password"/></div><div className="login-meta"><label><input type="checkbox"/> Remember me</label><a href="#">Forgot password?</a></div><Link href="/school-admin/dashboard" className="btn btn-primary login-button">Sign in to portal →</Link></form><p className="login-help">Demo frontend: role shortcuts above open each portal directly.</p></div></section>
  </main>;
}
