const fs = require('fs');

['en', 'es', 'de', 'pt'].forEach(lang => {
  const dataFile = lang === 'en' ? 'blog-data.js' : `${lang}/blog-data.js`;
  global.window = {};
  eval(fs.readFileSync(dataFile, 'utf8'));
  const posts = global.window.BLOG_POSTS;

  // Exact filtering & sorting as in browser
  const filtered = posts.filter(item => true).sort((a, b) => {
    const dateA = new Date(a.publicationDate || a.date || '1970-01-01').getTime();
    const dateB = new Date(b.publicationDate || b.date || '1970-01-01').getTime();
    if (dateB !== dateA) return dateB - dateA;
    return (a.order || 0) - (b.order || 0);
  });

  const itemsPerPage = 6;
  const page1 = filtered.slice(0, itemsPerPage);
  const page2 = filtered.slice(itemsPerPage, itemsPerPage * 2);

  console.log(`\n=================== ${lang.toUpperCase()} BLOG HUB SIMULATION ===================`);
  console.log(`Total Articles: ${filtered.length}`);
  console.log(`PAGE 1 (Articles 1 - ${page1.length}):`);
  page1.forEach((p, idx) => {
    console.log(`  #${idx + 1}: ${p.id} | Date: ${p.date} (${p.publicationDate}) | ${p.title}`);
  });
  console.log(`PAGE 2 (Articles ${itemsPerPage + 1} - ${itemsPerPage + page2.length}):`);
  page2.forEach((p, idx) => {
    console.log(`  #${itemsPerPage + idx + 1}: ${p.id} | Date: ${p.date}`);
  });
});
