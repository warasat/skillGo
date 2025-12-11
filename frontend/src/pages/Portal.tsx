import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import {
  getInstructorCoursesCount,
  getEnrolledLearnersCount,
  getInstructorEarnings,
} from "../services/dashboard/dashboard.api";
import CourseByCategoryCount from "../charts/CourseByCategoryCount";
import TopCategoriesChart from "../charts/TopCategoriesChart";
import RoleGuard from "../utils/RoleGuard";

const Portal = () => {
  const [coursesCount, setCoursesCount] = useState<number>(0);
  const [learnersCount, setLearnersCount] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const courses = await getInstructorCoursesCount();
        const learners = await getEnrolledLearnersCount();
        const totalEarnings = await getInstructorEarnings();
        setCoursesCount(Array.isArray(courses) ? courses.length : courses || 0);
        setLearnersCount(
          Array.isArray(learners) ? learners.length : learners || 0
        );
        setEarnings(totalEarnings || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <RoleGuard
        allowedRoles={["instructor"]}
        fallback={
          <>
            <p className="text-gray-500 text-lg text-center flex p-1">
              Learners Portal is under construction. Please check back later.
            </p>
          </>
        }
      >
        <div className="p-8 bg-gray-100 space-y-8">
          {/* Top Row - 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Welcome Card */}
            <div className="bg-green-100 shadow-md p-6 rounded-xl border border-green-200">
              <h2 className="text-xl font-bold text-black-600 mb-2">
                👋 Welcome Back!
              </h2>
              <p className="text-gray-700 text-sm">
                Manage your courses, track learner progress, and improve
                learning outcomes with SkillGo.
              </p>
            </div>

            {/* Courses Count Card */}
            <div className="bg-yellow-100 shadow-md p-6 rounded-xl border border-yellow-200 text-center">
              <h3 className="text-gray-600 font-semibold text-sm mb-1">
                Total Courses
              </h3>
              <p className="text-4xl font-bold text-black">{coursesCount}</p>
            </div>

            {/* Learners Count Card */}
            <div className="bg-purple-100 shadow-md p-6 rounded-xl border border-purple-200 text-center">
              <h3 className="text-gray-600 font-semibold text-sm mb-1">
                Total Enrolled Learners
              </h3>
              <p className="text-4xl font-bold text-black">{learnersCount}</p>
            </div>
            {/* Earnings Card */}
            <div className="bg-blue-100 shadow-md p-6 rounded-xl border border-blue-200 text-center">
              <h3 className="text-gray-600 font-semibold text-sm mb-1">
                Total Earnings
              </h3>
              <p className="text-4xl font-bold text-black">${earnings}</p>
            </div>
          </div>

          {/*  Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Courses Overview in Chart
              </h3>
              <CourseByCategoryCount />
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <TopCategoriesChart />
            </div>
          </div>
        </div>
      </RoleGuard>
    </PortalLayout>
  );
};

export default Portal;
