import { useEffect, useState } from "react";
import { createModule, updateModule } from "../services/module/module.api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  moduleToEdit?: {
    _id: string;
    title: string;
    description?: string;
  }; // optional for edit
  onModuleCreated: (newModule: {
    _id: string;
    title: string;
    description?: string;
  }) => void;
}

const CreateModuleModal = ({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  moduleToEdit,
  onModuleCreated,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill form when editing
  useEffect(() => {
    if (moduleToEdit) {
      setTitle(moduleToEdit.title);
      setDescription(moduleToEdit.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [moduleToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { course_id: courseId, title, description };
      let newModule;

      if (moduleToEdit) {
        // EDIT MODE
        newModule = await updateModule(moduleToEdit._id, payload);
      } else {
        // CREATE MODE
        newModule = await createModule(payload);
      }

      onModuleCreated(newModule);
      onClose();
    } catch (err: any) {
      console.error("❌ Failed to create/update module:", err);
      alert(err.response?.data?.message || "Failed to create/update module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {moduleToEdit ? "Update Module" : "Create Module"} for{" "}
          <span className="text-blue-600">{courseTitle}</span>
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
              placeholder="Enter module title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Enter module description"
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
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
            >
              {loading
                ? moduleToEdit
                  ? "Updating..."
                  : "Creating..."
                : moduleToEdit
                ? "Update Module"
                : "Create Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModuleModal;
