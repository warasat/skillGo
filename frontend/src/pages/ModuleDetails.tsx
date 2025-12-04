import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import PortalLayout from "../layouts/PortalLayout";
import CreateLessonModal from "../components/lessonModal";
import ConfirmModal from "../components/DeleteModal";
import { getLessonsByModule } from "../services/lesson/lesson.api";

interface Lesson {
  _id: string;
  module_id: string;
  title: string;
  content: string;
}

interface Module {
  _id: string;
  title: string;
  description?: string;
}

const ModuleDetails = () => {
  const { courseName, moduleId } = useParams<{
    courseName: string;
    moduleId: string;
  }>();
  const navigate = useNavigate();

  const [module, setModule] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonToEdit, setLessonToEdit] = useState<Lesson | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [lessonToDeleteId, setLessonToDeleteId] = useState<string | null>(null);

  // Fetch module + lessons
  useEffect(() => {
    const fetchModuleAndLessons = async () => {
      try {
        const res = await API.get(`/modules/module/${moduleId}`);
        setModule(res.data.data);

        const lessonsRes = await getLessonsByModule(moduleId!);
        setLessons(lessonsRes);
      } catch (err) {
        console.error("Failed to fetch module/lessons:", err);
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchModuleAndLessons();
  }, [moduleId]);

  // Create lesson button
  const handleCreateLessonClick = () => {
    setLessonToEdit(null);
    setIsLessonModalOpen(true);
  };
  const handleLessonModalClose = () => setIsLessonModalOpen(false);

  // Lesson created / updated handler
  const handleLessonCreated = (lesson: Lesson) => {
    setLessons((prev) => {
      const index = prev.findIndex((l) => l._id === lesson._id);
      if (index !== -1) {
        // Update existing
        const copy = [...prev];
        copy[index] = lesson;
        return copy;
      } else {
        // Add new
        return [...prev, lesson];
      }
    });
  };

  // Edit lesson
  const handleEditLesson = (lesson: Lesson) => {
    setLessonToEdit(lesson);
    setIsLessonModalOpen(true);
  };

  // Delete lesson
  const handleDeleteLesson = (lessonId: string) => {
    setLessonToDeleteId(lessonId);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDeleteId) return;

    try {
      await API.delete(`/lessons/${lessonToDeleteId}`);
      setLessons((prev) => prev.filter((l) => l._id !== lessonToDeleteId));
      setLessonToDeleteId(null);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson");
    }
  };

  if (loading)
    return (
      <PortalLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">
            Loading module details...
          </p>
        </div>
      </PortalLayout>
    );

  if (!module)
    return (
      <PortalLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">Module not found.</p>
        </div>
      </PortalLayout>
    );

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
        >
          &larr; Back
        </button>

        {/* Module Title + Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {decodeURIComponent(courseName || "")}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              {module.title}
            </h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleCreateLessonClick}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Create Lesson
            </button>
          </div>
        </div>

        {/* Module Description */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {module.description || "No description available for this module."}
        </p>

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.length ? (
            lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="border p-4 rounded shadow-sm bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold text-lg">{lesson.title}</h3>
                  <p className="text-gray-700">{lesson.content}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditLesson(lesson)}
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson._id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No lessons created yet.</p>
          )}
        </div>
      </div>

      {/* Lesson Modal */}
      <CreateLessonModal
        isOpen={isLessonModalOpen}
        onClose={handleLessonModalClose}
        moduleId={module._id}
        moduleTitle={module.title}
        lessonToEdit={lessonToEdit || undefined}
        onLessonCreated={handleLessonCreated}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteLesson}
        message="Are you sure you want to delete this lesson?"
      />
    </PortalLayout>
  );
};

export default ModuleDetails;
