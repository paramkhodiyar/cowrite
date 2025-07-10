/*
  # Fix Foreign Key Relationships and Schema Issues

  1. Fix Foreign Key References
    - Ensure proper foreign key relationships exist
    - Add missing constraints if needed
  
  2. Refresh Schema Cache
    - Force Supabase to refresh its schema cache
    - Add proper comments to tables and columns
*/

-- Drop and recreate foreign key constraints to ensure they're properly recognized
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_community_id_fkey;

-- Recreate foreign key constraints with proper naming
ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE posts ADD CONSTRAINT posts_community_id_fkey 
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE;

-- Ensure all other foreign keys exist
ALTER TABLE community_members DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;
ALTER TABLE community_members DROP CONSTRAINT IF EXISTS community_members_community_id_fkey;

ALTER TABLE community_members ADD CONSTRAINT community_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE community_members ADD CONSTRAINT community_members_community_id_fkey 
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE;

-- Fix other foreign keys
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_post_id_fkey;

ALTER TABLE post_likes ADD CONSTRAINT post_likes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE post_likes ADD CONSTRAINT post_likes_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_post_id_fkey;

ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_post_id_fkey 
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Add proper table and column comments to force schema refresh
COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE communities IS 'Communities that users can join';
COMMENT ON TABLE community_members IS 'Junction table for community memberships';
COMMENT ON TABLE posts IS 'Blog posts with author and community relationships';
COMMENT ON COLUMN posts.author_id IS 'Foreign key reference to profiles table';
COMMENT ON COLUMN posts.community_id IS 'Foreign key reference to communities table';
COMMENT ON TABLE post_likes IS 'User likes on posts';
COMMENT ON TABLE comments IS 'Comments on posts';

-- Refresh schema cache by updating table statistics
ANALYZE profiles;
ANALYZE communities;
ANALYZE community_members;
ANALYZE posts;
ANALYZE post_likes;
ANALYZE comments;