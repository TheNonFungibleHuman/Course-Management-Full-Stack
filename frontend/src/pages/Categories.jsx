import ComingSoon from "../components/ComingSoon.jsx";

export default function Categories() {
  return (
    <ComingSoon
      title="Categories"
      subtitle="Course categories"
      endpoint="GET / POST / PUT / DELETE /api/categories"
      willDo="List every category and support add, edit and delete, including the refusal when courses still reference one."
    />
  );
}
