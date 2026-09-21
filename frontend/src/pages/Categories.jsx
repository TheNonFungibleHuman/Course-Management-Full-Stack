import { useMemo, useState } from "react";
import { getCategories, getCourses, createCategory, updateCategory, deleteCategory } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import useForm from "../hooks/useForm.js";
import { validateCategory } from "../utils/validation.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import FormField from "../components/FormField.jsx";
import Toaster, { useToasts } from "../components/Toast.jsx";
import { formatNumber } from "../utils/format.js";

// Categories list. The courses column is counted from the loaded course list, so
// it stays correct without another endpoint. Deleting a category that still has
// courses is refused by the database and the API returns 409, which is surfaced
// as an error toast rather than swallowed.
const EMPTY_CATEGORY = { category_name: "", description: "" };

export default function Categories() {
  const { data: categories, loading, error, reload } = useFetch(getCategories);
  const { data: courses } = useFetch(getCourses);
  const toasts = useToasts();

  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = categories ?? [];
  const courseList = courses ?? [];

  const form = useForm({
    initialValues: EMPTY_CATEGORY,
    validate: validateCategory,
    onSubmit: async (values) => {
      const payload = { category_name: values.category_name, description: values.description };
      if (editing) await updateCategory(editing.category_id, payload);
      else await createCategory(payload);
    },
    onSuccess: () => {
      setFormOpen(false);
      reload();
      toasts.success(editing ? "Category updated." : "Category added.");
    },
    onError: (err) => toasts.error(err.message),
  });

  const courseCounts = useMemo(() => {
    const map = new Map();
    for (const course of courseList) {
      map.set(course.category_id, (map.get(course.category_id) ?? 0) + 1);
    }
    return map;
  }, [courseList]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter(
      (category) =>
        category.category_name.toLowerCase().includes(needle) ||
        String(category.description ?? "").toLowerCase().includes(needle)
    );
  }, [rows, query]);

  function openAdd() {
    setEditing(null);
    form.reset(EMPTY_CATEGORY);
    setFormOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    form.reset({
      category_name: category.category_name,
      description: category.description ?? "",
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
      await deleteCategory(target.category_id);
      reload();
      toasts.success("Category deleted.");
    } catch (err) {
      toasts.error(err.message);
    }
  }

  return (
    <div className="content">
      <PageHeader
        title="Categories"
        subtitle={
          loading || error
            ? "How the course catalogue is grouped."
            : `${formatNumber(rows.length)} categories grouping ${formatNumber(courseList.length)} courses.`
        }
      >
        <button type="button" className="btn" onClick={openAdd}>Add category</button>
      </PageHeader>

      <div className="toolbar">
        <div className="chips" />
        <div className="search">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" fill="none" stroke="var(--ink-muted)" strokeWidth="1.6" />
            <line x1="10.8" y1="10.8" x2="14.5" y2="14.5" stroke="var(--ink-muted)" strokeWidth="1.6" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search categories"
            aria-label="Search categories"
          />
        </div>
      </div>

      {loading || error || visible.length === 0 ? (
        <div className="table">
          <div className="state">
            {loading && (<><div className="spinner" /><div className="state-title">Loading categories</div></>)}
            {error && (
              <>
                <div className="state-title">Could not load categories</div>
                <div>{error}</div>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 12 }} onClick={reload}>
                  Try again
                </button>
              </>
            )}
            {!loading && !error && (
              <><div className="state-title">No categories match</div><div>Try a different search.</div></>
            )}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="tr head">
            <div className="th" style={{ width: 64, paddingLeft: 20 }}>ID</div>
            <div className="th" style={{ width: 240 }}>Category</div>
            <div className="th" style={{ flex: 1, minWidth: 0 }}>Description</div>
            <div className="th right" style={{ width: 120 }}>Courses</div>
            <div className="th right" style={{ width: 140, paddingRight: 20 }}>Actions</div>
          </div>

          {visible.map((category) => (
            <div className="tr" key={category.category_id}>
              <div className="td cell-id" style={{ width: 64, paddingLeft: 20 }}>{category.category_id}</div>
              <div className="td cell-name" style={{ width: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {category.category_name}
              </div>
              <div className="td cell-text" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {category.description || <span style={{ color: "var(--ink-muted)" }}>No description</span>}
              </div>
              <div className="td cell-figure right" style={{ width: 120 }}>
                {courseCounts.get(category.category_id) ?? 0}
              </div>
              <div className="td" style={{ width: 140, paddingRight: 20 }}>
                <div className="row-actions">
                  <button type="button" className="btn-link" onClick={() => openEdit(category)}>Edit</button>
                  <button type="button" className="btn-link danger" onClick={() => setPendingDelete(category)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? "Edit category" : "Add category"} onClose={closeForm}>
          <form onSubmit={form.handleSubmit} noValidate>
            <div className="form-grid">
              <FormField
                label="Category name"
                name="category_name"
                value={form.values.category_name}
                onChange={form.setField}
                error={form.errors.category_name}
                placeholder="Web Development"
                required
              />
              <FormField
                label="Description"
                name="description"
                as="textarea"
                value={form.values.description}
                onChange={form.setField}
                error={form.errors.description}
                placeholder="What kind of courses belong here"
                maxLength={255}
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn" disabled={form.submitting}>
                {form.submitting ? "Saving…" : editing ? "Save changes" : "Add category"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete category"
          message={`Delete ${pendingDelete.category_name}? A category that still has courses cannot be deleted.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  );
}
