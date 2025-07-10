import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from '../navbar/navbar';
import VantaBackground from '../vantabackground/vantabackground';
import PostCard from '../postcard/postcard';
import './feed.css';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [communities, setCommunities] = useState([]);
    const [selectedCommunity, setSelectedCommunity] = useState('all');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        fetchCommunities();
        fetchPosts();
    }, [selectedCommunity]);

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

    const fetchPosts = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('posts')
                .select(`
                    *,
                    profiles:author_id (username, display_name, avatar_url),
                    communities (name),
                    post_likes!inner (user_id)
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
            const { data: existingLike } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', user.uid)
                .single();

            if (existingLike) {
                await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.uid);
            } else {
                await supabase
                    .from('post_likes')
                    .insert({ post_id: postId, user_id: user.uid });
            }

            fetchPosts();
        } catch (error) {
            console.error('Error handling like:', error);
        }
    };

    return (
        <VantaBackground>
            <Navbar />
            <div className="feed-container">
                <div className="feed-sidebar">
                    <h3>Communities</h3>
                    <div className="community-filter">
                        <button 
                            className={selectedCommunity === 'all' ? 'active' : ''}
                            onClick={() => setSelectedCommunity('all')}
                        >
                            All Posts
                        </button>
                        {communities.map(community => (
                            <button
                                key={community.id}
                                className={selectedCommunity === community.id ? 'active' : ''}
                                onClick={() => setSelectedCommunity(community.id)}
                            >
                                {community.name} ({community.member_count})
                            </button>
                        ))}
                    </div>
                </div>

                <div className="feed-main">
                    <h1 className="feed-title">Feed</h1>
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

export default FeedPage;