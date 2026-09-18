import * as courseModel from "../models/coursesModel.js";

async function getAllCourses(req, res, next) {
  try {
    const courses = await courseModel.getAllCourses(req.query.category_id);
    res.json(courses);
  } catch (error) {
    next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    const course = await courseModel.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
}

async function createCourse(req, res, next) {
  try {
    const course = await courseModel.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
}

async function updateCourse(req, res, next) {
  try {
    const course = await courseModel.updateCourse(req.params.id, req.body);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const deleted = await courseModel.deleteCourse(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function getCourseStudents(req, res, next) {
  try {
    const course = await courseModel.getCourseById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const students = await courseModel.getStudentsByCourseId(req.params.id);
    res.json(students);
  } catch (error) {
    next(error);
  }
}

export {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
};
