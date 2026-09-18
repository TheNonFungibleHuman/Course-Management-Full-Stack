import { Router } from "express";
import {
  getAllEnrolments,
  getEnrolmentById,
  createEnrolment,
  updateEnrolment,
  deleteEnrolment,
  getEnrolmentDetails,
} from "../controllers/enrolmentsController.js";

const router = Router();

router.get("/", getAllEnrolments);
router.get("/details", getEnrolmentDetails);
router.get("/:id", getEnrolmentById);
router.post("/", createEnrolment);
router.put("/:id", updateEnrolment);
router.delete("/:id", deleteEnrolment);

export default router;
