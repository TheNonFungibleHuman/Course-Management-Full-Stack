import { useState } from "react";
import { getStudents, createStudent, updateStudent, deleteStudent } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import useForm from "../hooks/useForm.js";
import { validateStudent } from "../utils/validation.js";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormField from "../components/FormField.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import Toaster, { useToasts } from "../components/Toast.jsx";

// The reference page for the application. Every other list page follows this
// shape: fetch into a table, add and edit through the same validated form in a
// modal, confirm before deleting, and report the outcome in a toast.
//
// The list is re-fetched after every write, so what is on screen is always what
// the database actually holds rather than what the form submitted.

const EMPTY_STUDENT = { name: "", email: "", phone: "" };

const COLUMNS = [
  {
    key: "student_id",
    header: "ID",
    width: "1%",
    render: (student) => <span className="mono">{student.student_id}</span>,
  },
  { key: "name", header: "Name" },
  { key: "email", header: "Email" },
  { key: "phone", header: "Phone" },
];

export default function Students() {
  const { data, loading, error, reload } = useFetch(getStudents);
  const toasts = useToasts();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const form = useForm({
    initialValues: EMPTY_STUDENT,
    validate: validateStudent,
    onSubmit: async (values) => {
      if (editing) {
        await updateStudent(editing.student_id, values);
      } else {
        await createStudent(values);
      }
    },
    onSuccess: () => {
      setFormOpen(false);
      reload();
      toasts.success(editing ? "Student updated successfully." : "Student successfully added.");
    },
    onError: (err) => toasts.error(err.message),
  });

  const students = data ?? [];

  function openAdd() {
    setEditing(null);
    form.reset(EMPTY_STUDENT);
    setFormOpen(true);
  }

  function openEdit(student) {
    setEditing(student);
    form.reset({
      name: student.name,
      email: student.email,
      phone: student.phone,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function confirmDelete() {
    const student = pendingDelete;
    try {
      await deleteStudent(student.student_id);
      setPendingDelete(null);
      reload();
      toasts.success("Student deleted successfully.");
    } catch (err) {
      setPendingDelete(null);
      toasts.error(err.message);
    }
  }

  return (
    <>
      <PageHeader title="Students" subtitle="Everyone registered with the training centre">
        <button type="button" className="btn" onClick={openAdd}>
          Add student
        </button>
      </PageHeader>

      <DataTable
        columns={COLUMNS}
        rows={students}
        rowKey={(student) => student.student_id}
        loading={loading}
        error={error}
        onRetry={reload}
        emptyTitle="No students yet"
        emptyMessage="Add the first student to get started."
        actions={(student) => (
          <>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => openEdit(student)}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => setPendingDelete(student)}
            >
              Delete
            </button>
          </>
        )}
      />

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
                placeholder="+230 5712 3401"
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
          message={`Delete ${pendingDelete.name}? Any enrolments for this student will be removed as well.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </>
  );
}
