import { useParams, Link } from "react-router-dom";
import { getCourse, getCourseStudents } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import PageHeader from "../components/PageHeader.jsx";
import StateBlock from "../components/StateBlock.jsx";
import { formatDate, formatNumber } from "../utils/format.js";

// One course and the students enrolled on it. The route parameter arrives as a
// string, so it is passed through as-is to the API rather than compared against
// an integer anywhere.

const STATUS_CLASS = {
  Active: "badge-teal",
  Completed: "badge-ok",
  Cancelled: "badge-muted",
};

export default function CourseDetails() {
  const { id } = useParams();
  const { data: course, loading, error, reload } = useFetch(
    () => getCourse(id)
  );
  const { data: students, loading: studentsLoading, error: studentsError } =
    useFetch(() => getCourseStudents(id));

  const enrolled = students ?? [];

  if (loading || error) {
    return (
      <div className="content">
        <PageHeader title="Course" subtitle="Course details" />
        <StateBlock loading={loading} error={error} onRetry={reload} />
      </div>
    );
  }

  const money = (value) => {
    const [whole, cents] = Number(value || 0).toFixed(2).split(".");
    return `MUR ${formatNumber(whole)}.${cents}`;
  };

  return (
    <div className="content">
      <PageHeader
        title={course.course_name}
        subtitle={course.description || "No description recorded for this course."}
      >
        <Link to="/courses" className="btn btn-ghost">Back to courses</Link>
      </PageHeader>

      <section className="stat-band">
        <div className="stat">
          <div className="stat-label">Category</div>
          <div className="stat-row">
            <div className="stat-value" style={{ fontSize: 20 }}>
              {course.category_name}
            </div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Duration</div>
          <div className="stat-row">
            <div className="stat-value">{course.duration}</div>
            <div className="stat-unit">weeks</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Price</div>
          <div className="stat-row">
            <div className="stat-value" style={{ fontSize: 26 }}>{money(course.price)}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Enrolled</div>
          <div className="stat-row">
            <div className="stat-value">{formatNumber(course.enrolment_count)}</div>
            <div className="stat-unit">students</div>
          </div>
        </div>
      </section>

      <div className="sec-head">
        <div className="sec-title">Students on this course</div>
        <div className="sec-meta">{formatNumber(enrolled.length)} enrolled</div>
      </div>

      {studentsLoading || studentsError || enrolled.length === 0 ? (
        <div className="table">
          <div className="state">
            {studentsLoading && <><div className="spinner" /><div className="state-title">Loading students</div></>}
            {studentsError && (
              <><div className="state-title">Could not load students</div><div>{studentsError}</div></>
            )}
            {!studentsLoading && !studentsError && (
              <>
                <div className="state-title">Nobody is enrolled yet</div>
                <div>Add an enrolment to put a student on this course.</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="tr head">
            <div className="th" style={{ width: 72, paddingLeft: 20 }}>ID</div>
            <div className="th" style={{ width: 220 }}>Student</div>
            <div className="th" style={{ flex: 1, minWidth: 0 }}>Email</div>
            <div className="th" style={{ width: 160 }}>Enrolled</div>
            <div className="th" style={{ width: 130, paddingRight: 20 }}>Status</div>
          </div>

          {enrolled.map((student) => (
            <div className="tr" key={student.enrolment_id}>
              <div className="td cell-id" style={{ width: 72, paddingLeft: 20 }}>{student.student_id}</div>
              <div className="td cell-name" style={{ width: 220 }}>{student.name}</div>
              <div className="td cell-text" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {student.email}
              </div>
              <div className="td cell-text" style={{ width: 160 }}>{formatDate(student.enrolment_date)}</div>
              <div className="td" style={{ width: 130, paddingRight: 20 }}>
                <span className={`badge ${STATUS_CLASS[student.status] ?? "badge-muted"}`}>
                  {student.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
