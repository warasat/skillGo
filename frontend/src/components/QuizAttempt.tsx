import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io"; // 👈 back arrow icon
import { getQuizByModule, submitQuizAttempt } from "../services/quiz/quiz.api";
import type { Quiz, QuizAnswer, QuizAttemptResult } from "../types/quiz";

interface QuizAttemptProps {
  moduleId: string;
  onBack?: () => void;
}

const QuizAttempt = ({ moduleId, onBack }: QuizAttemptProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizByModule(moduleId);

        // Now handle array response from backend
        const quizzesArray = Array.isArray(res) ? res : [res];
        const firstQuiz = quizzesArray.length > 0 ? quizzesArray[0] : null;

        setQuiz(firstQuiz);
        setAnswers([]);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuiz();
  }, [moduleId]);

  const handleSelect = (questionIndex: number, selectedOptionIndex: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = { questionIndex, selectedOptionIndex };
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const res = await submitQuizAttempt({
        quiz_id: quiz._id,
        answers,
      });
      setResult(res);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>No quiz found for this module.</p>;

  return (
    <div className="p-6 bg-white rounded shadow relative">
      <div
        onClick={onBack}
        className="flex items-center gap-1 text-blue-600 cursor-pointer mb-4 hover:underline w-fit"
      >
        <IoMdArrowBack size={20} />
        <span className="text-sm font-medium">Back to Module</span>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Quiz for Module
      </h2>

      {result ? (
        <div className="bg-green-50 p-4 rounded">
          <h3 className="text-lg font-bold text-green-600">
            Quiz Submitted Successfully!
          </h3>
          <p className="mt-2 text-gray-700">
            Score: <strong>{result.score}</strong> / {result.totalQuestions} (
            {result.percentage}%)
          </p>
        </div>
      ) : (
        <>
          {quiz.questions.map((q, index) => (
            <div
              key={q._id || index}
              className="mb-5 p-4 border rounded-lg bg-gray-50"
            >
              <p className="font-medium mb-2">
                {index + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt, optIndex) => (
                  <button
                    key={optIndex}
                    onClick={() => handleSelect(index, optIndex)}
                    className={`w-full text-left px-3 py-2 rounded border cursor-pointer ${
                      answers[index]?.selectedOptionIndex === optIndex
                        ? "bg-blue-100 border-blue-500"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizAttempt;
