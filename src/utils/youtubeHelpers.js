/**
 * YouTube URL Helper Functions
 */

/**
 * Check if URL is valid YouTube URL
 * @param {string} url - YouTube URL to validate
 * @returns {boolean}
 */
exports.isValidYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
exports.extractVideoId = (url) => {
  if (!url) return null;
  
  try {
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0].split('/')[0];
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0].split('/')[0];
    }
    if (url.includes('youtube.com/shorts/')) {
      return url.split('/shorts/')[1].split('?')[0].split('/')[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Convert any YouTube URL to embed format
 * @param {string} url - YouTube URL
 * @returns {string|null} - Embed URL or null if invalid
 */
exports.convertToEmbedUrl = (url) => {
  const videoId = exports.extractVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};
