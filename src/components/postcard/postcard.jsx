import React, { useState } from 'react';
import { supabase } from '../../supabase';
import { FaHeart, FaRegHeart, FaComment, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import EditPostModal from '../editpost/editpost';
import CommentsSection from '../comments/comments';
import './postcard.css';

const PostCard = ({ post, user, onLike, onUpdate }) => {
    const [showComments, setShowComments] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isLiked = post.post_likes?.some(like => like.user_id === user?.uid);
    const isAuthor = user?.uid === post.author_id;
    const canEdit = isAuthor && post.edit_count < 2;

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', post.id);
            
            if (error) throw error;
            onUpdate();
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="post-author">
                    <div className="author-avatar">
                        {post.profiles?.avatar_url ? (
                            <img src={post.profiles.avatar_url} alt="Avatar" />
                        ) : (
                            <div className="default-avatar">
                                {post.profiles?.display_name?.[0] || post.profiles?.username?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="author-info">
                        <span className="author-name">
                            {post.profiles?.display_name || post.profiles?.username}
                        </span>
                        <span className="post-community">in {post.communities?.name}</span>
                        <span className="post-time">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                            {post.edit_count > 0 && <span className="edited"> (edited {post.edit_count} time{post.edit_count > 1 ? 's' : ''})</span>}
                        </span>
                    </div>
                </div>
                {isAuthor && (
                    <div className="post-actions">
                        {canEdit && (
                            <button 
                                className="edit-btn"
                                onClick={() => setShowEditModal(true)}
                                title="Edit post"
                            >
                                <FaEdit />
                            </button>
                        )}
                        <button 
                            className="delete-btn"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            title="Delete post"
                        >
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-text">
                    {post.content.split('\n').map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
                {post.media_url && (
                    <div className="post-media">
                        <img src={post.media_url} alt="Post media" />
                    </div>
                )}
            </div>

            <div className="post-footer">
                <div className="post-stats">
                    <button 
                        className={`like-btn ${isLiked ? 'liked' : ''}`}
                        onClick={() => onLike(post.id)}
                        disabled={!user}
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                        <span>{post.likes_count}</span>
                    </button>
                    <button 
                        className="comment-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <FaComment />
                        <span>{post.comments_count}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <CommentsSection 
                    postId={post.id} 
                    user={user}
                    onUpdate={onUpdate}
                />
            )}

            {showEditModal && (
                <EditPostModal
                    post={post}
                    onClose={() => setShowEditModal(false)}
                    onUpdate={onUpdate}
                />
            )}
        </div>
    );
};

export default PostCard;