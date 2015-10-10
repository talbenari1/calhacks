'use strict';

let config = require('./config.json'); // our configuration object
let express = require('express');
let app = express(); // the application itself
let server = require('http').Server(app);
let io = require('socket.io')(server);
let crypto = require('crypto');
let rooms = new Map();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  // Create a unique ID for the user
  let id;
  do {
    id = crypto.randomBytes(6).toString('base64');
  } while (rooms.has(id));

  rooms.set(id, true);

  res.send(id);
});

app.get('/:id', (req, res) => {
  let id = req.params.id;
  if (rooms.has(id)) {
    // Successful connection to a room
    res.send(`Connected to room ${id}`);
  } else {
    // Room doesn't exist
    res.send(`Room ${id} does not exist`);
  }
});

app.listen(config.port, () => {
  console.log(`Listening on port ${config.port}`);
});
