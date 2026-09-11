import ComingSoon from "../components/ComingSoon.jsx";

export default function CourseDetails() {
  return (
    <ComingSoon
      title="Course Details"
      subtitle="A single course and its enrolled students"
      endpoint="GET /api/courses/:id and GET /api/courses/:id/students"
      willDo="Show the course information together with the students enrolled on it."
    />
  );
}
