import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students.jsx";
import Courses from "./pages/Courses.jsx";
import CourseDetails from "./pages/CourseDetails.jsx";
import Enrolments from "./pages/Enrolments.jsx";
import Categories from "./pages/Categories.jsx";
import NotFound from "./pages/NotFound.jsx";

/**
 * Route definitions.
 *
 * A single layout route wraps every page, so the navigation bar is rendered
 * once and does not remount as the user moves between pages. Each page renders
 * into the layout's <Outlet />.
 */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetails />} />
          <Route path="enrolments" element={<Enrolments />} />
          <Route path="categories" element={<Categories />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
