import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

/**
 * Application shell.
 *
 * The navbar and the page container live here, and each route renders into the
 * <Outlet />. Because this component does not unmount during navigation, the
 * navigation bar stays put while the page content changes.
 */
export default function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
