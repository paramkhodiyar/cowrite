/*
  # Add Sample Data for Testing

  1. Sample Communities
    - Create default communities for the app
  2. Sample Posts
    - Add a welcome/first post for each community
*/

-- Insert default communities
INSERT INTO communities (name, description, created_by, member_count) VALUES
  ('CoWrite', 'The official CoWrite community. All users are members here. Share your ideas, get updates, and connect!', null, 0),
  ('Technology', 'Discuss the latest in tech, programming, and innovation', null, 0),
  ('Memes', 'Share and enjoy the best memes on the internet!', null, 0),
  ('Creative Writing', 'Share your stories, poems, and creative works', null, 0),
  ('Science & Nature', 'Explore the wonders of science and the natural world', null, 0),
  ('Lifestyle', 'Tips, advice, and discussions about daily life', null, 0),
  ('Gaming', 'Talk about your favorite games, strategies, and news', null, 0),
  ('Movies & TV', 'Discuss the latest movies, shows, and entertainment', null, 0),
  ('Books', 'Book lovers unite! Share reviews, recommendations, and more', null, 0),
  ('Fitness & Health', 'Share tips, routines, and motivation for a healthy life', null, 0)
ON CONFLICT (name) DO NOTHING;

-- Insert a default welcome post for each community
-- NOTE: Replace '00000000-0000-0000-0000-000000000000' with a real admin user UUID after initial setup
INSERT INTO posts (title, content, author_id, community_id) VALUES
  ('Welcome to CoWrite!', 'Welcome to the official CoWrite community! 🎉\n\nThis is your space to connect, share, and grow together. We''re excited to have you here!', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'CoWrite')),
  ('Welcome to Technology!', 'Kickstart your tech journey here! 🚀\n\nShare news, ask questions, and discuss the latest in technology.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Technology')),
  ('Welcome to Memes!', 'Laughter is the best medicine! 😂\n\nDrop your favorite memes and enjoy the fun.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Memes')),
  ('Welcome to Creative Writing!', 'Unleash your creativity! ✍️\n\nShare your stories, poems, and creative works with the community.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Creative Writing')),
  ('Welcome to Science & Nature!', 'Curious minds gather here! 🔬🌱\n\nDiscuss science, nature, and the wonders of our world.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Science & Nature')),
  ('Welcome to Lifestyle!', 'Share your lifestyle tips, advice, and daily experiences! 🌟', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Lifestyle')),
  ('Welcome to Gaming!', 'Game on! 🎮\n\nTalk about your favorite games, strategies, and news.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Gaming')),
  ('Welcome to Movies & TV!', 'Lights, camera, action! 🍿\n\nDiscuss the latest movies, shows, and entertainment.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Movies & TV')),
  ('Welcome to Books!', 'Book lovers unite! 📚\n\nShare reviews, recommendations, and more.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Books')),
  ('Welcome to Fitness & Health!', 'Stay healthy, stay strong! 💪\n\nShare tips, routines, and motivation for a healthy life.', '00000000-0000-0000-0000-000000000000', (SELECT id FROM communities WHERE name = 'Fitness & Health'));