import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import StateBlock from "../components/StateBlock.jsx";
import { formatCurrency, formatNumber } from "../utils/format.js";

// Dashboard. Every figure on this page is returned by GET /api/dashboard/stats,
// which computes them in SQL. Nothing here is hardcoded or counted in the
// browser.
export default function Dashboard() {
  const { data: stats, loading, error, reload } = useFetch(getDashboardStats);

  // Derived before any early return so the hook order stays stable.
  const popularCourses = stats?.popular_courses || [];
  const maxEnrolments = popularCourses.reduce(
    (max, course) => Math.max(max, Number(course.enrolment_count) || 0),
    0
  );

  if (loading || error) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="Overview of the course management system" />
        <StateBlock loading={loading} error={error} onRetry={reload} />
      </>
    );
  }

  const totalEnrolments = Number(stats?.total_enrolments) || 0;
  const active = Number(stats?.active_enrolments) || 0;
  const completed = Number(stats?.completed_enrolments) || 0;
  const cancelled = Number(stats?.cancelled_enrolments) || 0;

  const percent = (value) =>
    totalEnrolments > 0 ? Math.round((value / totalEnrolments) * 100) : 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of the course management system"
      />

      <div className="stat-grid">
        <StatCard label="Students" value={formatNumber(stats?.total_students)} accent="students" />
        <StatCard label="Courses" value={formatNumber(stats?.total_courses)} accent="courses" />
        <StatCard label="Enrolments" value={formatNumber(totalEnrolments)} accent="enrol" />
        <StatCard label="Categories" value={formatNumber(stats?.total_categories)} accent="cats" />
      </div>

      <div className="card">
        <h2 className="card-title">Enrolments by status</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Status</th>
                <th className="num">Enrolments</th>
                <th className="num">Share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="badge badge-active">Active</span></td>
                <td className="num">{formatNumber(active)}</td>
                <td className="num">{percent(active)}%</td>
              </tr>
              <tr>
                <td><span className="badge badge-completed">Completed</span></td>
                <td className="num">{formatNumber(completed)}</td>
                <td className="num">{percent(completed)}%</td>
              </tr>
              <tr>
                <td><span className="badge badge-cancelled">Cancelled</span></td>
                <td className="num">{formatNumber(cancelled)}</td>
                <td className="num">{percent(cancelled)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Popular courses</h2>
        {popularCourses.length === 0 ? (
          <p className="muted">No enrolments recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Course</th>
                  <th className="num">Enrolments</th>
                  <th style={{ width: "30%" }}>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {popularCourses.map((course) => {
                  const count = Number(course.enrolment_count) || 0;
                  const width = maxEnrolments > 0 ? (count / maxEnrolments) * 100 : 0;
                  return (
                    <tr key={course.course_id}>
                      <td>
                        <Link to={`/courses/${course.course_id}`}>{course.course_name}</Link>
                      </td>
                      <td className="num">{formatNumber(count)}</td>
                      <td>
                        <div className="bar-track">
                          <div className="bar-fill" style={{ width: `${width}%` }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Course revenue</h2>
        <p className="stat-value">{formatCurrency(stats?.total_revenue)}</p>
        <p className="muted" style={{ margin: 0 }}>
          Total value of all courses currently in the catalogue.
        </p>
      </div>
    </>
  );
}
