import { Navigate, useLocation } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useState, useEffect, useMemo } from "react";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  const auth = useMemo(() => {
    if (!token) return { isValid: false, role: null };

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp || !decoded?.role) {
        throw new Error("Malformed token");
      }

      const isValid = decoded.exp * 1000 > Date.now();

      return {
        isValid,
        role: decoded.role,
      };
    } catch (error) {
      console.error("Invalid token:", error);
      return { isValid: false, role: null };
    }
  }, [token]);

  useEffect(() => {
    if (!auth.isValid && token) {
      localStorage.removeItem("token");
      setToken(null);
    }
  }, [auth.isValid, token]);

  if (!auth.isValid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default ProtectedRoute;
