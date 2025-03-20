{
  "routes": [
    {
      "src": "/",
      "headers": {
        "host": "qr.altrospazio.org"
      },
      "dest": "/menu-gruppo-nazario.pdf",
      "continue": true
    },
    {
      "handle": "filesystem"
    }
  ],
  "headers": [
    {
      "source": "/menu-gruppo-nazario.pdf",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/pdf"
        },
        {
          "key": "Content-Disposition",
          "value": "inline"
        }
      ]
    }
  ]
}
