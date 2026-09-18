import "dotenv/config";
import express from "express";
import cors from "cors";
import studentsRoutes from "./routes/studentsRoutes.js";
import coursesRoutes from "./routes/coursesRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import enrolmentsRoutes from "./routes/enrolmentsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 5000;

// Allows the frontend development server to send requests to this API.
app.use(cors());

// Converts incoming JSON request bodies into req.body for the controllers.
app.use(express.json());

// These base paths match the URLs used by frontend/src/services/api.js.
app.use("/api/students", studentsRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/enrolments", enrolmentsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Requests that do not match an API route return a consistent JSON error.
app.use(notFound);
app.use(errorHandler);

// The frontend sends API requests to http://localhost:5000/api by default.
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
