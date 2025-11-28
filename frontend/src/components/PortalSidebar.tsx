import { Link } from "react-router-dom";
import { FaHome, FaBook, FaUser, FaCog, FaBookOpen } from "react-icons/fa";
import { getUserFromLocalStorage } from "../utils/utils";

const PortalSidebar = () => {
  const user = getUserFromLocalStorage();

  return (
    <div className="w-48 p-4 space-y-4">
      <Link to="/portal" className="flex items-center gap-2 p-2">
        <FaHome />
        <span>Portal</span>
      </Link>

      <Link to="/portal/course" className="flex items-center gap-2 p-2">
        <FaBook />
        <span>Courses</span>
      </Link>

      <Link to="/portal/profile" className="flex items-center gap-2 p-2">
        <FaUser />
        <span>Profile</span>
      </Link>

      <Link to="/portal/setting" className="flex items-center gap-2 p-2">
        <FaCog />
        <span>Settings</span>
      </Link>
      {/* My Courses Link - Only for Learner */}
      {user?.role?.role === "learner" && (
        <Link to="/portal/my-courses" className="flex items-center gap-2 p-2">
          <FaBook />
          <span>My Courses</span>
        </Link>
      )}
      {/* Only show for instructor */}
      {user?.role?.role === "instructor" && (
        <Link
          to="/portal/my-own-courses"
          className="flex items-center gap-2 p-2"
        >
          <FaBook />
          <span>MyOwnCourses</span>
        </Link>
      )}
      <Link to="/portal/create-module" className="flex items-center gap-2 p-2">
        <FaBookOpen />
        <span>Create Module</span>
      </Link>
    </div>
  );
};

export default PortalSidebar;
