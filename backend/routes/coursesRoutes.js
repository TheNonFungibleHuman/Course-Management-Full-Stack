import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseStudents,
} from "../controllers/coursesController.js";
import {
  validateId,
  validateCategoryFilter,
  validateCourse,
} from "../middleware/validate.js";

const router = Router();

router.get("/", validateCategoryFilter, getAllCourses);
router.get("/:id/students", validateId, getCourseStudents);
router.get("/:id", validateId, getCourseById);
router.post("/", validateCourse, createCourse);
router.put("/:id", validateId, validateCourse, updateCourse);
router.delete("/:id", validateId, deleteCourse);

export default router;
