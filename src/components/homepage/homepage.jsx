import React from "react";
import "./homepage.css";
import VantaBackground from "../vantabackground/vantabackground";
import Navbar from "../navbar/navbar";

function HomePage() {
    return (
        <>
            <VantaBackground>
                <Navbar />
                <div className="maincontent">
                    <h1 className="homepageh1">Welcome to CoWrite</h1>
                    <p className="homepagep">Where Ideas Come Together and Stories Begin.</p>
                </div>
            </VantaBackground>
        </>
    );
}

export default HomePage;
