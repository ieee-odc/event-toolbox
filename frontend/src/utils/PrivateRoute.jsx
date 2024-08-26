import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { UserData } from "./UserData";

function PrivateRoute({ children, allowedRoles }) {
  const user = UserData();

  const isAuthorized = useMemo(() => {
    return user && allowedRoles.includes(user.role) && user.status === "pending";
  }, [user, allowedRoles]);
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (isAuthorized) {
    return children;
  } else {
    console.log("byebye");
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;