import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portal from "./pages/Portal";
import CourseForm from "./pages/CourseForm";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import GetCourses from "./pages/getCourses";
import MyCourses from "./pages/MyCourse";
import CreateModule from "./pages/CreateModule";
import ProtectedRoute from "./utils/ProtectedRoute";
import { getUserFromLocalStorage } from "./utils/utils";
import type { User } from "./types/user";
import MyOwnCourses from "./pages/MyOwnCourse";

const App = () => {
  const user: User | null = getUserFromLocalStorage();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/portal"
        element={
          <ProtectedRoute>
            <Portal />
          </ProtectedRoute>
        }
      />

      {/* Conditional course page */}
      <Route
        path="/portal/course"
        element={
          <ProtectedRoute>
            {user?.role?.role === "instructor" ? (
              <CourseForm />
            ) : (
              <GetCourses />
            )}
          </ProtectedRoute>
        }
      />

      <Route
        path="/portal/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/portal/setting"
        element={
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/my-courses"
        element={
          <ProtectedRoute>
            {user?.role?.role === "learner" ? <MyCourses /> : <Portal />}
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/create-module"
        element={
          <ProtectedRoute>
            <CreateModule />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/my-own-courses"
        element={
          <ProtectedRoute>
            {user?.role?.role === "instructor" && <MyOwnCourses />}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
