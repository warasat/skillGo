import { useEffect, useState } from "react";
import { getInstructorCourses } from "../services/course/course.api"; // service banani hai
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";

const MyOwnCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses(); // call service
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Own Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{course.title}</h3>
              <p className="text-sm text-gray-600">{course.description}</p>
              <p className="mt-2 font-medium">
                Price: {course.paidStatus ? `$${course.amount}` : "Free"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default MyOwnCourses;
