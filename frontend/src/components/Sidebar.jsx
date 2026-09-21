import { NavLink } from "react-router-dom";

// Sidebar navigation for the records section. The active link is driven by
// NavLink rather than local state, so the highlight always matches the URL.
const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/students", label: "Students" },
  { to: "/courses", label: "Courses" },
  { to: "/enrolments", label: "Enrolments" },
  { to: "/categories", label: "Categories" },
];

export default function Sidebar() {
  return (
    <aside className="side">
      <div className="side-brand">
        <div className="side-brand-name">Hinata Institute</div>
      </div>

      <div className="side-label">Records</div>

      <nav className="side-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `side-link${isActive ? " active" : ""}`}
          >
            <span className="side-dot" />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="side-foot">
        Training centre records
        <br />
        Updated 11 Sep 2026
      </div>
    </aside>
  );
}
