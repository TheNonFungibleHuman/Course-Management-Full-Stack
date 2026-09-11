import ComingSoon from "../components/ComingSoon.jsx";

export default function Students() {
  return (
    <ComingSoon
      title="Students"
      subtitle="Student records"
      endpoint="GET / POST / PUT / DELETE /api/students"
      willDo="List every student, then add, edit and delete records through a validated form."
    />
  );
}
