import React, { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import Navbar from "../navbar/navbar";
import "./homepage.css";

function HomePage() {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                GLOBE({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.00,
                    scaleMobile: 1.00,
                    color1: "#4f8b8c",
                    color2: "#c6e2f1",
                    backgroundColor: "#0a1a1d",
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    return (
        <>
            <Navbar />
            <div ref={vantaRef} className="vanta-container">
                <div className="content">
                    <h1 className="homepageh1">Welcome to the CoWrite!</h1>
                    <p className="homepagep">Where Ideas Come Together, Stories are Shared....</p>
                </div>
            </div>
        </>
    );
}

export default HomePage;