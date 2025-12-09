const API_CONSTANTS = {
  auth: {
    login: "/users/login",
    register: "/users/register",
    me: "/users/auth/me",
  },
  category: {
    getAll: "/categories/get-category",
  },
  course: {
    create: "/courses/create-course",
    read: "/courses/get-course",
    readById: "/courses",
    instructorCourse: "/courses/instructor-courses",
  },
  enrollment: {
    enroll: "/enrollments/enroll",
    myEnrollments: "/enrollments/my-enrollments",
  },
  module: {
    create: "/modules/create-module",
  },
  quiz: {
    getByModule: "/quizzes/module",

    submitAttempt: "/quiz-attempt/submit",

    getAttemptByQuiz: "/quiz-attempt",
    createQuiz: "/quizzes/create-quiz",
    updateQuiz: "/quizzes",
    deleteQuiz: "/quizzes",
  },
};

export default API_CONSTANTS;
