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
import CourseProgressPage from "./pages/CourseProgressPage";
import AdminPortal from "./pages/AdminPortal";
import RoleGuard from "./utils/RoleGuard";
import UserManagement from "./pages/UserManagement";
import PermissionPolicy from "./pages/PermissionPolicy";
import RoleManagement from "./pages/RoleManagement";

// Step 1: Define base interface mapping
const getBaseInterface = (role: string) => {
  if (role === "learner") return "learner";
  if (role === "instructor") return "instructor";
  return "admin"; // All other roles use AdminInterface
};

const App = () => {
  const user: User | null = getUserFromLocalStorage();
  const baseInterface = user ? getBaseInterface(user.role.role) : null;

  return (
    <Routes>
      {/* Public Routes */}
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

      {/* Common Protected Routes */}
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

      {/* Learner Routes */}
      {baseInterface === "learner" && (
        <>
          <Route
            path="/portal/course"
            element={
              <ProtectedRoute>
                <GetCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/my-courses"
            element={
              <ProtectedRoute>
                <MyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal/my-courses/progress/:courseId"
            element={
              <ProtectedRoute>
                <CourseProgressPage />
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Instructor Routes */}
      {baseInterface === "instructor" && (
        <>
          <Route
            path="/portal/courses"
            element={
              <ProtectedRoute>
                <MyOwnCourses />
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
        </>
      )}

      {/* Admin / Sub-Admin / Content-Manager / Senior-Manager / Others */}
      {baseInterface === "admin" && (
        <>
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={[
                    "admin",
                    "sub-admin",
                    "content-manager",
                    "senior-manager",
                  ]}
                  fallback={<div>Access Denied</div>}
                >
                  <AdminPortal />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/user-management"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={[
                    "admin",
                    "sub-admin",
                    "content-manager",
                    "senior-manager",
                  ]}
                  fallback={<div>Access Denied</div>}
                >
                  <UserManagement />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/permission-policies"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={[
                    "admin",
                    "sub-admin",
                    "content-manager",
                    "senior-manager",
                  ]}
                  fallback={<div>Access Denied</div>}
                >
                  <PermissionPolicy />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/role-management"
            element={
              <ProtectedRoute>
                <RoleGuard
                  allowedRoles={[
                    "admin",
                    "sub-admin",
                    "content-manager",
                    "senior-manager",
                  ]}
                  fallback={<div>Access Denied</div>}
                >
                  <RoleManagement />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
        </>
      )}
    </Routes>
  );
};

export default App;
