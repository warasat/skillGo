import React from "react";
import type { Course } from "../types/course";
import { RiBookOpenLine } from "react-icons/ri";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";
import coursesIcon from "../assets/courses-icon2.jpg";
import type { ReactNode } from "react";

export interface CourseCardProps {
  course: Course;
  onClick: (id: string) => void;
  onEdit?: (course: Course, e: React.MouseEvent) => void;
  onDelete?: (id: string, e: React.MouseEvent) => void;
  children?: ReactNode;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onClick,
  onEdit,
  onDelete,
  children,
}) => {
  return (
    <div
      onClick={() => onClick(course._id)}
      className="relative border border-gray-300 rounded-3xl shadow hover:shadow-lg transition transform hover:-translate-y-1 bg-white cursor-pointer overflow-hidden"
    >
      <img
        src={coursesIcon}
        alt="Course Icon"
        className="w-full h-48 object-cover"
      />
      <div className="px-4 py-2 flex flex-col gap-2">
        {/* Category badge */}
        <div className="flex items-center gap-1 mb-1">
          <span className="bg-gray-100 text-blue-400 text-xs font-semibold px-2 py-1 rounded-xl flex items-center gap-1">
            <RiBookOpenLine />{" "}
            {typeof course.category_id === "object"
              ? course.category_id.name
              : ""}
          </span>
        </div>

        <h3 className="font-bold text-lg">{course.title}</h3>
        <p className="text-sm text-gray-600">{course.description}</p>
        <p className="text-xs text-gray-500">
          Instructor:{" "}
          {typeof course.user_id === "object" ? course.user_id.name : ""}
        </p>

        <hr className="border-gray-300" />

        <div className="flex justify-between text-sm font-medium text-gray-700">
          <div>Price: {course.paidStatus ? `$${course.amount}` : "Free"}</div>
          <div>Modules: {course.moduleCount ?? 0}</div>
        </div>

        <div className="flex justify-between mt-2">
          {onEdit && (
            <button
              onClick={(e) => onEdit(course, e)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <LiaEditSolid /> Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => onDelete(course._id, e)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
            >
              <RiDeleteBin7Line /> Delete
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default CourseCard;
