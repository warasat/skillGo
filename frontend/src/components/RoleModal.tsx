import { useState } from "react";
import type { Role } from "../types/role";
import { createRole } from "../services/role/role.api";

type CreateRoleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onRoleCreated: (role: Role) => void;
};

const CreateRoleModal = ({
  isOpen,
  onClose,
  onRoleCreated,
}: CreateRoleModalProps) => {
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!roleName.trim()) return;
    setLoading(true);
    try {
      const newRole = await createRole(roleName);
      onRoleCreated(newRole);
      setRoleName("");
      onClose();
    } catch (err) {
      console.error("Error creating role:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Create New Role</h2>
        <input
          type="text"
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4"
          placeholder="Enter role name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoleModal;
