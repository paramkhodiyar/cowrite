import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { formatDistanceToNow } from 'date-fns';
import './comments.css';

const CommentsSection = ({ postId, user, onUpdate }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select(`
                    *,
                    profiles:author_id (username, display_name, avatar_url)
                `)
                .eq('post_id', postId)
                .order('created_at', { ascending: true });
            
            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            // Ensure profile exists first
            const profileData = {
                id: user.uid,
                username: user.email?.split('@')[0] || `user_${Date.now()}`,
                display_name: user.displayName || user.email?.split('@')[0] || 'User',
                avatar_url: user.photoURL || ''
            };

            const { error: profileError } = await supabase
                .from('profiles')
                .upsert(profileData, { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                });

            if (profileError) {
                console.warn('Profile creation warning:', profileError);
            }

            // Create the comment
            const { error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    author_id: user.uid,
                    content: newComment.trim()
                });
            
            if (error) throw error;
            
            console.log('Comment posted successfully');
            
            setNewComment('');
            fetchComments();
            onUpdate(); // Update post comments count
        } catch (error) {
            console.error('Error submitting comment:', error);
            console.error('Error details:', error.message, error.details, error.hint);
            alert(`Failed to post comment: ${error.message || 'Unknown error'}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="comments-loading">Loading comments...</div>;
    }

    return (
        <div className="comments-section">
            <div className="comments-header">
                <h4>Comments ({comments.length})</h4>
            </div>
            
            {user && (
                <form className="comment-form" onSubmit={handleSubmitComment}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows="3"
                        className="comment-input"
                    />
                    <button 
                        type="submit" 
                        className="comment-submit"
                        disabled={!newComment.trim() || submitting}
                    >
                        {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                </form>
            )}

            <div className="comments-list">
                {comments.length === 0 ? (
                    <p className="no-comments">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="comment-item">
                            <div className="comment-author">
                                <div className="comment-avatar">
                                    {comment.profiles?.avatar_url ? (
                                        <img src={comment.profiles.avatar_url} alt="Avatar" />
                                    ) : (
                                        <div className="default-comment-avatar">
                                            {comment.profiles?.display_name?.[0] || comment.profiles?.username?.[0] || 'U'}
                                        </div>
                                    )}
                                </div>
                                <div className="comment-info">
                                    <span className="comment-author-name">
                                        {comment.profiles?.display_name || comment.profiles?.username}
                                    </span>
                                    <span className="comment-time">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                            <div className="comment-content">
                                {comment.content.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection;