// Login.js
import React, { useState } from "react";
import { handleLogin } from "../../firebaseauth"; // Import the login function from firebaseAuth.js

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password); // Call the login function from firebaseAuth
  };

  return (
    <form onSubmit={onLoginSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
