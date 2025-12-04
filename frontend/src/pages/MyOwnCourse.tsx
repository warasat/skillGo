import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInstructorCourses,
  deleteCourse,
  createCourse,
  updateCourse,
} from "../services/course/course.api";
import { getAllCategories } from "../services/category/category.api";
import type { Course } from "../types/course";
import type { CategoryResponse } from "../types/category";
import PortalLayout from "../layouts/PortalLayout";
import { LuPlus } from "react-icons/lu";

import CourseCard from "../components/CourseCard";
import CourseModal from "../components/Modal";
import ConfirmModal from "../components/DeleteModal";

const MyOwnCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      console.error("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const handleDeleteConfirm = async (courseId: string) => {
    try {
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setDeleteCourseId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <LuPlus /> Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={(id) => navigate(`/portal/courses/${id}`)}
              onEdit={(course, e) => {
                e.stopPropagation();
                setEditingCourse(course);
                setIsModalOpen(true);
              }}
              onDelete={(id, e) => {
                e.stopPropagation();
                setDeleteCourseId(id);
              }}
            />
          ))}
        </div>

        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={categories}
          initialData={editingCourse || undefined}
          onSubmit={async (payload) => {
            if (editingCourse) {
              await updateCourse(editingCourse._id, payload);
            } else {
              await createCourse(payload);
            }
            await fetchCourses();
          }}
        />

        <ConfirmModal
          isOpen={!!deleteCourseId}
          onClose={() => setDeleteCourseId(null)}
          onConfirm={() =>
            deleteCourseId && handleDeleteConfirm(deleteCourseId)
          }
          message="Are you sure you want to delete this course?"
        />
      </div>
    </PortalLayout>
  );
};

export default MyOwnCourses;
