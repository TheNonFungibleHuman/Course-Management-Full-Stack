import axios from "axios";

/**
 * The single HTTP entry point for the entire frontend.
 *
 * Every page and component talks to the backend through the functions below.
 * No component calls a URL directly and no URL is hardcoded outside this file,
 * so the base URL and the error format are defined in exactly one place — and
 * pointing the app at a different backend is a one-line change in `.env`.
 *
 * Each function returns the response body directly, so callers can simply await
 * the result and catch any failure as a normal Error.
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Response interceptor.
 *
 * The backend always returns { error: "..." } with a failing status code.
 * This unwraps that into a normal Error whose message is safe to show the user
 * directly in a toast or an inline field message, so pages only ever need to
 * catch (err) and read err.message.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiMessage = error.response?.data?.error;
    const networkMessage = error.request
      ? "Cannot reach the server. Is the backend running?"
      : error.message;
    return Promise.reject(new Error(apiMessage || networkMessage));
  }
);
 
//Students
export const getStudents = () => api.get("/students").then((r) => r.data);

export const getStudent = (id) => api.get(`/students/${id}`).then((r) => r.data);

export const createStudent = (payload) =>
  api.post("/students", payload).then((r) => r.data);

export const updateStudent = (id, payload) =>
  api.put(`/students/${id}`, payload).then((r) => r.data);

export const deleteStudent = (id) =>
  api.delete(`/students/${id}`).then((r) => r.data);

//Courses
/** @param {number|undefined} categoryId optional filter -> ?category_id= */
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

//Students enrolled in one course — feeds the Course Details page.
export const getCourseStudents = (id) =>
  api.get(`/courses/${id}/students`).then((r) => r.data);

//Categories
export const getCategories = () => api.get("/categories").then((r) => r.data);

export const createCategory = (payload) =>
  api.post("/categories", payload).then((r) => r.data);

export const updateCategory = (id, payload) =>
  api.put(`/categories/${id}`, payload).then((r) => r.data);

export const deleteCategory = (id) =>
  api.delete(`/categories/${id}`).then((r) => r.data);

//Enrolments
export const getEnrolments = () => api.get("/enrolments").then((r) => r.data);

export const getEnrolment = (id) =>
  api.get(`/enrolments/${id}`).then((r) => r.data);

export const createEnrolment = (payload) =>
  api.post("/enrolments", payload).then((r) => r.data);

export const updateEnrolment = (id, payload) =>
  api.put(`/enrolments/${id}`, payload).then((r) => r.data);

export const deleteEnrolment = (id) =>
  api.delete(`/enrolments/${id}`).then((r) => r.data);

//Enrolments joined with student, course and category names.
// The Enrolments table uses this so it can show names instead of IDs.
export const getEnrolmentDetails = () =>
  api.get("/enrolments/details").then((r) => r.data);

//Dashboard
export const getDashboardStats = () =>
  api.get("/dashboard/stats").then((r) => r.data);

export default api;
