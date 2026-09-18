import * as categoryModel from "../models/categoriesModel.js";

async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryModel.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const category = await categoryModel.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryModel.updateCategory(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const deleted = await categoryModel.deleteCategory(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
