// A single figure on the dashboard. The accent prop selects the coloured top border: students, courses, enrol or cats.
export default function StatCard({ label, value, note, accent = "" }) {
  return (
    <div className={`stat-card${accent ? ` accent-${accent}` : ""}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {note && <div className="stat-note">{note}</div>}
    </div>
  );
}
