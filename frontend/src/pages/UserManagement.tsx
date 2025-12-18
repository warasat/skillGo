import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUserById,
  updateUserStatus,
  updateUserRole,
} from "../services/adminDashboard/adminUser.api";
import * as roleService from "../services/role/role.api";
import PortalLayout from "../layouts/PortalLayout";
import ConfirmModal from "../components/DeleteModal";
import CreateRoleModal from "../components/RoleModal";
import EditRoleModal from "../components/EditRoleModal";
import { RiDeleteBin5Line } from "react-icons/ri";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import { getUserFromLocalStorage } from "../utils/utils";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string | { _id: string; role: string; identifier: number };
  status: "active" | "inactive";
  createdAt: string;
  permissions?: string[];
}

interface Role {
  _id: string;
  role: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Role editing modal state
  const [isRoleEditModalOpen, setIsRoleEditModalOpen] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(
    null
  );
  const [editingRole, setEditingRole] = useState<string>("");

  // Create role modal
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const currentUser = getUserFromLocalStorage();
  const roleName =
    typeof currentUser?.role === "object"
      ? currentUser.role.role
      : currentUser?.role;
  const isSubAdmin = roleName === "sub-admin";
  const isAdmin = roleName === "admin";
  const canDelete = currentUser?.permissions?.includes("deleteuser") ?? false;

  // Fetch users
  const fetchUsers = async () => {
    try {
      const usersArray = await getAllUsers();
      const normalizedUsers = (Array.isArray(usersArray) ? usersArray : []).map(
        (u) => ({
          ...u,
          role: typeof u.role === "object" ? u.role._id : u.role,
        })
      );
      setUsers(normalizedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const allRoles = await roleService.getAllRoles();
      setRoles(allRoles);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // Delete user
  const handleDelete = async (userId: string) => {
    try {
      await deleteUserById(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
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

  // Toggle status
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

  // Update role
  const handleRoleUpdate = async (userId: string, roleId: string) => {
    try {
      const updatedUser = await updateUserRole(userId, roleId);
      const normalizedUser = {
        ...updatedUser,
        role:
          typeof updatedUser.role === "object" && updatedUser.role !== null
            ? (updatedUser.role as { _id: string })._id
            : updatedUser.role,
      };
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? normalizedUser : u))
      );
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>

        {/* Create Role Button */}
        {isAdmin && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
            >
              Create Role
            </button>
          </div>
        )}

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
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
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
                    <td className="px-4 py-2 border-r border-gray-200 capitalize">
                      {roles.find(
                        (r) =>
                          r._id ===
                          (typeof user.role === "string"
                            ? user.role
                            : user.role._id)
                      )?.role || "N/A"}
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
                    <td className="px-4 py-2 flex gap-3 items-center justify-center">
                      {/* Show only delete for sub-admin */}
                      {isSubAdmin ? (
                        canDelete && (
                          <button
                            onClick={() => openDeleteModal(user._id)}
                            className="text-red-600 hover:text-red-800 transition-transform hover:scale-110 cursor-pointer"
                          >
                            <RiDeleteBin5Line className="text-lg" />
                          </button>
                        )
                      ) : (
                        <>
                          {/* Status Toggle */}
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
                          >
                            {user.status === "active" ? (
                              <PiToggleRightFill className="text-2xl" />
                            ) : (
                              <PiToggleLeftFill className="text-2xl" />
                            )}
                          </button>

                          {/* Role button */}
                          <button
                            onClick={() => {
                              setEditingRoleUserId(user._id);
                              setEditingRole(
                                typeof user.role === "string"
                                  ? user.role
                                  : user.role._id
                              );
                              setIsRoleEditModalOpen(true);
                            }}
                            className="px-3 py-1 text-purple-500 hover:text-purple-700 rounded text-sm cursor-pointer"
                          >
                            Role
                          </button>

                          {/* Delete */}
                          {canDelete && (
                            <button
                              onClick={() => openDeleteModal(user._id)}
                              className="text-red-600 hover:text-red-800 transition-transform hover:scale-110 cursor-pointer"
                            >
                              <RiDeleteBin5Line className="text-lg" />
                            </button>
                          )}
                        </>
                      )}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?"
      />

      {/* Create Role Modal */}
      <CreateRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        onRoleCreated={() => fetchRoles()}
      />

      {/* Edit Role Modal */}
      <EditRoleModal
        isOpen={isRoleEditModalOpen}
        onClose={() => setIsRoleEditModalOpen(false)}
        userId={editingRoleUserId}
        currentRole={editingRole}
        roles={roles}
        onSave={handleRoleUpdate}
      />
    </PortalLayout>
  );
};

export default UserManagement;
