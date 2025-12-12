import { useEffect, useState } from "react";
import {
  getAdminDashboardStats,
  type AdminDashboardStats,
} from "../services/adminDashboard/adminDashboard.api";
import PortalLayout from "../layouts/PortalLayout";
import AdminUsersLineChart from "../charts/AdminUserLineChart";

const AdminPortal = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <PortalLayout>
      {/* Parent Wrapper */}
      <div className="p-6 space-y-6">
        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-green-100 shadow-md p-6 rounded-xl border border-green-200">
            <h2 className="text-xl font-bold text-black mb-2">
              👋 Welcome Back!
            </h2>
            <p className="text-gray-700 text-sm">
              Manage your courses, track learner progress, and improve learning
              outcomes with SkillGo.
            </p>
          </div>
          <div className="bg-blue-100 p-6 rounded-xl text-center">
            <h3 className="text-gray-700 font-semibold mb-1">
              Total Instructors
            </h3>
            <p className="text-2xl font-bold">{stats?.totalInstructors}</p>
          </div>
          <div className="bg-purple-100 p-6 rounded-xl text-center">
            <h3 className="text-gray-700 font-semibold mb-1">Total Learners</h3>
            <p className="text-2xl font-bold">{stats?.totalLearners}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-xl text-center">
            <h3 className="text-gray-700 font-semibold mb-1">Total Courses</h3>
            <p className="text-2xl font-bold">{stats?.totalCourses}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 h-full w-full  overflow-hidden ">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            User Registration Trend
          </h3>
          <div className="">
            <AdminUsersLineChart />
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default AdminPortal;
