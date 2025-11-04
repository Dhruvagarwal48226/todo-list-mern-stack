import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/addtask.css";

function SignUp() {
  const [userData, setUserData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("login")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignUp = async () => {
    try {
      console.log(userData);

      const response = await fetch("http://localhost:3200/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        document.cookie = `token=${result.token}`;
        localStorage.setItem("login", userData.email);
        navigate("/");
      } else {
        alert("Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>

      <label>Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />

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

      <button onClick={handleSignUp} className="submit">
        Sign Up
      </button>

      <Link className="link" to="/login">
        Login
      </Link>
    </div>
  );
}

export default SignUp;
