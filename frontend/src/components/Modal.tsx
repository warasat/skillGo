import { useState, useEffect } from "react";
import type { CategoryResponse } from "../types/category";
import type { CourseRequest, Course } from "../types/course";
import CONSTANTS from "../constants/constants";

const UPDATED_BLACK_COLOR = CONSTANTS.color_constants.headings.hex;

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryResponse[];
  onSubmit: (payload: CourseRequest) => Promise<void>;
  initialData?: Course;
}

const CourseModal = ({
  isOpen,
  onClose,
  categories,
  onSubmit,
  initialData,
}: CourseModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [paidStatus, setPaidStatus] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCategoryId(initialData.category_id._id);
      setPaidStatus(initialData.paidStatus);
      setAmount(initialData.amount);
    } else {
      setTitle("");
      setDescription("");
      setCategoryId("");
      setPaidStatus(false);
      setAmount(0);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);

    try {
      if (!title || !description || !categoryId) {
        throw new Error("Title, description, and category are required.");
      }
      if (paidStatus && amount <= 0) {
        throw new Error("Please enter valid amount for paid course.");
      }

      const user = localStorage.getItem("user");
      const user_id = user ? JSON.parse(user)._id : "";

      const payload: CourseRequest = {
        user_id,
        category_id: categoryId,
        title,
        description,
        paidStatus,
        amount: paidStatus ? amount : 0,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setFormLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
        >
          ✕
        </button>

        <h2
          className="text-xl font-bold mb-4 text-center"
          style={{ color: UPDATED_BLACK_COLOR }}
        >
          {initialData ? "Update Course" : "Create Course"}
        </h2>

        {error && <p className="mb-2 text-red-600 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={formLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={formLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
              disabled={formLoading}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={paidStatus}
              onChange={(e) => setPaidStatus(e.target.checked)}
              disabled={formLoading}
            />
            <label>Paid Course?</label>
          </div>

          {paidStatus && (
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                disabled={formLoading}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={formLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 cursor-pointer"
          >
            {formLoading
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
              ? "Update Course"
              : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
