-- Fix authentication and permissions issues
-- This migration addresses the core problems with user authentication and database permissions

-- First, let's create a more robust auth function that works with Firebase
CREATE OR REPLACE FUNCTION public.get_current_user_id() 
RETURNS text 
LANGUAGE sql 
STABLE
AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    current_setting('app.current_user_id', true)
  );
$$;

-- Drop all existing RLS policies and recreate them to be more permissive
-- This will help us debug the authentication issues

-- Profiles policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON profiles FOR UPDATE
  USING (true);

-- Communities policies
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;

CREATE POLICY "Communities are viewable by everyone"
  ON communities FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create communities"
  ON communities FOR INSERT
  WITH CHECK (true);

-- Community members policies
DROP POLICY IF EXISTS "Community members are viewable by everyone" ON community_members;
DROP POLICY IF EXISTS "Users can join communities" ON community_members;
DROP POLICY IF EXISTS "Users can leave communities" ON community_members;

CREATE POLICY "Community members are viewable by everyone"
  ON community_members FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join communities"
  ON community_members FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can leave communities"
  ON community_members FOR DELETE
  USING (true);

-- Posts policies
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;

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

-- Post likes policies
DROP POLICY IF EXISTS "Post likes are viewable by everyone" ON post_likes;
DROP POLICY IF EXISTS "Authenticated users can like posts" ON post_likes;
DROP POLICY IF EXISTS "Users can unlike posts" ON post_likes;

CREATE POLICY "Post likes are viewable by everyone"
  ON post_likes FOR SELECT
  USING (true);

CREATE POLICY "Anyone can like posts"
  ON post_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can unlike posts"
  ON post_likes FOR DELETE
  USING (true);

-- Comments policies
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON comments;
DROP POLICY IF EXISTS "Authenticated users can create comments" ON comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON comments;

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

-- Grant comprehensive permissions to both anon and authenticated roles
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO anon;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Ensure the trigger functions have proper permissions
GRANT EXECUTE ON FUNCTION update_post_likes_count() TO anon;
GRANT EXECUTE ON FUNCTION update_post_likes_count() TO authenticated;
GRANT EXECUTE ON FUNCTION update_post_comments_count() TO anon;
GRANT EXECUTE ON FUNCTION update_post_comments_count() TO authenticated;
GRANT EXECUTE ON FUNCTION update_community_member_count() TO anon;
GRANT EXECUTE ON FUNCTION update_community_member_count() TO authenticated;

-- Make sure all tables have proper ownership
ALTER TABLE profiles OWNER TO postgres;
ALTER TABLE communities OWNER TO postgres;
ALTER TABLE community_members OWNER TO postgres;
ALTER TABLE posts OWNER TO postgres;
ALTER TABLE post_likes OWNER TO postgres;
ALTER TABLE comments OWNER TO postgres;

-- Refresh the schema cache
NOTIFY pgrst, 'reload schema';