import axios from "axios";

// The single HTTP entry point for the entire frontend. Every page and component
// talks to the backend through the functions below, so the base URL and the
// error format live in exactly one place, and pointing the app at a different
// backend is a one-line change in .env.
//
// Each function returns the response body directly, so callers can await the
// result and catch any failure as a normal Error.

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Unwraps the backend's { error: "..." } envelope into a normal Error, so pages
// only ever need to catch (err) and read err.message. Validation failures also
// carry a per-field map, which is kept on the error so a form can mark the
// individual inputs as well as showing the sentence.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error.response?.data?.error;
    const networkMessage = error.request
      ? "Cannot reach the server. Is the backend running?"
      : error.message;
    const wrapped = new Error(apiMessage || networkMessage);
    if (error.response?.data?.errors) wrapped.errors = error.response.data.errors;
    return Promise.reject(wrapped);
  }
);

// Students
export const getStudents = () => api.get("/students").then((r) => r.data);

export const getStudent = (id) => api.get(`/students/${id}`).then((r) => r.data);

export const createStudent = (payload) =>
  api.post("/students", payload).then((r) => r.data);

export const updateStudent = (id, payload) =>
  api.put(`/students/${id}`, payload).then((r) => r.data);

export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

// Courses

// categoryId is an optional filter, sent as ?category_id=
export const getCourses = (categoryId) =>
  api
    .get("/courses", { params: categoryId ? { category_id: categoryId } : {} })
    .then((r) => r.data);

export const getCourse = (id) => api.get(`/courses/${id}`).then((r) => r.data);

export const createCourse = (payload) =>
  api.post("/courses", payload).then((r) => r.data);

export const updateCourse = (id, payload) =>
  api.put(`/courses/${id}`, payload).then((r) => r.data);

export const deleteCourse = (id) =>
  api.delete(`/courses/${id}`).then((r) => r.data);

// Students enrolled in one course, for the Course Details page
export const getCourseStudents = (id) =>
  api.get(`/courses/${id}/students`).then((r) => r.data);

// Categories
export const getCategories = () => api.get("/categories").then((r) => r.data);

export const createCategory = (payload) =>
  api.post("/categories", payload).then((r) => r.data);

export const updateCategory = (id, payload) =>
  api.put(`/categories/${id}`, payload).then((r) => r.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data);

// Enrolments
export const getEnrolments = () => api.get("/enrolments").then((r) => r.data);

export const getEnrolment = (id) =>
  api.get(`/enrolments/${id}`).then((r) => r.data);

export const createEnrolment = (payload) =>
  api.post("/enrolments", payload).then((r) => r.data);

export const updateEnrolment = (id, payload) =>
  api.put(`/enrolments/${id}`, payload).then((r) => r.data);

export const deleteEnrolment = (id) =>
  api.delete(`/enrolments/${id}`).then((r) => r.data);

// Enrolments joined with student, course and category names, so the Enrolments
// table can show names instead of IDs
export const getEnrolmentDetails = () =>
  api.get("/enrolments/details").then((r) => r.data);

// Dashboard
export const getDashboardStats = () =>
  api.get("/dashboard/stats").then((r) => r.data);

export default api;
