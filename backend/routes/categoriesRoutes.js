import { Router } from "express";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";
import {
  validateId,
  validateCategory,
} from "../middleware/validate.js";

const router = Router();

router.get("/", getAllCategories);
router.post("/", validateCategory, createCategory);
router.put("/:id", validateId, validateCategory, updateCategory);
router.delete("/:id", validateId, deleteCategory);

export default router;
