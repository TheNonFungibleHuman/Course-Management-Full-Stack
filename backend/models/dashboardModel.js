import pool from "../config/database.js";

export async function getDashboardStats() {
  const [summaryResult, popularResult] = await Promise.all([
    pool.execute(`
      SELECT
        (SELECT COUNT(*) FROM students) AS total_students,
        (SELECT COUNT(*) FROM courses) AS total_courses,
        (SELECT COUNT(*) FROM categories) AS total_categories,
        (SELECT COUNT(*) FROM enrolments) AS total_enrolments,
        (SELECT COUNT(*) FROM enrolments WHERE status = 'Active') AS active_enrolments,
        (SELECT COUNT(*) FROM enrolments WHERE status = 'Completed') AS completed_enrolments,
        (SELECT COUNT(*) FROM enrolments WHERE status = 'Cancelled') AS cancelled_enrolments,
        -- Revenue is tuition that has not been refunded. Active is treated as billed,
        -- Completed as delivered, and Cancelled as refunded. There is no payments table,
        -- so enrolment status is the only signal available.
        (SELECT COALESCE(SUM(c.price), 0)
           FROM enrolments e
           JOIN courses c ON c.course_id = e.course_id
          WHERE e.status IN ('Active', 'Completed')) AS total_revenue
    `),
    pool.execute(`
      SELECT c.course_id, c.course_name, COUNT(e.enrolment_id) AS enrolment_count
      FROM courses c
      JOIN enrolments e ON e.course_id = c.course_id
      GROUP BY c.course_id, c.course_name
      ORDER BY enrolment_count DESC, c.course_name
      LIMIT 5
    `),
  ]);

  const [summaryRows] = summaryResult;
  const [popularCourses] = popularResult;

  return {
    ...summaryRows[0],
    popular_courses: popularCourses,
  };
}
