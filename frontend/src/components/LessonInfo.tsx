import type { Lesson } from "../types/lesson";

const LessonInfo = ({ lesson }: { lesson: Lesson }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
      <p>{lesson.content}</p>
    </div>
  );
};

export default LessonInfo;
