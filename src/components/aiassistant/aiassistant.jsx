import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoSendSharp, IoClose } from "react-icons/io5";
import "./aiassistant.css";

function AIAssistant({ onResponse, onClose }) {
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
            
            // Enhanced prompt for blog writing assistance
            const enhancedPrompt = `As a writing assistant for a blog post, help with: ${trimmedPrompt}. 
            Please provide helpful, creative, and well-structured content that can be used in a blog post.`;
            
            const result = await model.generateContent(enhancedPrompt);
            const text = result.response.text();

            setChatHistory((prev) => [...prev, { role: "ai", content: text }]);
        } catch (error) {
            console.error("Error generating content:", error);
            setChatHistory((prev) => [
                ...prev,
                { role: "ai", content: "Sorry, I'm having trouble connecting right now. Please check your API key and try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const insertResponse = (response) => {
        onResponse(response);
    };

    return (
        <div className="ai-assistant">
            <div className="ai-header">
                <h3>✨ AI Writing Assistant</h3>
                <button className="ai-close" onClick={onClose}>
                    <IoClose />
                </button>
            </div>
            
            <div className="ai-chat-window">
                {chatHistory.length === 0 && (
                    <div className="ai-welcome">
                        <p>Hi! I'm here to help you write better content. Ask me to:</p>
                        <ul>
                            <li>Improve your writing</li>
                            <li>Generate ideas</li>
                            <li>Fix grammar</li>
                            <li>Expand on topics</li>
                            <li>Create engaging titles</li>
                        </ul>
                    </div>
                )}
                
                {chatHistory.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`ai-chat-bubble ${msg.role === "user" ? "ai-user-bubble" : "ai-ai-bubble"}`}
                    >
                        <div className="ai-message-content">
                            {msg.content}
                        </div>
                        {msg.role === "ai" && (
                            <button 
                                className="ai-insert-btn"
                                onClick={() => insertResponse(msg.content)}
                                title="Insert this response into your post"
                            >
                                Insert
                            </button>
                        )}
                    </div>
                ))}
                
                {loading && (
                    <div className="ai-chat-bubble ai-ai-bubble">
                        <div className="ai-typing">
                            <div className="ai-dot"></div>
                            <div className="ai-dot"></div>
                            <div className="ai-dot"></div>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="ai-input-container">
                <textarea
                    className="ai-input"
                    rows="2"
                    placeholder="Ask me anything about your blog post..."
                    value={prompt}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="ai-send-button"
                    onClick={generateContent}
                    disabled={loading || !prompt.trim()}
                >
                    <IoSendSharp />
                </button>
            </div>
        </div>
    );
}

export default AIAssistant;