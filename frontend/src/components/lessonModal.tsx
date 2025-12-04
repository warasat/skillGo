import { useState, useEffect } from "react";
import type { Lesson } from "../types/lesson";
import { createLesson, updateLesson } from "../services/lesson/lesson.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  moduleTitle: string;
  lessonToEdit?: Lesson;
  onLessonCreated: (lesson: Lesson) => void;
}

const CreateLessonModal = ({
  isOpen,
  onClose,
  moduleId,
  moduleTitle,
  lessonToEdit,
  onLessonCreated,
}: Props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill data if editing
  useEffect(() => {
    if (lessonToEdit) {
      setTitle(lessonToEdit.title);
      setContent(lessonToEdit.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [lessonToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (lessonToEdit) {
        const updatedLesson = await updateLesson(lessonToEdit._id, {
          title,
          content,
        });
        onLessonCreated(updatedLesson);
      } else {
        const newLesson = await createLesson({
          module_id: moduleId,
          title,
          content,
        } as Lesson);
        onLessonCreated(newLesson);
      }
      onClose();
    } catch (err: any) {
      console.error("Failed to create/update lesson:", err);
      alert(err.message || "Failed to create/update lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {lessonToEdit ? "Update Lesson" : "Create Lesson"} for{" "}
          <span className="text-blue-600">{moduleTitle}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter lesson title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter lesson content"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer "
            >
              {loading
                ? lessonToEdit
                  ? "Updating..."
                  : "Creating..."
                : lessonToEdit
                ? "Update Lesson"
                : "Create Lesson"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLessonModal;
