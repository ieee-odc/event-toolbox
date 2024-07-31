import React from "react";
import { Navigate } from "react-router-dom";

import { UserData } from "./UserData";
function PrivateRoute({ children, allowedRoles }) {
  const user = UserData();
  if (user) {
    return (
      children
    );
  } else {
    // No valid token or role, redirect to the login page
    return <Navigate to="/login" />; // Adjust the redirect route as needed
  }
}
export default PrivateRoute;
