import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentsController.js";
import {
  validateId,
  validateStudent,
} from "../middleware/validate.js";

const router = Router();

router.get("/", getAllStudents);
router.get("/:id", validateId, getStudentById);
router.post("/", validateStudent, createStudent);
router.put("/:id", validateId, validateStudent, updateStudent);
router.delete("/:id", validateId, deleteStudent);

export default router;
