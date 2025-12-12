import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import logo from "../assets/logo.webp";
import {
  getUserInitials,
  removeTokenFromLocalStorage,
  getUserFromLocalStorage,
} from "../utils/utils";
import CONSTANTS from "../constants/constants";
import { AiOutlineLogout } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";

const PortalHeader: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const storedUser = getUserFromLocalStorage();
  const initials = getUserInitials(storedUser?.name);
  const name = storedUser?.name || "Host";
  const role = storedUser?.role?.role || "User";

  const handleLogout = () => {
    removeTokenFromLocalStorage();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/portal/profile");
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="flex justify-between items-center py-4 px-10 bg-white shadow relative z-50"
      style={{ color: `#${CONSTANTS.color_constants.headings.hex}` }}
    >
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <div className="w-10">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className={`font-bold text-lg`}>SkillsGo</h1>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>
        {/* Name + Role */}
        <div className="flex flex-col items-end mr-2">
          <span className="font-medium leading-tight">{name}</span>
          <span className="text-xs text-gray-500 capitalize">{role}</span>
        </div>

        {/* Initials + Dropdown */}
        <div
          className="flex items-center gap-1 p-1 rounded hover:bg-gray-100 cursor-pointer transition-all relative"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
            {initials}
          </div>
          <FaChevronDown
            className={`transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-40 bg-white border rounded shadow-lg flex flex-col z-50">
              {role !== "admin" && (
                <button
                  onClick={handleProfile}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 text-left cursor-pointer"
                  style={{
                    color: `#${CONSTANTS.color_constants.headings.hex}`,
                  }}
                >
                  <FaRegUser />
                  <span>Profile</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 text-left cursor-pointer"
              >
                <AiOutlineLogout />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortalHeader;
