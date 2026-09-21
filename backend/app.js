import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import pool from "./config/database.js";
import swaggerDocument from "./swagger/swagger.js";
import studentsRoutes from "./routes/studentsRoutes.js";
import coursesRoutes from "./routes/coursesRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import enrolmentsRoutes from "./routes/enrolmentsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

// Only the frontend development server is allowed to call this API.
app.use(cors({ origin: "http://localhost:5173" }));

// Converts incoming JSON request bodies into req.body for the controllers.
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// These base paths match the URLs used by frontend/src/services/api.js.
app.use("/api/students", studentsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/enrolments", enrolmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Requests that do not match an API route return a consistent JSON error.
app.use(notFound);
app.use(errorHandler);

async function start() {
  // Checks the database connection up front, so a wrong password or a missing
  // database is reported at startup rather than as a failed request later.
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log(`Connected to database "${process.env.DB_NAME || "course_management"}"`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

start();

export default app;
