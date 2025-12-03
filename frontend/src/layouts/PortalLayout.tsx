import React, { useEffect, useState } from "react";
import PortalHeader from "../components/PortalHeader";
import PortalSidebar from "../components/PortalSidebar";
import type { User } from "../types/user";
import { getUserProfile } from "../services/user/user.api";

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = await getUserProfile();
      setUser(loggedInUser);
    };
    fetchUserData();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header at top */}
      <div className="flex-shrink-0">
        <PortalHeader user={user} />
      </div>

      <div className="flex flex-1">
        {/* Sidebar - Fixed on left */}
        <div className="fixed top-[64px] left-0 h-[calc(100vh-64px)]">
          <PortalSidebar />
        </div>

        {/* Main content with left margin equal to sidebar width */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 ml-56">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PortalLayout;
