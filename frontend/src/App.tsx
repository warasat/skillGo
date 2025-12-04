import { Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Portal from "./pages/Portal";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import GetCourses from "./pages/getCourses";
import MyCourses from "./pages/MyCourse";

import ProtectedRoute from "./utils/ProtectedRoute";
import { getUserFromLocalStorage } from "./utils/utils";
import type { User } from "./types/user";
import MyOwnCourses from "./pages/MyOwnCourse";
import CourseDetails from "./pages/CourseDetails";
import ModuleDetails from "./pages/ModuleDetails";

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

      {/* ✅ Course page only for Learner now */}
      {user?.role?.role === "learner" && (
        <Route
          path="/portal/course"
          element={
            <ProtectedRoute>
              <GetCourses />
            </ProtectedRoute>
          }
        />
      )}

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
        path="/portal/courses"
        element={
          <ProtectedRoute>
            {user?.role?.role === "instructor" && <MyOwnCourses />}
          </ProtectedRoute>
        }
      />

      <Route
        path="/portal/courses/:courseId"
        element={
          <ProtectedRoute>
            <CourseDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/portal/courses/:CourseName/:moduleId"
        element={
          <ProtectedRoute>
            <ModuleDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
