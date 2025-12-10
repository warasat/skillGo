import { useState, useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import {
  getQuizByModule,
  submitQuizAttempt,
  getQuizAttemptByQuiz,
} from "../services/quiz/quiz.api";
import type { Quiz, QuizAnswer, QuizAttemptResult } from "../types/quiz";
import { AiOutlineSolution } from "react-icons/ai";

interface QuizAttemptProps {
  moduleId: string;
  onBack?: () => void;
}

const QuizAttempt = ({ moduleId, onBack }: QuizAttemptProps) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<QuizAttemptResult | null>(null);
  const [attempts, setAttempts] = useState<QuizAttemptResult[]>([]);
  const [showAttempts, setShowAttempts] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchQuizAndAttempts = async () => {
      try {
        const res = await getQuizByModule(moduleId);
        const quizzesArray = Array.isArray(res) ? res : [res];
        const firstQuiz = quizzesArray.length > 0 ? quizzesArray[0] : null;
        setQuiz(firstQuiz);
        setAnswers([]);

        if (firstQuiz?._id) {
          try {
            const attemptsData = await getQuizAttemptByQuiz(firstQuiz._id);
            setAttempts(attemptsData.slice(0, 3));
          } catch (err: any) {
            if (err.response && err.response.status === 404) {
              setAttempts([]);
            } else {
              console.error("Error fetching attempts:", err);
            }
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchQuizAndAttempts();
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
    if (attempts.length >= 3) {
      alert("You have reached the maximum of 3 attempts for this quiz.");
      return;
    }

    try {
      const res = await submitQuizAttempt({
        quiz_id: quiz._id,
        answers,
      });
      setResult(res);

      const updatedAttempts = await getQuizAttemptByQuiz(quiz._id);
      setAttempts(updatedAttempts.slice(0, 3));
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>No quiz found for this module.</p>;

  const answeredCount = answers.filter((a) => a !== undefined).length;
  const totalQuestions = quiz.questions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div className="p-6 bg-white rounded shadow relative">
      {/*  Back Button */}
      <div
        onClick={onBack}
        className="flex items-center gap-1 text-blue-600 cursor-pointer mb-4 hover:underline w-fit"
      >
        <IoMdArrowBack size={20} />
        <span className="text-sm font-medium">Back to Module</span>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Quiz for Module</h2>

        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
          <p className="text-sm text-gray-700">
            Attempts: <strong>{attempts.length}</strong> / 3
          </p>
          <button
            onClick={() => setShowAttempts(!showAttempts)}
            className=" hover:text-blue-800 cursor-pointer"
            title="View past results"
          >
            <AiOutlineSolution />
          </button>
        </div>
      </div>

      {/*  Show Attempts */}
      {showAttempts ? (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-3">
            {attempts.length ? "Your Last 3 Attempts" : "No attempts yet"}
          </h3>

          {attempts.length > 0 ? (
            attempts.slice(0, 3).map((a, index) => (
              <div
                key={index}
                className={`p-5 border rounded-xl shadow-sm ${
                  a.passStatus
                    ? "bg-green-50 border-green-300"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4
                    className={`text-lg font-bold ${
                      a.passStatus ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    Attempt #{attempts.length - index}
                  </h4>

                  {/*  Clear Passed / Failed label */}
                  <span
                    className={`text-sm font-semibold ${
                      a.passStatus ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {a.percentage}% — {a.passStatus ? "Passed ✅" : "Failed ❌"}
                  </span>
                </div>

                <p className="text-gray-700">
                  Score: <strong>{a.score}</strong> / {a.totalQuestions}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm italic">No attempts yet.</p>
          )}
        </div>
      ) : (
        <>
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
                result.passStatus
                  ? "bg-green-50 border-green-300"
                  : "bg-red-50 border-red-300"
              }`}
            >
              {result.passStatus && (
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
                  result.passStatus ? "text-green-600" : "text-red-600"
                }`}
              >
                {result.passStatus
                  ? "🎉 Congratulations! You passed the exam."
                  : "❌ You did not pass the exam."}
              </h3>
              <p className="text-gray-700">
                Score: <strong>{result.score}</strong> / {result.totalQuestions}{" "}
                ({result.percentage}%)
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
        </>
      )}
    </div>
  );
};

export default QuizAttempt;
