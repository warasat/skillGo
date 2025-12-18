// // useAuthSync.ts
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";
// import { getUserFromLocalStorage } from "../utils/utils";

// // Helper to clear auth data
// const clearAuthData = () => {
//   localStorage.removeItem("user");
//   localStorage.removeItem("token");
// };

// const useAuthSync = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkRoleChange = async () => {
//       const localUser = getUserFromLocalStorage();
//       if (!localUser) return; // no logged-in user, nothing to check

//       try {
//         // Fetch fresh user data from backend
//         const response = await API.get("/users/auth/me");
//         const freshUser = response.data.data;

//         // Compare roleUpdatedAt for the same user
//         if (
//           freshUser._id === localUser._id &&
//           freshUser.roleUpdatedAt !== localUser.roleUpdatedAt
//         ) {
//           console.warn("User role changed. Logging out...");
//           clearAuthData();
//           navigate("/login", { replace: true });
//         }
//       } catch (error) {
//         console.error("Error checking auth sync:", error);
//         // Optional: if error fetching user, log out just in case
//         // clearAuthData();
//         // navigate("/login", { replace: true });
//       }
//     };

//     // Check every 10 seconds (adjust if needed)
//     const interval = setInterval(checkRoleChange, 10000);

//     return () => clearInterval(interval); // cleanup on unmount
//   }, [navigate]);
// };

// export default useAuthSync;
