// Form validation rules. These mirror the rules the API enforces, so the user
// gets immediate feedback without a round trip. They are not a substitute for
// the server-side checks, since a request can always be crafted by hand.
//
// Each validator takes the whole form object and returns { field: "message" }.
// An empty object means the form is valid.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A phone number is only a string of digits with optional spacing, dashes,
// brackets and a leading plus. Between 7 and 15 digits: the lower bound catches
// obviously truncated entries, the upper bound is the E.164 maximum.
function phoneError(value) {
  const raw = String(value || "").trim();
  if (!raw) return "Phone is required";
  if (!/^[+()\d][\d\s()+-]*$/.test(raw)) return "Phone can only contain digits, spaces and + - ( )";
  const digits = raw.replace(/\D/g, "");
  if (digits.length < 7) return "Phone number is too short";
  if (digits.length > 15) return "Phone number is too long";
  return null;
}

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

  const phone = phoneError(values.phone);
  if (phone) errors.phone = phone;

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
