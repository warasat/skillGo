import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import PortalLayout from "../layouts/PortalLayout";
import CreateLessonModal from "../components/lessonModal";
import ConfirmModal from "../components/DeleteModal";
import QuizModal from "../components/QuizModal";
import { getLessonsByModule } from "../services/lesson/lesson.api";
import { LiaEditSolid } from "react-icons/lia";
import { RiDeleteBin7Line } from "react-icons/ri";

import type { Quiz } from "../types/quiz";

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

  // Quiz state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<{ [moduleId: string]: Quiz[] }>({});
  const [quizToEdit, setQuizToEdit] = useState<Quiz | null>(null);
  const [quizToDeleteId, setQuizToDeleteId] = useState<string | null>(null);
  const [isQuizConfirmOpen, setIsQuizConfirmOpen] = useState(false);

  // Fetch module + lessons + quizzes
  useEffect(() => {
    const fetchModuleAndLessons = async () => {
      try {
        // Module fetch
        const res = await API.get(`/modules/module/${moduleId}`);
        setModule(res.data?.data || null);

        // Lessons fetch
        const lessonsRes = await getLessonsByModule(moduleId!);
        setLessons(lessonsRes);

        // Quizzes fetch
        try {
          const quizRes = await API.get(`/quizzes/module/${moduleId}`);
          const moduleQuizzes = quizRes.data?.data || [];
          setQuizzes((prev) => ({ ...prev, [moduleId!]: moduleQuizzes }));
        } catch (quizErr) {
          console.warn("No quizzes found for this module:", quizErr);
          setQuizzes((prev) => ({ ...prev, [moduleId!]: [] }));
        }
      } catch (err) {
        console.error("Failed to fetch module/lessons:", err);
        setModule(null);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchModuleAndLessons();
  }, [moduleId]);

  // Lesson handlers
  const handleCreateLessonClick = () => {
    setLessonToEdit(null);
    setIsLessonModalOpen(true);
  };
  const handleLessonModalClose = () => setIsLessonModalOpen(false);

  const handleLessonCreated = (lesson: Lesson) => {
    setLessons((prev) => {
      const index = prev.findIndex((l) => l._id === lesson._id);
      if (index !== -1) {
        const copy = [...prev];
        copy[index] = lesson;
        return copy;
      } else {
        return [...prev, lesson];
      }
    });
  };

  const handleEditLesson = (lesson: Lesson) => {
    setLessonToEdit(lesson);
    setIsLessonModalOpen(true);
  };

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
      setIsConfirmModalOpen(false);
    } catch (err) {
      console.error("Failed to delete lesson:", err);
      alert("Failed to delete lesson");
    }
  };

  // Quiz handlers
  const handleCreateQuizClick = () => {
    setQuizToEdit(null);
    setIsQuizModalOpen(true);
  };

  const handleQuizSuccess = (quiz: Quiz) => {
    setQuizzes((prev) => {
      const moduleQuizzes = prev[moduleId!] || [];
      const index = moduleQuizzes.findIndex((q) => q._id === quiz._id);
      if (index !== -1) {
        const copy = [...moduleQuizzes];
        copy[index] = quiz;
        return { ...prev, [moduleId!]: copy };
      } else {
        return { ...prev, [moduleId!]: [...moduleQuizzes, quiz] };
      }
    });
  };

  const handleEditQuiz = (quiz: Quiz) => {
    setQuizToEdit(quiz);
    setIsQuizModalOpen(true);
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizToDeleteId(quizId);
    setIsQuizConfirmOpen(true);
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDeleteId) return;
    try {
      const moduleQuizzes = quizzes[moduleId!] || [];
      await API.delete(`/quizzes/${quizToDeleteId}`);
      setQuizzes((prev) => ({
        ...prev,
        [moduleId!]: moduleQuizzes.filter((q) => q._id !== quizToDeleteId),
      }));
      setQuizToDeleteId(null);
      setIsQuizConfirmOpen(false);
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert("Failed to delete quiz");
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
            <button
              onClick={handleCreateQuizClick}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Create Quiz
            </button>
          </div>
        </div>

        {/* Module Description */}
        <p className="text-gray-700 leading-relaxed mb-6">
          {module.description || "No description available for this module."}
        </p>

        {/* Lessons List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-2">Lessons</h3>
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
                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                  >
                    <LiaEditSolid />
                  </button>
                  <button
                    onClick={() => handleDeleteLesson(lesson._id)}
                    className="text-red-600 hover:underline text-sm cursor-pointer"
                  >
                    <RiDeleteBin7Line />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No lessons created yet.</p>
          )}
        </div>

        {/* Quizzes List */}
        <div className="space-y-4 mt-8">
          <h3 className="text-xl font-semibold mb-2">Quizzes</h3>
          {quizzes[module._id]?.length ? (
            quizzes[module._id].map((quiz) => (
              <div
                key={quiz._id}
                className="border p-4 rounded shadow-sm bg-gray-50 flex justify-between items-start"
              >
                <div>
                  <h4 className="font-semibold text-lg">
                    Quiz: {quiz.questions[0]?.question}
                  </h4>
                  <p className="text-gray-700">
                    Questions: {quiz.questions.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuiz(quiz)}
                    className="text-blue-600 hover:underline text-sm cursor-pointer"
                  >
                    <LiaEditSolid />
                  </button>
                  <button
                    onClick={() => handleDeleteQuiz(quiz._id)}
                    className="text-red-600 hover:underline text-sm cursor-pointer"
                  >
                    <RiDeleteBin7Line />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No quizzes created yet.</p>
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

      {/* Quiz Modal */}
      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        moduleId={module._id}
        quiz={quizToEdit || undefined}
        onSuccess={handleQuizSuccess}
      />

      {/* Confirm Delete Modals */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteLesson}
        message="Are you sure you want to delete this lesson?"
      />

      <ConfirmModal
        isOpen={isQuizConfirmOpen}
        onClose={() => setIsQuizConfirmOpen(false)}
        onConfirm={confirmDeleteQuiz}
        message="Are you sure you want to delete this quiz?"
      />
    </PortalLayout>
  );
};

export default ModuleDetails;
