import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  getUserFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../utils/utils";

import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineLogout } from "react-icons/ai";
import { LuBookOpen } from "react-icons/lu";
import { LuBookOpenCheck } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const PortalSidebar = () => {
  const user = getUserFromLocalStorage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeTokenFromLocalStorage();
    navigate("/login");
  };

  const menuItems = [
    { to: "/portal", label: "Portal", icon: <LuLayoutDashboard /> },

    ...(user?.role?.role === "learner"
      ? [{ to: "/portal/course", label: "Courses", icon: <LuBookOpen /> }]
      : []),
    { to: "/portal/profile", label: "Profile", icon: <FaRegUser /> },
    { to: "/portal/setting", label: "Settings", icon: <IoSettingsOutline /> },
  ];

  if (user?.role?.role === "learner") {
    menuItems.push({
      to: "/portal/my-courses",
      label: "My Courses",
      icon: <LuBookOpenCheck />,
    });
  }

  if (user?.role?.role === "instructor") {
    menuItems.push({
      to: "/portal/courses",
      label: "Courses",
      icon: <LuBookOpenCheck />,
    });
  }

  return (
    <div className="w-56 h-full flex flex-col justify-between bg-white shadow-md p-4 pt-8">
      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/portal" &&
              location.pathname.startsWith(item.to + "/"));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 p-2 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 p-2 rounded-md text-red-600 hover:bg-red-100 transition-all duration-200 cursor-pointer"
      >
        <AiOutlineLogout />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default PortalSidebar;
