import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseProgressLayout from "../layouts/CourseProgressLayout";
import { getCourseById } from "../services/course/course.api";
import { getLessonsByModule } from "../services/lesson/lesson.api";
import { getModulesByCourse } from "../services/module/module.api";
import type { Course } from "../types/course";
import type { ModuleResponse } from "../types/module";
import type { Lesson } from "../types/lesson";

import CourseInfo from "../components/CourseInfo";
import LessonInfo from "../components/LessonInfo";
import QuizAttempt from "../components/QuizAttempt";

import { GrChapterAdd } from "react-icons/gr";
import { BiBookOpen } from "react-icons/bi";
import { PiExamThin } from "react-icons/pi";

const CourseProgressPage = () => {
  const { courseId } = useParams();

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleResponse[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [selectedModule, setSelectedModule] = useState<ModuleResponse | null>(
    null
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [openModuleId, setOpenModuleId] = useState<string | null>(null);

  // STATE for quiz handling
  const [showQuiz, setShowQuiz] = useState(false);

  // Fetch course and modules
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        const res = await getCourseById(courseId);
        const courseData = res.data as Course;
        setSelectedCourse(courseData);

        if (courseData._id) {
          const moduleRes = await getModulesByCourse(courseData._id);
          setModules(moduleRes || []);
        }
      } catch (err) {
        console.error("Error fetching course or modules:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle module click
  const handleModuleClick = async (module: ModuleResponse) => {
    setSelectedModule(module);
    setSelectedLesson(null);
    setShowQuiz(false);

    if (openModuleId === module._id) {
      setOpenModuleId(null);
      setLessons([]);
      return;
    }

    setOpenModuleId(module._id);

    try {
      const data = await getLessonsByModule(module._id);
      setLessons(data);
    } catch (err) {
      console.error("Error fetching lessons:", err);
    }
  };

  // Handle lesson click
  const handleLessonClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setShowQuiz(false);
  };

  // Handle quiz view trigger
  const handleShowQuiz = (module: ModuleResponse) => {
    setSelectedModule(module);
    setSelectedLesson(null);
    setShowQuiz(true);
  };

  return (
    <CourseProgressLayout
      rightSidebar={
        <div>
          <h3 className="text-lg font-semibold mb-3 border-b pb-2">
            {selectedCourse?.title || "Course"}
          </h3>

          <div className="ml-3 mt-2 space-y-1">
            {modules.length > 0 ? (
              modules.map((module) => (
                <div key={module._id}>
                  <div
                    className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-500 flex items-center gap-2"
                    onClick={() => handleModuleClick(module)}
                  >
                    <GrChapterAdd />
                    {module.title}
                  </div>

                  {/* Lessons */}
                  {openModuleId === module._id && (
                    <div className="ml-4 mt-1 space-y-2">
                      {lessons.length > 0 ? (
                        lessons.map((lesson) => (
                          <div
                            key={lesson._id}
                            className="cursor-pointer text-sm text-gray-600 hover:text-blue-400 flex items-center gap-2"
                            onClick={() => handleLessonClick(lesson)}
                          >
                            <BiBookOpen />
                            {lesson.title}
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400 ml-2">
                          No lessons found
                        </p>
                      )}

                      {/* Single Attempt Quiz button for the module */}
                      {selectedModule && (
                        <button
                          onClick={() => handleShowQuiz(selectedModule)}
                          className="cursor-pointer text-sm text-gray-600 hover:text-green-400 flex items-center gap-2"
                        >
                          <PiExamThin />
                          Attempt Quiz
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 ml-2">No modules found</p>
            )}
          </div>
        </div>
      }
    >
      {/* Main content */}
      <div className="p-4">
        {showQuiz && selectedModule ? (
          <QuizAttempt
            moduleId={selectedModule._id}
            onBack={() => setShowQuiz(false)}
          />
        ) : selectedLesson ? (
          <LessonInfo lesson={selectedLesson} />
        ) : selectedModule ? (
          <div>
            {/* ModuleInfo removed Attempt Quiz button */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedModule.title}
            </h2>
            <p className="text-gray-600">{selectedModule.description}</p>
          </div>
        ) : selectedCourse ? (
          <CourseInfo course={selectedCourse} />
        ) : (
          <p className="text-gray-500">Select a course to view details</p>
        )}
      </div>
    </CourseProgressLayout>
  );
};

export default CourseProgressPage;
