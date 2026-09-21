import pool from "../config/database.js";

export async function getAllEnrolments() {
  const [rows] = await pool.execute(
    `SELECT enrolment_id, student_id, course_id, enrolment_date, status
     FROM enrolments
     ORDER BY enrolment_id DESC`
  );
  return rows;
}

export async function getEnrolmentById(enrolmentId) {
  const [rows] = await pool.execute(
    `SELECT enrolment_id, student_id, course_id, enrolment_date, status
     FROM enrolments
     WHERE enrolment_id = ?`,
    [enrolmentId]
  );
  return rows[0] ?? null;
}

export async function createEnrolment({
  student_id,
  course_id,
  enrolment_date,
  status,
}) {
  const [result] = await pool.execute(
    `INSERT INTO enrolments (student_id, course_id, enrolment_date, status)
     VALUES (?, ?, ?, ?)`,
    [student_id, course_id, enrolment_date, status]
  );
  return getEnrolmentById(result.insertId);
}

export async function updateEnrolment(
  enrolmentId,
  { student_id, course_id, enrolment_date, status }
) {
  const [result] = await pool.execute(
    `UPDATE enrolments
     SET student_id = ?, course_id = ?, enrolment_date = ?, status = ?
     WHERE enrolment_id = ?`,
    [student_id, course_id, enrolment_date, status, enrolmentId]
  );
  return result.affectedRows ? getEnrolmentById(enrolmentId) : null;
}

export async function deleteEnrolment(enrolmentId) {
  const [result] = await pool.execute(
    "DELETE FROM enrolments WHERE enrolment_id = ?",
    [enrolmentId]
  );
  return result.affectedRows > 0;
}

export async function getEnrolmentDetails() {
  const [rows] = await pool.execute(
    `SELECT e.enrolment_id, e.student_id, s.name AS student_name,
            s.email AS student_email,
            e.course_id, c.course_name, cat.category_id, cat.category_name,
            e.enrolment_date, e.status
     FROM enrolments e
     JOIN students s ON s.student_id = e.student_id
     JOIN courses c ON c.course_id = e.course_id
     JOIN categories cat ON cat.category_id = c.category_id
     ORDER BY e.enrolment_id DESC`
  );
  return rows;
}
