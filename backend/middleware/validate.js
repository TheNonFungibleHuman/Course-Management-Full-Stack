const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const enrolmentStatuses = new Set(["Active", "Completed", "Cancelled"]);

function isMissing(value) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isPositiveInteger(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0;
}

function isValidDate(value) {
  if (typeof value !== "string") {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function rejectInvalid(res, errors) {
  return res.status(400).json({
    error: Object.values(errors)[0],
    errors,
  });
}

// The description column is optional. An absent value and a blank string both
// become null, so the frontend does not have to send an empty string to clear it.
function normaliseDescription(value) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function validateId(req, res, next) {
  if (!isPositiveInteger(req.params.id)) {
    return rejectInvalid(res, { id: "ID must be a positive integer" });
  }

  next();
}

function validateCategoryFilter(req, res, next) {
  const categoryId = req.query.category_id;

  if (!isMissing(categoryId) && !isPositiveInteger(categoryId)) {
    return rejectInvalid(res, {
      category_id: "Category ID must be a positive integer",
    });
  }

  next();
}

function isValidPhone(value) {
  if (typeof value !== "string") {
    return false;
  }

  const trimmed = value.trim();
  if (!/^[+()\d][\d\s()+-]*$/.test(trimmed)) {
    return false;
  }

  // 7 digits is the shortest real subscriber number we accept, and 15 is the
  // E.164 maximum. Without a lower bound a four-digit entry was accepted.
  const digits = trimmed.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

function validateStudent(req, res, next) {
  const body = req.body ?? {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const errors = {};

  if (!name) {
    errors.name = "Name is required";
  } else if (name.length > 150) {
    errors.name = "Name cannot exceed 150 characters";
  }

  if (!email) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address";
  } else if (email.length > 255) {
    errors.email = "Email cannot exceed 255 characters";
  }

  if (!phone) {
    errors.phone = "Phone is required";
  } else if (!isValidPhone(phone)) {
    errors.phone = "Phone must be a valid number, 7 to 15 digits";
  } else if (phone.length > 30) {
    errors.phone = "Phone cannot exceed 30 characters";
  }

  if (Object.keys(errors).length) {
    return rejectInvalid(res, errors);
  }

  req.body = { ...body, name, email: email.toLowerCase(), phone };
  next();
}

function validateCategory(req, res, next) {
  const body = req.body ?? {};
  const categoryName =
    typeof body.category_name === "string" ? body.category_name.trim() : "";
  const description = normaliseDescription(body.description);
  const errors = {};

  if (!categoryName) {
    errors.category_name = "Category name is required";
  } else if (categoryName.length > 100) {
    errors.category_name = "Category name cannot exceed 100 characters";
  }

  if (description && description.length > 255) {
    errors.description = "Description cannot exceed 255 characters";
  }

  if (Object.keys(errors).length) {
    return rejectInvalid(res, errors);
  }

  req.body = { ...body, category_name: categoryName, description };
  next();
}

function validateCourse(req, res, next) {
  const body = req.body ?? {};
  const courseName =
    typeof body.course_name === "string" ? body.course_name.trim() : "";
  const description = normaliseDescription(body.description);
  const duration = Number(body.duration);
  const price = Number(body.price);
  const errors = {};

  if (!courseName) {
    errors.course_name = "Course name is required";
  } else if (courseName.length > 150) {
    errors.course_name = "Course name cannot exceed 150 characters";
  }

  if (description && description.length > 255) {
    errors.description = "Description cannot exceed 255 characters";
  }

  if (isMissing(body.duration)) {
    errors.duration = "Duration is required";
  } else if (!Number.isFinite(duration) || duration <= 0) {
    errors.duration = "Duration must be greater than 0";
  } else if (duration > 99999.99) {
    errors.duration = "Duration exceeds the allowed value";
  }

  if (isMissing(body.price)) {
    errors.price = "Price is required";
  } else if (!Number.isFinite(price) || price < 0) {
    errors.price = "Price cannot be negative";
  } else if (price > 99999999.99) {
    errors.price = "Price exceeds the allowed value";
  }

  if (!isPositiveInteger(body.category_id)) {
    errors.category_id = "Category ID must be a positive integer";
  }

  if (Object.keys(errors).length) {
    return rejectInvalid(res, errors);
  }

  req.body = {
    ...body,
    course_name: courseName,
    description,
    duration,
    price,
    category_id: Number(body.category_id),
  };
  next();
}

function validateEnrolment(req, res, next) {
  const body = req.body ?? {};
  const errors = {};

  if (!isPositiveInteger(body.student_id)) {
    errors.student_id = "Student ID must be a positive integer";
  }

  if (!isPositiveInteger(body.course_id)) {
    errors.course_id = "Course ID must be a positive integer";
  }

  if (isMissing(body.enrolment_date)) {
    errors.enrolment_date = "Enrolment date is required";
  } else if (!isValidDate(body.enrolment_date)) {
    errors.enrolment_date = "Enrolment date must use YYYY-MM-DD";
  }

  if (!enrolmentStatuses.has(body.status)) {
    errors.status = "Status must be Active, Completed or Cancelled";
  }

  if (Object.keys(errors).length) {
    return rejectInvalid(res, errors);
  }

  req.body = {
    ...body,
    student_id: Number(body.student_id),
    course_id: Number(body.course_id),
  };
  next();
}

export {
  validateId,
  validateCategoryFilter,
  validateStudent,
  validateCategory,
  validateCourse,
  validateEnrolment,
};
