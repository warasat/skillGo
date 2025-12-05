import React from "react";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";

interface CourseProgressLayoutProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

const CourseProgressLayout: React.FC<CourseProgressLayoutProps> = ({
  children,
  rightSidebar,
}) => {
  return (
    <div className="flex flex-col h-screen">
      <PortalHeader />

      <div className="flex flex-1  bg-gray-100">
        <div className="w-56 border-white bg-white">
          <PortalSidebar />
        </div>

        <div className="flex-1  p-6">{children}</div>

        <div className="w-64 border-white bg-white p-4 ">
          {rightSidebar ? (
            rightSidebar
          ) : (
            <div className="text-gray-500 text-sm">Right sidebar content</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseProgressLayout;
