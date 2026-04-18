import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Show backend message
        setError(data.msg || "Registration failed");
      } else {
        setSuccess(data.msg || "Registration successful!");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Create an Account</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <div style={{ position: "relative" }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <span
          style={styles.eyeIcon}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "🙈" : "👁️"}
        </span>
      </div>

      <div style={{ position: "relative" }}>
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <span
          style={styles.eyeIcon}
          onClick={() => setShowConfirm(!showConfirm)}
        >
          {showConfirm ? "🙈" : "👁️"}
        </span>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <button onClick={handleRegister} style={styles.button}>
        Register
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: "50px auto",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 8,
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderRadius: 4,
    border: "1px solid #ccc",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    userSelect: "none",
  },
  button: {
    width: "100%",
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: "none",
    backgroundColor: "#28a745",
    color: "white",
    cursor: "pointer",
  },
};

export default Register;
