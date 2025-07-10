import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import VantaBackground from '../vantabackground/vantabackground';
import './profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        display_name: '',
        bio: '',
        avatar_url: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchProfile(currentUser.uid);
                fetchUserPosts(currentUser.uid);
            } else {
                navigate("/components/login/login");
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            
            if (data) {
                setProfile(data);
                setFormData(data);
            } else {
                // Create profile if it doesn't exist
                const newProfile = {
                    id: userId,
                    username: user?.email?.split('@')[0] || `user_${Date.now()}`,
                    display_name: user?.displayName || user?.email?.split('@')[0] || '',
                    bio: '',
                    avatar_url: user?.photoURL || ''
                };
                
                const { data: createdProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert(newProfile)
                    .select()
                    .single();
                
                if (createError) throw createError;
                setProfile(createdProfile);
                setFormData(createdProfile);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select(`
                    *,
                    communities (name)
                `)
                .eq('author_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setUserPosts(data || []);
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.uid,
                    ...formData,
                    updated_at: new Date().toISOString()
                });
            
            if (error) throw error;
            
            setProfile({ ...profile, ...formData });
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    if (loading) {
        return (
            <VantaBackground>
                <Navbar />
                <div className="profile-loading">Loading...</div>
            </VantaBackground>
        );
    }

    return (
        <VantaBackground>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="Avatar" />
                        ) : (
                            <div className="default-profile-avatar">
                                {profile?.display_name?.[0] || profile?.username?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="profile-info">
                        <h1>{profile?.display_name || profile?.username}</h1>
                        <p className="profile-username">@{profile?.username}</p>
                        <p className="profile-bio">{profile?.bio || 'No bio yet'}</p>
                        <div className="profile-stats">
                            <span>{userPosts.length} posts</span>
                        </div>
                    </div>
                    <button 
                        className="edit-profile-btn"
                        onClick={() => setEditing(!editing)}
                    >
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </button>
                </div>

                {editing && (
                    <div className="edit-profile-form">
                        <form onSubmit={handleSaveProfile}>
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Display Name</label>
                                <input
                                    type="text"
                                    value={formData.display_name}
                                    onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Avatar URL</label>
                                <input
                                    type="url"
                                    value={formData.avatar_url}
                                    onChange={(e) => setFormData({...formData, avatar_url: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="save-profile-btn">
                                Save Changes
                            </button>
                        </form>
                    </div>
                )}

                <div className="user-posts">
                    <h2>Your Posts</h2>
                    {userPosts.length === 0 ? (
                        <p className="no-posts">You haven't created any posts yet.</p>
                    ) : (
                        <div className="posts-grid">
                            {userPosts.map(post => (
                                <div key={post.id} className="post-preview">
                                    <h3>{post.title}</h3>
                                    <p className="post-preview-community">in {post.communities?.name}</p>
                                    <p className="post-preview-content">
                                        {post.content.substring(0, 150)}...
                                    </p>
                                    <div className="post-preview-stats">
                                        <span>❤️ {post.likes_count}</span>
                                        <span>💬 {post.comments_count}</span>
                                        {post.edit_count > 0 && <span>✏️ {post.edit_count}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </VantaBackground>
    );
};

export default Profile;