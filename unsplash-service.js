/**
 * OmniConverter Unsplash Image Integration Service
 */

export const UNSPLASH_CONFIG = {
  accessKey: 'FvIdCFkaEpNWDfE9uKaxAdFxmNJppftCFHxTIHAPcc0',
  secretKey: '-p7q1hkmu_cKBoxpo84zuI5FAjm8N2et6rgDe31EqfY',
  baseUrl: 'https://api.unsplash.com'
};

/**
 * Fetch a unique high-resolution image URL from Unsplash for a given search query
 * @param {string} query - Keyword to search (e.g., 'baking measurement', 'currency converter')
 * @param {string} fallbackUrl - Default fallback image if API request fails
 * @returns {Promise<string>} Image URL
 */
export async function fetchUnsplashImage(query, fallbackUrl = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80') {
  try {
    const endpoint = `${UNSPLASH_CONFIG.baseUrl}/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${UNSPLASH_CONFIG.accessKey}`;
    const response = await fetch(endpoint);
    if (!response.ok) return fallbackUrl;
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
    return fallbackUrl;
  } catch (err) {
    console.warn('Unsplash API fetch failed, using fallback image:', err);
    return fallbackUrl;
  }
}
