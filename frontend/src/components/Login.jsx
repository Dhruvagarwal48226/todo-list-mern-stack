import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/addtask.css";

function Login() {
  const [userData, setUserData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      console.log(userData);

      const response = await fetch("http://localhost:3200/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log(result);
        document.cookie = `token=${result.token}`;
        localStorage.setItem("login", userData.email);
       window.dispatchEvent(new Event('localStorage-change'))
        navigate("/");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>

      <label>Email</label>
      <input
        type="text"
        name="email"
        placeholder="Enter your email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />

      <label>Password</label>
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        value={userData.password}
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />

      <button onClick={handleLogin} className="submit">
        Login
      </button>

      <Link className="link" to="/signup">
        Sign Up
      </Link>
    </div>
  );
}

export default Login;
