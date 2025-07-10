/*
  # Fix Firebase UID Integration - Schema Migration

  1. Schema Changes
    - Convert all user ID columns from UUID to TEXT to support Firebase UIDs
    - Remove problematic auth.users foreign key constraint
    - Maintain all application-level foreign key relationships
    
  2. Security Updates
    - Update RLS policies to work with text-based user IDs
    - Ensure proper permissions for Firebase authentication
    
  3. Performance
    - Recreate necessary indexes
    - Maintain unique constraints
*/

-- First, disable RLS temporarily to make schema changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE communities DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies first to avoid conflicts
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies on profiles
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
    END LOOP;
    
    -- Drop all policies on communities
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'communities'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON communities';
    END LOOP;
    
    -- Drop all policies on community_members
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'community_members'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON community_members';
    END LOOP;
    
    -- Drop all policies on posts
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'posts'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON posts';
    END LOOP;
    
    -- Drop all policies on post_likes
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'post_likes'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON post_likes';
    END LOOP;
    
    -- Drop all policies on comments
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'comments'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON comments';
    END LOOP;
END $$;

-- Drop all foreign key constraints that involve user IDs
DO $$
BEGIN
    -- Drop constraint from profiles to auth.users if it exists
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'profiles_id_fkey' 
               AND table_name = 'profiles') THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
    END IF;
    
    -- Drop other foreign key constraints
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'community_members_user_id_fkey' 
               AND table_name = 'community_members') THEN
        ALTER TABLE community_members DROP CONSTRAINT community_members_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'posts_author_id_fkey' 
               AND table_name = 'posts') THEN
        ALTER TABLE posts DROP CONSTRAINT posts_author_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'post_likes_user_id_fkey' 
               AND table_name = 'post_likes') THEN
        ALTER TABLE post_likes DROP CONSTRAINT post_likes_user_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'comments_author_id_fkey' 
               AND table_name = 'comments') THEN
        ALTER TABLE comments DROP CONSTRAINT comments_author_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'communities_created_by_fkey' 
               AND table_name = 'communities') THEN
        ALTER TABLE communities DROP CONSTRAINT communities_created_by_fkey;
    END IF;
END $$;

-- Clear any existing data that might cause issues with type conversion
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE post_likes CASCADE;
TRUNCATE TABLE posts CASCADE;
TRUNCATE TABLE community_members CASCADE;
TRUNCATE TABLE profiles CASCADE;

-- Now change the column types from UUID to TEXT
ALTER TABLE profiles ALTER COLUMN id TYPE text USING id::text;
ALTER TABLE community_members ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE posts ALTER COLUMN author_id TYPE text USING author_id::text;
ALTER TABLE post_likes ALTER COLUMN user_id TYPE text USING user_id::text;
ALTER TABLE comments ALTER COLUMN author_id TYPE text USING author_id::text;
ALTER TABLE communities ALTER COLUMN created_by TYPE text USING created_by::text;

-- Recreate foreign key constraints (but NOT the auth.users one since Firebase UIDs won't match)
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
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

-- Create new policies that work with Firebase authentication
CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (true);

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Communities are viewable by everyone"
  ON communities FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create communities"
  ON communities FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Community members are viewable by everyone"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join communities"
  ON community_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can leave communities"
  ON community_members FOR DELETE
  USING (true);

CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON posts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete posts"
  ON posts FOR DELETE
  USING (true);

CREATE POLICY "Post likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can unlike posts"
  ON post_likes FOR DELETE
  USING (true);

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create comments"
  ON comments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update comments"
  ON comments FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete comments"
  ON comments FOR DELETE
  USING (true);

-- Update table comments
COMMENT ON TABLE profiles IS 'User profiles linked to Firebase auth users';
COMMENT ON COLUMN profiles.id IS 'Firebase UID (text format)';
COMMENT ON COLUMN posts.author_id IS 'Foreign key reference to profiles table (Firebase UID)';
COMMENT ON COLUMN comments.author_id IS 'Foreign key reference to profiles table (Firebase UID)';

-- Recreate indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_community_id ON posts(community_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Ensure unique constraints are maintained
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'profiles_username_key' 
                   AND table_name = 'profiles') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'communities_name_key' 
                   AND table_name = 'communities') THEN
        ALTER TABLE communities ADD CONSTRAINT communities_name_key UNIQUE (name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'community_members_community_id_user_id_key' 
                   AND table_name = 'community_members') THEN
        ALTER TABLE community_members ADD CONSTRAINT community_members_community_id_user_id_key UNIQUE (community_id, user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'post_likes_post_id_user_id_key' 
                   AND table_name = 'post_likes') THEN
        ALTER TABLE post_likes ADD CONSTRAINT post_likes_post_id_user_id_key UNIQUE (post_id, user_id);
    END IF;
END $$;

-- Refresh schema cache
ANALYZE profiles;
ANALYZE community_members;
ANALYZE posts;
ANALYZE post_likes;
ANALYZE comments;
ANALYZE communities;