// A simple proxy for Instagram API to avoid CORS issues
export default async function handler(req, res) {
  try {
    const username = 'laltrospazio'; // Your Instagram username
    const response = await fetch(`https://www.instagram.com/${username}/?__a=1&__d=dis`, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Instagram API responded with ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the posts we need
    const posts = data.graphql.user.edge_owner_to_timeline_media.edges.slice(0, 6).map(edge => ({
      id: edge.node.id,
      caption: edge.node.edge_media_to_caption.edges[0]?.node.text || '',
      image: edge.node.display_url,
      permalink: `https://www.instagram.com/p/${edge.node.shortcode}/`,
      timestamp: edge.node.taken_at_timestamp
    }));

    res.setHeader('Cache-Control', 'max-age=0, s-maxage=3600');
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Instagram posts',
      message: error.message 
    });
  }
}