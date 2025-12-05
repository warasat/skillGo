import type { Course } from "../types/course";

const CourseInfo = ({ course }: { course: Course }) => {
  return (
    <div className="space-y-3 p-4 border rounded-md shadow-sm">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <p className="text-gray-700">{course.description}</p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Price:</strong>{" "}
          {course.paidStatus ? `$${course.amount}` : "Free"}
        </p>
        <p>
          <strong>Category:</strong> {course.category_id.name}
        </p>
        <p>
          <strong>Instructor:</strong> {course.user_id.name}
        </p>
        <p>
          <strong>Module Count:</strong> {course.moduleCount}
        </p>
      </div>
    </div>
  );
};

export default CourseInfo;
