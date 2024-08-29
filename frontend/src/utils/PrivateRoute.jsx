import React, { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserData } from "./UserData";
import toast from "react-hot-toast";

function PrivateRoute({ children, allowedRoles }) {
  const user = UserData();

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isAuthorized =
    user && allowedRoles.includes(user.role) && user.status === "approved";

  if (user) {
    if (isAuthorized) {
      console.log("is authorized");
      return children;
    } else {
      localStorage.clear();
      return <Navigate to="/login" />;
    }
  } else {
    localStorage.clear();

    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;
