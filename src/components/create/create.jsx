import React from "react";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import VantaBackground from "../vantabackground/vantabackground";
import Navbar from "../navbar/navbar";
import AIAssistant from "../aiassistant/aiassistant";
import "./create.css";

function CreatePost() {
    const [user, setUser] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mediaUrl, setMediaUrl] = useState("");
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchCommunities();
            } else {
                navigate("/components/login/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchCommunities = async () => {
        try {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .order('name');
            
            if (error) throw error;
            setCommunities(data || []);
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !selectedCommunity) {
            alert('Please fill in all required fields');
            return;
        }
        setShowConfirmation(true);
    };

    const confirmPost = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('posts')
                .insert({
                    title: title.trim(),
                    content: content.trim(),
                    media_url: mediaUrl.trim() || null,
                    author_id: user.uid,
                    community_id: selectedCommunity
                });
            
            if (error) throw error;
            
            // Reset form
            setTitle("");
            setContent("");
            setMediaUrl("");
            setSelectedCommunity("");
            setShowConfirmation(false);
            
            alert('Post created successfully!');
            navigate('/feed');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleAIResponse = (response) => {
        // Insert AI response at cursor position or append to content
        setContent(prev => prev + (prev ? '\n\n' : '') + response);
    };

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <VantaBackground>
            <Navbar />
            <div className="create-container">
                <div className="create-main">
                    <h1 className="create-title">Create New Post</h1>
                    
                    <form onSubmit={handleSubmit} className="create-form">
                        <div className="form-group">
                            <label>Community *</label>
                            <select
                                value={selectedCommunity}
                                onChange={(e) => setSelectedCommunity(e.target.value)}
                                required
                            >
                                <option value="">Select a community</option>
                                {communities.map(community => (
                                    <option key={community.id} value={community.id}>
                                        {community.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Title *</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter your post title..."
                                required
                                maxLength={200}
                            />
                        </div>

                        <div className="form-group">
                            <label>Content *</label>
                            <div className="content-container">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write your post content..."
                                    required
                                    rows="12"
                                    maxLength={5000}
                                />
                                <button
                                    type="button"
                                    className="ai-toggle-btn"
                                    onClick={() => setShowAI(!showAI)}
                                    title="Get AI assistance"
                                >
                                    ✨ AI
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Media URL (optional)</label>
                            <input
                                type="url"
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>
                        <button type="submit" className="create-btn" disabled={loading}>
                            Create Post
                        </button>
                    </form>
                </div>

                {showAI && (
                    <AIAssistant
                        onResponse={handleAIResponse}
                        onClose={() => setShowAI(false)}
                    />
                )}

                {showConfirmation && (
                    <div className="confirmation-modal">
                        <div className="confirmation-content">
                            <h3>Confirm Post</h3>
                            <p>Are you sure you want to post this? You can edit it up to 2 times after posting.</p>
                            <div className="confirmation-actions">
                                <button 
                                    onClick={() => setShowConfirmation(false)}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmPost}
                                    disabled={loading}
                                    className="confirm-btn"
                                >
                                    {loading ? 'Posting...' : 'Yes, Post It'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </VantaBackground>
    );
}
export default CreatePost()