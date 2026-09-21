import pool from "../config/database.js";

export async function getAllCategories() {
  const [rows] = await pool.execute(
    "SELECT category_id, category_name, description FROM categories ORDER BY category_name"
  );
  return rows;
}

export async function getCategoryById(categoryId) {
  const [rows] = await pool.execute(
    "SELECT category_id, category_name, description FROM categories WHERE category_id = ?",
    [categoryId]
  );
  return rows[0] ?? null;
}

export async function createCategory({ category_name, description }) {
  const [result] = await pool.execute(
    "INSERT INTO categories (category_name, description) VALUES (?, ?)",
    [category_name, description]
  );
  return getCategoryById(result.insertId);
}

export async function updateCategory(categoryId, { category_name, description }) {
  const [result] = await pool.execute(
    "UPDATE categories SET category_name = ?, description = ? WHERE category_id = ?",
    [category_name, description, categoryId]
  );
  return result.affectedRows ? getCategoryById(categoryId) : null;
}

export async function deleteCategory(categoryId) {
  const [result] = await pool.execute(
    "DELETE FROM categories WHERE category_id = ?",
    [categoryId]
  );
  return result.affectedRows > 0;
}
