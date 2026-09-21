import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

// Reached by typing an address that does not exist. Rendered inside the normal
// page container so it keeps the sidebar, the top bar and the same spacing as
// every other screen rather than dropping the user onto a bare page.
export default function NotFound() {
  return (
    <div className="content">
      <PageHeader title="Page not found" />
      <div className="table">
        <div className="state">
          <div className="state-title">That page does not exist</div>
          <div>Check the address, or use the navigation to find what you were after.</div>
          <Link className="btn" to="/" style={{ marginTop: 16, display: "inline-flex" }}>
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
