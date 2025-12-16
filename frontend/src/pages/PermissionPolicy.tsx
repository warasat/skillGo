import { useEffect, useState } from "react";
import PortalLayout from "../layouts/PortalLayout";
import {
  getAllPermissionPolicies,
  createPermissionPolicy,
  deletePermissionPolicy,
  updatePermissionPolicy,
} from "../services/permission/permission.api";
import type { PermissionPolicy } from "../types/permission";
import { RiDeleteBin5Line, RiEdit2Line } from "react-icons/ri";
import ConfirmModal from "../components/DeleteModal";

const PermissionPolicies = () => {
  const [policies, setPolicies] = useState<PermissionPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);

  // Form states (shared)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<string>("");

  // Editing state
  const [editId, setEditId] = useState<string | null>(null);

  // fetch policies
  const fetchPolicies = async () => {
    try {
      const data = await getAllPermissionPolicies();
      setPolicies(data);
    } catch (error) {
      console.error("Error fetching policies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  // Create new policy
  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || !permissions.trim()) {
      alert("All fields are required");
      return;
    }

    const permsArray = permissions
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    await createPermissionPolicy(title, description, permsArray);
    setIsCreateModalOpen(false);
    resetForm();
    fetchPolicies();
  };

  // Update existing policy
  const handleUpdate = async () => {
    if (!editId) return;

    const permsArray = permissions
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    await updatePermissionPolicy(editId, title, description, permsArray);
    setIsEditModalOpen(false);
    resetForm();
    fetchPolicies();
  };

  // Delete policy
  // Open delete modal
  const openDeleteModal = (id: string) => {
    setSelectedPolicyId(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (selectedPolicyId) {
      await deletePermissionPolicy(selectedPolicyId);
      setSelectedPolicyId(null);
      fetchPolicies();
    }
    setIsDeleteModalOpen(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPermissions("");
    setEditId(null);
  };

  const openEditModal = (policy: PermissionPolicy) => {
    setEditId(policy._id);
    setTitle(policy.title);
    setDescription(policy.description);
    setPermissions(policy.permissions.join(", "));
    setIsEditModalOpen(true);
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <PortalLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Permission Policies</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Create Permission
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-gray-700">
            <thead>
              <tr className="bg-gray-100 border-b text-sm text-gray-600">
                <th className="px-4 py-2 text-left border-r">Title</th>
                <th className="px-4 py-2 text-left border-r">Description</th>
                <th className="px-4 py-2 text-left border-r">Permissions</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.length > 0 ? (
                policies.map((policy) => (
                  <tr
                    key={policy._id}
                    className="border-b hover:bg-gray-50 text-sm"
                  >
                    <td className="px-4 py-2 border-r">{policy.title}</td>
                    <td className="px-4 py-2 border-r">{policy.description}</td>
                    <td className="px-4 py-2 border-r text-xs text-gray-600">
                      {policy.permissions.join(", ")}
                    </td>
                    <td className="px-4 py-2 flex gap-3 justify-center">
                      <button
                        onClick={() => openEditModal(policy)}
                        className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <RiEdit2Line className="text-lg" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(policy._id)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        <RiDeleteBin5Line className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No Permission Policies Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create Permission Modal */}
        {isCreateModalOpen && (
          <Modal
            title="Create Permission Policy"
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreate}
            form={{
              title,
              setTitle,
              description,
              setDescription,
              permissions,
              setPermissions,
            }}
          />
        )}

        {/* Edit Permission Modal */}
        {isEditModalOpen && (
          <Modal
            title="Edit Permission Policy"
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleUpdate}
            form={{
              title,
              setTitle,
              description,
              setDescription,
              permissions,
              setPermissions,
            }}
          />
        )}
      </div>
      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this permission policy?"
      />
    </PortalLayout>
  );
};

// ✅ Reusable Modal Component
const Modal = ({
  title,
  onClose,
  onSave,
  form,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  form: {
    title: string;
    setTitle: (v: string) => void;
    description: string;
    setDescription: (v: string) => void;
    permissions: string;
    setPermissions: (v: string) => void;
  };
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => form.setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => form.setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
      />

      <textarea
        placeholder="Permissions (comma-separated)"
        value={form.permissions}
        onChange={(e) => form.setPermissions(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 cursor-pointer border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

export default PermissionPolicies;
