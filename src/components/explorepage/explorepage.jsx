import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/navbar';
import './explorepage.css';

const WP_API_URL = 'https://techcrunch.com/wp-json/wp/v2/posts?_embed&per_page=10';

const ExplorePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(WP_API_URL);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <>
            <div className="explore-container">
            <Navbar />
                <h1 className="explore-title">Explore Blogs</h1>
                <div className="explore-grid">
                    {posts.map((post) => (
                        <div key={post.id} className="explore-card">
                            {post._embedded?.['wp:featuredmedia'] ? (
                                <img
                                    src={post._embedded['wp:featuredmedia'][0].source_url}
                                    alt="featured"
                                    className="explore-image"
                                />
                            ) : (
                                <div className="explore-image-placeholder">No Image</div>
                            )}
                            <div className="explore-content">
                                <h2
                                    className="explore-post-title"
                                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                />
                                <div
                                    className="explore-excerpt"
                                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                                />
                                <a
                                    href={post.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="explore-link"
                                >
                                    Read more →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ExplorePage;
