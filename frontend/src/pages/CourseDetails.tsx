import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PortalLayout from "../layouts/PortalLayout";
import {
  getModulesByCourse,
  deleteModule,
} from "../services/module/module.api";
import API from "../services/api";
import CreateModuleModal from "../components/ModuleModal";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";

interface Module {
  _id: string;
  title: string;
  description?: string;
}

const CourseDetails = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const navigate = useNavigate();

  const fetchCourseData = async () => {
    try {
      const res = await API.get(`/courses/details/${courseId}`);
      setCourse(res.data.data.course);

      const fetchedModules = await getModulesByCourse(courseId!);
      const mappedModules = fetchedModules.map((mod: any) => ({
        _id: mod._id,
        title: mod.title,
        description: mod.description,
      }));
      setModules(mappedModules);
    } catch (err) {
      console.error("Failed to fetch course details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) fetchCourseData();
  }, [courseId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await deleteModule(id);
      setModules((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete module:", err);
      alert("Failed to delete module");
    }
  };

  if (loading)
    return (
      <PortalLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">
            Loading course details...
          </p>
        </div>
      </PortalLayout>
    );

  if (!course)
    return (
      <PortalLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Course not found.</p>
        </div>
      </PortalLayout>
    );

  return (
    <PortalLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-700 p-6 text-white flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="text-sm mb-3 hover:underline opacity-90 block"
              >
                ← Back to My Courses
              </button>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-gray-300 mt-2 max-w-2xl">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-300">
                <span>
                  <strong>Modules:</strong> {modules.length}
                </span>
                <span>
                  <strong>Price:</strong>{" "}
                  {course.paidStatus ? `$${course.amount}` : "Free"}
                </span>
                {course.category_id?.name && (
                  <span>
                    <strong>Category:</strong> {course.category_id.name}
                  </span>
                )}
              </div>
            </div>

            {/* Create Module Button */}
            <button
              onClick={() => {
                setEditingModule(null);
                setIsModalOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              + Create Module
            </button>
          </div>

          <div className="p-8 bg-white">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Course Modules
            </h2>

            {modules.length === 0 ? (
              <p className="text-gray-500 italic text-center py-8">
                No modules found for this course yet.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {modules.map((mod, index) => (
                  <div
                    key={mod._id}
                    onClick={() =>
                      navigate(
                        `/portal/courses/${encodeURIComponent(course.title)}/${
                          mod._id
                        }`
                      )
                    }
                    className="group border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-200 p-5 cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                        {index + 1}. {mod.title}
                      </h3>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingModule(mod);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          <LiaEditSolid />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(mod._id);
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          <RiDeleteBin7Line />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {mod.description ||
                        "No description available for this module."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Component */}
      <CreateModuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseId={course._id}
        courseTitle={course.title}
        moduleToEdit={editingModule || undefined}
        onModuleCreated={(newModule) => {
          if (editingModule) {
            setModules((prev) =>
              prev.map((m) => (m._id === newModule._id ? newModule : m))
            );
          } else {
            setModules((prev) => [...prev, newModule]);
          }
        }}
      />
    </PortalLayout>
  );
};

export default CourseDetails;
