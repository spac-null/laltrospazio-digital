<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Function to get Instagram feed
function getInstagramFeed($username) {
    // The Instagram username to fetch
    $instagram_username = $username ? $username : 'laltrospazio';
    
    // Create placeholder data as fallback
    $fallback_data = [
        'posts' => [
            [
                'id' => '1',
                'caption' => 'Serata speciale di musica inclusiva con interpreti LIS. Un\'esperienza unica accessibile a tutti! #inclusione #musicapertutti',
                'title' => 'Concerto di musica dal vivo',
                'image' => 'https://placehold.co/600x600/e2e8f0/64748b?text=@laltrospazio'
            ],
            [
                'id' => '2',
                'caption' => 'Un\'esperienza multisensoriale alla scoperta dei sapori senza l\'ausilio della vista. Guidati da persone non vedenti per una serata indimenticabile. #cenaalbuio #esperienzasensoriale',
                'title' => 'Cena al buio',
                'image' => 'https://placehold.co/600x600/e2e8f0/64748b?text=@laltrospazio'
            ],
            [
                'id' => '3',
                'caption' => 'La nostra nuova esposizione accessibile che celebra artisti locali. Opere tattili e descrizioni in braille disponibili per tutti i visitatori. #arteinclusive #accessibilità',
                'title' => 'Mostra d\'arte inclusiva',
                'image' => 'https://placehold.co/600x600/e2e8f0/64748b?text=@laltrospazio'
            ],
            [
                'id' => '4',
                'caption' => 'Un incontro tra culture diverse, uniti dalla convivialità e dal dialogo. Lo staff è pronto ad accogliervi in un ambiente completamente accessibile. #inclusione #multiculturalità',
                'title' => 'Aperitivo multiculturale',
                'image' => 'https://placehold.co/600x600/e2e8f0/64748b?text=@laltrospazio'
            ]
        ]
    ];
    
    // Attempt to fetch from Instagram
    try {
        // In a real implementation, you would use Instagram Graph API with proper authentication
        // For demonstration, return fallback data
        return json_encode($fallback_data);
    } catch (Exception $e) {
        // Return fallback data in case of error
        return json_encode($fallback_data);
    }
}

// Get username from request
$username = isset($_GET['username']) ? $_GET['username'] : 'laltrospazio';

// Output the Instagram feed
echo getInstagramFeed($username);
?>