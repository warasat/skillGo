import { useEffect, useState } from "react";
import { getMyCourses } from "../services/enrollment/enrollment.api";
import type { EnrollmentRequest } from "../types/enrollment";
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrolledData = await getMyCourses();
        console.log(" Enrollments:", enrolledData);
        setEnrollments(enrolledData);
      } catch (err) {
        console.error("Error fetching MyCourses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const myCourses: Course[] = enrollments
    .map((enroll) => enroll.course_id as unknown as Course)
    .filter((course): course is Course => course != null);

  console.log("Mapped MyCourses:", myCourses);

  return (
    <PortalLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        {myCourses.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => (
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
        )}
      </div>
    </PortalLayout>
  );
};

export default MyCourses;
