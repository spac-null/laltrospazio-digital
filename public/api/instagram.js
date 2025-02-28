// A proxy for Instagram's oEmbed API using the provided client token
export default async function handler(req, res) {
  try {
    const clientToken = '4e37d53ff05d1bebf43b466ab38c734a'; // Instagram client token
    const username = req.query.username || 'laltrospazio';
    
    // Sample post URLs - in a real implementation, you'd need to fetch these first
    // For a complete solution, you'd need to use Instagram's Graph API to get recent media
    const postUrls = [
      "https://www.instagram.com/p/C4l2Xrvt0_n/", // Replace with actual post URLs
      "https://www.instagram.com/p/C4XT9a8N8z5/", 
      "https://www.instagram.com/p/C4VmNH5txYS/",
      "https://www.instagram.com/p/C4Qvz-wtt0K/"
    ];
    
    // Fetch data for each post using oEmbed API
    const posts = await Promise.all(
      postUrls.map(async (url, index) => {
        try {
          const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${clientToken}`;
          const response = await fetch(oembedUrl);
          
          if (!response.ok) {
            console.error(`Error fetching oEmbed data for ${url}: ${response.status}`);
            return null;
          }
          
          const data = await response.json();
          
          return {
            id: index + 1,
            caption: data.title || '',
            title: extractTitle(data.title || ''),
            image: data.thumbnail_url || '',
            url: url,
            author_name: data.author_name || '',
            html: data.html || ''
          };
        } catch (error) {
          console.error(`Error processing ${url}:`, error);
          return null;
        }
      })
    );
    
    // Filter out any nulls from failed requests
    const validPosts = posts.filter(post => post !== null);
    
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600');
    res.status(200).json({ posts: validPosts });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Instagram posts',
      message: error.message,
      posts: [] 
    });
  }
}

// Helper function to extract title from caption
function extractTitle(caption) {
  if (!caption) return 'Evento L\'Altro Spazio';
  
  // Try to extract the first sentence or phrase
  const firstLine = caption.split('\n')[0];
  if (firstLine.length <= 50) return firstLine;
  return firstLine.substring(0, 47) + '...';
}