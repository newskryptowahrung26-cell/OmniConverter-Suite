const fs = require('fs');

const langs = ['es', 'de', 'pt'];

for (const lang of langs) {
  const dataJs = fs.readFileSync(`${lang}/blog-data.js`, 'utf8');
  
  // Create mock browser window
  const window = {};
  const evalFunc = new Function('window', dataJs + '; return window.BLOG_POSTS;');
  const posts = evalFunc(window);
  
  console.log(`${lang}/blog-data.js: Loaded ${Array.isArray(posts) ? posts.length : 0} posts!`);
  if (posts && posts.length > 0) {
    console.log(`  Sample 1: ${posts[0].title} (${posts[0].slug})`);
    console.log(`  Sample 2: ${posts[1].title} (${posts[1].slug})`);
  }
}
