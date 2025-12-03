import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import {
  getInstructorCourses,
  deleteCourse,
} from "../services/course/course.api";
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";
import coursesIcon from "../assets/courses-icon2.jpg"; // verify path

const MyOwnCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = async (courseId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmDelete) return;

    try {
      await deleteCourse(courseId);
      alert("Course deleted successfully!");
      setCourses((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  // Edit course
  const handleEdit = (course: Course, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate("/portal/course", { state: { course } });
  };

  // Navigate to course details
  const handleCardClick = (courseId: string) => {
    navigate(`/portal/my-own-courses/${courseId}`);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">My Own Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => handleCardClick(course._id)}
              className="relative border rounded-lg shadow hover:shadow-lg transition transform hover:-translate-y-1 bg-white cursor-pointer overflow-hidden"
            >
              {/* Course Image */}
              <img
                src={coursesIcon}
                alt="Course Icon"
                className="w-full h-48 object-cover"
              />

              {/* Card Body */}
              <div className="p-4 flex flex-col gap-3">
                {/* Title & Description */}
                <h3 className="font-bold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600">{course.description}</p>

                {/* Separator */}
                <hr className="border-gray-300" />

                {/* Price & Module Count */}
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <div>
                    Price: {course.paidStatus ? `$${course.amount}` : "Free"}
                  </div>
                  <div>Modules: {course.moduleCount ?? 0}</div>
                </div>

                {/* Edit & Delete buttons */}
                <div className="flex justify-between mt-2">
                  <button
                    onClick={(e) => handleEdit(course, e)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(course._id, e)}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default MyOwnCourses;
