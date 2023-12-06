import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";

function PrivateRoutes(props) {
  const { user } = useContext(UserContext);

  if (user && user.isAuthenticated === true) {
    return <>{props.element}</>;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoutes;
