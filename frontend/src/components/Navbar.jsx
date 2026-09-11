import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/students", label: "Students" },
  { to: "/courses", label: "Courses" },
  { to: "/enrolments", label: "Enrolments" },
  { to: "/categories", label: "Categories" },
];

// Main navigation. NavLink applies the active class to whichever route is
// current, so the highlight comes from the router rather than from state here.
export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="app-nav">
      <div className="app-nav-inner">
        <Link to="/" className="app-brand" onClick={() => setOpen(false)}>
          <span className="app-brand-mark">CMS</span>
          <span>Course Management</span>
        </Link>

        <button
          type="button"
          className="app-nav-toggle"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>

        <div className={`app-nav-links${open ? " open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `app-nav-link${isActive ? " active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
