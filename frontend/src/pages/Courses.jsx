import { useMemo, useState } from "react";
import { getCourses, getCategories, createCourse, updateCourse, deleteCourse } from "../services/api.js";
import useFetch from "../hooks/useFetch.js";
import useForm from "../hooks/useForm.js";
import { validateCourse } from "../utils/validation.js";
import PageHeader from "../components/PageHeader.jsx";
import Modal from "../components/Modal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import FormField from "../components/FormField.jsx";
import Toaster, { useToasts } from "../components/Toast.jsx";
import { formatNumber } from "../utils/format.js";

// Courses list. Price is right-aligned with the cents in a lighter weight so the decimal points line up down the column. The category is a quiet outlined tag rather than a filled badge, because it groups records rather than describing a state, and filled colour is reserved for status elsewhere in the app.
const EMPTY_COURSE = {
  course_name: "",
  description: "",
  duration: "",
  price: "",
  category_id: "",
};

export default function Courses() {
  const { data: courses, loading, error, reload } = useFetch(getCourses);
  const { data: categories } = useFetch(getCategories);
  const toasts = useToasts();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const rows = courses ?? [];
  const cats = categories ?? [];

  const form = useForm({
    initialValues: EMPTY_COURSE,
    validate: validateCourse,
    onSubmit: async (values) => {
      const payload = {
        course_name: values.course_name,
        description: values.description,
        duration: Number(values.duration),
        price: Number(values.price),
        category_id: Number(values.category_id),
      };
      if (editing) await updateCourse(editing.course_id, payload);
      else await createCourse(payload);
    },
    onSuccess: () => {
      setFormOpen(false);
      reload();
      toasts.success(editing ? "Course updated." : "Course added.");
    },
    onError: (err) => toasts.error(err.message),
  });

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((course) => {
      if (categoryFilter !== "all" && String(course.category_id) !== String(categoryFilter)) {
        return false;
      }
      if (!needle) return true;
      return course.course_name.toLowerCase().includes(needle);
    });
  }, [rows, categoryFilter, query]);

  function openAdd() {
    setEditing(null);
    form.reset(EMPTY_COURSE);
    setFormOpen(true);
  }

  function openEdit(course) {
    setEditing(course);
    form.reset({
      course_name: course.course_name,
      description: course.description ?? "",
      duration: String(course.duration),
      price: String(course.price),
      category_id: String(course.category_id),
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
      await deleteCourse(target.course_id);
      reload();
      toasts.success("Course deleted.");
    } catch (err) {
      toasts.error(err.message);
    }
  }

  const money = (value) => {
    const [whole, cents] = Number(value || 0).toFixed(2).split(".");
    return (
      <div className="money">
        <span className="money-cur">MYR</span>
        <span className="money-whole">{formatNumber(whole)}</span>
        <span className="money-cents">.{cents}</span>
      </div>
    );
  };

  return (
    <div className="content">
      <PageHeader
        title="Courses"
        subtitle={
          loading || error
            ? "The course catalogue."
            : `${formatNumber(rows.length)} courses across ${formatNumber(cats.length)} categories.`
        }
      >
        <button type="button" className="btn btn-ghost">Export</button>
        <button type="button" className="btn" onClick={openAdd}>Add course</button>
      </PageHeader>

      <div className="toolbar">
        <div className="chips">
          <button
            type="button"
            className={`chip${categoryFilter === "all" ? " active" : ""}`}
            onClick={() => setCategoryFilter("all")}
          >
            All {rows.length}
          </button>
          {cats.map((category) => (
            <button
              key={category.category_id}
              type="button"
              className={`chip${String(categoryFilter) === String(category.category_id) ? " active" : ""}`}
              onClick={() => setCategoryFilter(category.category_id)}
            >
              {category.category_name}
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
            placeholder="Search courses"
            aria-label="Search courses"
          />
        </div>
      </div>

      {loading || error || visible.length === 0 ? (
        <div className="table">
          <div className="state">
            {loading && (<><div className="spinner" /><div className="state-title">Loading courses</div></>)}
            {error && (
              <>
                <div className="state-title">Could not load courses</div>
                <div>{error}</div>
                <button type="button" className="btn btn-ghost" style={{ marginTop: 12 }} onClick={reload}>
                  Try again
                </button>
              </>
            )}
            {!loading && !error && (
              <><div className="state-title">No courses match</div><div>Try a different search or category.</div></>
            )}
          </div>
        </div>
      ) : (
        <div className="table">
          <div className="tr head">
            <div className="th" style={{ width: 64, paddingLeft: 20 }}>ID</div>
            <div className="th" style={{ flex: 1, minWidth: 0 }}>Course</div>
            <div className="th" style={{ width: 168 }}>Category</div>
            <div className="th" style={{ width: 100 }}>Duration</div>
            <div className="th right" style={{ width: 130 }}>Price</div>
            <div className="th right" style={{ width: 104 }}>Enrolled</div>
            <div className="th right" style={{ width: 140, paddingRight: 20 }}>Actions</div>
          </div>

          {visible.map((course) => (
            <div className="tr" key={course.course_id}>
              <div className="td cell-id" style={{ width: 64, paddingLeft: 20 }}>{course.course_id}</div>
              <div className="td cell-name" style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {course.course_name}
              </div>
              <div className="td" style={{ width: 168 }}>
                <span className="tag">{course.category_name}</span>
              </div>
              <div className="td cell-text" style={{ width: 100 }}>{course.duration} wks</div>
              <div className="td" style={{ width: 130 }}>{money(course.price)}</div>
              <div className="td cell-figure right" style={{ width: 104 }}>
                {Number(course.enrolment_count) || 0}
              </div>
              <div className="td" style={{ width: 140, paddingRight: 20 }}>
                <div className="row-actions">
                  <button type="button" className="btn-link" onClick={() => openEdit(course)}>Edit</button>
                  <button type="button" className="btn-link danger" onClick={() => setPendingDelete(course)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <Modal title={editing ? "Edit course" : "Add course"} onClose={closeForm}>
          <form onSubmit={form.handleSubmit} noValidate>
            <div className="form-grid">
              <FormField
                label="Course name"
                name="course_name"
                value={form.values.course_name}
                onChange={form.setField}
                error={form.errors.course_name}
                placeholder="React Fundamentals"
                required
              />
              <FormField
                label="Description"
                name="description"
                as="textarea"
                value={form.values.description}
                onChange={form.setField}
                error={form.errors.description}
                placeholder="What the course covers"
                maxLength={255}
              />
              <FormField
                label="Category"
                name="category_id"
                as="select"
                value={form.values.category_id}
                onChange={form.setField}
                error={form.errors.category_id}
                required
              >
                <option value="">Select a category</option>
                {cats.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </FormField>
              <FormField
                label="Duration (weeks)"
                name="duration"
                type="number"
                min="1"
                value={form.values.duration}
                onChange={form.setField}
                error={form.errors.duration}
                placeholder="32"
                required
              />
              <FormField
                label="Price (MYR)"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.values.price}
                onChange={form.setField}
                error={form.errors.price}
                placeholder="14000.00"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={closeForm}>Cancel</button>
              <button type="submit" className="btn" disabled={form.submitting}>
                {form.submitting ? "Saving…" : editing ? "Save changes" : "Add course"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <ConfirmDialog
          title="Delete course"
          message={`Delete ${pendingDelete.course_name}? A course that still has enrolments cannot be deleted.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <Toaster toasts={toasts.toasts} onDismiss={toasts.dismiss} />
    </div>
  );
}
