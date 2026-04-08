import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useMemo } from "react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  const auth = useMemo(() => {
    if (!token) return { isValid: false, position: null };

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);

      if (!decoded?.exp) {
        throw new Error("Malformed token");
      }

      const isValid = decoded.exp * 1000 > Date.now();
      const positions = Array.isArray(decoded.position)
        ? decoded.position
        : decoded.position
          ? [decoded.position]
          : [];

      return {
        isValid,
        positions,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return { isValid: false, position: null };
    }
  }, [token]);

  useEffect(() => {
    if (!auth.isValid && token) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [auth.isValid, token]);

  const currentPath = location.pathname;

  if (!auth.isValid && currentPath !== "/") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (
    allowedRoles.length &&
    !auth.positions.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
