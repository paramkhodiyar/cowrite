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

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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
        try {
            await supabase
                .from('community_members')
                .insert({ community_id: communityId, user_id: user.uid });
            fetchJoinedCommunities();
        } catch (error) {
            alert('Failed to join community');
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
            await supabase
                .from('community_members')
                .delete()
                .eq('community_id', communityId)
                .eq('user_id', user.uid);
            fetchJoinedCommunities();
            if (selectedCommunity === communityId) setSelectedCommunity('all');
        } catch (error) {
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
                    profiles:author_id (username, display_name, avatar_url),
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
                            Mixed Feed
                        </button>
                        {communities.map(community => (
                            <div key={community.id} className="community-row">
                                <button
                                    className={selectedCommunity === community.id ? 'active' : ''}
                                    onClick={() => setSelectedCommunity(community.id)}
                                >
                                    {community.name} ({community.member_count})
                                </button>
                                {isJoined(community.id) ? (
                                    <span className="joined-label">Joined</span>
                                ) : (
                                    <button className="join-btn" onClick={() => handleJoinCommunity(community.id)} title="Join">
                                        +
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
                            <p>No posts found. Be the first to create one!</p>
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