import { useMemo, useState } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import useForm from "../hooks/useForm.js";
import { validateStudent } from "../utils/validation.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import FormField from "../components/FormField.jsx";
import Toaster, { useToasts } from "../components/Toast.jsx";
import { formatPhone } from "../utils/format.js";

// Students list. The reference implementation for every record page: fetch, filter, add and edit through one validated form, confirm before deleting, and re-fetch after every write so the table reflects the database.
//
// The table shows "active of total" enrolments per student rather than a single status, because a student can hold several enrolments at once and there is no such thing as one status for a person. Inventing a single badge would have been a lie the first time someone held two.

const EMPTY_STUDENT = { name: "", email: "", phone: "" };

export default function Students() {
  const { data, loading, error, reload } = useFetch(getStudents);
  const toasts = useToasts();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const form = useForm({
    initialValues: EMPTY_STUDENT,
    validate: validateStudent,
    onSubmit: async (values) => {
      if (editing) await updateStudent(editing.student_id, values);
      else await createStudent(values);
    },
    onSuccess: () => {
      setFormOpen(false);
      reload();
      toasts.success(editing ? "Student updated." : "Student added.");
    },
    onError: (err) => toasts.error(err.message),
  });

  const students = data ?? [];

  const counts = useMemo(
    () => ({
      all: students.length,
      enrolled: students.filter((s) => Number(s.active_enrolments) > 0).length,
      completed: students.filter((s) => Number(s.completed_enrolments) > 0).length,
    }),
    [students]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return students.filter((student) => {
      if (filter === "enrolled" && !(Number(student.active_enrolments) > 0)) return false;
      if (filter === "completed" && !(Number(student.completed_enrolments) > 0)) return false;
      if (!needle) return true;
      return (
        student.name.toLowerCase().includes(needle) ||
        student.email.toLowerCase().includes(needle)
      );
    });
  }, [students, query, filter]);

  function openAdd() {
    setEditing(null);
    form.reset(EMPTY_STUDENT);
    setFormOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    form.reset({ name: student.name, email: student.email, phone: student.phone });
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
      await deleteStudent(target.student_id);
      reload();
      toasts.success("Student deleted.");
    } catch (err) {
      toasts.error(err.message);
    }
  }

  return (
    <div className="content">
      <PageHeader title="Students">
        <button type="button" className="btn" onClick={openAdd}>
          Add student
        </button>
      </PageHeader>

      <div className="toolbar">
        <div className="chips">
          <button
            type="button"
            className={`chip${filter === "all" ? " active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All {counts.all}
          </button>
          <button
            type="button"
            className={`chip${filter === "enrolled" ? " active" : ""}`}
            onClick={() => setFilter("enrolled")}
          >
            Currently enrolled {counts.enrolled}
          </button>
          <button
            type="button"
            className={`chip${filter === "completed" ? " active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Has completed {counts.completed}
          </button>
        </div>

        <div className="search">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="var(--ink-muted)" strokeWidth="1.6" />
            <line
              x1="10.8"
              y1="10.8"
              x2="14.5"
              y2="14.5"
              stroke="var(--ink-muted)"
              strokeWidth="1.6"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search students"
          />
        </div>
      </div>

      {loading || error || visible.length === 0 ? (
        <div className="table">
          <div className="state">
            {loading && (
              <>
                <div className="spinner" />
                <div className="state-title">Loading students</div>
              </>
            )}
            {error && (
              <>
                <div className="state-title">Could not load students</div>
                <div>{error}</div>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 12 }} onClick={reload}>
                  Try again
                </button>
              </>
            )}
            {!loading && !error && (
              <>
                <div className="state-title">No students match</div>
                <div>Try a different search or filter.</div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="tr head">
            <div className="th" style={{ width: 68, paddingLeft: 20 }}>ID</div>
            <div className="th" style={{ width: 236 }}>Name</div>
            <div className="th" style={{ flex: 1, minWidth: 0 }}>Email</div>
            <div className="th" style={{ width: 168 }}>Phone</div>
            <div className="th" style={{ width: 116 }}>Enrolments</div>
            <div className="th right" style={{ width: 132, paddingRight: 20 }}>Actions</div>
          </div>

          {visible.map((student) => {
            const total = Number(student.total_enrolments) || 0;
            const active = Number(student.active_enrolments) || 0;
            return (
              <div className="tr" key={student.student_id}>
                <div className="td cell-id" style={{ width: 68, paddingLeft: 20 }}>
                  {student.student_id}
                </div>
                <div className="td cell-name" style={{ width: 236 }}>
                  {student.name}
                </div>
                <div className="td cell-text" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {student.email}
                </div>
                <div className="td cell-text" style={{ width: 168 }}>{formatPhone(student.phone)}</div>
                <div className="td cell-figure" style={{ width: 116 }}>
                  {total > 0 ? (
                    <>
                      {active} <span className="of">of {total}</span>
                    </>
                  ) : (
                    <span className="of">None</span>
                  )}
                </div>
                <div className="td" style={{ width: 132, paddingRight: 20 }}>
                  <div className="row-actions">
                    <button type="button" className="btn-link" onClick={() => openEdit(student)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn-link danger"
                      onClick={() => setPendingDelete(student)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? "Edit student" : "Add student"} onClose={closeForm}>
          <form onSubmit={form.handleSubmit} noValidate>
            <div className="form-grid">
              <FormField
                label="Full name"
                name="name"
                value={form.values.name}
                onChange={form.setField}
                error={form.errors.name}
                placeholder="Aisha Patel"
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.values.email}
                onChange={form.setField}
                error={form.errors.email}
                placeholder="aisha.patel@example.com"
                required
              />
              <FormField
                label="Phone"
                name="phone"
                value={form.values.phone}
                onChange={form.setField}
                error={form.errors.phone}
                placeholder="+23057123401"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeForm}>
                Cancel
              </button>
              <button type="submit" className="btn" disabled={form.submitting}>
                {form.submitting ? "Saving…" : editing ? "Save changes" : "Add student"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete student"
          message={`Delete ${pendingDelete.name}? Their enrolments will be removed as well.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  );
}
