import { useEffect, useState } from "react";
import { getMyCourses } from "../services/enrollment/enrollment.api";
import type { EnrollmentRequest } from "../types/enrollment";
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";
import CourseCard from "../components/CourseCard";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const enrolledData = await getMyCourses();
        console.log("Enrollments fetched:", enrolledData);
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

  const filteredCourses = myCourses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PortalLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>

        {/* Search Field */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredCourses.length === 0 ? (
          <p>You are not enrolled in any courses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} onClick={() => {}} />
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default MyCourses;
