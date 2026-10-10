
import api from "./api";

// CUSTOMER SIGNUP
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

// CUSTOMER LOGIN
export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// ADMIN LOGIN - SEND OTP
export const adminLogin = async (credentials) => {
  const response = await api.post(
    "/admin/auth/login",
    credentials
  );
  return response.data;
};

// ADMIN OTP VERIFICATION
export const verifyAdminOtp = async (data) => {
  const response = await api.post(
    "/admin/auth/verify-otp",
    data
  );
  return response.data;
};

// RESEND ADMIN OTP
export const resendAdminOtp = async (data) => {
  const response = await api.post(
    "/admin/auth/resend-otp",
    data
  );
  return response.data;
};

// CHECK EXISTING ADMIN SESSION
export const getAdminSession = async (token) => {
  const response = await api.get("/admin/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
