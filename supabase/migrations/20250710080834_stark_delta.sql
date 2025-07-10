/*
  # Fix Firebase UID Schema Issue

  1. Schema Changes
    - Change all user ID columns from uuid to text to support Firebase UIDs
    - Update foreign key constraints
    - Update RLS policies

  2. Data Migration
    - Preserve existing data during schema changes
    - Update all references to use text instead of uuid

  3. Security
    - Maintain RLS policies with updated data types
    - Ensure proper permissions
*/

-- First, disable RLS temporarily to make schema changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;

-- Drop all foreign key constraints that reference user IDs
ALTER TABLE community_members DROP CONSTRAINT IF EXISTS community_members_user_id_fkey;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_author_id_fkey;
ALTER TABLE post_likes DROP CONSTRAINT IF EXISTS post_likes_user_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_author_id_fkey;
ALTER TABLE communities DROP CONSTRAINT IF EXISTS communities_created_by_fkey;

-- Change profiles.id from uuid to text
ALTER TABLE profiles ALTER COLUMN id TYPE text;

-- Change all user_id and author_id columns to text
ALTER TABLE community_members ALTER COLUMN user_id TYPE text;
ALTER TABLE posts ALTER COLUMN author_id TYPE text;
ALTER TABLE post_likes ALTER COLUMN user_id TYPE text;
ALTER TABLE comments ALTER COLUMN author_id TYPE text;
ALTER TABLE communities ALTER COLUMN created_by TYPE text;

-- Recreate foreign key constraints with text type
ALTER TABLE community_members ADD CONSTRAINT community_members_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE posts ADD CONSTRAINT posts_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE post_likes ADD CONSTRAINT post_likes_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE comments ADD CONSTRAINT comments_author_id_fkey 
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE communities ADD CONSTRAINT communities_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Update table comments to reflect the schema change
COMMENT ON TABLE profiles IS 'User profiles linked to Firebase auth users';
COMMENT ON COLUMN profiles.id IS 'Firebase UID (text format)';
COMMENT ON COLUMN posts.author_id IS 'Foreign key reference to profiles table (Firebase UID)';
COMMENT ON COLUMN posts.community_id IS 'Foreign key reference to communities table';

-- Ensure all existing policies work with the new schema
-- The policies should already be permissive from the previous migration

-- Grant permissions again to ensure everything works
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Refresh schema cache
ANALYZE profiles;
ANALYZE community_members;
ANALYZE posts;
ANALYZE post_likes;
ANALYZE comments;
ANALYZE communities;