import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

// Application shell. Each route renders into the Outlet, and because this
// component does not unmount during navigation, the navbar stays put.
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
