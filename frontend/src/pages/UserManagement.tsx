import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUserById,
  updateUserStatus,
  type User,
} from "../services/adminDashboard/adminUser.api";
import PortalLayout from "../layouts/PortalLayout";
import ConfirmModal from "../components/DeleteModal";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";

const ROLE_MAP: Record<string, string> = {
  "69240cf8678deaeaa09e11ef": "admin",
  "69240cf8678deaeaa09e11f0": "instructor",
  "69240cf8678deaeaa09e11f1": "learner",
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const usersArray = await getAllUsers();
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (userId: string) => {
    try {
      await deleteUserById(userId);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const openDeleteModal = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId) handleDelete(selectedUserId);
    setSelectedUserId(null);
    setIsModalOpen(false);
  };

  // Toggle user status
  const handleStatusToggle = async (
    userId: string,
    newStatus: "active" | "inactive"
  ) => {
    try {
      const updatedUser = await updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, status: updatedUser.status } : u
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-sm text-gray-600">
                <th className="px-4 py-2 text-left border-r border-gray-300">
                  Name
                </th>
                <th className="px-4 py-2 text-left border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-2 text-left border-r border-gray-300">
                  Role
                </th>
                <th className="px-4 py-2 text-left border-r border-gray-300">
                  Status
                </th>
                <th className="px-4 py-2 text-left border-r border-gray-300">
                  Created At
                </th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.filter((u) => ROLE_MAP[u.role] !== "admin").length > 0 ? (
                users
                  .filter((u) => ROLE_MAP[u.role] !== "admin")
                  .map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-200 hover:bg-gray-50 text-sm"
                    >
                      <td className="px-4 py-2 border-r border-gray-200">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border-r border-gray-200">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 border-r border-gray-200">
                        {ROLE_MAP[user.role] || user.role}
                      </td>
                      <td className="px-4 py-2 border-r border-gray-200 capitalize">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 border-r border-gray-200">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 flex gap-4 items-center justify-center">
                        {/* Toggle Button */}
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              user._id,
                              user.status === "active" ? "inactive" : "active"
                            )
                          }
                          className={`transition-transform hover:scale-110 ${
                            user.status === "active"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                          title={`Set as ${
                            user.status === "active" ? "Inactive" : "Active"
                          }`}
                        >
                          {user.status === "active" ? (
                            <PiToggleRightFill className="text-2xl" />
                          ) : (
                            <PiToggleLeftFill className="text-2xl" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => openDeleteModal(user._id)}
                          className="text-red-600 hover:text-red-800 cursor-pointer transition-transform hover:scale-110"
                          title="Delete User"
                        >
                          <RiDeleteBin5Line className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?"
      />
    </PortalLayout>
  );
};

export default UserManagement;
