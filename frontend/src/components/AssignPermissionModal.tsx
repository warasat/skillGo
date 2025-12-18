import { useState, useEffect } from "react";
import type { PermissionPolicy } from "../types/permission";

interface AssignPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedIds: string[]) => void;
  allPermissions: PermissionPolicy[];
  assignedPermissions: string[]; // currently assigned permissions (array of IDs)
}

const AssignPermissionModal = ({
  isOpen,
  onClose,
  onSave,
  allPermissions,
  assignedPermissions,
}: AssignPermissionModalProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    assignedPermissions || []
  );

  useEffect(() => {
    setSelectedPermissions(assignedPermissions || []);
  }, [assignedPermissions]);

  if (!isOpen) return null;

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    onSave(selectedPermissions);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Assign Permissions</h2>

        <div className="max-h-64 overflow-y-auto border rounded p-3 mb-4">
          {allPermissions.length > 0 ? (
            allPermissions.map((perm) => (
              <label
                key={perm._id}
                className="flex items-center mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="mr-2 accent-blue-600"
                  checked={selectedPermissions.includes(perm._id)}
                  onChange={() => togglePermission(perm._id)}
                />
                <span>{perm.title}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No permissions available.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignPermissionModal;
