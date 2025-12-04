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
    <div className="h-screen flex bg-slate-50">
      {/* Sidebar */}
      <div className="fixed top-16 left-0 h-[calc(100vh-64px)] w-56">
        <PortalSidebar />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 w-full h-16 z-50">
        <PortalHeader user={user} />
      </div>

      {/* Main content */}
      <main className="flex-1 ml-56 mt-16 overflow-y-auto p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default PortalLayout;
