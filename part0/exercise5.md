sequenceDiagram
    participant Client
    participant Server
    Client->>Server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server-->>Client: HTML document
    Client->>Server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Server-->>Client: CSS file
    Client->>Server: GET https://studies.cs.helsinki.fi/exampleapp.spa.js
    Server-->>Client: JavaScript file
    Note over Client: Client executes the JavaScript code which fetches the JSON from the server
    Client->>Server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    Server-->>Client: [{"content":"HTML is easy","date":"2023-10-01T10:00:00.000Z"}, ...]
    Note over Client: Client processes the JSON data and updates the UI(by executes the callback function)