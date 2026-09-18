import pool from "../config/database.js";

export async function getAllStudents() {
  const [rows] = await pool.execute(
    "SELECT student_id, name, email, phone FROM students ORDER BY student_id DESC"
  );
  return rows;
}

export async function getStudentById(studentId) {
  const [rows] = await pool.execute(
    "SELECT student_id, name, email, phone FROM students WHERE student_id = ?",
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
