import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" />
      <div className="card card-narrow">
        <p style={{ marginTop: 0 }}>
          The page you requested does not exist.
        </p>
        <Link className="btn" to="/">
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
