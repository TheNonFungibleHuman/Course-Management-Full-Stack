import pool from "../config/database.js";

// Enrolment counts are included so the courses list can show how full each course is without a request per row. A LEFT JOIN keeps courses with no enrolments, which must show zero rather than disappear.
const courseSelect = `
  SELECT c.course_id, c.course_name, c.description, c.duration, c.price,
         c.category_id, cat.category_name,
         COUNT(e.enrolment_id) AS enrolment_count,
         COALESCE(SUM(e.status = 'Active'), 0) AS active_enrolments
  FROM courses c
  JOIN categories cat ON cat.category_id = c.category_id
  LEFT JOIN enrolments e ON e.course_id = c.course_id
`;

const courseGroup = `
  GROUP BY c.course_id, c.course_name, c.description, c.duration, c.price,
           c.category_id, cat.category_name
`;

export async function getAllCourses(categoryId) {
  if (categoryId) {
    const [rows] = await pool.execute(
      `${courseSelect} WHERE c.category_id = ? ${courseGroup} ORDER BY c.course_id DESC`,
      [categoryId]
    );
    return rows;
  }

  const [rows] = await pool.execute(
    `${courseSelect} ${courseGroup} ORDER BY c.course_id DESC`
  );
  return rows;
}

export async function getCourseById(courseId) {
  const [rows] = await pool.execute(
    `${courseSelect} WHERE c.course_id = ? ${courseGroup}`,
    [courseId]
  );
  return rows[0] ?? null;
}

export async function createCourse({
  course_name,
  description,
  duration,
  price,
  category_id,
}) {
  const [result] = await pool.execute(
    `INSERT INTO courses (course_name, description, duration, price, category_id)
     VALUES (?, ?, ?, ?, ?)`,
    [course_name, description, duration, price, category_id]
  );
  return getCourseById(result.insertId);
}

export async function updateCourse(
  courseId,
  { course_name, description, duration, price, category_id }
) {
  const [result] = await pool.execute(
    `UPDATE courses
     SET course_name = ?, description = ?, duration = ?, price = ?, category_id = ?
     WHERE course_id = ?`,
    [course_name, description, duration, price, category_id, courseId]
  );
  return result.affectedRows ? getCourseById(courseId) : null;
}

export async function deleteCourse(courseId) {
  const [result] = await pool.execute(
    "DELETE FROM courses WHERE course_id = ?",
    [courseId]
  );
  return result.affectedRows > 0;
}

export async function getStudentsByCourseId(courseId) {
  const [rows] = await pool.execute(
    `SELECT s.student_id, s.name, s.email, s.phone,
            e.enrolment_id, e.enrolment_date, e.status
     FROM enrolments e
     JOIN students s ON s.student_id = e.student_id
     WHERE e.course_id = ?
     ORDER BY s.name`,
    [courseId]
  );
  return rows;
}
