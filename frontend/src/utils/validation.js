/**
 * Form validation rules.
 *
 * These mirror the rules the API enforces, so the user gets immediate feedback
 * without a round trip. They are not a substitute for the server-side checks:
 * a request can always be crafted by hand, so the API remains the authority on
 * what reaches the database.
 *
 * Each validator takes the whole form object and returns an object of
 * { fieldName: "message" }. An empty object means the form is valid.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStudent(values) {
  const errors = {};

  if (!String(values.name || "").trim()) {
    errors.name = "Name is required";
  }

  const email = String(values.email || "").trim();
  if (!email) {
    errors.email = "Email is required";
  } else if (!EMAIL.test(email)) {
    errors.email = "Enter a valid email address";
  }

  if (!String(values.phone || "").trim()) {
    errors.phone = "Phone is required";
  }

  return errors;
}

export function validateCourse(values) {
  const errors = {};

  if (!String(values.course_name || "").trim()) {
    errors.course_name = "Course name is required";
  }

  const duration = Number(values.duration);
  if (values.duration === "" || values.duration === null || values.duration === undefined) {
    errors.duration = "Duration is required";
  } else if (Number.isNaN(duration) || duration <= 0) {
    errors.duration = "Duration must be greater than 0";
  }

  const price = Number(values.price);
  if (values.price === "" || values.price === null || values.price === undefined) {
    errors.price = "Price is required";
  } else if (Number.isNaN(price) || price < 0) {
    errors.price = "Price cannot be negative";
  }

  if (!values.category_id) {
    errors.category_id = "Please select a category";
  }

  return errors;
}

export function validateCategory(values) {
  const errors = {};

  if (!String(values.category_name || "").trim()) {
    errors.category_name = "Category name is required";
  }

  return errors;
}

export function validateEnrolment(values) {
  const errors = {};

  if (!values.student_id) {
    errors.student_id = "Please select a student";
  }

  if (!values.course_id) {
    errors.course_id = "Please select a course";
  }

  if (!values.enrolment_date) {
    errors.enrolment_date = "Enrolment date is required";
  }

  if (!values.status) {
    errors.status = "Please select a status";
  }

  return errors;
}

export const ENROLMENT_STATUSES = ["Active", "Completed", "Cancelled"];

export const hasErrors = (errors) => Object.keys(errors).length > 0;
