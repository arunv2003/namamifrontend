import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { EmployeeRoute } from "../../routes/auth/login.route.js";
import { toast } from "react-toastify";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("superadmin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await EmployeeRoute.login({ email, password });

    setLoading(false);

    console.log(result);

    if (!result || result.statusCode !== 200 || !result.success) {
      const errorMsg = result?.message || "Login failed";
      setError(errorMsg);
      return;
    }

    if (result.data?.user) {
      login(result.data.user);
    }

    toast.success(result.message || "Employee logged in successfully");
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        maxHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        margin: 0,
        padding: 0,
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      {/* LEFT FORM SECTION (Full Height) */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          zIndex: 10,
          backgroundColor: "transparent",
          boxSizing: "border-box",
          padding: "40px 40px 40px 80px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Brand Logo Header - EmployeeTrackr */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                backgroundColor: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 20px -4px rgba(15, 23, 42, 0.3)",
                flexShrink: 0,
              }}
            >
              <LocationOnIcon style={{ fontSize: 32, color: "#f97316" }} />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                paddingBottom: "3px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                Employee<span style={{ color: "#8b5cf6" }}>Trackr</span>
              </span>
              <span
                style={{
                  fontSize: "10px",
                  color: "#64748b",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginTop: "2px",
                }}
              >
                Workforce Management
              </span>
            </div>
          </div>

          {/* Title Header */}
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: 800,
                color: "#1e293b",
                margin: "0 0 4px 0",
                letterSpacing: "-0.02em",
              }}
            >
              Login
            </h3>
          </div>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#e11d48",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* Form Inputs */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "22px" }}
          >
            {/* Username Input */}
            <div>
              <input
                type="text"
                required
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "15px",
                  color: "#1e293b",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#9333ea")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
            </div>

            {/* Password Input */}
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "16px 50px 16px 20px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  fontSize: "15px",
                  color: "#1e293b",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                  backgroundColor: "#ffffff",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#9333ea")}
                onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? (
                  <VisibilityOff style={{ fontSize: 22 }} />
                ) : (
                  <Visibility style={{ fontSize: 22 }} />
                )}
              </button>
            </div>

            {/* Options Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "14px",
                color: "#64748b",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: "18px",
                    height: "18px",
                    accentColor: "#9333ea",
                    cursor: "pointer",
                  }}
                />
                <span style={{ fontWeight: 500 }}>Remember Me</span>
              </label>

              <a
                href="#forgot"
                onClick={(e) => e.preventDefault()}
                style={{
                  color: "#64748b",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Right Aligned Pill LOGIN Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "10px",
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "14px 48px",
                  borderRadius: "9999px",
                  backgroundColor: "#8b5cf6",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  border: "none",
                  boxShadow: "0 12px 24px -6px rgba(139, 92, 246, 0.45)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#7c3aed")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#8b5cf6")
                }
              >
                {loading ? "LOADING..." : "LOGIN"}
              </button>
            </div>
          </form>

          {/* Social Login Footer */}
          <div
            style={{
              marginTop: "48px",
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <span
              style={{ fontSize: "15px", color: "#64748b", fontWeight: 500 }}
            >
              Or login with
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Facebook Button */}
              <button
                type="button"
                onClick={() => navigate("#")}
                style={{
                  width: "58px",
                  height: "36px",
                  borderRadius: "9999px",
                  backgroundColor: "#3b5998",
                  color: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "transform 0.15s",
                }}
                aria-label="Login with Facebook"
              >
                <FacebookIcon style={{ fontSize: 20 }} />
              </button>

              {/* Twitter Button */}
              <button
                type="button"
                onClick={() => navigate("#")}
                style={{
                  width: "58px",
                  height: "36px",
                  borderRadius: "9999px",
                  backgroundColor: "#00acee",
                  color: "#ffffff",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                  transition: "transform 0.15s",
                }}
                aria-label="Login with Twitter"
              >
                <TwitterIcon style={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE DIAGONAL TRIANGLE BANNER MATCHING REFERENCE DESIGN */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "70%",
          height: "100%",
          clipPath: "polygon(0% 0%, 100% 0%, 100% 120%)",
          background:
            "linear-gradient(135deg, #7c3aed 0%, #6366f1 45%, #06b6d4 100%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: "80px 80px 0 0",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "right", maxWidth: "420px" }}>
          <h2
            style={{
              fontSize: "58px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              margin: "0 0 20px 0",
              textShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            Welcome
            <br />
            Back.
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255, 255, 255, 0.92)",
              margin: 0,
              lineHeight: 1.6,
              fontWeight: 400,
            }}
          >
            Lorem factorial non deposit quid pro quo hic escorol. Olypian
            quarrels et gorilla congolium.
          </p>
        </div>
      </div>
    </div>
  );
}
