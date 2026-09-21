import pool from "../config/database.js";

// Enrolment counts are included so the students list can show how many courses
// each student holds without a request per row. A LEFT JOIN is used because a
// student with no enrolments must still appear, with zeroes.
const studentSelect = `
  SELECT s.student_id, s.name, s.email, s.phone,
         COUNT(e.enrolment_id) AS total_enrolments,
         COALESCE(SUM(e.status = 'Active'), 0) AS active_enrolments,
         COALESCE(SUM(e.status = 'Completed'), 0) AS completed_enrolments,
         COALESCE(SUM(e.status = 'Cancelled'), 0) AS cancelled_enrolments
  FROM students s
  LEFT JOIN enrolments e ON e.student_id = s.student_id
`;

export async function getAllStudents() {
  const [rows] = await pool.execute(
    `${studentSelect} GROUP BY s.student_id, s.name, s.email, s.phone ORDER BY s.student_id DESC`
  );
  return rows;
}

export async function getStudentById(studentId) {
  const [rows] = await pool.execute(
    `${studentSelect} WHERE s.student_id = ? GROUP BY s.student_id, s.name, s.email, s.phone`,
    [studentId]
  );
  return rows[0] ?? null;
}

export async function createStudent({ name, email, phone }) {
  const [result] = await pool.execute(
    "INSERT INTO students (name, email, phone) VALUES (?, ?, ?)",
    [name, email, phone]
  );
  return getStudentById(result.insertId);
}

export async function updateStudent(studentId, { name, email, phone }) {
  const [result] = await pool.execute(
    "UPDATE students SET name = ?, email = ?, phone = ? WHERE student_id = ?",
    [name, email, phone, studentId]
  );
  return result.affectedRows ? getStudentById(studentId) : null;
}

export async function deleteStudent(studentId) {
  const [result] = await pool.execute(
    "DELETE FROM students WHERE student_id = ?",
    [studentId]
  );
  return result.affectedRows > 0;
}
