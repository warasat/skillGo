import { useEffect, useState } from "react";
import { createModule } from "../services/module/module.api";
import { getInstructorCourses } from "../services/course/course.api";
import type { Course } from "../types/course";
import PortalLayout from "../layouts/PortalLayout";

const CreateModule = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch instructor's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getInstructorCourses();
        setCourses(data);
      } catch (err: any) {
        console.error("Failed to fetch instructor courses:", err);
        setMessage("Failed to fetch courses");
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (!courseId || !title || !description) {
        throw new Error("All fields are required");
      }

      const payload = { course_id: courseId, title, description };
      const res = await createModule(payload);
      console.log("✅ Created Module:", res);

      setMessage("Module created successfully!");
      setCourseId("");
      setTitle("");
      setDescription("");
    } catch (err: any) {
      console.error("❌ Module creation failed:", err);
      setMessage(err.message || "Failed to create module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PortalLayout>
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Create Module</h2>

        {message && (
          <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Select Course
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">-- Select your course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Module Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter module title"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Module Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter module description"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Module"}
          </button>
        </form>
      </div>
    </PortalLayout>
  );
};

export default CreateModule;
