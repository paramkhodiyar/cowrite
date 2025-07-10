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
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAI, setShowAI] = useState(false);
    const [allCommunities, setAllCommunities] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchAllCommunities();
                fetchJoinedCommunities(currentUser.uid);
            } else {
                navigate("/components/login/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchAllCommunities = async () => {
        try {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .order('name');
            
            if (error) throw error;
            setAllCommunities(data || []);
        } catch (error) {
            console.error('Error fetching all communities:', error);
        }
    };

    const fetchJoinedCommunities = async (userId) => {
        try {
            // First ensure user profile exists
            await ensureUserProfile(userId);
            
            // Auto-join CoWrite community
            await autoJoinCoWrite(userId);
            
            const { data, error } = await supabase
                .from('community_members')
                .select(`
                    community_id,
                    communities!inner(id, name)
                `)
                .eq('user_id', userId);
                
            if (error) throw error;
            
            const communities = data ? data.map(cm => cm.communities) : [];
            setJoinedCommunities(communities);
            
            // If user has no joined communities, show all communities
            if (communities.length === 0) {
                setJoinedCommunities(allCommunities);
            }
        } catch (error) {
            console.error('Error fetching joined communities:', error);
            // If there's an error, show all communities as fallback
            setJoinedCommunities(allCommunities);
        }
    };

    const ensureUserProfile = async (userId) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    username: user?.email?.split('@')[0] || `user_${Date.now()}`,
                    display_name: user?.displayName || '',
                    avatar_url: user?.photoURL || ''
                }, { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                });
            
            if (error) {
                console.warn('Profile upsert warning:', error);
            }
        } catch (error) {
            console.error('Error ensuring user profile:', error);
        }
    };

    const autoJoinCoWrite = async (userId) => {
        try {
            const { data: coWriteCommunity } = await supabase
                .from('communities')
                .select('id')
                .eq('name', 'CoWrite')
                .single();

            if (coWriteCommunity) {
                const { error } = await supabase
                    .from('community_members')
                    .upsert({
                        community_id: coWriteCommunity.id,
                        user_id: userId
                    }, { 
                        onConflict: 'community_id,user_id',
                        ignoreDuplicates: true 
                    });
                
                if (error) {
                    console.warn('Auto-join CoWrite warning:', error);
                }
            }
        } catch (error) {
            console.error('Error auto-joining CoWrite:', error);
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
            // Ensure user profile exists before creating post
            await ensureUserProfile(user.uid);

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
            navigate('/explore');
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post. Please try again.');
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
                                {(joinedCommunities.length > 0 ? joinedCommunities : allCommunities).map(community => (
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

export default CreatePost;