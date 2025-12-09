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

        // Ensure array from backend
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

  // Calculate progress
  const answeredCount = answers.filter((a) => a !== undefined).length;
  const totalQuestions = quiz.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="p-6 bg-white rounded shadow relative">
      {/* Back Button */}
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

      {/* Progress Bar */}
      {!result && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-right">
            {answeredCount} / {totalQuestions} answered
          </p>
        </div>
      )}

      {/* Quiz or Result */}
      {result ? (
        <div
          className={`relative p-6 rounded-xl shadow-lg border ${
            result.passed
              ? "bg-green-50 border-green-300"
              : "bg-red-50 border-red-300"
          }`}
        >
          {/* Confetti emojis */}
          {result.passed && (
            <>
              <span className="absolute top-0 left-2 text-yellow-400 text-3xl animate-bounce">
                ✨
              </span>
              <span className="absolute top-1/4 right-4 text-pink-400 text-3xl animate-bounce">
                🎊
              </span>
              <span className="absolute bottom-2 left-1/4 text-blue-400 text-3xl animate-bounce">
                🎉
              </span>
            </>
          )}

          <h3
            className={`text-xl font-extrabold mb-2 ${
              result.passed ? "text-green-600" : "text-red-600"
            }`}
          >
            {result.passed
              ? "🎉 Congratulations! You passed the exam."
              : "❌ You did not pass the exam."}
          </h3>

          <p className="text-gray-700">
            Score: <strong>{result.score}</strong> / {result.totalQuestions} (
            {result.percentage}%)
          </p>

          {/* Show per-question feedback */}
          <div className="mt-4 space-y-3">
            {result.attempt.answers.map(
              (
                a: {
                  isCorrect: boolean;
                  question: string;
                  selectedOptionIndex: number | null;
                },
                idx: number
              ) => (
                <div
                  key={idx}
                  className={`p-2 border rounded ${
                    a.isCorrect
                      ? "border-green-400 bg-green-50"
                      : "border-red-400 bg-red-50"
                  }`}
                >
                  <p className="font-medium">
                    {idx + 1}. {a.question}
                  </p>
                  <p className="text-sm">
                    Your answer:{" "}
                    <strong>
                      {a.selectedOptionIndex !== null
                        ? quiz.questions[idx].options[a.selectedOptionIndex]
                        : "Not answered"}
                    </strong>
                  </p>
                  {a.isCorrect && (
                    <p className="text-green-600 text-sm">Correct ✅</p>
                  )}
                  {!a.isCorrect && (
                    <p className="text-red-600 text-sm">Incorrect ❌</p>
                  )}
                </div>
              )
            )}
          </div>
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
            disabled={answeredCount !== totalQuestions}
            className={`mt-4 px-6 py-2 rounded text-white cursor-pointer ${
              answeredCount === totalQuestions
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Quiz
          </button>
        </>
      )}
    </div>
  );
};

export default QuizAttempt;
