import { useEffect, useState } from "react";
import { getAllCourse } from "../services/course/course.api";
import { enrollCourse } from "../services/enrollment/enrollment.api";
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";
import { getTokenFromLocalStorage } from "../utils/utils";

const GetCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]); // store enrolled course ids

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getAllCourse();
        setCourses(data);
      } catch (err: any) {
        setError(err.message || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (course: Course) => {
    console.log("Token from localStorage:", getTokenFromLocalStorage());
    console.log("Course ID clicked:", course._id);
    try {
      if (!course.paidStatus) {
        // Free course → auto-enroll
        const enrollment = await enrollCourse(course._id);
        console.log("Enrolled:", enrollment);
        setEnrolledCourses((prev) => [...prev, course._id]);
        alert(`Successfully enrolled in ${course.title}`);
      } else {
        // Paid course → temporary payment handling
        const confirmPayment = window.confirm(
          `Pay $${course.amount} to enroll in ${course.title}?`
        );
        if (confirmPayment) {
          const enrollment = await enrollCourse(course._id);
          console.log("Paid & Enrolled:", enrollment);
          setEnrolledCourses((prev) => [...prev, course._id]);
          alert(`Payment successful! Enrolled in ${course.title}`);
        }
      }
    } catch (err: any) {
      console.error("Enrollment failed:", err);
      alert(err.message || "Failed to enroll");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Courses</h2>
        {courses.length === 0 ? (
          <p>No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <button
                  onClick={() => handleEnroll(course)}
                  className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  disabled={enrolledCourses.includes(course._id)}
                >
                  {enrolledCourses.includes(course._id)
                    ? "Enrolled"
                    : course.paidStatus
                    ? "Pay & Enroll"
                    : "Enroll"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default GetCourses;
