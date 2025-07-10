/*
  # Add Sample Data for Testing

  1. Sample Communities
    - Create some default communities for testing
  
  2. Sample Data
    - Add some initial communities to get started
*/

-- Insert sample communities
INSERT INTO communities (name, description, created_by, member_count) VALUES
  ('General Discussion', 'A place for general conversations and topics', null, 0),
  ('Technology', 'Discuss the latest in tech, programming, and innovation', null, 0),
  ('Creative Writing', 'Share your stories, poems, and creative works', null, 0),
  ('Science & Nature', 'Explore the wonders of science and the natural world', null, 0),
  ('Lifestyle', 'Tips, advice, and discussions about daily life', null, 0)
ON CONFLICT (name) DO NOTHING;