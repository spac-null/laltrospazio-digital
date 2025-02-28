<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Function to get Instagram feed using oEmbed API
function getInstagramFeed($username) {
    // The Instagram username to fetch
    $instagram_username = $username ? $username : 'laltrospazio';
    $client_token = '4e37d53ff05d1bebf43b466ab38c734a'; // Instagram client token
    
    // Array to store fetched posts
    $posts = [];
    
    try {
        // Fetch recent media URLs from a helper API or scrape them
        // For this example, we'll use a simple approach to fetch recent posts
        // In a real implementation, you might need additional APIs to get post URLs first
        
        // Example post IDs/URLs - in a real implementation, you would dynamically fetch these
        // These are sample Instagram post codes that would be replaced with real ones
        $post_urls = [
            "https://www.instagram.com/p/C4l2Xrvt0_n/", // Replace with real post URLs
            "https://www.instagram.com/p/C4XT9a8N8z5/",
            "https://www.instagram.com/p/C4VmNH5txYS/",
            "https://www.instagram.com/p/C4Qvz-wtt0K/"
        ];
        
        // Loop through each post URL and fetch its oEmbed data
        foreach ($post_urls as $index => $url) {
            // Instagram oEmbed API endpoint
            $oembed_url = "https://graph.facebook.com/v18.0/instagram_oembed?url=" . urlencode($url) . "&access_token=" . $client_token;
            
            // Fetch oEmbed data
            $response = file_get_contents($oembed_url);
            
            if ($response) {
                $data = json_decode($response, true);
                
                if ($data) {
                    // Extract relevant information
                    $post = [
                        'id' => $index + 1,
                        'caption' => $data['title'] ?? '',
                        'title' => extractTitle($data['title'] ?? ''),
                        'image' => $data['thumbnail_url'] ?? '',
                        'url' => $url,
                        'author_name' => $data['author_name'] ?? '',
                        'html' => $data['html'] ?? ''
                    ];
                    
                    $posts[] = $post;
                }
            }
        }
        
        return json_encode(['posts' => $posts]);
    } catch (Exception $e) {
        error_log("Instagram API Error: " . $e->getMessage());
        // Return empty array on error
        return json_encode(['posts' => []]);
    }
}

// Helper function to extract title from caption
function extractTitle($caption) {
    if (!$caption) return 'Evento L\'Altro Spazio';
    
    // Try to extract the first sentence or phrase
    $firstLine = explode("\n", $caption)[0];
    if (strlen($firstLine) <= 50) return $firstLine;
    return substr($firstLine, 0, 47) . '...';
}

// Get username from request
$username = isset($_GET['username']) ? $_GET['username'] : 'laltrospazio';

// Output the Instagram feed
echo getInstagramFeed($username);
?>