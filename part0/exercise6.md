sequenceDiagram
    note over Client: Client executes the JavaScript code which rerenders the UI with the new note
    Client->>Server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Server-->>Client: {"message":"note created"}
