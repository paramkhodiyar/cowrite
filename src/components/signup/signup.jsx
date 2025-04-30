import React, { useState } from "react";
import { handleSignup, signInWithGoogle } from "../../firebaseauth";
import VantaBackground from "../vantabackground/vantabackground";
import "./signup.css";
import { useNavigate } from "react-router-dom";

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
            console.log("Navigation triggered after email/password signup");
            navigate("/");
        }
    };
    const handleGoogleSignIn = async () => {
        const user = await signInWithGoogle();
        if (user) {
            console.log("Google sign-in successful in component:", user);
            console.log("Navigation triggered after Google sign-in");
            navigate("/");
        } else {
            console.log("Google sign-in failed in component.");
        }
    };
    return (
        <>
        <VantaBackground blur={true}>
            <div className="formcontainer">
                
            <form className="signup-form" onSubmit={onSignupSubmit}>
                <h2 style={{color:"black"}}>Sign Up</h2>
                <button onClick={() => navigate("/")}>Test Navigate</button>
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
                <button type="submit" className="signup-button">Sign Up</button>
                <button className="google-signup-button" onClick={handleGoogleSignIn}>
                        Sign in with Google
                    </button>
            </form>
        </div>
            </VantaBackground>
            </>

    );
};

export default Signup;

