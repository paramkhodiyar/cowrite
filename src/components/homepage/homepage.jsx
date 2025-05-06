import React, { useState, useEffect } from "react";
import "./homepage.css";
import VantaBackground from "../vantabackground/vantabackground";
import Navbar from "../navbar/navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { auth } from '../../firebase'; // Import auth from firebase.js

function HomePage() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <VantaBackground>
                <Navbar />
                <div className="maincontent">
                    <h1 className="homepageh1">
                        {user ? `Welcome ${user.displayName || user.email}` : 'Welcome to CoWrite'}
                    </h1>
                    <p className="homepagep">Where Ideas Come Together and Stories Begin.</p>
                </div>
            </VantaBackground>
        </>
    );
}

export default HomePage;
