import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function main() {
  const keyPath = path.join(rootDir, 'service-account.json');
  if (!fs.existsSync(keyPath)) {
    console.error('service-account.json not found in root directory.');
    return;
  }

  const key = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  const jwtClient = new google.auth.JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: ['https://www.googleapis.com/auth/indexing']
  });

  try {
    await jwtClient.authorize();
    console.log(`[Google Indexing API] Authenticated with service account: ${key.client_email}`);
    const indexing = google.indexing({ version: 'v3', auth: jwtClient });

    const sitemapPath = path.join(rootDir, 'sitemap.xml');
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const allUrls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());

    // Filter to top landing hubs and new language pages first (Google Indexing API has a quota of ~200/day)
    const priorityUrls = allUrls.filter(u => 
      u.endsWith('/indian-units') || 
      u.includes('/es/') || 
      u.includes('/de/') || 
      u.includes('/pt/')
    );

    console.log(`Found ${priorityUrls.length} priority URLs to submit.`);

    let successCount = 0;
    for (let i = 0; i < Math.min(priorityUrls.length, 100); i++) {
      const url = priorityUrls[i];
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url: url,
            type: 'URL_UPDATED'
          }
        });
        successCount++;
        console.log(`[${i + 1}/${priorityUrls.length}] Submitted: ${url}`);
      } catch (err) {
        if (err.message.includes('Permission denied')) {
          console.error('\n[PERMISSION REQUIRED IN GOOGLE SEARCH CONSOLE]');
          console.error(`Please add the service account email as an 'Owner' in GSC:`);
          console.error(`Email: ${key.client_email}\n`);
          break;
        } else {
          console.warn(`Failed for ${url}: ${err.message}`);
        }
      }
    }
    console.log(`Finished. Successfully submitted ${successCount} URLs.`);
  } catch (err) {
    console.error('Google Indexing API error:', err.message);
  }
}

main();
