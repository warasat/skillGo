import { useState, useEffect } from "react";
import type {
  Quiz,
  QuizQuestion,
  QuizCreatePayload,
  QuizUpdatePayload,
} from "../types/quiz";
import { createQuiz, updateQuiz } from "../services/quiz/quiz.api";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleId: string;
  quiz?: Quiz;

  onSuccess: (quiz: Quiz) => void;
}

const QuizModal = ({
  isOpen,
  onClose,
  moduleId,
  quiz,
  onSuccess,
}: QuizModalProps) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      // Edit mode: load existing questions
      setQuestions(
        quiz.questions.map((q) => ({
          ...q,
          correctOptionIndex: q.correctOptionIndex ?? 0,
        }))
      );
    } else {
      // Create mode: start with one empty question
      setQuestions([
        { question: "", options: ["", "", "", ""], correctOptionIndex: 0 },
      ]);
    }
  }, [quiz]);

  const handleQuestionChange = (index: number, value: string) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index].question = value;
      return updated;
    });
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].options[optIndex] = value;
      return updated;
    });
  };

  const handleCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[qIndex].correctOptionIndex = optIndex;
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], correctOptionIndex: 0 },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        alert(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some((opt) => !opt.trim())) {
        alert(`All 4 options must be filled for question ${i + 1}`);
        return;
      }
    }

    setLoading(true);
    try {
      if (quiz) {
        // Update
        const payload: QuizUpdatePayload = { questions };
        const updated = await updateQuiz(quiz._id, payload);
        onSuccess(updated);
      } else {
        // Create
        const payload: QuizCreatePayload = { module_id: moduleId, questions };
        const created = await createQuiz(payload);
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-start pt-20  bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {quiz ? "Edit Quiz" : "Create Quiz"}
        </h2>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold">Question {qIndex + 1}</label>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              type="text"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full px-3 py-2 mb-3 border rounded focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter question text"
            />

            <div className="grid grid-cols-2 gap-3">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctOptionIndex === optIndex}
                    onChange={() => handleCorrectOption(qIndex, optIndex)}
                    className="cursor-pointer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    placeholder={`Option ${optIndex + 1}`}
                    className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={addQuestion}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add Question
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {quiz ? "Update Quiz" : "Create Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
