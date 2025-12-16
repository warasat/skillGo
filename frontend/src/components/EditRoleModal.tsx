import React, { useState, useEffect } from "react";

interface Role {
  _id: string;
  role: string;
}

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  currentRole: string;
  roles: Role[];
  onSave: (userId: string, roleId: string) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({
  isOpen,
  onClose,
  userId,
  currentRole,
  roles,
  onSave,
}) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  useEffect(() => {
    setSelectedRole(currentRole);
  }, [currentRole]);

  if (!isOpen || !userId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Edit Role</h2>

        <select
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((r) => (
            <option key={r._id} value={r._id}>
              {r.role}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (userId && selectedRole) onSave(userId, selectedRole);
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRoleModal;
