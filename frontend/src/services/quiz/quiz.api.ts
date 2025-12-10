import API from "../api";
import API_CONSTANTS from "../apiConstants";
import type {
  Quiz,
  QuizAnswer,
  QuizAttemptResult,
  QuizCreatePayload,
  QuizUpdatePayload,
} from "../../types/quiz";

export const getQuizByModule = async (
  moduleId: string
): Promise<Quiz | null> => {
  const res = await API.get(`${API_CONSTANTS.quiz.getByModule}/${moduleId}`);
  return res.data.data;
};

export const submitQuizAttempt = async (payload: {
  quiz_id: string;
  answers: QuizAnswer[];
}): Promise<QuizAttemptResult> => {
  const res = await API.post(API_CONSTANTS.quiz.submitAttempt, payload);
  return res.data.data;
};

export const getQuizAttemptByQuiz = async (
  quizId: string
): Promise<QuizAttemptResult[] | []> => {
  const res = await API.get(`${API_CONSTANTS.quiz.getAttemptByQuiz}/${quizId}`);
  return res.data.data || [];
};

export const createQuiz = async (payload: QuizCreatePayload): Promise<Quiz> => {
  const res = await API.post(API_CONSTANTS.quiz.createQuiz, payload);
  return res.data.data;
};

export const updateQuiz = async (
  quizId: string,
  payload: QuizUpdatePayload
): Promise<Quiz> => {
  const res = await API.patch(
    `${API_CONSTANTS.quiz.updateQuiz}/${quizId}`,
    payload
  );
  return res.data.data;
};

export const deleteQuiz = async (
  quizId: string
): Promise<{ message: string }> => {
  const res = await API.delete(`${API_CONSTANTS.quiz.deleteQuiz}/${quizId}`);
  return res.data;
};
