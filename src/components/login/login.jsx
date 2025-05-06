// Login.jsx
import React, { useState } from "react";
import { handleLogin, signInWithGoogle } from "../../firebaseauth";
import VantaBackground from "../vantabackground/vantabackground";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onLoginSubmit = async (e) => {
        e.preventDefault();
        const user = await handleLogin(email, password);
        if (user) {
            console.log("Login successful, navigating...");
            navigate("/");
        } else {
            alert("Login failed. Please check your credentials.");
        }
    };

    // Handle Google Sign-In
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        const user = await signInWithGoogle();
        if (user) {
            console.log("Google login successful");
            navigate("/");
        }
    };

    return (
        <VantaBackground blur={true}>
            <div className="formcontainer">
                <form className="login-form" onSubmit={onLoginSubmit}>
                    <h2 className="login-title">Login to Your Account</h2>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="login-input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="login-input"
                    />

                    <button type="submit" className="login-button">
                        Log In
                    </button>

                    <button className="google-login-button" onClick={handleGoogleSignIn}>
                        <FcGoogle className="google-icon" />
                        Sign in with Google
                    </button>

                    <p className="signup-link">
                        Don't have an account?{" "}
                        <span onClick={() => navigate("/components/signup/signup")}>Sign up here</span>
                    </p>
                </form>
            </div>
        </VantaBackground>
    );
};

export default Login;
