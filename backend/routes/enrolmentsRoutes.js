import { Router } from "express";
import {
  getAllEnrolments,
  getEnrolmentById,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment,
  getEnrolmentDetails,
} from "../controllers/enrolmentsController.js";
import {
  validateId,
  validateEnrolment,
} from "../middleware/validate.js";

const router = Router();

router.get("/", getAllEnrolments);
router.get("/details", getEnrolmentDetails);
router.get("/:id", validateId, getEnrolmentById);
router.post("/", validateEnrolment, createEnrolment);
router.put("/:id", validateId, validateEnrolment, updateEnrolment);
router.delete("/:id", validateId, deleteEnrolment);

export default router;
