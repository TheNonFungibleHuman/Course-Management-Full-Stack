import * as studentModel from "../models/studentsModel.js";

async function getAllStudents(req, res, next) {
  try {
    const students = await studentModel.getAllStudents();
    res.json(students);
  } catch (error) {
    next(error);
  }
}

async function getStudentById(req, res, next) {
  try {
    const student = await studentModel.getStudentById(req.params.id);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
}

async function createStudent(req, res, next) {
  try {
    const student = await studentModel.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
}

async function updateStudent(req, res, next) {
  try {
    const student = await studentModel.updateStudent(req.params.id, req.body);

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
}

async function deleteStudent(req, res, next) {
  try {
    const deleted = await studentModel.deleteStudent(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
}

export {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
