import pool from "../config/database.js";

const courseSelect = `
  SELECT c.course_id, c.course_name, c.description, c.duration, c.price,
         c.category_id, cat.category_name
  FROM courses c
  JOIN categories cat ON cat.category_id = c.category_id
`;

export async function getAllCourses(categoryId) {
  if (categoryId) {
    const [rows] = await pool.execute(
      `${courseSelect} WHERE c.category_id = ? ORDER BY c.course_id DESC`,
      [categoryId]
    );
    return rows;
  }

  const [rows] = await pool.execute(
    `${courseSelect} ORDER BY c.course_id DESC`
  );
  return rows;
}

export async function getCourseById(courseId) {
  const [rows] = await pool.execute(
    `${courseSelect} WHERE c.course_id = ?`,
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
