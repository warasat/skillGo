import { useNavigate } from "react-router-dom";

import PortalLayout from "../layouts/PortalLayout";

const Portal = () => {
  const navigate = useNavigate();

  const goToCourse = () => {
    navigate("/portal/course"); // navigate to course page
  };

  return (
    <PortalLayout>
      <div className="p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Portal of User</h1>

        <div className="mb-4">
          <button
            onClick={goToCourse}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Course Page
          </button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Portal;
