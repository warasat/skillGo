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
    instructorCourse: "/courses/instructor-courses",
  },
  enrollment: {
    enroll: "/enrollments/enroll",
    myEnrollments: "/enrollments/my-enrollments",
  },
  module: {
    create: "/modules/create-module",
  },
};

export default API_CONSTANTS;
