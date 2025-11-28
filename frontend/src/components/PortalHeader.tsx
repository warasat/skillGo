import logo from "../assets/download.jpg";
import type { User } from "../types/user";
import { getUserInitials } from "../utils/utils";

interface PortalHeaderProps {
  user: User | null;
}

const PortalHeader: React.FC<PortalHeaderProps> = ({ user }) => {
  const initials = getUserInitials(user?.name);
  const name = user?.name || "Host";
  return (
    <div className="flex justify-between items-center py-4 px-10 bg-white shadow">
      <div className="flex gap-3 items-center">
        <div className="w-10">
          <img src={logo} alt="Logo" />
        </div>
        <h1 className="font-bold text-lg">SkillsGo</h1>
      </div>

      <div className="flex gap-3 items-center">
        <h1>{name}</h1>
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
          {initials}
        </div>
      </div>
    </div>
  );
};

export default PortalHeader;
