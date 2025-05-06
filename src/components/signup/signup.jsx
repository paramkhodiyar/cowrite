import React, { useState } from "react";
import { handleSignup, signInWithGoogle } from "../../firebaseauth";
import VantaBackground from "../vantabackground/vantabackground";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const onSignupSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        const user = await handleSignup(email, password);
        if (user) {
            navigate("/");
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        const user = await signInWithGoogle();
        if (user) {
            navigate("/");
        }
    };

    return (
        <VantaBackground blur={true}>
            <div className="formcontainer">
                <form className="signup-form" onSubmit={onSignupSubmit}>
                    <h2 className="signup-title">Create Your Account</h2>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="signup-input"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="signup-input"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        required
                        className="signup-input"
                    />

                    <button type="submit" className="signup-button">
                        Sign Up
                    </button>

                    <button className="google-signup-button" onClick={handleGoogleSignIn}>
                        <FcGoogle className="google-icon" />
                        Sign in with Google
                    </button>

                    <p className="login-link">
                        Already have an account?{" "}
                        <span onClick={() => navigate("/components/login/login")}>Login here</span>
                    </p>
                </form>
            </div>
        </VantaBackground>
    );
};

export default Signup;
