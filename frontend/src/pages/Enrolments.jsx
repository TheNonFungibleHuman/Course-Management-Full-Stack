import { useMemo, useState } from "react";
import {
  getEnrolmentDetails,
  getStudents,
  getCourses,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment,
} from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import useForm from "../hooks/useForm.js";
import { validateEnrolment, ENROLMENT_STATUSES } from "../utils/validation.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import FormField from "../components/FormField.jsx";
import Toaster, { useToasts } from "../components/Toast.jsx";
import { formatDate, today } from "../utils/format.js";

// Enrolments list. The table reads from the joined endpoint so it shows student and course names rather than bare IDs, and the status badge is the only coloured element in a row so state can be scanned without reading every cell.
const EMPTY_ENROLMENT = {
  student_id: "",
  course_id: "",
  enrolment_date: "",
  status: "Active",
};

const STATUS_CLASS = {
  Active: "badge-teal",
  Completed: "badge-ok",
  Cancelled: "badge-muted",
};

export default function Enrolments() {
  const { data: details, loading, error, reload } = useFetch(getEnrolmentDetails);
  const { data: students } = useFetch(getStudents);
  const { data: courses } = useFetch(getCourses);
  const toasts = useToasts();

  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = details ?? [];
  const studentList = students ?? [];
  const courseList = courses ?? [];

  const form = useForm({
    initialValues: { ...EMPTY_ENROLMENT, enrolment_date: today() },
    validate: validateEnrolment,
    onSubmit: async (values) => {
      const payload = {
        student_id: Number(values.student_id),
        course_id: Number(values.course_id),
        enrolment_date: values.enrolment_date,
        status: values.status,
      };
      if (editing) await updateEnrolment(editing.enrolment_id, payload);
      else await createEnrolment(payload);
    },
    onSuccess: () => {
      setFormOpen(false);
      reload();
      toasts.success(editing ? "Enrolment updated." : "Enrolment added.");
    },
    onError: (err) => toasts.error(err.message),
  });

  const counts = useMemo(
    () => ({
      all: rows.length,
      Active: rows.filter((r) => r.status === "Active").length,
      Completed: rows.filter((r) => r.status === "Completed").length,
      Cancelled: rows.filter((r) => r.status === "Cancelled").length,
    }),
    [rows]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!needle) return true;
      return (
        row.student_name.toLowerCase().includes(needle) ||
        row.course_name.toLowerCase().includes(needle)
      );
    });
  }, [rows, statusFilter, query]);

  function openAdd() {
    setEditing(null);
    form.reset({ ...EMPTY_ENROLMENT, enrolment_date: today() });
    setFormOpen(true);
  }

  function openEdit(row) {
    setEditing(row);
    form.reset({
      student_id: String(row.student_id),
      course_id: String(row.course_id),
      enrolment_date: String(row.enrolment_date).slice(0, 10),
      status: row.status,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function confirmDelete() {
    const target = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteEnrolment(target.enrolment_id);
      reload();
      toasts.success("Enrolment removed.");
    } catch (err) {
      toasts.error(err.message);
    }
  }

  return (
    <div className="content">
      <PageHeader title="Enrolments">
        <button type="button" className="btn" onClick={openAdd}>Add enrolment</button>
      </PageHeader>

      <div className="toolbar">
        <div className="chips">
          <button
            type="button"
            className={`chip${statusFilter === "all" ? " active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All {counts.all}
          </button>
          {ENROLMENT_STATUSES.map((status) => (
            <button
              key={status}
              type="button"
              className={`chip${statusFilter === status ? " active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status} {counts[status]}
            </button>
          ))}
        </div>

        <div className="search">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="var(--ink-muted)" strokeWidth="1.6" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="var(--ink-muted)" strokeWidth="1.6" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search student or course"
            aria-label="Search enrolments"
          />
        </div>
      </div>

      {loading || error || visible.length === 0 ? (
        <div className="table">
          <div className="state">
            {loading && (<><div className="spinner" /><div className="state-title">Loading enrolments</div></>)}
            {error && (
              <>
                <div className="state-title">Could not load enrolments</div>
                <div>{error}</div>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 12 }} onClick={reload}>
                  Try again
                </button>
              </>
            )}
            {!loading && !error && (
              <><div className="state-title">No enrolments match</div><div>Try a different search or status.</div></>
            )}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="tr head">
            <div className="th" style={{ width: 64, paddingLeft: 20 }}>ID</div>
            <div className="th" style={{ width: 210 }}>Student</div>
            <div className="th" style={{ flex: 1, minWidth: 0 }}>Course</div>
            <div className="th" style={{ width: 160 }}>Category</div>
            <div className="th" style={{ width: 128 }}>Enrolled</div>
            <div className="th" style={{ width: 118 }}>Status</div>
            <div className="th right" style={{ width: 140, paddingRight: 20 }}>Actions</div>
          </div>

          {visible.map((row) => (
            <div className="tr" key={row.enrolment_id}>
              <div className="td cell-id" style={{ width: 64, paddingLeft: 20 }}>{row.enrolment_id}</div>
              <div className="td cell-name" style={{ width: 210, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {row.student_name}
              </div>
              <div className="td cell-text" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {row.course_name}
              </div>
              <div className="td" style={{ width: 160 }}>
                <span className="tag">{row.category_name}</span>
              </div>
              <div className="td cell-text" style={{ width: 128 }}>{formatDate(row.enrolment_date)}</div>
              <div className="td" style={{ width: 118 }}>
                <span className={`badge ${STATUS_CLASS[row.status] ?? "badge-muted"}`}>{row.status}</span>
              </div>
              <div className="td" style={{ width: 140, paddingRight: 20 }}>
                <div className="row-actions">
                  <button type="button" className="btn-link" onClick={() => openEdit(row)}>Edit</button>
                  <button type="button" className="btn-link danger" onClick={() => setPendingDelete(row)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? "Edit enrolment" : "Add enrolment"} onClose={closeForm}>
          <form onSubmit={form.handleSubmit} noValidate>
            <div className="form-grid">
              <FormField
                label="Student"
                name="student_id"
                as="select"
                value={form.values.student_id}
                onChange={form.setField}
                error={form.errors.student_id}
                required
              >
                <option value="">Select a student</option>
                {studentList.map((student) => (
                  <option key={student.student_id} value={student.student_id}>
                    {student.name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Course"
                name="course_id"
                as="select"
                value={form.values.course_id}
                onChange={form.setField}
                error={form.errors.course_id}
                required
              >
                <option value="">Select a course</option>
                {courseList.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Enrolment date"
                name="enrolment_date"
                type="date"
                value={form.values.enrolment_date}
                onChange={form.setField}
                error={form.errors.enrolment_date}
                required
              />

              <FormField
                label="Status"
                name="status"
                as="select"
                value={form.values.status}
                onChange={form.setField}
                error={form.errors.status}
                required
              >
                {ENROLMENT_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </FormField>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn" disabled={form.submitting}>
                {form.submitting ? "Saving…" : editing ? "Save changes" : "Add enrolment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Remove enrolment"
          message={`Remove ${pendingDelete.student_name} from ${pendingDelete.course_name}?`}
          confirmLabel="Remove"
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  );
}
