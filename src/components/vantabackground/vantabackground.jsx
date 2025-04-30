import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import "./vantabackground.css";

const VantaBackground = ({ children, blur = false }) => {
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
                    scale: 1.0,
                    scaleMobile: 1.0,
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
        <div
            ref={vantaRef}
            className={`vanta-container ${blur ? "vanta-blur" : ""}`}
        >
            <div className="vanta-content">
                {children}
            </div>
        </div>
    );
};

export default VantaBackground;
