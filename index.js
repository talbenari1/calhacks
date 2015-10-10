'use strict';

let config = require('./config.json'); // our configuration object
let app = require('express')(); // the application itself
let crypto = require('crypto'); // for random id generation
let rooms = new Map();

app.get('/', (req, res) => {
  // Create a unique ID for the user
  let id;
  do {
    id = crypto.randomBytes(6);
  } while (rooms.has(id));

  rooms.set(id, []);
});

let server = app.listen(config.port, () => {
  let host = server.address().address;
  let port = server.address().port;

  console.log(`Listening on port ${port}`);
});
