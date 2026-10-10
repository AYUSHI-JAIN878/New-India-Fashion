import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    completeAdminLogin,
    user,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const from = location.state?.from || "/";

  // Redirect an existing saved session.
  // Do not request OTP again if the admin is already logged in.
  useEffect(() => {
    if (authLoading || !user) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    if (String(user.role).toLowerCase() === "admin") {
      navigate("/admin", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setMessage("");
  };

  // CUSTOMER + ADMIN LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Check admin credentials first.
      try {
        const result = await authService.adminLogin({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (result?.success && result?.otpRequired) {
          setOtpStep(true);
          setOtp("");
          setMessage(
            "OTP sent to your registered admin email."
          );
          return;
        }

        setError(
          result?.message ||
            "Unable to start admin verification."
        );
        return;
      } catch (adminError) {
        const status = adminError.response?.status;

        // Fall back to customer login only for admin 401.
        if (status !== 401) {
          setError(
            adminError.response?.data?.message ||
              "Unable to start login. Please try again."
          );
          return;
        }
      }

      // Customer login
      const result = await login(
        formData.email.trim(),
        formData.password
      );

      if (result?.success) {
        navigate(from, { replace: true });
      } else {
        setError(
          result?.message || "Invalid email or password."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // VERIFY ADMIN OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await authService.verifyAdminOtp({
        email: formData.email.trim(),
        otp,
      });

      if (
        result?.success &&
        result?.token &&
        String(result?.user?.role).toLowerCase() === "admin"
      ) {
        const authResult = completeAdminLogin(result);

        if (!authResult?.success) {
          setError(
            authResult?.message || "Admin login failed."
          );
          return;
        }

        navigate("/admin", { replace: true });
      } else {
        setError(
          result?.message ||
            "Admin OTP verification failed."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND ADMIN OTP
  const handleResendOtp = async () => {
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your login credentials again.");
      setOtpStep(false);
      return;
    }

    setResending(true);
    setError("");
    setMessage("");

    try {
      const result = await authService.resendAdminOtp({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result?.success) {
        setOtp("");
        setMessage("A new OTP has been sent to your email.");
      } else {
        setError(result?.message || "Unable to resend OTP.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // Wait until the saved session is restored.
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <p>Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-back">
          <ArrowLeft size={15} />
          Back to Home
        </Link>

        <div className="auth-header">
          <div className="auth-logo">
            <span>New India</span>
            <small>Fashion</small>
          </div>

          <div className="auth-icon">
            {otpStep ? (
              <ShieldCheck size={20} />
            ) : (
              <LogIn size={20} />
            )}
          </div>

          <h1>
            {otpStep ? "Verify Admin OTP" : "Welcome Back"}
          </h1>

          <p>
            {otpStep
              ? `Enter the 6-digit code sent to ${formData.email}.`
              : "Login to continue shopping with New India Fashion."}
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="auth-success" role="status">
            {message}
          </div>
        )}

        {!otpStep ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">
                Email Address
              </label>

              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="username"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">
                Password
              </label>

              <div className="password-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <div className="auth-field">
              <label htmlFor="admin-otp">
                6-Digit Email OTP
              </label>

              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otp}
                onChange={(e) => {
                  setOtp(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  );
                  setError("");
                  setMessage("");
                }}
                placeholder="Enter 6-digit OTP"
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="auth-submit-btn"
              disabled={loading || resending}
              onClick={handleResendOtp}
            >
              {resending ? "Sending..." : "Resend OTP"}
            </button>

            <button
              type="button"
              className="auth-back"
              onClick={() => {
                setOtpStep(false);
                setOtp("");
                setError("");
                setMessage("");
              }}
            >
              <ArrowLeft size={15} />
              Back to Login
            </button>
          </form>
        )}

        {!otpStep && (
          <>
            <div className="auth-divider">
              <span>OR</span>
            </div>

            <p className="auth-switch">
              Don't have an account?{" "}
              <Link to="/signup">Create Account</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;