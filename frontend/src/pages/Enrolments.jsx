import ComingSoon from "../components/ComingSoon.jsx";

export default function Enrolments() {
  return (
    <ComingSoon
      title="Enrolments"
      subtitle="Students enrolled on courses"
      endpoint="GET /api/enrolments/details and POST / PUT / DELETE /api/enrolments"
      willDo="List every enrolment with the student and course names, and support add, edit and delete."
    />
  );
}
