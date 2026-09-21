import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import PageHeader from "../components/PageHeader.jsx";
import StateBlock from "../components/StateBlock.jsx";
import { formatCurrency, formatNumber } from "../utils/format.js";

// Dashboard. Every figure comes from GET /api/dashboard/stats, which computes them in SQL.
//
// Two deliberate omissions, both learned from reviewing the design: the stat figures carry no explanatory notes, because the ones we had said nothing useful, and there is no running count under the title, because it repeated the stat band a few millimetres below it.
export default function Dashboard() {
  const { data: stats, loading, error, reload } = useFetch(getDashboardStats);

  // Derived before any early return so hook order stays stable.
  const popular = stats?.popular_courses ?? [];
  const maxEnrolments = popular.reduce(
    (max, course) => Math.max(max, Number(course.enrolment_count) || 0),
    0
  );

  if (loading || error) {
    return (
      <div className="content">
        <PageHeader title="Dashboard" />
        <StateBlock loading={loading} error={error} onRetry={reload} />
      </div>
    );
  }

  const total = Number(stats?.total_enrolments) || 0;
  const active = Number(stats?.active_enrolments) || 0;
  const completed = Number(stats?.completed_enrolments) || 0;
  const cancelled = Number(stats?.cancelled_enrolments) || 0;
  const courseCount = Number(stats?.total_courses) || 0;
  const average = courseCount > 0 ? (total / courseCount).toFixed(1) : "—";

  const share = (value) => (total > 0 ? Math.round((value / total) * 100) : 0);

  const statuses = [
    { label: "Active", value: active, colour: "var(--teal-mid)" },
    { label: "Completed", value: completed, colour: "var(--ok-light)" },
    { label: "Cancelled", value: cancelled, colour: "var(--clay)" },
  ];

  return (
    <div className="content">
      <PageHeader title="Dashboard" />

      <section className="stat-band">
        <div className="stat">
          <div className="stat-label">Students</div>
          <div className="stat-row">
            <div className="stat-value">{formatNumber(stats?.total_students)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Courses</div>
          <div className="stat-row">
            <div className="stat-value">{formatNumber(courseCount)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Enrolments</div>
          <div className="stat-row">
            <div className="stat-value">{formatNumber(total)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Avg per course</div>
          <div className="stat-row">
            <div className="stat-value">{average}</div>
            <div className="stat-unit">students</div>
          </div>
        </div>
      </section>

      <div className="cols">
        <div className="col col-a">
          <div className="sec-head">
            <div className="sec-title">Enrolments by status</div>
            <div className="sec-meta">{formatNumber(total)} total</div>
          </div>
          <div className="rows">
            {statuses.map((item) => (
              <div className="row" key={item.label}>
                <div className="row-top">
                  <div className="row-name">{item.label}</div>
                  <div className="row-count">
                    <strong>{formatNumber(item.value)}</strong>
                    <span className="row-pct">{share(item.value)}%</span>
                  </div>
                </div>
                <div className="track">
                  <div
                    className="fill"
                    style={{ background: item.colour, width: `${share(item.value)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col col-b">
          <div className="sec-head">
            <div className="sec-title">Popular courses</div>
            <div className="sec-meta">by enrolments</div>
          </div>
          <div>
            {popular.map((course, index) => {
              const count = Number(course.enrolment_count) || 0;
              const width = maxEnrolments > 0 ? (count / maxEnrolments) * 100 : 0;
              return (
                <div className="pop-row" key={course.course_id}>
                  <div className="pop-rank">{String(index + 1).padStart(2, "0")}</div>
                  <div className="pop-name">
                    <Link to={`/courses/${course.course_id}`}>{course.course_name}</Link>
                  </div>
                  <div className="pop-track">
                    <div className="pop-fill" style={{ width: `${width}%` }} />
                  </div>
                  <div className="pop-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="panel">
        <div className="panel-label">Revenue earned</div>
        <div className="panel-value">{formatCurrency(stats?.total_revenue)}</div>
        <div className="panel-split">
          <div>
            <div className="panel-split-label">Completions</div>
            <div className="panel-split-value">{formatNumber(completed)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
