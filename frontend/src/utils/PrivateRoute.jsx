import React from "react";
import { Navigate } from "react-router-dom";
import { UserData } from "./UserData";
function PrivateRoute({ children, allowedRoles }) {
const user = UserData();
if (user.userRoles) {
return (
<div>
{allowedRoles.includes(user.userRoles) ? children:<Navigate to="/" /> }
</div>)
}
else {
// No valid token or role, redirect to the login page
return <Navigate to="/sign-in" />; // Adjust the redirect route as needed
}
}
export default PrivateRoute;