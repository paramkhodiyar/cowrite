/*
  # Fix Schema Cache and Refresh Foreign Key Relationships

  1. Schema Refresh
    - Add a comment to force Supabase schema cache refresh
    - Ensure all foreign key relationships are properly recognized

  2. Verification
    - Verify all foreign key constraints exist
    - Add indexes for better performance
*/

-- Add comment to posts table to force schema cache refresh
COMMENT ON TABLE posts IS 'Blog posts with author and community relationships';
COMMENT ON COLUMN posts.author_id IS 'Foreign key reference to profiles table';
COMMENT ON COLUMN posts.community_id IS 'Foreign key reference to communities table';

-- Add comment to other tables to ensure cache refresh
COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE communities IS 'Communities that users can join';
COMMENT ON TABLE community_members IS 'Junction table for community memberships';
COMMENT ON TABLE post_likes IS 'User likes on posts';
COMMENT ON TABLE comments IS 'Comments on posts';

-- Ensure foreign key constraints exist (they should from the original migration)
DO $$
BEGIN
  -- Check if foreign key constraint exists for posts.author_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'posts_author_id_fkey' 
    AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;

  -- Check if foreign key constraint exists for posts.community_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'posts_community_id_fkey' 
    AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts ADD CONSTRAINT posts_community_id_fkey 
    FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);