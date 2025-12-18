import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import { RiAddLine } from "react-icons/ri";
import type { RolePermission } from "../types/rolePermission";
import type { Role } from "../types/role";
import type { PermissionPolicy } from "../types/permission";
import { getAllRoles } from "../services/role/role.api";
import { getAllPermissionPolicies } from "../services/permission/permission.api";
import {
  getAllRolePermissions,
  assignPermissionsToRole,
} from "../services/rolePermission/rolePermission.api";
import AssignPermissionModal from "../components/AssignPermissionModal";

const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionPolicy[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [modalRoleId, setModalRoleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [rolesData, permissionData, rolePermData] = await Promise.all([
        getAllRoles(),
        getAllPermissionPolicies(),
        getAllRolePermissions(),
      ]);

      setRoles(rolesData);
      setPermissions(permissionData);
      setRolePermissions(rolePermData);
    } catch (error) {
      console.error("Error fetching role management data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (roleId: string) => setModalRoleId(roleId);
  const closeModal = () => setModalRoleId(null);

  const handleSavePermissions = async (selectedIds: string[]) => {
    if (!modalRoleId) return;
    await assignPermissionsToRole(modalRoleId, selectedIds);
    await fetchAllData();
  };

  const getAssignedPermissions = (roleId: string): string[] => {
    const mapping = rolePermissions.find((rp) => rp.roleId._id === roleId);
    return mapping ? mapping.permissionIds.map((p) => p.title) : [];
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Role Management</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b text-sm text-gray-600">
                <th className="px-4 py-2 text-left border-r">Role</th>
                <th className="px-4 py-2 text-left border-r">Permissions</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {roles.length > 0 ? (
                roles.map((role) => (
                  <tr
                    key={role._id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-2 border-r capitalize">
                      {role.role}
                    </td>
                    <td className="px-4 py-2 border-r text-gray-600">
                      {getAssignedPermissions(role._id).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => openModal(role._id)}
                        className="text-green-600 hover:text-green-800 transition-transform hover:scale-110 cursor-pointer"
                        title="Assign Permissions"
                      >
                        <RiAddLine className="text-xl" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No roles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modalRoleId && (
          <AssignPermissionModal
            isOpen={!!modalRoleId}
            onClose={closeModal}
            onSave={handleSavePermissions}
            allPermissions={permissions}
            assignedPermissions={
              rolePermissions
                .find((rp) => rp.roleId._id === modalRoleId)
                ?.permissionIds.map((p) => p._id) || []
            }
          />
        )}
      </div>
    </PortalLayout>
  );
};

export default RoleManagement;
