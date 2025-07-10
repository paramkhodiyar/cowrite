import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../navbar/navbar';
import VantaBackground from '../vantabackground/vantabackground';
import PostCard from '../postcard/postcard';
import './feed.css';

const ExplorePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('all');
    const [joiningCommunity, setJoiningCommunity] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Auto-join CoWrite community for new users
                autoJoinCoWrite(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            fetchCommunities();
            fetchJoinedCommunities();
        }
    }, [user]);

    useEffect(() => {
        fetchPosts();
    }, [selectedCommunity, user]);

    const autoJoinCoWrite = async (userId) => {
        try {
            // Ensure user profile exists
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

            if (error) console.warn('Profile upsert warning:', error);

            // Auto-join CoWrite community
            const { data: coWriteCommunity } = await supabase
                .from('communities')
                .select('id')
                .eq('name', 'CoWrite')
                .single();

            if (coWriteCommunity) {
                const { error: joinError } = await supabase
                    .from('community_members')
                    .upsert({
                        community_id: coWriteCommunity.id,
                        user_id: userId
                    }, { 
                        onConflict: 'community_id,user_id',
                        ignoreDuplicates: true 
                    });
                
                if (joinError) console.warn('Auto-join warning:', joinError);
            }
        } catch (error) {
            console.error('Error auto-joining CoWrite:', error);
        }
    };
    const fetchCommunities = async () => {
        try {
            const { data, error } = await supabase
                .from('communities')
                .select('*')
                .order('member_count', { ascending: false });
            if (error) throw error;
            setCommunities(data || []);
        } catch (error) {
            console.error('Error fetching communities:', error);
        }
    };

    const fetchJoinedCommunities = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('community_members')
                .select('community_id')
                .eq('user_id', user.uid);
            if (error) throw error;
            setJoinedCommunities(data ? data.map(cm => cm.community_id) : []);
        } catch (error) {
            console.error('Error fetching joined communities:', error);
        }
    };

    const handleJoinCommunity = async (communityId) => {
        if (!user) return;
        setJoiningCommunity(communityId);
        try {
            // First, ensure user profile exists
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.uid,
                    username: user.email?.split('@')[0] || `user_${Date.now()}`,
                    display_name: user.displayName || '',
                    avatar_url: user.photoURL || ''
                }, { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                });

            if (profileError && profileError.code !== '23505') {
                console.warn('Profile upsert warning:', profileError);
            }

            // Now join the community
            const { error: joinError } = await supabase
                .from('community_members')
                .upsert({ 
                    community_id: communityId, 
                    user_id: user.uid 
                }, {
                    onConflict: 'community_id,user_id',
                    ignoreDuplicates: true
                });
            
            if (joinError) throw joinError;
            
            fetchJoinedCommunities();
            fetchCommunities(); // Refresh to update member counts
        } catch (error) {
            console.error('Error joining community:', error);
            // Always refresh joined communities, even on error
            fetchJoinedCommunities();
        } finally {
            setJoiningCommunity(null);
        }
    };

    const handleLeaveCommunity = async (communityId) => {
        if (!user) return;
        // Prevent leaving CoWrite
        const coWrite = communities.find(c => c.name === 'CoWrite');
        if (coWrite && communityId === coWrite.id) {
            alert('You cannot leave the CoWrite community.');
            return;
        }
        try {
            const { error } = await supabase
                .from('community_members')
                .delete()
                .eq('community_id', communityId)
                .eq('user_id', user.uid);
            
            if (error) throw error;
            fetchJoinedCommunities();
            fetchCommunities(); // Refresh to update member counts
            if (selectedCommunity === communityId) setSelectedCommunity('all');
        } catch (error) {
            console.error('Error leaving community:', error);
            alert('Failed to leave community');
        }
    };

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select(`
                    *,
                    profiles!author_id (username, display_name, avatar_url),
                    communities (name),
                    post_likes (user_id)
                `)
                .order('created_at', { ascending: false });
            
            if (selectedCommunity !== 'all') {
                query = query.eq('community_id', selectedCommunity);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        if (!user) return;
        
        try {
            const post = posts.find(p => p.id === postId);
            const isLiked = post.post_likes && post.post_likes.some(like => like.user_id === user.uid);
            
            if (isLiked) {
                // Unlike
                const { error } = await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.uid);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from('post_likes')
                    .insert({ post_id: postId, user_id: user.uid });
                if (error) throw error;
            }
            
            fetchPosts(); // Refresh posts to update like counts
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };
    const isJoined = (communityId) => joinedCommunities.includes(communityId);

    return (
        <VantaBackground>
            <Navbar />
            <div className="feed-container">
                <div className="feed-sidebar">
                    <h3>Explore Communities</h3>
                    <div className="community-filter">
                        <button 
                            className={selectedCommunity === 'all' ? 'active' : ''}
                            onClick={() => setSelectedCommunity('all')}
                        >
                            🌐 All Communities
                        </button>
                        {communities.map(community => (
                            <div key={community.id} className="community-row">
                                <button
                                    className={selectedCommunity === community.id ? 'active' : ''}
                                    onClick={() => setSelectedCommunity(community.id)}
                                >
                                    {community.name === 'CoWrite' ? '🏠' : 
                                     community.name === 'Technology' ? '💻' :
                                     community.name === 'Creative Writing' ? '✍️' :
                                     community.name === 'Science & Nature' ? '🔬' :
                                     community.name === 'Lifestyle & Wellness' ? '🌱' :
                                     community.name === 'Gaming' ? '🎮' :
                                     community.name === 'Movies & TV' ? '🎬' :
                                     community.name === 'Books & Literature' ? '📚' :
                                     community.name === 'Art & Design' ? '🎨' :
                                     community.name === 'Food & Cooking' ? '👨‍🍳' : '📝'} {community.name} ({community.member_count})
                                </button>
                                {isJoined(community.id) ? (
                                    community.name === 'CoWrite' ? (
                                        <span className="joined-label">✓ Member</span>
                                    ) : (
                                        <button 
                                            className="leave-btn" 
                                            onClick={() => handleLeaveCommunity(community.id)}
                                            title="Leave community"
                                        >
                                            ✓
                                        </button>
                                    )
                                ) : (
                                    <button 
                                        className="join-btn" 
                                        onClick={() => handleJoinCommunity(community.id)} 
                                        disabled={joiningCommunity === community.id}
                                        title="Join community"
                                    >
                                        {joiningCommunity === community.id ? '...' : '+'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="feed-main">
                    <h1 className="feed-title">Explore</h1>
                    {loading ? (
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="no-posts">
                            <p>
                                {selectedCommunity === 'all' 
                                    ? 'No posts found. Be the first to create one!' 
                                    : `No posts in this community yet. Be the first to post!`
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="posts-container">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    user={user}
                                    onLike={handleLike}
                                    onUpdate={fetchPosts}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </VantaBackground>
    );
};

export default ExplorePage;