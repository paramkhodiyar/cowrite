/*
  # Create Default Communities with Welcome Posts

  1. New Communities
    - Creates 10 default communities including CoWrite
    - Each community has a description and welcome post
  
  2. Welcome Posts
    - Creates a welcome post for each community
    - Posts are created by a system user (null author_id for now)
  
  3. Auto-join Logic
    - Users will be auto-joined to CoWrite community via application logic
*/

-- Insert default communities (using ON CONFLICT to avoid duplicates)
INSERT INTO communities (name, description, member_count) VALUES
  ('CoWrite', 'The official CoWrite community. All users are automatically members here. Share your ideas, get updates, and connect with fellow writers!', 1),
  ('Technology', 'Discuss the latest in tech, programming, AI, and digital innovation. Share tutorials, ask questions, and stay updated!', 0),
  ('Creative Writing', 'Share your stories, poems, novels, and creative works. Get feedback and inspire others with your creativity!', 0),
  ('Science & Nature', 'Explore the wonders of science, nature, and the universe. Share discoveries, ask questions, and learn together!', 0),
  ('Lifestyle & Wellness', 'Tips, advice, and discussions about daily life, health, fitness, and personal growth. Live your best life!', 0),
  ('Gaming', 'Talk about your favorite games, share strategies, discuss gaming news, and connect with fellow gamers!', 0),
  ('Movies & TV', 'Discuss the latest movies, TV shows, streaming content, and entertainment news. What are you watching?', 0),
  ('Books & Literature', 'Book lovers unite! Share reviews, recommendations, discuss authors, and dive deep into literature!', 0),
  ('Art & Design', 'Showcase your artwork, discuss design trends, share tutorials, and appreciate visual creativity!', 0),
  ('Food & Cooking', 'Share recipes, cooking tips, restaurant reviews, and culinary adventures. Let''s cook together!', 0)
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description;

-- Insert welcome posts for each community
INSERT INTO posts (title, content, author_id, community_id) VALUES
  (
    'Welcome to CoWrite! 🎉',
    E'Welcome to the official CoWrite community!\n\nThis is your home base for all things CoWrite. Here you can:\n\n• Get platform updates and announcements\n• Share feedback and suggestions\n• Connect with fellow writers and creators\n• Ask questions about using CoWrite\n• Celebrate your writing achievements\n\nWe''re excited to have you as part of our growing community of writers and creators. Let''s write amazing stories together!\n\nHappy writing! ✍️',
    null,
    (SELECT id FROM communities WHERE name = 'CoWrite')
  ),
  (
    'Welcome to Technology! 💻',
    E'Welcome to the Technology community!\n\nThis is your space to:\n\n• Discuss the latest tech trends and innovations\n• Share programming tutorials and tips\n• Ask technical questions and get help\n• Explore AI, machine learning, and emerging technologies\n• Review gadgets and software\n\nWhether you''re a seasoned developer, tech enthusiast, or just curious about technology, you''ll find your tribe here!\n\nLet''s build the future together! 🚀',
    null,
    (SELECT id FROM communities WHERE name = 'Technology')
  ),
  (
    'Welcome to Creative Writing! ✍️',
    E'Welcome to the Creative Writing community!\n\nThis is where creativity flows freely:\n\n• Share your original stories, poems, and creative works\n• Get constructive feedback from fellow writers\n• Participate in writing prompts and challenges\n• Discuss writing techniques and craft\n• Find writing partners and beta readers\n\nEvery writer has a unique voice - we can''t wait to hear yours!\n\nLet your imagination soar! 🌟',
    null,
    (SELECT id FROM communities WHERE name = 'Creative Writing')
  ),
  (
    'Welcome to Science & Nature! 🔬',
    E'Welcome to the Science & Nature community!\n\nExplore the wonders of our world:\n\n• Share fascinating scientific discoveries\n• Discuss environmental issues and conservation\n• Ask questions about how things work\n• Share nature photography and observations\n• Explore space, physics, biology, and more\n\nCuriosity is the engine of achievement - let''s learn together!\n\nStay curious! 🌍',
    null,
    (SELECT id FROM communities WHERE name = 'Science & Nature')
  ),
  (
    'Welcome to Lifestyle & Wellness! 🌱',
    E'Welcome to the Lifestyle & Wellness community!\n\nYour journey to better living starts here:\n\n• Share health and fitness tips\n• Discuss mental wellness and self-care\n• Exchange lifestyle advice and life hacks\n• Support each other''s personal growth\n• Share recipes for healthy living\n\nSmall steps lead to big changes - let''s grow together!\n\nLive well! 💪',
    null,
    (SELECT id FROM communities WHERE name = 'Lifestyle & Wellness')
  ),
  (
    'Welcome to Gaming! 🎮',
    E'Welcome to the Gaming community!\n\nLevel up your gaming experience:\n\n• Discuss your favorite games and genres\n• Share gaming tips, tricks, and strategies\n• Review new releases and classics\n• Find gaming buddies and form teams\n• Explore gaming news and industry updates\n\nWhether you''re casual or hardcore, mobile or PC, all gamers are welcome!\n\nGame on! 🏆',
    null,
    (SELECT id FROM communities WHERE name = 'Gaming')
  ),
  (
    'Welcome to Movies & TV! 🎬',
    E'Welcome to the Movies & TV community!\n\nLights, camera, discussion:\n\n• Review the latest movies and TV shows\n• Discuss plot theories and character development\n• Share recommendations and hidden gems\n• Explore different genres and eras\n• Chat about actors, directors, and behind-the-scenes\n\nFrom blockbusters to indie films, from sitcoms to dramas - let''s talk entertainment!\n\nAction! 🍿',
    null,
    (SELECT id FROM communities WHERE name = 'Movies & TV')
  ),
  (
    'Welcome to Books & Literature! 📚',
    E'Welcome to the Books & Literature community!\n\nDive into the world of words:\n\n• Share book reviews and recommendations\n• Discuss classic and contemporary literature\n• Join book clubs and reading challenges\n• Explore different genres and authors\n• Share quotes and literary insights\n\nBooks are windows to infinite worlds - let''s explore them together!\n\nHappy reading! 📖',
    null,
    (SELECT id FROM communities WHERE name = 'Books & Literature')
  ),
  (
    'Welcome to Art & Design! 🎨',
    E'Welcome to the Art & Design community!\n\nWhere creativity meets expression:\n\n• Showcase your artwork and designs\n• Share tutorials and techniques\n• Discuss art history and movements\n• Get feedback on your creative projects\n• Explore digital art, traditional media, and more\n\nArt speaks where words are unable to explain - show us your voice!\n\nCreate boldly! 🖌️',
    null,
    (SELECT id FROM communities WHERE name = 'Art & Design')
  ),
  (
    'Welcome to Food & Cooking! 👨‍🍳',
    E'Welcome to the Food & Cooking community!\n\nWhere flavor meets passion:\n\n• Share your favorite recipes and cooking tips\n• Discuss different cuisines and food cultures\n• Review restaurants and food experiences\n• Ask cooking questions and get advice\n• Share food photography and plating ideas\n\nFood brings people together - let''s cook up some amazing conversations!\n\nBon appétit! 🍽️',
    null,
    (SELECT id FROM communities WHERE name = 'Food & Cooking')
  )
ON CONFLICT DO NOTHING;