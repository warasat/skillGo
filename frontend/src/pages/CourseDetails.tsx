import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PortalLayout from "../layouts/PortalLayout";
import API from "../services/api";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/courses/details/${courseId}`);
        setCourse(res.data.data.course);
        setModules(res.data.data.modules || []);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchDetails();
  }, [courseId]);

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
          {/* Course Header */}
          <div className="bg-gray-700 p-6 text-white">
            <button
              onClick={() => navigate(-1)}
              className="text-sm mb-3 hover:underline opacity-90"
            >
              ← Back to My Courses
            </button>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-300 mt-2 max-w-2xl">{course.description}</p>

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

          {/* Course Content */}
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
                    className="group border border-gray-200 rounded-xl bg-gray-50 shadow-sm hover:shadow-lg transition-all duration-200 p-5"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-lg text-gray-800 group-hover:text-gray-900 transition-colors">
                        {index + 1}. {mod.title}
                      </h3>
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
    </PortalLayout>
  );
};

export default CourseDetails;
