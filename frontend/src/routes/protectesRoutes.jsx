import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../context/user";
import Loading from "../components/loading";

export default function ProtectedRoute() {
  let { user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <Navigate to="/auth/login" replace state={{ from: location }}></Navigate>
    );
  }
  return <Outlet></Outlet>;
}
