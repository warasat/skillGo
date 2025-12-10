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

    getAttemptByQuiz: "/quiz-attempt/all",
    createQuiz: "/quizzes/create-quiz",
    updateQuiz: "/quizzes",
    deleteQuiz: "/quizzes",
  },
  dashboard: {
    coursesCount: "/dashboard/courses-count",
    learnersCount: "/dashboard/learners-count",
    coursesByCategory: "/dashboard/courses-by-category",
  },
};

export default API_CONSTANTS;
