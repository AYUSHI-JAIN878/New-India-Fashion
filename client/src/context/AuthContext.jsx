
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // RESTORE AND VALIDATE SAVED SESSION
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!savedUser || !token) {
          if (active) clearSession();
          return;
        }

        const parsedUser = JSON.parse(savedUser);

        if (!parsedUser?.role) {
          if (active) clearSession();
          return;
        }

        // Validate saved admin session with backend.
        if (
          String(parsedUser.role).toLowerCase() === "admin"
        ) {
          const result =
            await authService.getAdminSession(token);

          const verifiedUser = result?.user;

          if (
            !result?.success ||
            !verifiedUser ||
            String(verifiedUser.role).toLowerCase() !== "admin"
          ) {
            if (active) clearSession();
            return;
          }

          if (active) {
            localStorage.setItem(
              "user",
              JSON.stringify(verifiedUser)
            );
            setUser(verifiedUser);
          }

          return;
        }

        // Restore customer session.
        if (active) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Session restore error:", error);

        if (active) clearSession();
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // SAVE LOGIN SESSION
  const saveSession = (data) => {
    if (!data?.success || !data?.token || !data?.user) {
      return {
        success: false,
        message: data?.message || "Login failed. Please try again.",
      };
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    return {
      success: true,
      user: data.user,
    };
  };

  // CUSTOMER SIGNUP
  const signup = async (userData) => {
    try {
      const data = await authService.register(userData);
      if (!data?.success) return data;
      return saveSession(data);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to create account. Please try again.",
      };
    }
  };

  // CUSTOMER LOGIN
  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });
      if (!data?.success) return data;
      return saveSession(data);
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Unable to login. Please try again.",
      };
    }
  };

  // ADMIN LOGIN AFTER OTP VERIFICATION
  const completeAdminLogin = (data) => {
    if (
      !data?.success ||
      !data?.token ||
      !data?.user ||
      String(data.user.role).toLowerCase() !== "admin"
    ) {
      return {
        success: false,
        message: "Valid admin OTP verification is required.",
      };
    }

    return saveSession(data);
  };

  // LOGOUT
  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        completeAdminLogin,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
