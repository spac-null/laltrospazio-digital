<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Function to get Instagram feed
function getInstagramFeed($username) {
    // The Instagram username to fetch
    $instagram_username = $username ? $username : 'laltrospazio';
    
    // Create empty response - no fallback data
    $empty_response = [
        'posts' => []
    ];
    
    // Attempt to fetch from Instagram
    try {
        // In a real implementation, you would use Instagram Graph API with proper authentication
        // This would require setting up Meta developer account and creating an app
        // For details: https://developers.facebook.com/docs/instagram-basic-display-api
        
        // For now, return empty response
        return json_encode($empty_response);
    } catch (Exception $e) {
        // Return empty response in case of error
        return json_encode($empty_response);
    }
}

// Get username from request
$username = isset($_GET['username']) ? $_GET['username'] : 'laltrospazio';

// Output the Instagram feed
echo getInstagramFeed($username);
?>