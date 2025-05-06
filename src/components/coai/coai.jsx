import React, { useState } from "react";
import VantaBackground from "../vantabackground/vantabackground";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSendSharp } from "react-icons/io5";
import Navbar from "../navbar/navbar";
import "./coai.css";

function CoAI() {
    const [prompt, setPrompt] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiKey = import.meta.env.VITE_GOOGLE_GEN_AI_API_KEY;

    const handleInputChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            generateContent();
        }
    };

    const generateContent = async () => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        const newChat = { role: "user", content: trimmedPrompt };
        setChatHistory((prev) => [...prev, newChat]);
        setPrompt("");
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const chat = model.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 500,
                },
            });
            const result = await chat.sendMessage(trimmedPrompt);
            const text = result.response.text();

            setChatHistory((prev) => [...prev, { role: "ai", content: text }]);
        } catch (error) {
            console.error("Error generating content:", error);
            setChatHistory((prev) => [
                ...prev,
                { role: "ai", content: "An error occurred while generating content." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <VantaBackground>
            <Navbar />
            <div className="coai-wrapper">
                <div className="chat-window">
                    {chatHistory.map((msg, idx) => (
                        <div
                            key={idx}
                            className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "ai-bubble"}`}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div className="chat-bubble ai-bubble">
                            <div className="typing">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat-input-container">
                    <textarea
                        className="chat-input"
                        rows="1"
                        placeholder="CoAI✨ to take your content to next level...."
                        value={prompt}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="send-button"
                        onClick={generateContent}
                        disabled={loading}
                    >
                       <IoSendSharp style={{ display: "flex", justifyContent: "center", alignItems: "center" }}/>
                    </button>
                </div>
            </div>
        </VantaBackground>
    );
}

export default CoAI;
