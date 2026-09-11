import ComingSoon from "../components/ComingSoon.jsx";

export default function Courses() {
  return (
    <ComingSoon
      title="Courses"
      subtitle="Course catalogue"
      endpoint="GET / POST / PUT / DELETE /api/courses"
      willDo="List every course with its category and price, filter by category, and support add, edit and delete."
    />
  );
}
