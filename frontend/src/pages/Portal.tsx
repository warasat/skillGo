import { useEffect } from "react";
import {
  getTokenFromLocalStorage,
  removeTokenFromLocalStorage,
} from "../utils/utils";

const Portal = () => {
  const handleLogout = () => {
    removeTokenFromLocalStorage();
    if (!getTokenFromLocalStorage()) {
      window.location.href = "/login";
    }
  };

  return (
    <div>
      <div>Portal of user</div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Portal;
