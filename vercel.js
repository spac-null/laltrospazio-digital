{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    {
      "source": "/(.*)",
      "has": [
        {
          "type": "host",
          "value": "festa.altrospazio.org"
        }
      ],
      "destination": "/index.html"
    }
  ]
}
