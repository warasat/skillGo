import { useEffect, useState } from "react";
import { getAllCategories } from "../services/category/category.api";
import { createCourse } from "../services/course/course.api";
import type { CategoryResponse } from "../types/category";
import type { CourseRequest } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";

const CourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paidStatus, setPaidStatus] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (err: any) {
        setError("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!title || !description || !categoryId) {
        throw new Error("Title, description and category are required.");
      }

      if (paidStatus && amount <= 0) {
        throw new Error("Please enter a valid amount for paid courses.");
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

      const res = await createCourse(payload);
      setSuccess("Course created successfully!");
      console.log("Created course:", res);

      setTitle("");
      setDescription("");
      setCategoryId("");
      setPaidStatus(false);
      setAmount(0);
    } catch (err: any) {
      setError(err.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Course</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {}
                  </option>
                ))}
              </select>
            </div>

            {/* Paid Status */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={paidStatus}
                onChange={(e) => setPaidStatus(e.target.checked)}
                className="mr-2"
                disabled={loading}
              />
              <label>Paid Course?</label>
            </div>

            {/* Amount */}
            {paidStatus && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Course"}
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CourseForm;
