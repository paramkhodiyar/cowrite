// Signup.js
import React, { useState } from "react";
import { handleSignup } from "../../firebaseauth"; 
import "./signup.css"; 

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onSignupSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        handleSignup(email, password);
    };

    return (
        <form className="signup-form" onSubmit={onSignupSubmit}>
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
        </form>
    );
};

export default Signup;
