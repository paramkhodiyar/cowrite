import React, { useState, useEffect } from "react";
import "./homepage.css";
import VantaBackground from "../vantabackground/vantabackground";
import Navbar from "../navbar/navbar";
import { getAuth, onAuthStateChanged } from "firebase/auth"; 
import { auth } from '../../firebase'; // Import auth from firebase.js

function HomePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#0a1a1d',
                color: 'white' 
            }}>
                Loading...
            </div>
        );
    }
    return (
        <div style={{ minHeight: '100vh' }}>
            <VantaBackground>
                <Navbar />
                <div className="maincontent">
                    <h1 className="homepageh1">
                        {user ? `Welcome ${user.displayName || user.email} to CoWrite` : 'Welcome to CoWrite'}
                    </h1>
                    <p className="homepagep">Where Ideas Come Together and Stories Begin.</p>
                </div>
            </VantaBackground>
        </div>
    );
}

export default HomePage;
