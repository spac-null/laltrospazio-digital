// A simple proxy for Instagram API to avoid CORS issues
export default async function handler(req, res) {
  try {
    // In a production implementation, you would use Instagram's Graph API with proper authentication
    // This would require registering an app with Meta, obtaining access tokens, etc.
    // For more information: https://developers.facebook.com/docs/instagram-basic-display-api
    
    // Return empty response instead of placeholders
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600');
    res.status(200).json({ posts: [] });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Instagram posts',
      message: error.message,
      posts: [] // Always return empty posts array even on error
    });
  }
}