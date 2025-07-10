import React, { useState } from 'react';
import { supabase } from '../../supabase';
import './editpost.css';

const EditPostModal = ({ post, onClose, onUpdate }) => {
    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [mediaUrl, setMediaUrl] = useState(post.media_url || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        try {
            const { error } = await supabase
                .from('posts')
                .update({
                    title: title.trim(),
                    content: content.trim(),
                    media_url: mediaUrl.trim() || null,
                    updated_at: new Date().toISOString(),
                    edit_count: post.edit_count + 1
                })
                .eq('id', post.id);
            
            if (error) throw error;
            
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Post</h2>
                    <p className="edit-warning">
                        You can edit this post {2 - post.edit_count} more time{2 - post.edit_count !== 1 ? 's' : ''}.
                    </p>
                    <button className="modal-close" onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className="edit-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            maxLength={200}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Content</label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows="10"
                            maxLength={5000}
                        />
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
                    
                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="save-btn">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPostModal;