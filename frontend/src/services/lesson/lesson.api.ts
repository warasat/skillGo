import API from "../api";
import type {
  Lesson,
  LessonResponseSingle,
  LessonResponseArray,
} from "../../types/lesson";

// Create lesson
export const createLesson = async (
  payload: Lesson
): Promise<LessonResponseSingle["data"]> => {
  try {
    const res = await API.post<LessonResponseSingle>(
      "/lessons/create-lesson",
      payload
    );
    console.log("Lesson created:", res.data.data);
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to create lesson");
  }
};

// Get lessons for a specific module
export const getLessonsByModule = async (
  moduleId: string
): Promise<Lesson[]> => {
  try {
    const res = await API.get<LessonResponseArray>(`/lessons/${moduleId}`);
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch lessons");
  }
};

// Update lesson
export const updateLesson = async (
  lessonId: string,
  payload: Partial<Lesson>
): Promise<LessonResponseSingle["data"]> => {
  try {
    const res = await API.patch<LessonResponseSingle>(
      `/lessons/${lessonId}`,
      payload
    );
    console.log("Lesson updated:", res.data.data);
    return res.data.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update lesson");
  }
};

// Delete lesson
export const deleteLesson = async (lessonId: string): Promise<string> => {
  try {
    const res = await API.delete<LessonResponseSingle>(`/lessons/${lessonId}`);
    console.log("Lesson deleted:", res.data.message);
    return res.data.message;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete lesson");
  }
};
