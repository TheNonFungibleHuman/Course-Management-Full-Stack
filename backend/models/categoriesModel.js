import pool from "../config/database.js";

export async function getAllCategories() {
  const [rows] = await pool.execute(
    "SELECT category_id, category_name FROM categories ORDER BY category_name"
  );
  return rows;
}

export async function getCategoryById(categoryId) {
  const [rows] = await pool.execute(
    "SELECT category_id, category_name FROM categories WHERE category_id = ?",
    [categoryId]
  );
  return rows[0] ?? null;
}

export async function createCategory({ category_name }) {
  const [result] = await pool.execute(
    "INSERT INTO categories (category_name) VALUES (?)",
    [category_name]
  );
  return getCategoryById(result.insertId);
}

export async function updateCategory(categoryId, { category_name }) {
  const [result] = await pool.execute(
    "UPDATE categories SET category_name = ? WHERE category_id = ?",
    [category_name, categoryId]
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
