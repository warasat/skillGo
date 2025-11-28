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
    <div className="h-screen bg-slate-50 flex flex-col">
      <PortalHeader user={user} />

      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar />
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default PortalLayout;
