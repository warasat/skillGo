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
  },
  enrollment: {
    enroll: "/enrollments/enroll",
    myEnrollments: "/enrollments/my-enrollments",
  },
};

export default API_CONSTANTS;
