import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {
  const user = useSelector((state) => state.user.userInfo);

  if (!user) return <Navigate to="/login" />; // not logged in
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />; // wrong role

  return children; // allowed
}

export default ProtectedRoute;
