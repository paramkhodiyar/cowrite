import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import "./vantabackground.css";

const VantaBackground = ({ children, blur = false }) => {
    const [vantaEffect, setVantaEffect] = useState(null);
    const vantaRef = useRef(null);

    useEffect(() => {
        let effect = null;
        const initVanta = () => {
            if (!effect && vantaRef.current && typeof GLOBE === 'function') {
                try {
                    effect = GLOBE({
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
                    });
                    setVantaEffect(effect);
                } catch (error) {
                    console.error("Vanta initialization error:", error);
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(initVanta, 100);

        return () => {
            clearTimeout(timer);
            if (effect) {
                try {
                    effect.destroy();
                } catch (error) {
                    console.error("Vanta cleanup error:", error);
                }
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            if (vantaEffect) {
                try {
                    vantaEffect.destroy();
                } catch (error) {
                    console.error("Vanta cleanup error:", error);
                }
            }
        }
    }, [vantaEffect]);

    return (
        <div
            ref={vantaRef}
            className={`vanta-container ${blur ? "vanta-blur" : ""}`}
            style={{ 
                minHeight: '100vh',
                backgroundColor: '#0a1a1d' // Fallback background
            }}
        >
            <div className="vanta-content">
                {children}
            </div>
        </div>
    );
};

export default VantaBackground;
